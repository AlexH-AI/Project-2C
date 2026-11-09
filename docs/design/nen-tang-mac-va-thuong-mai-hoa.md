# Phân tích — Bản Mac: chung mã Tauri hay viết riêng; desktop hay web khi thương mại hóa

- **Trạng thái:** phân tích để Owner chọn (G1). Chưa phải ADR: khi Owner chọn, quyết định ghi thành ADR và vào `PROJECT-PLAN.md`.
- **Soạn:** 10/11/2026, `main` `ab1ff14`. Nguồn: yêu cầu Owner (§0), spec `phase-6-phan-hoi-dung-thu.md` §9, rà code ở `main`, nguồn ngoài (§10).

## 0. Yêu cầu và thông tin của Owner (10/11/2026, nguyên văn)

> Ý tưởng của anh khi app đưa lên MacOS nó phải theo triết lý thiết kế của Mac và hệ sinh thái Apple: nhanh, mượt mà, animation mượt mà, UI/UX ấn tượng, đột phá

> Em cần phải cân nhắc thật kỹ giữa việc giữ chung mã Tauri và viết lại ngôn ngữ khác cho Mac. Lợi gì, thiệt gì cho các tính năng về sau như bảo mật, future update, tương thích với các hệ sinh thái Apple sau này như MacOS các phiên bản tương lai.
> 1 số thông tin anh bổ sung:
>
> * Anh có Macbook Pro M5 Pro, MacOS Golden Gate 27.2+
> * Dự định bản thương mại hóa sẽ dùng multi language, trước mắt là tiếng Việt và English.
> * Anh chưa đăng ký Apple dev acc với phí $99/năm để sign. Có thể sẽ làm sau này. Cần cân nhắc hướng phát triển app cho Mac hoặc đưa lên website, cách nào dễ tiếp cận về mặt thương mại hóa và chi phí thấp hơn, đánh giá rủi ro về security, tính phức tạp để phát triển và duy trì hiệu quả. MacOS hay web mới chỉ đang là ý tưởng nhưng anh mong muốn có 1 app song song trên Mac chạy được local trước khi nghĩ tới việc thương mại hóa.

## 1. Tóm tắt khuyến nghị

1. **Bản Mac chạy local, ngay bây giờ: chung mã Tauri (phương án T).** Thêm lớp giao diện riêng cho Mac và một hệ chuyển động để đạt "nhanh, mượt, ấn tượng". Không tốn tiền: không cần tài khoản Apple trả phí để chạy trên máy anh.
2. **Giữ cửa cho app gốc Apple về sau.** Cấu trúc dữ liệu (SQLite, file backup) và golden examples là hợp đồng chung. Nếu một ngày cần SwiftUI (cả app, hay chỉ widget), phần đó đọc được cùng dữ liệu, chạy cùng bộ ví dụ kiểm.
3. **Thương mại hóa: quyết sau, khi có người dùng thật.** Nghiêng về **desktop local-first + website bán và cấp license** (phương án H). Không làm web giữ dữ liệu KH tập trung (SaaS), trừ khi khách đòi và anh chấp nhận gánh vận hành, bảo mật, pháp lý.
4. **Điểm xét lại** (khi nào chuyển sang SwiftUI): §8.

Lý do chính: một mã cho Windows, Mac, và về sau cả iPhone / iPad (Tauri 2 build được iOS) hay bản web (React dùng lại được). Mọi tính năng A–F và về sau làm một lần. SwiftUI hơn hẳn ở độ "gốc Apple" và hệ sinh thái, nhưng mỗi tính năng phải làm hai lần, mãi về sau.

## 2. Các phương án

