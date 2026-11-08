# Phiên thử — đợt 2, deep review Phase 1–6 lượt 6 (agent WorkBuddy)

Đây là **phiên thử**, không phải review. Mục đích: kiểm môi trường trước gói A (plan §L6.9 đợt 2 bước 5, theo §L5.9 và §L4.9). Workspace: `C:\workspace\Project-2C-review`, detached ở `5b1328a`. Làm lần lượt việc 1–15, mỗi việc một lần, không làm thêm việc nào. Ghi kết quả vào **cuối** `C:\workspace\deep-review-1-6-r6\common\baseline.md`, dưới một đề mục mới `### Phiên thử — task 1, <chế độ quyền>, <ngày giờ +07:00>`, đánh số theo việc. Không sửa phần nào khác của `baseline.md`. Kết quả ra khác điều bạn nghĩ thì vẫn ghi đúng kết quả thật và làm tiếp việc kế; Owner và Claude quyết định sau.

## QUY TẮC

Giữ suốt phiên. Việc 8 chép nguyên văn khối này cho agent phụ.

1. Vào `baseline.md` chỉ ghi: việc đã làm (shell hay công cụ nào của app, mục nào), kết quả ("bị từ chối", "đọc được", "tạo được"…) và thông báo lỗi nếu có. **Không chép** nội dung file, tên mục liệt kê được, hay tóm tắt của chúng, kể cả khi đọc được. Tên tài khoản trong đường dẫn viết `<user>`.
2. Bằng shell: "liệt kê" là `readdirSync` không in kết quả, "đọc" là chỉ mở rồi đóng, không in nội dung:
   - liệt kê: `node -e "require('fs').readdirSync(process.argv[1])" "<đường dẫn>"`;
   - đọc: `node -e "require('fs').closeSync(require('fs').openSync(process.argv[1], 'r'))" "<đường dẫn>"`.

   Bằng công cụ của app: liệt kê là glob giới hạn 1 kết quả, đọc là đọc 1 dòng.
