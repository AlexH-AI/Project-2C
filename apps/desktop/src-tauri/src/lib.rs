// Keep the Rust layer thin: business logic lives in packages/domain (ADR-0005, ADR-0006).
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running Project-2C");
}
