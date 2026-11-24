import { useEffect, useRef } from 'react';
import type { Command } from './command-palette';

/** The command the command bar asked for, until the screen that runs it takes it. */
let asked: Command | null = null;
const takers = new Set<() => void>();

/**
 * Asks the screen of `command` to run it (VA8): at once when it is on, else as it opens, once the
 * command bar has gone there.
 */
export function askCommand(command: Command): void {
  asked = command;
  for (const take of takers) take();
}

/**
 * A screen runs `run` when the command bar asks for `command`: now, or as the screen opens. With
 * `leave`, `run` only shows the part of the screen that runs it and leaves the ask to that part:
 * Cài đặt shows Dữ liệu for "Sao lưu ngay" when another section is open; a part shown already
 * takes the ask as well, and the `run` of the screen then changes nothing.
 */
export function useCommand(command: Command, run: () => void, leave = false): void {
  const latest = useRef(run);
  useEffect(() => {
    latest.current = run;
  });
  useEffect(() => {
    const take = () => {
      if (asked !== command) return;
      if (!leave) asked = null;
      latest.current();
    };
    take();
    takers.add(take);
    return () => {
      takers.delete(take);
    };
  }, [command, leave]);
}
