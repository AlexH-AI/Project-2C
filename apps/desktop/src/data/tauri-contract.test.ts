// The contract between `tauri-storage.ts` and the Rust commands (DR-55): each side is otherwise
// tested only against its own copy, and a renamed command or argument shows only in the exe.
import { readdirSync, readFileSync } from 'node:fs';
import { AI_MODELS } from '@p2c/ai';
import { describe, expect, it, vi } from 'vitest';
import { tauriOpenCode } from './ai-tauri';
import { ACCESS_DENIED, ALREADY_OPEN, DISK_FULL, FILE_IN_USE, tauriStorage } from './tauri-storage';

const rust = (file: string) =>
  readFileSync(new URL(`../../src-tauri/src/${file}`, import.meta.url), 'utf8');
const lib = rust('lib.rs');
const storage = rust('storage.rs');
const ai = rust('ai.rs');

/**
 * The AI commands (spec Phase 5 §5.1, §5.4) and the camelCase arguments the webview sends.
 */
const AI_COMMANDS: Record<string, string[]> = {
  ai_complete: ['sessionId', 'plan', 'model', 'reasoning', 'messages', 'maxTokens'],
  ai_key_set: ['key'],
  ai_key_delete: [],
  ai_key_status: [],
  open_chatgpt: [],
};

interface Call {
  command: string;
  args: unknown;
  headers: Record<string, string>;
}

/** Every command the app invokes, one call per storage port method. */
async function calls(): Promise<Call[]> {
  const invoke = vi.fn().mockResolvedValue(new ArrayBuffer(0));
  const port = tauriStorage(invoke, () => 0, 'page-1');
  await port.load();
  await port.save(new Uint8Array([1]));
  await port.backup();
  await port.writeExport('a.xlsx', new Uint8Array([1]));
  await port.latestBackup();
  await port.openFolder('exports');
  return invoke.mock.calls.map(([command, args, options]) => ({
    command: command as string,
    args,
    headers: (options as { headers?: Record<string, string> } | undefined)?.headers ?? {},
  }));
}

/** The registered commands, in `generate_handler!`. */
const handlers = () =>
  /generate_handler!\[([^\]]*)\]/
    .exec(lib)![1]!
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

/** The source of a command, from its `fn` to the closing brace at the start of a line. */
const commandSource = (command: string) =>
  new RegExp(`fn ${command}\\(.*?\\n\\}`, 's').exec(lib)?.[0];

/** Splits at the commas outside `<…>`, `(…)` and `[…]`, so a type like `(u8, u8)` stays whole. */
const splitTopLevel = (list: string) => {
  const parts = [''];
  let depth = 0;
  for (const char of list) {
    if ('<(['.includes(char)) depth++;
    if ('>)]'.includes(char)) depth--;
    if (char === ',' && depth === 0) parts.push('');
    else parts[parts.length - 1] += char;
  }
  return parts.map((part) => part.trim()).filter(Boolean);
};

/** The parameters of a command with their types: everything between `fn name(` and `) ->`. */
const parameters = (command: string) =>
  splitTopLevel(new RegExp(`fn ${command}\\((.*?)\\)\\s*->`, 's').exec(lib)![1]!).map(
    (parameter) => {
      const colon = parameter.indexOf(':');
      return { name: parameter.slice(0, colon).trim(), type: parameter.slice(colon + 1).trim() };
    },
  );

const camel = (snake: string) =>
  snake.replace(/_(\w)/g, (_, letter: string) => letter.toUpperCase());

/** The value of a `&str` constant in a Rust file. */
const rustString = (source: string, name: string) =>
  new RegExp(`const ${name}: &str = "([^"]*)";`).exec(source)?.[1];

