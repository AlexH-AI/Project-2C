// Pure helpers for tools/codemap.mjs: the export map written into each package's CLAUDE.md
// (#287). No file I/O here, so they are unit-tested in codemap-core.test.mjs.

import ts from 'typescript';

export function parseSource(fileName, text) {
  const kind = fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, kind);
}

const isExported = (node) =>
  ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export ? true : false;
const isDefault = (node) =>
  ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Default ? true : false;

/**
 * Names a file exports itself (`type: true` for types and interfaces) and the modules it
 * re-exports from, in source order. Re-exported names are not repeated: they are listed
 * on the line of the file that declares them.
 */
export function listExports(sourceFile) {
  const names = [];
  const reexports = [];
  for (const node of sourceFile.statements) {
    if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier) {
        const from = node.moduleSpecifier.text;
        if (!reexports.includes(from)) reexports.push(from);
        continue;
      }
      for (const element of node.exportClause?.elements ?? []) {
        names.push({ name: element.name.text, type: node.isTypeOnly || element.isTypeOnly });
      }
    } else if (ts.isExportAssignment(node)) {
      names.push({ name: 'default', type: false });
    } else if (ts.isVariableStatement(node) && isExported(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          names.push({ name: declaration.name.text, type: false });
        }
      }
    } else if (
      (ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)) &&
      isExported(node)
    ) {
      const type = ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node);
      names.push({ name: isDefault(node) ? 'default' : node.name.text, type });
    }
  }
  return { names, reexports };
}

const byPath = (a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0);

function describeFile({ names, reexports }) {
  const parts = [];
  if (names.length) parts.push(names.map((n) => (n.type ? `type ${n.name}` : n.name)).join(', '));
  if (reexports.length) parts.push(`re-exports ${reexports.join(', ')}`);
  return parts.length ? parts.join('; ') : '(no exports)';
}

/**
 * Markdown list of the files and what they export, one line per file sorted by path.
 * Over `limit` characters, it falls back to one line per directory listing file names only,
 * so the CLAUDE.md that Claude Code loads into context stays small.
 */
export function renderExportMap(files, limit = Infinity) {
  const sorted = [...files].sort(byPath);
  const full = sorted.map((f) => `- \`${f.path}\` — ${describeFile(f)}`).join('\n');
  if (full.length <= limit) return full;
  const dirs = new Map();
  for (const { path } of sorted) {
    const cut = path.lastIndexOf('/') + 1;
    const dir = path.slice(0, cut);
    dirs.set(dir, [...(dirs.get(dir) ?? []), path.slice(cut)]);
  }
  return [...dirs.keys()]
    .sort()
    .map((dir) => `- \`${dir}\` — ${dirs.get(dir).join(', ')}`)
    .join('\n');
}

export const START = '<!-- codemap:start -->';
export const END = '<!-- codemap:end -->';

const count = (text, marker) => text.split(marker).length - 1;

/** `content` (made LF) with `block` between the markers; the hand-written rest is kept. */
export function replaceBlock(content, block) {
  const text = content.replace(/\r\n/g, '\n');
  for (const marker of [START, END]) {
    const n = count(text, marker);
    if (n === 0) throw new Error(`missing ${marker}`);
    if (n > 1) throw new Error(`${marker} must appear once (found ${n})`);
  }
  const from = text.indexOf(START);
  const to = text.indexOf(END);
  if (to < from) throw new Error(`${START} must come before ${END}`);
  return `${text.slice(0, from)}${START}\n${block}\n${text.slice(to)}`;
}

/** The `SECTIONS` array of shell/routes.ts: sidebar screens in sidebar order. */
export function sectionsOf(routesFile) {
  let sections = [];
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(routesFile) === 'SECTIONS') {
      let init = node.initializer;
      while (init && ts.isAsExpression(init)) init = init.expression;
      if (init && ts.isArrayLiteralExpression(init)) {
        sections = init.elements.filter(ts.isStringLiteral).map((e) => e.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(routesFile);
  return sections;
}

function importsByName(file) {
  const map = new Map();
  for (const node of file.statements) {
    if (!ts.isImportDeclaration(node)) continue;
    const bindings = node.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const el of bindings.elements) map.set(el.name.text, node.moduleSpecifier.text);
    }
  }
  return map;
}

const tagOf = (expr) => {
  while (expr && ts.isParenthesizedExpression(expr)) expr = expr.expression;
  if (expr && ts.isJsxSelfClosingElement(expr)) return expr.tagName.getText();
  if (expr && ts.isJsxElement(expr)) return expr.openingElement.tagName.getText();
  return null;
};

/** Each `if (route.screen === 'x') return <Component />` of routes/Screen.tsx, with its import. */
export function screenComponents(screenFile) {
  const imports = importsByName(screenFile);
  const rows = [];
  const visit = (node) => {
    if (ts.isIfStatement(node) && ts.isBinaryExpression(node.expression)) {
      const { left, operatorToken, right } = node.expression;
      const then = node.thenStatement;
      if (
        operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken &&
        left.getText(screenFile) === 'route.screen' &&
        ts.isStringLiteral(right) &&
        ts.isReturnStatement(then)
      ) {
        const tag = tagOf(then.expression);
        if (tag && imports.has(tag)) rows.push({ screen: right.text, from: imports.get(tag) });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(screenFile);
  return rows;
}

/** Module specifiers of the `*-view` files a file imports (pure screen logic, unit-tested). */
export function viewImports(file) {
  return file.statements
    .filter(ts.isImportDeclaration)
    .map((node) => node.moduleSpecifier.text)
    .filter((from) => /-view$/.test(from));
}

/** Markdown table route → screen file → view files; sidebar sections first, in order. */
export function renderRouteTable(sections, rows) {
  const code = (paths) => (paths.length ? paths.map((p) => `\`${p}\``).join(', ') : '—');
  const ordered = [
    ...sections.map((screen) => rows.find((r) => r.screen === screen) ?? { screen }),
    ...rows.filter((r) => !sections.includes(r.screen)),
  ];
  const lines = ordered.map((r) =>
    r.file
      ? `| \`${r.screen}\` | \`${r.file}\` | ${code(r.views)} |`
      : `| \`${r.screen}\` | (placeholder) | — |`,
  );
  return ['| route | screen | view |', '|---|---|---|', ...lines].join('\n');
}