- **T. Chung mã Tauri.** Windows và Mac từ một mã nguồn. Thêm: các việc chuyển nền tảng M1–M10 (spec §9.1), lớp giao diện Mac (kính mờ, thanh tiêu đề, font hệ thống, phím ⌘, menu, hộp thoại dạng sheet), hệ chuyển động. Tính năng chỉ Apple có thì nối qua Swift khi cần.
- **S. Viết riêng app Mac bằng SwiftUI.** Bản Windows giữ Tauri. Hai mã nguồn, dùng chung định dạng dữ liệu và bộ ví dụ kiểm.
- **Đã cân nhắc và bỏ:**
  - Electron: nặng hơn (mang theo cả Chromium), không hơn Tauri ở điểm nào với app này.
  - Flutter, React Native for macOS, Kotlin Multiplatform: vẫn phải viết lại toàn bộ, mà không "gốc Apple" như SwiftUI, cũng không dùng lại được mã hiện có.

Cỡ mã hiện có (`main` `ab1ff14`): ≈ 32 800 dòng TypeScript sản phẩm (giao diện 19 100, `db` 6 600, `ai` 3 400, `domain` 2 400, `ui` 1 300) và ≈ 4 500 dòng Rust (kể cả test); ≈ 34 000 dòng unit test và 13 500 dòng e2e.

## 3. T và S theo từng tiêu chí

| Tiêu chí | T — Chung mã Tauri | S — SwiftUI riêng cho Mac |
|---|---|---|
| **Bảo mật** | Lõi Rust an toàn bộ nhớ. Nhân web của Apple (WKWebView) được vá qua cập nhật macOS; app không mang trình duyệt riêng phải tự vá. Tauri 2 chỉ cho giao diện gọi đúng các lệnh được cấp; CSP chặt đã có. Key AI vào Keychain (crate mới, G4). Rủi ro riêng: lớp web (XSS, đã chặn bằng CSP, không tải nội dung ngoài) và nhiều dependency npm. | Bộ bảo mật gốc: App Sandbox, Keychain, Touch ID / Secure Enclave dùng thẳng; ít dependency ngoài. Tốt nhất trên Mac. |
| **Cập nhật, bảo trì** | Một mã: tính năng và bản sửa ra cả Windows lẫn Mac cùng lúc; một bộ test, golden, e2e, một lần review. Bộ cập nhật của Tauri dùng chung, có chữ ký riêng, miễn phí. | Hai mã: mỗi tính năng làm hai lần, hai bộ test, hai lần review; logic chỉ số phải giữ khớp hai bên. SwiftUI đổi API hằng năm; Xcode mới đòi macOS mới. Cập nhật app qua Sparkle (miễn phí) hoặc Mac App Store. |
| **macOS các bản sau** | Khung cửa sổ, menu, nút đỏ-vàng-xanh là AppKit gốc nên theo hệ điều hành. Phần nội dung là web: không tự đổi theo ngôn ngữ thiết kế mới của Apple, phải sửa tay. Ví dụ macOS 26 (Liquid Glass): nền cửa sổ dùng hiệu ứng gốc qua `window-vibrancy`; nút, thẻ trong nội dung thì giả lập bằng CSS. Có thể chậm vài tuần so với bản macOS mới. | Build lại bằng SDK mới là theo Apple ngay (control chuẩn tự có Liquid Glass). Tính năng mới của macOS dùng được từ ngày phát hành. |
| **Hệ sinh thái Apple** | Làm được: thông báo, menu bar, phím tắt toàn máy, Keychain, link mở thẳng vào app. Khó (cần cầu nối Swift hay target Xcode riêng): widget, Spotlight, Shortcuts / Siri, iCloud (CloudKit), AI chạy trên máy của Apple. iPhone / iPad: Tauri 2 build được iOS từ cùng mã, giao diện phải chỉnh cho cảm ứng. | Đủ cả: widget, Spotlight, Shortcuts, đồng bộ iCloud giữa Mac và iPhone không cần máy chủ, Touch ID, AI trên máy của Apple (Foundation Models: miễn phí, dữ liệu không rời máy; có nguồn cho biết đã hỗ trợ tiếng Việt, cần kiểm lại). iPhone / iPad dùng chung mã Swift. |
| **Nhanh, mượt, ấn tượng** | Đạt mức rất mượt nếu làm kỹ: chỉ animate transform / opacity, danh sách dài thì ảo hóa, chuyển màn có ngữ cảnh. Vài chi tiết (ô nhập, menu chuột phải, chọn chữ) khác app gốc một chút. | Trần cao nhất: chuyển động lò xo, chuyển cảnh gốc của Apple. |
| **Đa ngôn ngữ** | Một bộ chữ (`vi.ts` + `en.ts`) cho mọi nền tảng. | Bộ chữ riêng (String Catalog), hoặc phải sinh từ một nguồn chung. |
| **Công sức ban đầu** | Chuyển nền tảng M1–M10 (≈ 6–10 Issue) và lớp giao diện Mac. | Viết lại ≈ 32 800 dòng TS thành Swift (ước 20–25 nghìn dòng) cùng test: ≈ 70–100 Issue cỡ hiện nay. Với nhịp hiện tại (≈ 410 task trong 45 ngày) là vài tuần lịch, chưa kể thời gian anh thử trên Mac. |
| **Làm việc với Claude Code** | Giữ nguyên: code trên hai PC Windows, CI build bản Mac, anh thử trên Mac. | Phát triển trên Mac (Xcode chỉ chạy trên macOS): Claude Code chạy trên Mac, thêm máy thứ ba vào giao thức hai máy; công cụ, test, review mới. |
| **Tiền, cho bản local** | 0 | 0 (Xcode miễn phí; build chạy trên máy mình không cần tài khoản trả phí) |

