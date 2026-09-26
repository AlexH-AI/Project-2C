# ADR-0006: Kiến trúc monorepo và ranh giới module

- **Trạng thái:** Accepted (G1)
- **Ngày:** 2026-09-26
- **Nguồn:** `docs/PROJECT-PLAN.md` §4.4
- **Commit / PR:** `20e9c5e` · PR: —

## Bối cảnh

Lõi nghiệp vụ (chỉ số, vòng đời, cổng KYC) phải test được độc lập, không cần Tauri; UI phải dev/test nhanh trong trình duyệt.

## Quyết định

```
apps/desktop/      Tauri shell + React UI (routes, screens)
packages/domain/   TS thuần: entity, state machine N4→N1, stats engine, KYC gate,
                   parse ngày dd/mm & tiền VND — không phụ thuộc gì
packages/db/       Drizzle schema + migrations + repositories;
                   adapter TauriSqlite (app thật) & sql.js (trình duyệt, dev/e2e)
packages/ai/       provider adapters, prompt có version, zod schema, validators
packages/ui/       design system (tokens, components)
tools/             bootstrap, session scripts, seed generator
```

- `domain` không import gì từ package khác; ranh giới được `dependency-cruiser` chặn trong CI.
- **Chế độ web**: `pnpm dev:web` chạy UI trên Vite + sql.js; Playwright chạy ở chế độ này.
- **Portable**: dữ liệu ở `.\Project2C-data\` cạnh exe; tự backup khi khởi động.
- Mọi chuỗi UI qua lớp i18n; tiền/ngày chỉ xử lý bằng hàm chuẩn của `domain`.
- Kiểm thử: Vitest cho `domain` (coverage ≥ 95%); Playwright e2e + ảnh chụp; AI test bằng Mock + fixture; bộ eval AI ~20 hồ sơ chạy thủ công, không chạy trong CI.
- CI: lint → typecheck → unit → e2e (web) → build Tauri → upload exe.

## Phương án đã cân nhắc

- **Một package duy nhất** — loại: khó chặn phụ thuộc ngược, lõi dính Tauri.

## Lý do

Lõi thuần TS test nhanh và giữ được nếu đổi vỏ (ADR-0005); chế độ web giúp e2e không phụ thuộc build Tauri.

## Hệ quả

- Hai adapter DB phải giữ hành vi giống nhau (test hợp đồng chung).
- Mô hình dữ liệu chi tiết chốt ở **G2** (xem ADR-0007).

## Phụ lục — lưu trữ (Accepted G1, Owner duyệt 26/09/2026 · PR #58)

Theo ADR-0016: dòng "adapter TauriSqlite (app thật) & sql.js (trình duyệt, dev/e2e)" đổi thành **sql.js ở mọi nơi (exe, web, test); exe lưu file DB qua lệnh Rust mỏng** trong `apps/desktop/src-tauri`. Lý do: plugin SQL của Tauri không bảo đảm transaction (connection pool). Hệ quả "hai adapter DB giữ hành vi giống nhau" thành: một engine, chỉ khác cổng lưu file (`persist(bytes)`), do `apps/desktop` cung cấp. Mô hình dữ liệu chi tiết: `docs/design/phase-3-du-lieu.md` (G2).
