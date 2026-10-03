/* global process */
// SessionStart hook: print the HANDOFF from the pinned GitHub issue labelled "handoff"
// (ADR-0003 appendix, #283), or the local copy saved at the last read when GitHub cannot
// be reached. Claude Code keeps at most 10,000 characters of hook output, so it is capped.

import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const tools = (name) => pathToFileURL(join(root, 'tools', name)).href;

try {
  const { readHandoff } = await import(tools('handoff.mjs'));
  const { fitOutput } = await import(tools('session-core.mjs'));
  const { body, source, warnings } = readHandoff(root, 8000);
  const header =
    `== HANDOFF (${source}) — already loaded, do not read it again\n` +
    warnings.map((w) => `WARNING: ${w}\n`).join('') +
    '\n';
  process.stdout.write(fitOutput(header, body));
} catch (error) {
  process.stdout.write(
    `HANDOFF could not be loaded (${error.message}). Run: node tools/handoff.mjs read\n`,
  );
}