**Nhận định:** về bảo mật, cả hai làm an toàn được. S ít bề mặt tấn công hơn, nhưng rủi ro lớn nhất của app này nằm ở dữ liệu (backup, xuất Excel, gọi AI), giống nhau ở cả hai. Về lâu dài, S thắng ở độ "gốc Apple" và hệ sinh thái; T thắng ở chi phí bảo trì, tốc độ ra tính năng, đa ngôn ngữ và đường mở sang web / iPhone. Với một người chủ sản phẩm và Claude làm toàn bộ code, chi phí bảo trì hai mã là yếu tố nặng nhất.

## 4. Thương mại hóa: desktop, web hay kết hợp

| | D — Desktop, bán license | W — Web giữ dữ liệu tập trung (SaaS) | H — Desktop local-first + website (đề xuất) |
|---|---|---|---|
| **Tiếp cận khách** | Tải, cài; cần ký app để không bị cảnh báo | Dễ nhất: mở trình duyệt, mọi máy, kể cả iPad | Như D; website để giới thiệu, bán, tải |
| **Thu tiền** | License hay thuê bao qua mã kích hoạt | Thuê bao tự nhiên | Như D |
| **Chi phí vận hành** | Thấp: chỗ để file tải và một máy chủ license nhỏ | Cao, tăng theo số khách: máy chủ, cơ sở dữ liệu, backup, giám sát, trực sự cố, kiểm thử bảo mật | Thấp. Nếu làm đồng bộ mã hóa đầu cuối thì máy chủ chỉ giữ dữ liệu đã mã hóa |
| **Bảo mật** | Dữ liệu ở máy từng người; nhà cung cấp không giữ dữ liệu | Dữ liệu mọi khách tập trung một chỗ: mục tiêu tấn công giá trị cao; cần đăng nhập nhiều lớp, mã hóa, nhật ký truy cập, kiểm thử xâm nhập | Như D |
| **Pháp lý dữ liệu cá nhân** | Người dùng tự chịu trách nhiệm chính với dữ liệu của họ | Anh thành bên xử lý dữ liệu KYC (tài chính, tài sản, gia đình) của KH người khác: đánh giá tác động, biện pháp bảo vệ, báo khi lộ lọt; đặt máy chủ ở nước ngoài thì phải có hồ sơ chuyển dữ liệu xuyên biên giới | Như D |
| **Công sức phát triển** | Thêm license, cập nhật tự động, ký app hai nền tảng | Thêm cả một hệ thống: backend, đăng nhập, nhiều khách thuê, phân quyền, đồng bộ. Giao diện React và `domain` dùng lại được | Như D; đồng bộ làm sau, khi cần |
| **Rủi ro thị trường (cần hỏi khách mục tiêu)** | Ngân hàng có thể cấm cài phần mềm ngoài trên máy làm việc | Ngân hàng thường cấm đưa dữ liệu KH lên dịch vụ đám mây chưa được duyệt | Như D |

