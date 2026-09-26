/** Migration SQL is embedded at build time through Vite's `?raw` import (ADR-0016 §4). */
declare module '*.sql?raw' {
  const sql: string;
  export default sql;
}
