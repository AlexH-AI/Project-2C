# ADR-0019: Bản macOS và phân phối hai nền tảng

- **Trạng thái:** Proposed. Chờ Owner duyệt G1 (quyết định) và G4 từng điểm (Q8–Q10). Câu hỏi Q1–Q12 ở thân PR của T-420. Ký mã và Store không chốt ở đây: Owner "cân nhắc sau" (§6).
- **Ngày:** 2026-11-12
- **Nguồn:** Owner 10–12/11/2026 trong chat ở Home PC (nguyên văn: `docs/PROJECT-STATE.md`, các mục 2026-11-10, 2026-11-11, 2026-11-12; Issue #1230 mục Bối cảnh). Kết quả thử bản Mac: Issue #1226. Phân tích: `docs/design/nen-tang-mac-va-thuong-mai-hoa.md`. Spec: `docs/design/phase-6-phan-hoi-dung-thu.md` §9.
- **Thay một phần (khi Accepted):**
  - ADR-0005: câu "Build ra 1 file `.exe` portable" và bối cảnh "app desktop Windows x64 portable"; phụ lục kho key "chỉ kho Windows".
  - ADR-0006: dòng "Portable: dữ liệu ở `.\Project2C-data\` cạnh exe".
  - ADR-0009 phụ lục D-1: kho key chỉ Windows.
  - ADR-0016 §2: dòng "Thư mục: `Project2C-data\` cạnh exe".
  - Bổ sung ADR-0015: workflow macOS, nhãn `build-mac`.
  - ADR-0006, 0015, 0016 có phụ lục trỏ về đây. ADR-0005 và 0009 không sửa trong T-420 (ngoài danh sách file của Issue); dòng Index của ADR này ghi thay.
- **Commit / PR:** T-420 (#1230) · PR: #1232

Mỗi điểm ghi rõ ai chốt: **Owner chốt** (ngày, câu nguyên văn) hay **Claude đề xuất** (kèm số câu hỏi Q… ở thân PR).

## Bối cảnh

Hôm nay app là một exe portable cho Windows x64 (ADR-0005). Dữ liệu nằm ở `Project2C-data\` cạnh exe (ADR-0006, ADR-0016); key AI nằm trong Windows Credential Manager (ADR-0009 D-1). CI build trên runner Windows; riêng workflow thử `macos.yml` (T-413) build bản Mac.

**Bước thử T-413** (PR #1219) build `Heritas L-CRM.app` cho chip Apple, ký ad-hoc, nén zip. Bản này:

- để dữ liệu ở `~/Library/Application Support/dev.alexh.project2c/`;
- mở thư mục và chatgpt.com bằng `/usr/bin/open`;
- khóa thư mục dữ liệu và kiểm quyền ghi bằng `std`.

Key AI trên Mac chưa có (M1): lưu key báo lỗi kho key.

**Kết quả thử** (#1226, Owner 12/11/2026): MacBook Pro M5 Pro, macOS 27.2.1, bản `f7b82ad`. C1–C8 đều OK: mở app, nhập backup Windows, so hồ sơ, chiều ngược lại, ghi và mở lại, bàn phím, Excel, hai bản cùng lúc. Không có chỗ hỏng, không có Issue `build-mac` nào.

**Gatekeeper:**

- Lần mở đầu không bị chặn. Owner tải và giải nén artifact trên PC, rồi Mac mở app qua thư mục chia sẻ trong mạng riêng (file backup cũng chép qua đó), nên file không mang cờ `com.apple.quarantine`.
- macOS chỉ kiểm app ký ad-hoc khi file mang cờ này. Trình duyệt và AirDrop gắn cờ lúc tải; `gh`, `curl` thì không.
- Đường người dùng thật (tải bằng trình duyệt trên Mac → hộp chặn → "Vẫn mở") **chưa kiểm**; chữ của hộp chặn trên macOS 27 cũng chưa kiểm. Owner 12/11 không thử thêm: "Không cần, viết ADR".

**Phạm vi mở rộng thành phân phối cho cả hai nền tảng.** Trao đổi đêm 11 rạng 12/11/2026, chat ở Home PC:

> "anh có 1 chút lăn tăn về quy mô của app trên cả 2 nền tảng, nếu portable file không đủ thì có thể phát triển full app, không nên bị gò bó bởi yêu cầu portable file exe"

Claude trả lời: hiện chưa việc nào bị portable chặn. Claude đề xuất đưa câu "portable hay bản cài" vào ADR "Bản macOS", mở rộng thành ADR phân phối cho cả hai nền tảng, gồm bốn điểm:

- portable hay bản cài cho Windows, và dữ liệu để ở đâu;
- tự cập nhật;
- ký mã;
- phát hành qua Store.

Lý do chốt trước G7: dữ liệu còn giả lập, nên đổi chỗ để dữ liệu chỉ cần nạp lại seed. Owner: "Gộp vào ADR". Owner tiếp:

> "ký mã phát hành qua Microsoft/Mac App Store là bước anh sẽ cân nhắc sau. Cái anh muốn là việc chuẩn bị trước cho quy mô tương lai nếu data lớn thì cần SQLite hay nền tảng tương tự SQgre gì đó. Data sẽ là lưu tại máy của user, data giả lập hay KH thật thì cũng là việc cá nhân user dùng tự quản lý và chịu trách nhiệm. App chỉ là nền tảng."

Từ trước, Owner 10/11 (`nen-tang-mac-va-thuong-mai-hoa.md` §0): "Anh chưa đăng ký Apple dev acc với phí $99/năm để sign. Có thể sẽ làm sau này."

Vì vậy ADR này:

- chốt dạng phát hành, nơi để dữ liệu và tự cập nhật cho cả hai nền tảng, trước G7;
- ghi ký mã và Store là việc Owner cân nhắc sau;
- **không** chốt cách lưu khi dữ liệu lớn. Việc đó thuộc một ADR lưu trữ riêng, chưa có; Claude đã đề xuất đo ở 5× / 10× dữ liệu trước, đề xuất này đang chờ Owner. Chỗ chạm giữa hai ADR: §2, §5.

## Quyết định

### 1. Một mã Tauri cho hai nền tảng

- **Owner chốt 10/11/2026 (G1):** "A quyết định chung mã Tauri như e khuyến nghị, thử trên Mac local trước, nếu không ổn thì tính tiếp". Bước thử đã xong và ổn (#1226), nên không tính lại.
- **Owner chốt 10/11/2026:** "bản Mac phát hành cùng lúc với bản windows". v1.0 gồm cả Windows và macOS.
- **Điểm xét lại** (bản phân tích §8): chuyển sang (hay thêm phần) SwiftUI khi một trong ba điều đúng:
  - tính năng chỉ Apple có (widget, Spotlight, Siri / Shortcuts, AI trên máy của Apple, iCloud) thành điểm bán chính;
  - Mac thành nền tảng chính của khách hàng;
  - lớp giao diện Mac vẫn không đạt độ mượt Owner muốn, hoặc Tauri tụt sau macOS mới quá lâu.
- **Claude đề xuất:** phần khác nhau theo nền tảng của vỏ Rust gom vào một module `platform` (vd. `platform::{windows, macos}`). Module này giữ: thư mục dữ liệu, khóa thư mục, kiểm quyền ghi, mở thư mục / URL, kho key.
  - Hôm nay các cặp `#[cfg(windows)]` / `#[cfg(not(windows))]` lặp ở `lib.rs`, `storage.rs`, `ai.rs` (mục `[Mac]` của sổ ghi chú về *Repeated Switches*). Gom một chỗ để Issue Mac sau và ADR lưu trữ sửa một nơi.
  - Phần React, `domain`, `db`, `ai` dùng chung, không đổi.
  - Làm ở Issue Mac-1 (spec §9.3).
- **Owner chốt 12/11/2026:** "Macbook sẽ là dev machine thứ 3". Dựng máy là task riêng sau ADR này (Mac-8): tài liệu, bootstrap macOS, phụ lục ADR-0003 cho ba máy. ADR này chỉ nhắc.

### 2. Nơi để dữ liệu

- **macOS** (T-413 đã làm; Claude đề xuất giữ): `~/Library/Application Support/<mã định danh>/`. Lý do:
  - gói `.app` tải về có thể bị macOS chạy từ một chỗ chỉ đọc (App Translocation);
  - ghi vào trong gói làm hỏng chữ ký.

  Không có chế độ "dữ liệu cạnh app" trên macOS, vì hai lý do trên.
- **Windows** (Claude đề xuất, Q1; dạng phát hành ở §5):
  - Bản cài: `%LOCALAPPDATA%\<mã định danh>\`.
  - Chế độ portable: exe thấy thư mục `Project2C-data\` cạnh nó thì dùng thư mục đó, như hôm nay. Bản cài không tạo thư mục này.
  - Vì sao `%LOCALAPPDATA%` mà không `%APPDATA%`:
    - `%APPDATA%` (Roaming) có thể được chép lên máy chủ khi đăng nhập / đăng xuất trên máy công ty (roaming profile). File SQLite trên thư mục đồng bộ dễ hỏng: cùng lý do ADR-0010 loại phương án C.
    - WebView2 của app đã để dữ liệu ở `%LOCALAPPDATA%\dev.alexh.project2c\EBWebView` (Tauri đặt; kiểm trên Home PC 12/11/2026). `localStorage`, nơi ADR-0018 lưu ngôn ngữ, nằm ở đó. Dữ liệu app vào cùng thư mục: một app, một thư mục.
    - Trình gỡ cài NSIS của Tauri có ô "xóa dữ liệu ứng dụng", mặc định không tích. Tích thì xóa cả `%APPDATA%\<mã>` lẫn `%LOCALAPPDATA%\<mã>` (mẫu `installer.nsi` của Tauri, tra 12/11/2026). Gỡ cài thường giữ dữ liệu.
  - Hôm nay exe portable cũng không hoàn toàn portable: ngôn ngữ (ADR-0018) và lựa chọn "che tên KH" nhớ theo máy nằm trong `%LOCALAPPDATA%`, theo người dùng Windows, không đi theo thư mục exe.
- **Bản debug** (`pnpm dev`; Claude đề xuất, đi cùng Q1): luôn dùng thư mục `Project2C-data` cạnh file chạy, trên cả hai nền tảng. Dữ liệu thử của máy dev không lẫn với dữ liệu đang dùng. Cần nhất trên MacBook, máy vừa dev vừa dùng app: hôm nay bản debug macOS ghi vào cùng `~/Library/Application Support/…` với bản phát hành.
- **Bên trong thư mục** giữ nguyên trên cả hai nền tảng: `project2c.db`, `project2c.lock`, `backups/`, `exports/`.
- **Mã định danh** (`identifier` của `tauri.conf.json`, hôm nay `dev.alexh.project2c`; Claude đề xuất, Q4):
  - Mã này đặt tên thư mục dữ liệu macOS, thư mục dữ liệu Windows của bản cài, thư mục WebView2, và là mã gói (bundle ID) khi lên Mac App Store.
  - Đổi sau khi phát hành thì dữ liệu người dùng nằm lại ở thư mục cũ. Test `the_macos_data_folder_is_named_by_the_identifier_of_the_build` của `storage.rs` giữ mã và tên thư mục khớp nhau.
  - Đề xuất: đổi một lần trước G7 sang mã theo tên sản phẩm, vd. `com.heritas.lcrm`; Owner chọn chữ. Mã thường viết theo tên miền đảo ngược, nhưng chỉ cần không trùng app khác, không cần sở hữu tên miền.
  - Lúc này đổi gần như không tốn gì: dữ liệu còn giả lập, máy đã có dữ liệu thì nhập lại backup. Key AI giữ nguyên, vì tên dịch vụ trong kho key là `Project-2C` (`KEY_SERVICE` của `ai.rs`), không theo mã định danh.
  - Giữ `dev.alexh.project2c` cũng chạy được; mã đó mang tên nội bộ "project2c" mãi mãi.
- **Sửa ADR khác (khi Accepted):** ADR-0006 dòng "Portable" và ADR-0016 §2 dòng "Thư mục" chỉ còn đúng cho chế độ portable của Windows; nơi để dữ liệu theo điểm này.
- **Chỗ chạm với ADR lưu trữ (chưa có):** ADR này chỉ chốt thư mục. Engine, cách ghi khi dữ liệu lớn, giới hạn cỡ file backup thuộc ADR lưu trữ. Nếu ADR đó thêm file vào thư mục dữ liệu (vd. file nhật ký của SQLite), file mới vẫn ở thư mục của điểm này.

### 3. Dữ liệu chung giữa các máy

- **Owner chốt 11/11/2026:** "Dữ liệu chung là file backup có thể dùng được trên cả 2 nền tảng".
  - Một định dạng file `.p2cbackup`, xuất trên máy này và nhập trên máy kia, cả hai chiều.
  - Đã thử ở #1226: C2 (nhập trên Mac file xuất từ Windows) và C4 (chiều ngược lại) đều OK.
- Chép file giữa máy: thư mục chia sẻ mạng, USB, iCloud Drive, email… AirDrop không chạy từ Windows.
- v1.0 không có thư mục đồng bộ hay đồng bộ thật. Hai cách đó xét sau v1.0, cùng phương án backup cloud (ADR-0010 phụ lục 11/10/2026).
- Tiền tệ đi theo file, ngôn ngữ theo máy (ADR-0018 §1, §2): Mac và PC dùng chung file nên cùng tiền tệ; mỗi máy chọn ngôn ngữ riêng.

### 4. Kho key AI trên macOS (M1)

- **Claude đề xuất (G4, Q8):** crate **`apple-native-keyring-store` 1.0.2** (06/08/2026, MIT / Apache-2.0). Đây là crate kho Apple của cùng hệ `keyring-core` với crate kho Windows đang dùng.
  - Crate nhận `keyring-core` ^1, nên chạy với bản `=1.0.0` đang ghim.
  - Ghim đúng phiên bản, chỉ cho macOS: `[target.'cfg(target_os = "macos")'.dependencies]`, `default-features = false`, feature `keychain`.
  - Kéo theo trực tiếp: `security-framework` 3.x (≥ 3.7, qua feature `keychain`) và `log` 0.4. Danh sách đầy đủ ghi ở Issue Mac-4, theo `Cargo.lock`.
- **Feature `keychain`, không `protected`:**
  - `keychain` là Keychain dạng file của macOS, cho app không ký bằng provisioning profile.
  - `protected` (Keychain bảo vệ dữ liệu, đồng bộ iCloud, Touch ID) cần app ký bằng provisioning profile; app ký ad-hoc gọi vào sẽ bị lỗi thiếu entitlement (README của crate).
- **Giữ nguyên cách lưu của D-1:**
  - cùng tên dịch vụ `Project-2C` và cùng tên người dùng của mục key như bản Windows;
  - Cài đặt → AI không đổi;
  - key không bao giờ nằm trong file dữ liệu hay backup.
  - Nguyên tắc "key trong kho của hệ điều hành" đã qua G4 / G6 ở D-1 (07/10/2026); macOS chỉ thêm một kho.
- **Hệ quả của ký ad-hoc** (chưa kiểm trên Mac):
  - Keychain dạng file nhận ra app theo "yêu cầu chỉ định" (designated requirement) của chữ ký. Với chữ ký ad-hoc, yêu cầu này gắn với đúng một bản build (Apple TN3127).
  - Vì vậy mỗi bản app mới là "app khác" với Keychain. Lần đầu đọc key sau khi cập nhật, macOS hỏi mật khẩu đăng nhập ("Cho phép" / "Luôn cho phép"); "Luôn cho phép" giữ tới bản sau.
  - Ký Developer ID (§6) thì hết hỏi.
  - Test chấp nhận của Issue Mac-4 có bước này; hướng dẫn sử dụng (Mac-5) có một câu.

### 5. Dạng phát hành

- **Owner chốt 12/11/2026:** gộp câu "portable hay bản cài" vào ADR này ("Gộp vào ADR"); dạng phát hành "không nên bị gò bó bởi yêu cầu portable file exe"; ký mã và Store để sau (§6).

**Windows (Claude đề xuất C+P, Q1):**

| | P. Exe portable (hôm nay) | C. Bản cài NSIS theo người dùng | C+P. Bản cài, giữ chế độ portable (đề xuất) |
|---|---|---|---|
| Quyền admin | Không | Không: `installMode` mặc định `currentUser`, cài vào `%LOCALAPPDATA%\<tên app>` | Như C |
| Dữ liệu | Cạnh exe | `%LOCALAPPDATA%\<mã định danh>\` | Như C; có `Project2C-data\` cạnh exe thì dùng nó |
| Lối tắt, gỡ cài | Không; xóa thư mục bằng tay | Lối tắt Start; gỡ ở Cài đặt → Ứng dụng của Windows; gỡ giữ dữ liệu trừ khi tích ô | Như C |
| SmartScreen (chưa ký) | Hỏi khi mở exe tải bằng trình duyệt (NT-EX-01) | Hỏi khi mở file cài; app đã cài không mang dấu "tải từ mạng" nên không hỏi lại | Như C |
| Tự cập nhật về sau | Không được: updater của Tauri chỉ nhận bản cài NSIS / MSI trên Windows | Có đường, không phải chuyển dữ liệu | Như C, cho bản cài |
| Nghiệm thu tách thư mục (`C:\nghiem-thu\…`, `C:\heritas-dung-thu\`) | Như hôm nay | Mất: mỗi người dùng Windows chỉ một thư mục dữ liệu | Giữ, bằng chế độ portable |
| Công sức | 0 | Code Windows (Mac-2): thư mục dữ liệu, cấu hình NSIS, CI build file cài; viết và nghiệm thu lại NT-EX | Như C, thêm một nhánh đọc thư mục cạnh exe (có test) |

- **Lý do đề xuất C+P:**
  - Dữ liệu còn giả lập: đổi chỗ để dữ liệu lúc này chỉ cần nạp lại seed hay nhập backup (R2-02). Sau phát hành thì phải chuyển dữ liệu thật của người dùng.
  - "Chuẩn bị trước cho quy mô tương lai" (Owner 12/11): tự cập nhật và Store chỉ đi qua bản cài. Chọn bản cài bây giờ giữ đường đó mở mà không phải chuyển dữ liệu lần nữa.
  - Hai nền tảng cùng một kiểu: dữ liệu ở thư mục ứng dụng của người dùng ("Data sẽ là lưu tại máy của user", Owner 12/11).
  - Chế độ portable giữ ba việc đang dùng: nghiệm thu ở thư mục riêng, chạy từ USB, và exe dùng thử cũ (`C:\heritas-dung-thu\`) vẫn đọc dữ liệu cũ.
- **Giá của C+P:** code Windows phải mở K49 (Q11), NSIS là công cụ mới (G4, Q9), các dòng NT-EX nghiệm thu lại (K46), hướng dẫn sử dụng viết lại phần cài đặt.
- **Giá của P (giữ như hôm nay):** không tốn gì lúc này. Muốn tự cập nhật hay lên Store sau phát hành thì phải chuyển dữ liệu thật. Hai nền tảng để dữ liệu theo hai kiểu.
- **MSI bị loại:** `installMode` chỉ có ở NSIS. MSI (WiX) của Tauri cài cho cả máy, thường cần quyền admin, mà Office Laptop không có quyền admin. Chưa kiểm trên Office Laptop.
- **Tải về:** bản phát hành chỉ có file cài. Exe chạy thẳng vẫn là artifact CI của mỗi commit trên `main`, dùng cho nghiệm thu và thử.

**macOS (Claude đề xuất `.dmg`, Q2):**

- `.dmg` chứa `Heritas L-CRM.app` và lối tắt tới Applications: cách phát hành quen thuộc của Mac, mở ra là kéo app vào Applications.
- Hôm nay là `.app` nén zip; Safari tự giải nén zip, nên zip cũng dùng được.
- `.dmg` không đổi gì với Gatekeeper: tải bằng trình duyệt vẫn mang cờ quarantine, vẫn phải "Vẫn mở" (§6). Updater macOS của Tauri dùng gói `.app.tar.gz` riêng, không liên quan tới `.dmg`.
- Chưa kiểm: dựng `.dmg` trên runner không màn hình. Script của Tauri dùng AppleScript để sắp cửa sổ Finder. Issue Mac-3 kiểm; hỏng thì giữ zip.

**Tự cập nhật (Claude đề xuất để sau v1.0, Q3):**

- Updater của Tauri cần:
  - plugin mới (crate `tauri-plugin-updater` và gói npm `@tauri-apps/plugin-updater`, G4);
  - một cặp khóa ký gói cập nhật. Chữ ký là bắt buộc, không tắt được. Khóa riêng là bí mật của CI (G6).
  - file `latest.json` và các gói ở chỗ app tải được, vd. GitHub Releases: repo phải public, hoặc thuê chỗ khác;
  - app gọi mạng lúc mở để hỏi bản mới, ngoài các lệnh AI (ADR-0009).
- Với một người dùng trên ba máy, tải bản mới bằng tay là đủ.
- **Xét lại khi:** app có người dùng ngoài Owner (team, thương mại hóa), hoặc khi chốt ký mã (§6). Với C hay C+P thì lúc đó không phải chuyển dữ liệu.

**Mở `.p2cbackup` bằng nhấp đúp (Claude đề xuất để sau v1.0):**

- Bản cài khai được loại file (`bundle.fileAssociations`).
- Nhưng app còn phải nhận file lúc mở (Windows: tham số dòng lệnh; macOS: sự kiện mở file) và hỏi xác nhận trước khi thay toàn bộ dữ liệu: hành vi mới, cần mockup.

**Không chốt cách lưu khi dữ liệu lớn:** việc của ADR lưu trữ (chưa có), như Bối cảnh ghi.

### 6. Ký mã, notarize

- **Owner chốt 12/11/2026:** "ký mã phát hành qua Microsoft/Mac App Store là bước anh sẽ cân nhắc sau". v1.0:
  - macOS ký ad-hoc (`signingIdentity: "-"`, như T-413), không notarize;
  - Windows không ký.
- **Hệ quả trên macOS:**
  - Người dùng tải bằng trình duyệt sẽ gặp hộp chặn lần mở đầu. Phải vào Cài đặt hệ thống → Quyền riêng tư & Bảo mật, bấm "Vẫn mở", xác nhận bằng mật khẩu hay Touch ID.
  - Từ macOS 15 không còn mở bằng chuột phải → Open (bản phân tích §10).
  - Hướng dẫn sử dụng cần phần này (Issue Mac-5). Chữ của hộp chặn trên macOS 27 chưa kiểm: Mac-5 chép lại lúc Owner tải bằng trình duyệt lần đầu.
  - Kết quả thử #1226: đường tải qua PC rồi mở qua chia sẻ mạng không có cờ quarantine nên không bị chặn. Đường trình duyệt chưa kiểm trên macOS 27.
  - Keychain hỏi lại mật khẩu sau mỗi bản mới (§4).
- **Hệ quả trên Windows:** SmartScreen hỏi lần mở đầu một file tải bằng trình duyệt (*More info → Run anyway*). Đã nghiệm thu NT-EX-01 với exe portable; với bản cài thì hỏi ở file cài (§5).
- **Khi nào xét lại:** trước khi đưa app cho người khác ngoài Owner (team, thương mại hóa), hoặc khi một bản macOS mới làm app ký ad-hoc không mở được nữa.
  - Developer ID: Apple Developer Program 99 USD / năm (G4). Ký và notarize thì người dùng mở bình thường, Keychain không hỏi lại.
  - Mac App Store:
    - app phải chạy trong sandbox, nên dữ liệu chuyển vào thư mục container của app;
    - hiệu ứng cửa sổ trong suốt dùng API riêng của macOS không lên được store (bản phân tích §7);
    - Apple giữ 15–30% doanh thu.
  - Windows: chứng chỉ ký code, cỡ vài trăm USD / năm (bản phân tích §5); Microsoft Store xét cùng lúc.

### 7. Chip và bản macOS

- **Nguồn Apple, tra 12/11/2026:**
  - support.apple.com/en-us/127455: "macOS 27 is compatible with any Mac with Apple silicon".
  - support.apple.com/en-us/127255: danh sách máy chạy được macOS 27, chỉ gồm máy chip Apple; trang không nhắc máy Intel.
  - Apple nói ở WWDC 2025 rằng macOS 26 Tahoe là bản cuối hỗ trợ máy Intel (9to5mac, 09/06/2025).
- **Claude đề xuất (Q5):** chỉ chip Apple (arm64, như T-413).
  - Universal (arm64 + Intel) làm file chạy gần gấp đôi và build lâu hơn, mà không có máy Intel để thử.
  - Máy Intel còn chạy macOS 26 bị loại có chủ ý: bản arm64 không chạy trên Intel.
- **Bản macOS tối thiểu (`minimumSystemVersion`, Claude đề xuất 26.0, Q5):**
  - Hôm nay chưa đặt, nên Tauri ghi mặc định 10.13, không đúng thực tế.
  - Lý do chọn 26: lớp giao diện Mac theo ngôn ngữ thiết kế của macOS 26 (Liquid Glass; mockup đợt a, ADR-0013 phụ lục 11/11/2026). Máy chip Apple còn ở macOS 26 vẫn mở được.
  - Đã kiểm trên máy thật: chỉ macOS 27.2.1 (#1226). macOS 26 chỉ được runner CI kiểm (macOS 26.7.2 lúc 11/11/2026: Rust, build, và e2e WebKit nếu chọn Q7); giao diện trên macOS 26 chưa kiểm trên máy thật.
  - Phương án khác: 27.0, chỉ bản đã kiểm trên máy thật; mọi máy chip Apple lên được 27. Nhưng runner đang ở 26 có thể chưa có SDK 27 để build với mức tối thiểu đó (chưa kiểm).

### 8. CI (M5)

- `macos.yml` giữ như T-413:
  - chạy ở PR gắn nhãn `build-mac` và chạy tay từ `main`;
  - runner `macos-latest` chip Apple (macOS 26.7.2 ngày 11/11/2026);
  - một run ≈ 4 phút (run `f7b82ad`: Rust, build, ký, nén).
- **Claude đề xuất (Q6):** `build-mac` bắt buộc khi PR đụng cùng danh sách file bắt buộc `build-exe` (`EXE_PATHS` của `tools/pr-core.mjs`: `src-tauri`, Cargo, `rust-toolchain.toml`, `package.json`, `pnpm-lock.yaml`, cấu hình build). Lý do:
  - v1.0 phát hành cả hai nền tảng, nên lỗi build Mac phải lộ trước khi merge, không phải ở G7;
  - code `cfg(not(windows))` chỉ được biên dịch và test trên runner macOS.
  - `merge-pr` chặn khi thiếu nhãn, như với `build-exe`. Việc này sửa công cụ pipeline nên cần mở K49 (Q12), như DS-1.
  - `CLAUDE.md` và `.claude/rules/ci.md` đổi cùng Issue Mac-6.
- **Phát hành:** GitHub Release v1.0 gồm file cài Windows, `.dmg` và hướng dẫn sử dụng, build từ cùng một SHA. CI trên `main` build bản Windows; chạy tay `macos.yml` trên SHA đó cho bản Mac.
- **Chi phí:**
  - Repo public: phút runner miễn phí.
  - Repo private: phút macOS tính ×10 và Windows ×2 trên phút miễn phí của gói (docs.github.com, "About billing for GitHub Actions"; gói Free 2000 phút / tháng, ADR-0015 phụ lục 27/09/2026). Một run macOS ≈ 4 phút tính thành ≈ 40 phút.
  - Nếu repo chuyển sang private: bỏ bắt buộc `build-mac`, chỉ chạy tay trước khi merge PR chỉ của Mac và trước G7.

### 9. Kiểm thử (M9)

- **Claude đề xuất (Q7):** thêm một project WebKit cho e2e Playwright (`devices['Desktop Safari']`), chạy trong `macos.yml` (PR `build-mac`, chạy tay); không chạy trong `ci.yml` của mọi PR.
  - Giá: tải trình duyệt WebKit của Playwright (miễn phí, công cụ mới: G4, Q10) và thêm vài phút mỗi run (đo ở Issue Mac-7).
  - E2e hôm nay viết cho Edge (`channel: 'msedge'`, `locale: 'vi-VN'`); test nào phụ thuộc Edge thì sửa ở Mac-7.
  - WebKit của Playwright chạy trên Windows là một bản dựng khác, xa WKWebView hơn, nên không dùng.
- **WebKit của Playwright không phải WKWebView của macOS.** Vì vậy nghiệm thu trên Mac thật trước G7 vẫn bắt buộc:
  - thêm các dòng macOS vào `docs/testing/nghiem-thu-v1.md`, dựng từ C1–C8 của #1226, thêm Keychain, `.dmg` và "Vẫn mở" trên đường tải bằng trình duyệt;
  - Owner chạy trên MacBook. Claude không điều khiển được WKWebView qua cổng debug như WebView2.
  - Mỗi người dùng macOS chỉ có một thư mục dữ liệu: xuất backup trước khi nghiệm thu, nhập lại sau; hoặc dùng một tài khoản macOS riêng.

### 10. Lớp giao diện Mac

- Theo mockup vỏ app đợt a, Owner duyệt G3 ngày 11/11/2026 (`docs/design/mockups/app-shell.html`, `components.html`), và phụ lục ADR-0013 cùng ngày (font hệ thống, lớp vật liệu theo nền tảng, bo góc, token chuyển động). ADR này chỉ trỏ tới, không chốt lại. Hệ chuyển động: đợt g (spec §8).
- Ngôn ngữ của gói app (ADR-0018 §10): khai hai ngôn ngữ vi và en (`CFBundleLocalizations`) để menu và hộp chọn file của macOS theo ngôn ngữ của app. Làm ở Issue Mac-3.

## Phương án đã cân nhắc

1. **SwiftUI riêng cho Mac:** đã loại ngày 10/11/2026 (bản phân tích §3). Điểm xét lại: §1.
2. **Windows chỉ exe portable (P):** không tốn gì lúc này, nhưng tự cập nhật và Store về sau phải chuyển dữ liệu thật (§5).
3. **Windows chỉ bản cài (C), bỏ chế độ portable:** mất nghiệm thu ở thư mục riêng và exe dùng thử cũ; C+P chỉ thêm một nhánh có test.
4. **Phát hành cả file cài lẫn exe portable cho người dùng chọn:** hai nơi để dữ liệu, người dùng dễ lẫn, nghiệm thu gấp đôi.
5. **MSI:** cài cho cả máy, thường cần quyền admin (§5).
6. **`%APPDATA%` (Roaming) cho dữ liệu:** có thể bị đồng bộ theo roaming profile (§2).
7. **Chế độ portable trên macOS:** App Translocation và chữ ký của gói (§2).
8. **Giữ zip cho macOS:** dùng được, chỉ kém quen thuộc hơn `.dmg`. Là phương án dự phòng nếu dựng `.dmg` trên runner hỏng (§5).
9. **Tự cập nhật ở v1.0:** thêm plugin, khóa ký bí mật, chỗ để gói và một lệnh gọi mạng cho một người dùng (§5).
10. **Developer ID ở v1.0:** tốn 99 USD / năm; Owner để sau (§6).
11. **Chứng chỉ tự ký để Keychain khỏi hỏi lại:** chứng chỉ tự ký giữ cùng danh tính qua các bản build. Nhưng khóa riêng của nó phải nằm trong CI (G6), Gatekeeper vẫn chặn như ad-hoc, và chưa có nguồn xác nhận nó đủ cho Keychain.
12. **Feature `protected` của crate Keychain:** cần provisioning profile (§4).
13. **Universal binary, hay tối thiểu macOS 27:** §7.
14. **E2E WebKit trong `ci.yml` cho mọi PR:** tốn phút macOS mỗi PR; WebKit trên runner Windows xa WKWebView hơn (§9).

## Lý do

- Một mã: mọi tính năng và bản sửa ra cả hai nền tảng cùng lúc. Bước thử cho thấy app chạy đúng trên Mac mà không phải sửa gì thêm.
- Chốt dạng phát hành và nơi để dữ liệu trước G7, khi dữ liệu còn giả lập, là lúc đổi rẻ nhất. Sau phát hành, mỗi lần đổi chỗ là một lần chuyển dữ liệu thật.
- Dữ liệu theo người dùng trên cả hai nền tảng đúng với cách hai hệ điều hành và updater của Tauri mong đợi. Chế độ portable giữ lại những gì portable đang làm tốt cho dự án (nghiệm thu, USB).
- Ký mã, Store, tự cập nhật và lưu trữ khi dữ liệu lớn có điều kiện xét lại rõ ràng. Chúng không chặn v1.0 cho một người dùng trên ba máy.

## Hệ quả

- **Thay một phần** ADR-0005, 0006, 0009 (D-1), 0016 §2; bổ sung ADR-0015 (đầu ADR này).
- **Issue dự kiến Mac-1 … Mac-8:** spec `phase-6-phan-hoi-dung-thu.md` §9.3, gồm task dựng MacBook làm máy dev thứ 3. Mỗi M còn mở của §9.1 và mỗi mục `[Mac]` của sổ ghi chú thuộc đúng một Issue.
- **Nghiệm thu:** nếu chọn bản cài (Q1), các dòng NT-EX của bản Windows viết lại cho bản cài và chạy lại (K46), thêm dòng gỡ cài. Thêm các dòng macOS (§9).
- **Hướng dẫn sử dụng:** phần macOS ("Vẫn mở", Keychain, nơi để dữ liệu, phím ⌘); phần cài đặt Windows nếu chọn bản cài.
- **Máy dev:** bản debug dùng thư mục riêng, nên MacBook vừa dev vừa dùng app được. `CLAUDE.md` mục "Môi trường Windows và 2 máy" đổi ở task dựng máy (Mac-8).
- **Keychain:** hỏi mật khẩu sau mỗi bản Mac mới, tới khi ký Developer ID (§4).
- **ADR lưu trữ** (chưa có) dùng thư mục dữ liệu của §2.

## Nguồn ngoài (tra 12/11/2026)

- Apple: <https://support.apple.com/en-us/127455>, <https://support.apple.com/en-us/127255>; WWDC 2025, macOS 26 là bản cuối cho máy Intel: <https://9to5mac.com/2025/06/09/apple-will-end-support-for-intel-macs/>
- Apple TN3127, yêu cầu chỉ định của chữ ký ad-hoc gắn với một bản build: <https://developer.apple.com/documentation/technotes/tn3127-inside-code-signing-requirements>
- `apple-native-keyring-store`: <https://crates.io/crates/apple-native-keyring-store>, README (`keychain` / `protected`): <https://github.com/open-source-cooperative/apple-native-keyring-store>
- Tauri updater (chữ ký bắt buộc; Windows dùng bản cài NSIS / MSI): <https://v2.tauri.app/plugin/updater/>
- Tauri, bản cài Windows (NSIS `currentUser` mặc định, cài vào `%LOCALAPPDATA%`, không cần admin): <https://v2.tauri.app/distribute/windows-installer/>; mẫu trình gỡ cài: <https://github.com/tauri-apps/tauri/blob/dev/crates/tauri-bundler/src/bundle/windows/nsis/installer.nsi>
- GitHub Actions, hệ số phút macOS ×10, Windows ×2: <https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions>