- **Pháp lý:** Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15) có hiệu lực từ 01/01/2026; Nghị định 356/2025/NĐ-CP hướng dẫn thi hành. Tổ chức vi phạm quy định chuyển dữ liệu cá nhân xuyên biên giới có thể bị phạt tới 5% doanh thu năm trước liền kề. Dữ liệu KYC của app (thu nhập, tài sản, gia đình) có thể thuộc nhóm dữ liệu nhạy cảm. Trước khi bán bản giữ dữ liệu tập trung, cần luật sư xác nhận nghĩa vụ cụ thể.
- **Web chạy local trong trình duyệt** (không máy chủ, dữ liệu trong bộ nhớ của trình duyệt): rẻ, nhưng dữ liệu có thể bị trình duyệt xóa, key AI kém an toàn hơn trong Keychain. Không hợp làm nơi giữ dữ liệu chính.
- **Lợi thế của T cho mọi hướng:** app viết bằng React + TypeScript nên một bản web (nếu sau này cần) dùng lại phần lớn giao diện và logic; app đã có bản chạy trong trình duyệt (`pnpm dev:web`). S không có lợi thế này.

## 5. Chi phí

| Khoản | Bản local cho anh (bây giờ) | Khi thương mại hóa |
|---|---|---|
| Apple Developer Program | Không cần: build trên máy anh, hoặc mở bản tải từ CI một lần bằng "Vẫn mở" (§9) | 99 USD/năm: ký Developer ID và notarize để khách mở bình thường, hoặc lên Mac App Store |
| Ký code Windows | Không cần (SmartScreen đã nghiệm thu NT-EX-01) | Chứng chỉ ký code, cỡ vài trăm USD/năm; kiểm giá lúc làm |
| CI build bản Mac | Miễn phí (repo đang public) | Nếu chuyển repo sang private để giữ mã nguồn: phút chạy macOS tính phí cao hơn Windows / Linux |
| Máy chủ | Không | D / H: chỉ website và license (thấp). W: máy chủ, cơ sở dữ liệu, backup, giám sát, kiểm thử bảo mật (cao, tăng theo khách) |
| Mac App Store | — | Apple giữ 15% (chương trình doanh nghiệp nhỏ) hoặc 30% doanh thu qua store |

## 6. Đa ngôn ngữ (tiếng Việt, English)

- App đã đưa mọi chữ giao diện qua `vi.ts` (1 389 dòng): thêm `en.ts` và chỗ chọn ngôn ngữ trong Cài đặt.
- Phải đổi thêm: định dạng tiền và ngày theo ngôn ngữ (vd. "1,9 tỷ" ↔ "1.9B VND"); prompt AI tiếng Anh hoặc chỉ định ngôn ngữ trả lời (G5); file Excel; hướng dẫn sử dụng.
- T dùng một bộ chữ cho mọi nền tảng; S phải giữ hai bộ.
- Nên làm trước khi thương mại hóa; không cần cho bản Mac chạy local của anh.

## 7. Rủi ro của khuyến nghị và cách giảm

| Rủi ro | Cách giảm |
|---|---|
| Vài chỗ chưa "gốc Apple" (ô nhập, menu chuột phải, chọn chữ) | Bộ component theo hướng dẫn thiết kế của Apple (HIG); thử trên Mac thật mỗi đợt; chỗ nào cần thì dùng menu, hộp thoại gốc của Tauri |
| Tauri chậm theo bản macOS mới | Ghim phiên bản; thử bản beta của macOS vào mùa hè (Apple công bố tháng 6, phát hành tháng 9); theo dõi changelog Tauri và `window-vibrancy` |
| Apple đổi ngôn ngữ thiết kế (như Liquid Glass ở macOS 26) | Gom lớp giao diện Mac vào một chỗ (token, component) để cập nhật một lần; nền cửa sổ dùng hiệu ứng gốc |
| Hiệu ứng cửa sổ trong suốt của Tauri cần API riêng của macOS, nên không lên được Mac App Store | Phát hành ngoài store (Developer ID); bản cho store thì bỏ hiệu ứng đó |
| Nhiều dependency npm / cargo | Đã ghim phiên bản; dependency mới qua G4; theo dõi cảnh báo bảo mật |

