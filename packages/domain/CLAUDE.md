# packages/domain — quy tắc nghiệp vụ thuần

TypeScript thuần: định nghĩa chỉ số, vòng đời khách hàng, KYC, kỳ báo cáo, tiền / số. Không I/O, không DB, không UI.

## Ranh giới

- **Không import package nào khác** (kể cả `node:*`, trình duyệt) — `dependency-cruiser` rule `domain-is-pure` (`pnpm lint:deps`). Test (`*.test.ts`) được import `vitest`.
- Mọi package khác dùng domain qua `@p2c/domain` (`src/index.ts`); thêm export mới thì thêm vào `index.ts`. Ngoại lệ: hàm chỉ dùng chung giữa các file trong `src/` (vd. `scopeMatcher` của `stats.ts`, dùng ở `appointment-counts.ts`) được `export` nhưng không vào `index.ts`.
- Coverage ≥ 95% (`pnpm test:coverage` trong `pnpm verify`).

## File hay tìm

- Ngày / kỳ: `src/period.ts` (`CalendarDate` không giờ, không múi giờ; tuần Thứ Hai → Chủ Nhật; `parseQuickDate`, `formatDate`, `isInPeriod`, `shift`). Không có `date.ts`.
- Tiền: `src/money.ts` (VND là số nguyên đồng, `formatVnd`, `parseVnd`) · số: `src/number.ts`.
- Chỉ số: `src/stats.ts` (`periodMetrics`, `closeRate`, `rfCount`, ADR-0007) · thực thể: `src/model.ts`.
- Vòng đời KH: `src/customer-lifecycle.ts`, `src/pipeline-stage.ts` (N4 → N1).
- KYC: `src/kyc-catalog.ts` (danh mục, ngưỡng cổng), `src/kyc.ts`, `src/kyc-fact.ts`, `src/kyc-gate.ts` (ADR-0008).
- Golden fixtures: `src/golden/*.fixture.ts` (spec ở `docs/golden/`). **Không sửa để "cho xanh"**; muốn đổi phải qua Owner (G2).

## Quy ước

- Tiền, ngày, chỉ số chỉ tính / parse / format ở đây; package khác không tự làm lại.
- Định nghĩa chỉ số mới hoặc đổi định nghĩa: theo `docs/design/phase-4-chi-so.md` và ADR-0007, đổi định nghĩa là G2.

## Bản đồ export

Phần dưới do `pnpm codemap` sinh (`tools/codemap.mjs`), không sửa tay; `pnpm verify` báo đỏ khi lệch code.

<!-- codemap:start -->
- `src/appointment-counts.ts` — type AppointmentGroup, appointmentGroup, type AppointmentCounts, appointmentCounts
- `src/compare.ts` — type ComparisonWindows, comparisonWindows, type MetricDeltas, metricDeltas
- `src/customer-lifecycle.ts` — assertValidTransition, isRfTransition, stageOn, sortedByDate, stageAtEndOf, policyBadge
- `src/golden/appointments.fixture.ts` — APPOINTMENT_TODAY, type GoldenAppointmentRow, APPOINTMENT_ROWS, type AppointmentGoldenCase, APPOINTMENT_GOLDEN_CASES
- `src/golden/kyc.fixture.ts` — type ExpectedGate, type KycGoldenProfile, KYC_GOLDEN_PROFILES
- `src/golden/metrics.fixture.ts` — TEAMS, PEOPLE, CUSTOMERS, APPOINTMENTS, STAGE_TRANSITIONS, POLICIES, EXPECTED_RF_APPOINTMENT_IDS, type ExpectedMetrics, type GoldenCase, MTD_VIEWING_DATE, GOLDEN_CASES
- `src/golden/stage-snapshot.fixture.ts` — SNAPSHOT_TODAY, type GoldenCustomerRow, SNAPSHOT_CUSTOMERS, type SnapshotGoldenCase, SNAPSHOT_GOLDEN_CASES, CHART_GOLDEN_PERIOD, type ChartGoldenCase, CHART_GOLDEN_CASES, type MarksGoldenCase, REPORT_MARKS_GOLDEN_CASES
- `src/index.ts` — re-exports ./pipeline-stage, ./period, ./kyc-catalog, ./kyc-fact, ./kyc, ./kyc-gate, ./customer-lifecycle, ./stats, ./compare, ./appointment-counts, ./stage-snapshot, ./money, ./number, ./model
- `src/kyc-catalog.ts` — KYC_CATEGORIES, type KycCategory, KYC_FIELDS, type KycField, type KycCategorySpec, KYC_CATEGORY_SPECS, KYC_GATE_STATES, type KycGateState, KYC_GATE_THRESHOLDS, KYC_INSUFFICIENT_MESSAGE
- `src/kyc-fact.ts` — KYC_FACT_STATUSES, type KycFactStatus, type KycValue, type KycFact
- `src/kyc-gate.ts` — type KycSuggestedQuestions, type KycGateResult, evaluateKycGate
- `src/kyc.ts` — type KycNote, type KycProfile, type KycFactInput, type KycVersion, EMPTY_KYC_PROFILE, addNote, currentFacts, confirmFact, markConflict, resolveConflict, kycHash, isMaterialChange, nextKycVersion
- `src/model.ts` — type Team, PERSON_ROLES, type PersonRole, type Person, CLOSED_STAGES, type ClosedStage, type CustomerStage, type Customer, type StageTransition, APPOINTMENT_STATUSES, type AppointmentStatus, type Appointment, type Policy, type Scope
- `src/money.ts` — type Vnd, type VndParseError, type VndParseResult, parseVnd, formatVnd, formatVndCompact, formatVndDelta
- `src/number.ts` — groupThousands, formatCount, formatFileSize
- `src/period.ts` — type CalendarDate, PERIOD_KINDS, type PeriodKind, type Period, MIN_YEAR, MAX_YEAR, calendarDate, addDays, fromLocalDate, formatDate, formatLocalDateTime, localFileStamp, formatDayMonth, formatDayOfMonth, type Weekday, weekdayOf, daysBetween, compareDates, isInPeriod, parseDate, type QuickDateError, type QuickDateResult, NEXT_YEAR_SUGGESTION_DAYS, parseQuickDate, periodOf, customPeriod, monthToDate, shift, canShift, switchKind, formatPeriodValue, chartMarks, reportMarks
- `src/pipeline-stage.ts` — PIPELINE_STAGES, type PipelineStage, isPipelineStage, compareStages
- `src/stage-snapshot.ts` — snapshotDate, type StageCounts, stageSnapshot, stageSnapshotter
- `src/stats.ts` — type PolicyMetrics, scopeMatcher, inScope, policyMetrics, isRfAppointment, rfCount, type CloseRate, closeRate, type PeriodMetrics, type MetricsData, periodMetrics
<!-- codemap:end -->