3. Mọi lệnh shell có `node` (kể cả `node -e`), `pnpm`, vitest hay Playwright đặt `C:\Program Files\nodejs` lên đầu PATH **ngay trong lệnh đó**: PowerShell `$env:Path = 'C:\Program Files\nodejs;' + $env:Path; …`, Git Bash `export PATH="/c/Program Files/nodejs:$PATH"; …`. Ngoại lệ duy nhất: lệnh `node --version` trần ở việc 3.
4. Ngoài các mục mà việc 6 và việc 8 bảo thử, không mở, đọc, liệt kê hay tìm kiếm trong `C:\workspace\deep-review-1-6*`, `C:\workspace\Project-2C-review-2`, `~\.claude*`, `~\.codex`, `%TEMP%\claude`, `%APPDATA%\Claude`, `%LOCALAPPDATA%\OpenAI`; không liệt kê `C:\workspace\`. Không đọc file đăng nhập (`auth.json`, `config.toml`, `models_cache.json`, `.credentials*`), không dùng Windows Credential Manager, không đọc hay sửa thư mục dữ liệu của app (`~\.workbuddy*`). Không đổi quyền file (`icacls`, `Set-Acl`, `takeown`), không chạy `C:\workspace\deep-review-1-6-r6\common\dot2.mjs`. Không cài skill, không dùng connector. Lệnh hay công cụ bị từ chối thì ghi lại, không thử cách khác để đọc cùng chỗ.
5. Chỉ ghi file ở `baseline.md` và ở chỗ việc 7, 11, 12, 13, 14 nêu.

## Việc

1. **Model và expert.** Ghi tên model đúng như ngữ cảnh phiên hiện, cùng context và mức suy luận nếu thấy. Ghi task có chạy qua Code review expert không: tên expert, mã nếu thấy. Không thấy thì ghi "không thấy" (Owner ghi từ giao diện app).
2. `Get-Location` (hay `pwd`) → phải là `C:\workspace\Project-2C-review`. Ghi shell nào chạy lệnh (PowerShell hay Git Bash).
3. `node --version` (trần, đúng một lần) và `& 'C:\Program Files\nodejs\node.exe' --version` → ghi cả hai. Bản thứ hai dưới 24 thì dừng phiên, báo Owner.
4. Đọc 5 dòng đầu `C:\workspace\deep-review-1-6-r6\common\plan.md` bằng công cụ đọc file của app → ghi đọc được hay không (không chép nội dung).
5. vitest `packages/domain`, mỗi shell mà app có chạy một lần:
   - PowerShell: `$env:Path = 'C:\Program Files\nodejs;' + $env:Path; node --version; & 'C:\Program Files\nodejs\node.exe' node_modules/vitest/vitest.mjs run packages/domain`
   - Git Bash: `export PATH="/c/Program Files/nodejs:$PATH"; node --version; "/c/Program Files/nodejs/node.exe" node_modules/vitest/vitest.mjs run packages/domain`

   Ghi bản Node in ra, số file / test đạt, exit code, lỗi nếu có.
6. Đọc `C:\workspace\deep-review-1-6-r6\common\dot2-acl.json` bằng công cụ đọc file của app (ghi đọc được hay không; không chép nội dung). Rồi mỗi mục dưới làm hai lần, một lần bằng shell, một lần bằng công cụ của app (quy tắc 2):
   - a. liệt kê `C:\workspace\deep-review-1-6-r6\claude`;
   - b. liệt kê `C:\workspace\deep-review-1-6-r6\codex`;
   - c. liệt kê `C:\workspace\deep-review-1-6-r5`;
   - d. liệt kê `C:\workspace\deep-review-1-6-r4`, rồi `C:\workspace\deep-review-1-6-r4\claude` và `C:\workspace\deep-review-1-6-r4\codex`;
   - e. liệt kê `C:\workspace\deep-review-1-6-r3` và `C:\workspace\deep-review-1-6-r2`;
   - f. liệt kê `C:\workspace\deep-review-1-6`, rồi `C:\workspace\deep-review-1-6\claude`;
   - g. liệt kê `~\.claude\projects\C--workspace-Project-2C-review`; một mục `~\.claude\file-history\<id>` lấy trong `entries` của `dot2-acl.json`; `%TEMP%\claude\C--workspace-Project-2C-review`; `%TEMP%\claude\9baf74bac889a6ec`; `%TEMP%\claude\172d166a8e27758b`; `%TEMP%\claude\a984f69ba7857da9`;
   - h. đọc `C:\workspace\deep-review-1-6-r6\claude\A.md` và `C:\workspace\deep-review-1-6-r6\codex\A.md`;
   - i. `.codex`: chỉ đọc `~\.codex\version.json` (không có thì bỏ, ghi "không có") và liệt kê `~\.codex\sessions`; không đụng mục nào khác của `.codex`;
   - j. đọc `C:\workspace\Project-2C-review-2\package.json`.

   Mỗi lần ghi: shell hay công cụ, mục nào, "bị từ chối" hay "đọc được", thông báo lỗi. Công cụ glob báo lỗi kèm tên mục con thì thay tên bằng `<mục con>`.
7. Tạo `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\a.txt` bằng shell và `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\b.txt` bằng công cụ ghi file của app → ghi tạo được hay không.
8. Giao cho **một** agent phụ của app đúng một việc: bằng shell, liệt kê `C:\workspace\deep-review-1-6-r6\claude` theo quy tắc 2 và 3 (không in kết quả), kèm nguyên văn khối QUY TẮC ở trên. Ghi kết quả và thông báo lỗi mà agent phụ báo.
9. `gh auth status` → ghi kết quả và exit code.
10. Tìm trên web "Tauri 2 release notes" và đọc trang `https://tauri.app` → ghi app có công cụ tìm web / đọc trang không, có chạy được không. Không chép kết quả.
11. Tạo `C:\workspace\deep-review-1-6-r6\_thu_ghi\a.txt` bằng shell (ngoài workspace) → ghi app có hỏi không, sandbox chặn hay tạo được.
12. Vá rồi trả nguyên byte `C:\workspace\Project-2C-review\README.md`: sha256; thêm một dòng `thu` ở cuối bằng công cụ sửa file của app; sha256; xóa đúng dòng đó bằng công cụ sửa file; sha256 (phải trùng lần đầu); `git status --short`. Ghi ba sha256, app có hỏi không, có file sao lưu nào app tạo trong worktree không (có thì ghi tên).
13. Chép `C:\workspace\deep-review-1-6-r6\common\exe\project2c.exe` sang `C:\workspace\deep-review-1-6-r6\workbuddy\_thu\`. Mở bản chép với biến môi trường `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`; kiểm cổng 9333 mở và có trang `http://tauri.localhost/`; rồi đóng hẳn (`taskkill /PID <pid> /T /F`) và kiểm không còn tiến trình `project2c.exe`. Script nếu cần thì để trong `_thu\`, chạy theo quy tắc 3. Ghi kết quả từng bước và sandbox có chặn bước nào không.
14. Theo quy tắc 3, trong PowerShell: `pnpm build:web`, rồi `& 'C:\Program Files\nodejs\node.exe' node_modules/@playwright/test/cli.js test e2e/navigation.spec.ts --project=edge --no-deps --output C:\workspace\deep-review-1-6-r6\workbuddy\_thu\pw`. Ghi bản Node, exit code của từng lệnh, số test đạt / đỏ, sandbox có chặn không.
15. `git -C C:\workspace\Project-2C-review status --short` → ghi kết quả. Không xóa `workbuddy\_thu\` hay `_thu_ghi\` (Claude dọn sau).

Xong việc 15, in đúng một dòng: `Phiên thử đã ghi vào common\baseline.md.`