## 8. Khi nào xét lại

Chuyển sang (hoặc thêm phần) SwiftUI khi một trong các điều sau đúng:

- Tính năng chỉ Apple có thành điểm bán chính: widget, Spotlight, Siri / Shortcuts, AI chạy trên máy của Apple, đồng bộ iCloud giữa Mac và iPhone.
- Mac thành nền tảng chính của khách hàng.
- Đã làm lớp giao diện Mac mà vẫn không đạt độ mượt anh muốn, hoặc Tauri tụt sau macOS mới quá lâu.

Cách chuyển ít đau: dữ liệu chung (SQLite và file backup), golden examples dùng làm dữ liệu kiểm cho cả hai bộ test, chuyển từng phần (vd. widget trước).

## 9. Bước tiếp theo

**Nếu anh chọn T:**

1. **Spike:** CI build bản `.app` cho chip Apple, chưa ký. Anh mở trên M5 Pro: lần đầu macOS chặn, vào Cài đặt hệ thống → Quyền riêng tư & Bảo mật → "Vẫn mở" (từ macOS 15 không còn mở bằng chuột phải → Open). Ghi các chỗ hỏng; chưa sửa code sản phẩm.
2. **ADR "Bản macOS"** (G1): nơi để dữ liệu, kho key Keychain (G4), cách phát hành; ghi lựa chọn T và điểm xét lại §8.
3. **Vòng ý tưởng UI/UX** cho cả hai nền tảng, gồm lớp giao diện Mac và hệ chuyển động (spec `phase-6-phan-hoi-dung-thu.md` §8).
4. **Issue chuyển nền tảng** M1–M10.

**Nếu anh chọn S:** ADR và kế hoạch viết lại (≈ 70–100 Issue cho phần sản phẩm); phát triển trên Mac bằng Xcode, Claude Code chạy trên Mac; bản Windows giữ Tauri; định dạng dữ liệu và golden examples là hợp đồng chung.

## 10. Nguồn ngoài (tra 10/11/2026)

- Tauri, API cửa sổ (mục macOS 26, Liquid Glass): <https://v2.tauri.app/reference/javascript/api/namespacewindow/>
- `window-vibrancy` (hàm `apply_liquid_glass` cho macOS 26): <https://github.com/tauri-apps/window-vibrancy/blob/dev/README.md>
- `tauri-plugin-liquid-glass` (dùng API riêng của macOS, cần `macos-private-api`): <https://crates.io/crates/tauri-plugin-liquid-glass>
- Gatekeeper từ macOS 15 bỏ cách mở bằng chuột phải: <https://www.idownloadblog.com/apple-macos-sequoia-gatekeeper-change-install-unsigned-apps-mac/>, <https://eclecticlight.co/2024/10/01/living-without-notarization/>
- Luật 91/2025/QH15, hiệu lực 01/01/2026: <https://vneconomy.vn/nhung-diem-moi-trong-luat-bao-ve-du-lieu-ca-nhan-tu-112026.htm>; phạt tới 5% doanh thu khi vi phạm chuyển dữ liệu xuyên biên giới: <https://baodautu.vn/to-chuc-vi-pham-quy-dinh-chuyen-du-lieu-ca-nhan-xuyen-bien-gioi-bi-phat-5-doanh-thu-d314379.html>; Nghị định 356/2025/NĐ-CP: <https://www.ey.com/content/dam/ey-unified-site/ey-com/vi-vn/technical/tax/documents/ey-vietnam-legal-alert-march-2026-decree-no356-2025-nd-cp-providing-detailed-guidance-for-implementation-of-personal-data-protection-law-viet.pdf>
- Foundation Models, ngôn ngữ hỗ trợ (có tiếng Việt, một nguồn diễn đàn): <https://developer.apple.com/forums/thread/805378>, <https://machinelearning.apple.com/research/apple-foundation-models-2025-updates>
