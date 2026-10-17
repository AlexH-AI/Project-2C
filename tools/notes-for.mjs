/* global process */
// Which OPEN notes of the review notes ledger name the files a task changes (T-261,
// CLAUDE.md § "Quy trình một task"):
//
//   node tools/notes-for.mjs <issue>                  the Issue's "File / thư mục được phép sửa"
//   node tools/notes-for.mjs --diff [--base <ref>]    files this branch changed, committed or not,
//                                                     since <ref> (default origin/main)
//   node tools/notes-for.mjs --pr <N>                 the PR's files
//   node tools/notes-for.mjs --files <path|glob>...   while writing an Issue
//
// Reads the ledger of the checkout it runs in. The PR answers each "Trùng file" note in its
// "Ghi chú OPEN liên quan" section; review-pr checks that with --pr. Pure part: notes-core.mjs.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  allowedPatterns,
  formatRelated,
  openNotes,
  relatedNotes,
  targetPatterns,
} from './notes-core.mjs';
import { REVIEW_NOTES } from './pr-core.mjs';
import { run } from './session-io.mjs';

const USAGE =
  'usage: node tools/notes-for.mjs <issue> | --diff [--base <ref>] | --pr <N> | --files <path|glob>...';

const lines = (text) => text.split(/\r?\n/).filter(Boolean);
// Paths with Vietnamese letters stay readable instead of quoted octal escapes.
const git = (args, cwd) => run('git', ['-c', 'core.quotePath=false', ...args], { cwd });
const gh = (args) => run('gh', args, { timeout: 30000 });

const isNumber = (value) => /^\d+$/.test(value ?? '');

// What to do with the "Trùng file" notes, by what the files come from.
const PLAN =
  'Gộp vào task những mục "Trùng file" còn vừa phạm vi và cỡ (tính vào ước lượng); trước khi mở PR chạy lại với --diff.';
const ANSWER =
  'Thân PR, mục "Ghi chú OPEN liên quan": mỗi mục "Trùng file" một dòng — đã sửa, hoặc để lại + lý do (ngoài phạm vi, vượt cỡ, cần cổng G…, chỉ ghi lại). Mục đã sửa chuyển sang RESOLVED ở PR sổ sau review.';
const CHECK =
  'review-pr (Spec): mục "Trùng file" không có dòng trong "Ghi chú OPEN liên quan" của thân PR → chặn; ghi "đã sửa" mà diff không sửa → chặn.';

/** The files to look for, how the first output line names them, and the hint to end with. */
function targetsOf(argv, root, files) {
  const [mode, ...rest] = argv;
  if (isNumber(mode)) {
    const body = gh(['issue', 'view', mode, '--json', 'body', '--jq', '.body']);
    const targets = allowedPatterns(body, files);
    return { targets, source: `Issue #${mode} (${targets.length} đường dẫn / glob)`, hint: PLAN };
  }
  if (mode === '--pr' && isNumber(rest[0])) {
    const path = `repos/{owner}/{repo}/pulls/${rest[0]}/files?per_page=100`;
    const targets = lines(gh(['api', '--paginate', path, '--jq', '.[].filename']));
    return { targets, source: `PR #${rest[0]} (${targets.length} file)`, hint: CHECK };
  }
  if (mode === '--diff' && (rest.length === 0 || (rest[0] === '--base' && rest.length === 2))) {
    const base = rest[1] ?? 'origin/main';
    const changed = [
      ...lines(git(['diff', '--name-only', `${base}...HEAD`], root)),
      ...lines(git(['diff', '--name-only', 'HEAD'], root)),
      ...lines(git(['ls-files', '--others', '--exclude-standard'], root)),
    ];
    const targets = [...new Set(changed)];
    return {
      targets,
      source: `nhánh này so với ${base} (${targets.length} file, kể cả chưa commit)`,
      hint: ANSWER,
    };
  }
  if (mode === '--files' && rest.length) {
    const targets = targetPatterns(rest, files);
    return { targets, source: `--files (${targets.length} đường dẫn / glob)`, hint: PLAN };
  }
  return null;
}

function main() {
  const root = git(['rev-parse', '--show-toplevel']).trim();
  const files = lines(git(['ls-files'], root));
  const asked = targetsOf(process.argv.slice(2), root, files);
  if (!asked) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const notes = openNotes(readFileSync(join(root, REVIEW_NOTES), 'utf8'), files);
  const commit = git(['rev-parse', '--short', 'HEAD'], root).trim();
  const head = `Ghi chú OPEN của ${REVIEW_NOTES} @ ${commit}, theo ${asked.source}.`;
  process.stdout.write(`${formatRelated(relatedNotes(notes, asked.targets), head, asked.hint)}\n`);
}

main();