describe('the JS ↔ Rust storage contract', () => {
  it('invokes exactly the commands Rust registers', async () => {
    const invoked = (await calls()).map(({ command }) => command);
    const fileCommands = handlers().filter((command) => !(command in AI_COMMANDS));
    expect(fileCommands).toHaveLength(6);
    expect([...invoked].sort()).toEqual([...fileCommands].sort());
    for (const command of invoked) {
      expect(lib, command).toMatch(
        new RegExp(`#\\[tauri::command[^\\]]*\\]\\s*(async )?fn ${command}\\(`),
      );
    }
  });

  it('sends JSON arguments under the camelCase names of the Rust parameters', async () => {
    for (const { command, args } of await calls()) {
      const expected = parameters(command).map(({ name }) => camel(name));
      if (args instanceof Uint8Array) {
        // A raw body: the command reads the request itself.
        expect(parameters(command), command).toEqual([{ name: 'request', type: "Request<'_>" }]);
      } else {
        expect(Object.keys(args ?? {}).sort(), command).toEqual(expected.sort());
      }
    }
  });

  it('sends each header under the name the command reads', async () => {
    const headers = new Map(
      [...lib.matchAll(/const (\w+_HEADER): &str = "([^"]*)";/g)].map(([, name, value]) => [
        value!,
        name!,
      ]),
    );
    const sent = (await calls()).filter((call) => Object.keys(call.headers).length > 0);
    expect(sent.map(({ command }) => command).sort()).toEqual(['db_save', 'export_write']);
    for (const { command, headers: sentHeaders } of sent) {
      for (const header of Object.keys(sentHeaders)) {
        const constant = headers.get(header);
        expect(constant, `${command}: ${header}`).toBeDefined();
        expect(commandSource(command), `${command}: ${header}`).toContain(
          `header(&request, ${constant})`,
        );
      }
    }
  });

  it('matches the error messages Rust sends', () => {
    expect(rustString(storage, 'ALREADY_OPEN')).toBe(ALREADY_OPEN);
    expect(rustString(storage, 'DISK_FULL')).toBe(DISK_FULL);
    expect(rustString(storage, 'FILE_IN_USE')).toBe(FILE_IN_USE);
    expect(rustString(storage, 'ACCESS_DENIED')).toBe(ACCESS_DENIED);
  });

  it('reads an empty reply of db_open as a first start, which Rust sends for no file', () => {
    expect(commandSource('db_open')).toContain('Response::new(bytes.unwrap_or_default())');
  });
});

/** Every AI command the app invokes, one call per client method. */
async function aiCalls(): Promise<{ command: string; args: unknown }[]> {
  const invoke = vi.fn().mockResolvedValue(null);
  const client = tauriOpenCode(invoke);
  await client.keyStatus();
  await client.setKey('sk-1');
  await client.deleteKey();
  await client.openChatGpt();
  await client
    .adapter('GO')
    .complete({ sessionId: 's-1', model: 'glm-5.3', reasoning: null, messages: [], maxTokens: 1 });
  return invoke.mock.calls.map(([command, args]) => ({ command: command as string, args }));
}

describe('the JS ↔ Rust AI contract', () => {
  it('invokes the AI commands under the camelCase names of their Rust parameters', async () => {
    const calls = await aiCalls();
    expect(calls.map(({ command }) => command).sort()).toEqual(Object.keys(AI_COMMANDS).sort());
    for (const { command, args } of calls) {
      expect(Object.keys(args ?? {}).sort(), command).toEqual([...AI_COMMANDS[command]!].sort());
    }
  });

  it('registers each AI command with the arguments of spec §5.1', () => {
    for (const [command, args] of Object.entries(AI_COMMANDS)) {
      expect(handlers(), command).toContain(command);
      expect(lib, command).toMatch(
        new RegExp(`#\\[tauri::command[^\\]]*\\]\\s*(async )?fn ${command}\\(`),
      );
      expect(
        parameters(command).map(({ name }) => camel(name)),
        command,
      ).toEqual(args);
    }
  });

  it('sends the error codes packages/ai knows, plus the ChatGPT web one', () => {
    const errors = readFileSync(
      new URL('../../../../packages/ai/src/errors.ts', import.meta.url),
      'utf8',
    );
    const known = [.../AI_ERROR_CODES = \[([^\]]*)\]/.exec(errors)![1]!.matchAll(/'(\w+)'/g)].map(
      ([, code]) => code!,
    );
    const sent = [...ai.matchAll(/const (AI_\w+): &str = "([^"]*)";/g)].map(([, name, code]) => {
      expect(code).toBe(name);
      return code!;
    });
    // `open_chatgpt` fails only with `AI_OPEN_BROWSER`: the panel shows its message for any failure.
    expect(sent.sort()).toEqual([...known, 'AI_OPEN_BROWSER'].sort());
  });

  // A ceiling moved on one side only shows in the exe: `AI_BAD_REQUEST` for every call (DR6-61).
  it('asks no more max_tokens than Rust takes, and counts the messages to the ceiling Rust has', () => {
    const number = (source: string, pattern: RegExp) =>
      Number(pattern.exec(source)![1]!.replaceAll('_', ''));
    const prompts = new URL('../../../../packages/ai/src/prompts/', import.meta.url);
    const maxTokens = readdirSync(prompts)
      .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
      .flatMap((file) => [
        ...readFileSync(new URL(file, prompts), 'utf8').matchAll(/maxTokens: ([\d_]+),/g),
      ])
      .map(([, value]) => Number(value!.replaceAll('_', '')));
    // analysis, discovery, extraction and Kiểm tra kết nối.
    expect(maxTokens).toHaveLength(4);
    expect(Math.max(...maxTokens)).toBeLessThanOrEqual(
      number(ai, /const MAX_TOKENS: \w+ = ([\d_]+);/),
    );
    const run = readFileSync(
      new URL('../../../../packages/ai/src/run.ts', import.meta.url),
      'utf8',
    );
    expect(number(run, /const MAX_MESSAGE_CHARS = ([\d_]+);/)).toBe(
      number(ai, /const MAX_MESSAGE_CHARS: \w+ = ([\d_]+);/),
    );
  });

  // A model Rust refuses by name fails every call in the exe only: `AI_BAD_REQUEST` (DR6-88).
  it('names every model of Settings → AI as Rust takes it', () => {
    // `check` in ai.rs: 1 to MAX_MODEL_CHARS ASCII letters, digits and the bytes of one `b"…"`.
    const max = /const MAX_MODEL_CHARS: \w+ = ([\d_]+);/.exec(ai)![1]!.replaceAll('_', '');
    const modelBytes =
      /\.model\s*\.bytes\(\)\s*\.all\(\|byte\| byte\.is_ascii_alphanumeric\(\) \|\| b"([^"]*)"/;
    const others = modelBytes.exec(ai)![1]!.replace(/[\\\]^-]/g, '\\$&');
    const rule = new RegExp(`^[A-Za-z0-9${others}]{1,${max}}$`);
    expect(AI_MODELS.length).toBeGreaterThan(0);
    for (const { id } of AI_MODELS) expect(id, id).toMatch(rule);
    expect('qwen3.5+').not.toMatch(rule);
  });

  it('types the answer of ai_complete as Rust sends it, null where Rust has an Option', () => {
    const adapter = readFileSync(
      new URL('../../../../packages/ai/src/adapter.ts', import.meta.url),
      'utf8',
    );
    const rustFields = [
      .../pub struct Completion \{([^}]*)\}/.exec(ai)![1]!.matchAll(/pub (\w+): ([^,]+),/g),
    ].map(([, name, type]) => [camel(name!), type!.startsWith('Option<')]);
    const tsFields = [
      .../interface AiCompletion \{([^}]*)\}/
        .exec(adapter)![1]!
        .matchAll(/readonly (\w+)\??: ([^;]+);/g),
    ].map(([, name, type]) => [name, type!.includes('| null')]);
    expect(tsFields).toEqual(rustFields);
    expect(rustFields).toEqual([
      ['content', false],
      ['promptTokens', true],
      ['completionTokens', true],
      ['finishReason', true],
    ]);
  });
});

