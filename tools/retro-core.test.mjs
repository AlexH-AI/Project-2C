import { readFileSync } from 'node:fs';
import { URL } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  formatReport,
  isProbe,
  median,
  parseTranscript,
  projectDirName,
  sessionStats,
  transcriptDirs,
} from './retro-core.mjs';

const fixture = (name) =>
  parseTranscript(readFileSync(new URL(`./fixtures/retro/${name}.jsonl`, import.meta.url), 'utf8'));

const tool = (name, input) => ({ name, input });

describe('parseTranscript', () => {
  it('keeps the JSON objects and skips broken or non-object lines', () => {
    const entries = parseTranscript('{not json\n\n{"type":"user"}\nnull\n42\n[1]\n');
    expect(entries).toEqual([{ type: 'user' }]);
  });
});

describe('isProbe', () => {
  it('counts Read, Grep and Glob', () => {
    expect(isProbe(tool('Read', { file_path: 'a' }))).toBe(true);
    expect(isProbe(tool('Grep', { pattern: 'a' }))).toBe(true);
    expect(isProbe(tool('Glob', { pattern: '*' }))).toBe(true);
  });

  it('counts shell commands that read or search, after any leading cd', () => {
    expect(isProbe(tool('Bash', { command: 'cat a.md | head -5' }))).toBe(true);
    expect(isProbe(tool('Bash', { command: 'cd /c/repo && grep -rn x src' }))).toBe(true);
    expect(isProbe(tool('Bash', { command: 'git log --oneline -5' }))).toBe(true);
    expect(isProbe(tool('PowerShell', { command: 'Get-ChildItem tools' }))).toBe(true);
    expect(isProbe(tool('PowerShell', { command: 'Select-String -Path a -Pattern b' }))).toBe(true);
  });

  it('does not count commands that build, test, change state or edit', () => {
    expect(isProbe(tool('Bash', { command: 'pnpm verify' }))).toBe(false);
    expect(isProbe(tool('Bash', { command: 'git commit -m x' }))).toBe(false);
    expect(isProbe(tool('Bash', { command: 'gh issue view 1' }))).toBe(false);
    expect(isProbe(tool('Edit', { file_path: 'a' }))).toBe(false);
    expect(isProbe(tool('Bash', {}))).toBe(false);
  });
});

describe('sessionStats', () => {
  it('measures a task session', () => {
    expect(sessionStats(fixture('task'))).toEqual({
      id: 'task-0001-aaaa',
      start: '2026-10-01T08:00:00.100Z',
      kind: 'task',
      probesBeforeEdit: 3,
      contextAt3: 42203,
      wrongPaths: 3,
      handoffLoads: 2,
    });
  });

  it('classifies a session run in the review worktree as review, with no edit', () => {
    expect(sessionStats(fixture('review'))).toEqual({
      id: 'review-0002-bbbb',
      start: '2026-10-02T09:00:00.000Z',
      kind: 'review',
      probesBeforeEdit: null,
      contextAt3: null,
      wrongPaths: 0,
      handoffLoads: 0,
    });
  });

  it('survives broken lines and missing fields; a "review PR" prompt makes it a review', () => {
    expect(sessionStats(fixture('broken'))).toMatchObject({
      id: 'broken-0003-cccc',
      kind: 'review',
      probesBeforeEdit: null,
      contextAt3: null,
      wrongPaths: 0,
      handoffLoads: 0,
    });
  });

  it('counts HANDOFF reads that run the read, not commands that only mention it', () => {
    const line = { sessionId: 's', timestamp: '2026-10-03T00:00:00Z' };
    const call = (id, name, input) => ({
      ...line,
      type: 'assistant',
      message: { id, content: [{ type: 'tool_use', id, name, input }] },
    });
    const hook = (type) => ({
      ...line,
      type: 'attachment',
      attachment: { type, hookEvent: 'SessionStart', stdout: '# HANDOFF', content: '# HANDOFF' },
    });
    const stats = sessionStats([
      hook('hook_success'),
      hook('hook_additional_context'),
      call('a', 'Bash', { command: 'cat docs/state/HANDOFF.md' }),
      call('b', 'PowerShell', { command: 'cd C:\\repo; node tools/handoff.mjs read --out h.md' }),
      call('c', 'Read', { file_path: 'C:\\tmp\\handoff.md' }),
      call('d', 'Bash', { command: 'node -e \'run("node tools/handoff.mjs read")\'' }),
      call('e', 'Bash', { command: 'node tools/handoff.mjs write h.md' }),
    ]);
    expect(stats.handoffLoads).toBe(4);
  });

  it('returns null for a transcript without any session line', () => {
    expect(sessionStats(parseTranscript('{"type":"summary"}\n'))).toBeNull();
  });
});

describe('median', () => {
  it('ignores nulls and averages the two middle values', () => {
    expect(median([5, null, 1, 3])).toBe(3);
    expect(median([4, 1, 3, 2])).toBe(2.5);
    expect(median([null])).toBeNull();
  });
});

describe('project directories', () => {
  it('encodes a checkout path like Claude Code does', () => {
    expect(projectDirName('C:\\workspace\\Project-2C')).toBe('C--workspace-Project-2C');
  });

  it('keeps the repo folder and its review / worktree siblings, not a longer name', () => {
    const names = [
      'C--workspace-Project-2C',
      'C--workspace-Project-2C-review',
      'C--workspace-Project-2C-review-2',
      'C--workspace-Project-2C--claude-worktrees-x',
      'C--workspace-Project-2',
      'C--workspace-Project-2CX',
    ];
    expect(transcriptDirs(names, 'C--workspace-Project-2C')).toEqual(names.slice(0, 4));
  });
});

describe('formatReport', () => {
  it('prints one row per session and a median line per kind, never message text', () => {
    const rows = [fixture('task'), fixture('review')].map(sessionStats);
    const text = formatReport(rows, 'HOST-1');
    expect(text).toContain('machine HOST-1, 2 sessions');
    expect(text).toMatch(/2026-10-01 +task-000 +task +3 +42\.2k +3 +2/);
    expect(text).toMatch(/2026-10-02 +review-0 +review +— +— +0 +0/);
    expect(text).toMatch(/median task +\(1\) +3 +42\.2k +3 +2/);
    expect(text).toMatch(/median review +\(1\) +— +— +0 +0/);
    expect(text).not.toContain('review PR #12');
  });
});
