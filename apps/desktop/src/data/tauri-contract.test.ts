// The contract between `tauri-storage.ts` and the Rust commands (DR-55): each side is otherwise
// tested only against its own copy, and a renamed command or argument shows only in the exe.
import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { ALREADY_OPEN, DISK_FULL, tauriStorage } from './tauri-storage';

const rust = (file: string) =>
  readFileSync(new URL(`../../src-tauri/src/${file}`, import.meta.url), 'utf8');
const lib = rust('lib.rs');
const storage = rust('storage.rs');
const ai = rust('ai.rs');

/**
 * The AI commands (spec Phase 5 §5.1) and the camelCase arguments the webview sends. Their client
 * comes with Settings → AI and the panel; until then this pins the names it must use.
 */
const AI_COMMANDS: Record<string, string[]> = {
  ai_complete: ['plan', 'model', 'reasoning', 'messages', 'maxTokens'],
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
  });

  it('reads an empty reply of db_open as a first start, which Rust sends for no file', () => {
    expect(commandSource('db_open')).toContain('Response::new(bytes.unwrap_or_default())');
  });
});

describe('the JS ↔ Rust AI contract', () => {
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
    // `AI_OPEN_BROWSER` joins AI_ERROR_CODES with the ChatGPT web panel (T-174).
    expect(sent.sort()).toEqual([...known, 'AI_OPEN_BROWSER'].sort());
  });
});