const desktop = (file: string) => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
const tauriConf = () =>
  JSON.parse(desktop('src-tauri/tauri.conf.json')) as {
    version: string;
    app: { security: { csp: string } };
  };

/** Every value the webview imports from `@tauri-apps/api`, as `module: name`, type imports aside. */
function tauriImports(): string[] {
  const src = new URL('../', import.meta.url);
  const files = readdirSync(src, { recursive: true, encoding: 'utf8' }).filter(
    (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file),
  );
  return files.flatMap((file) =>
    [
      ...readFileSync(new URL(file.replaceAll('\\', '/'), src), 'utf8').matchAll(
        /^import \{([^}]*)\} from '@tauri-apps\/api\/(\w+)';/gm,
      ),
    ].flatMap(([, names, module]) =>
      names!
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name && !name.startsWith('type '))
        .map((name) => `${module}: ${name}`),
    ),
  );
}

describe('the release configuration (DR6-12…14)', () => {
  it('gives package.json, tauri.conf.json and Cargo.toml one version, 1.0.0 or later', () => {
    const { version } = JSON.parse(desktop('package.json')) as { version: string };
    const cargo = /^\[package\][^[]*^version = "([^"]+)"$/m.exec(desktop('src-tauri/Cargo.toml'));
    expect([tauriConf().version, cargo?.[1]]).toEqual([version, version]);
    // All three back at the 0.1.0 of the template would still agree (DR6-12, DR6-88).
    expect(version).toMatch(/^[1-9]\d*\.\d+\.\d+$/);
  });

  it('builds the Rust library only as the rlib the exe links', () => {
    expect(desktop('src-tauri/Cargo.toml')).toMatch(/^crate-type = \["rlib"\]$/m);
  });

  it('allows the webview only the Tauri commands it uses', () => {
    // A new import may need a new permission in capabilities/default.json.
    expect([...new Set(tauriImports())].sort()).toEqual([
      'core: invoke',
      'core: isTauri',
      'window: getCurrentWindow',
    ]);
    const capability = JSON.parse(desktop('src-tauri/capabilities/default.json')) as {
      permissions: string[];
    };
    // CloseGuard: `onCloseRequested` listens (and stops) for the close event, then `destroy`.
    // The app's own commands need none.
    expect(capability.permissions).toEqual([
      'core:event:allow-listen',
      'core:event:allow-unlisten',
      'core:window:allow-destroy',
    ]);
  });

  it('keeps the CSP closed: no other host, no base URL, no form posted anywhere', () => {
    const directives = tauriConf()
      .app.security.csp.split(';')
      .map((directive) => directive.trim());
    expect(directives).toEqual(
      expect.arrayContaining([
        "default-src 'self'",
        "connect-src 'self' ipc: http://ipc.localhost",
        "base-uri 'none'",
        "form-action 'none'",
      ]),
    );
  });
});
