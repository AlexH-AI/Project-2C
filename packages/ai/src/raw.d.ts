// Tests read the approved G5 file as text through Vite's `?raw` import (`prompts/prompts.test.ts`).
declare module '*?raw' {
  const text: string;
  export default text;
}
