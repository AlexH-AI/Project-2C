import { describe, expect, it } from 'vitest';
import { fieldNotes } from './field-notes';

describe('fieldNotes', () => {
  it('gives a field with nothing to say no line and no description', () => {
    expect(fieldNotes('f', {})).toEqual({ notes: [], describedBy: undefined });
    expect(fieldNotes('f', { error: '', hint: '', help: '' })).toEqual({
      notes: [],
      describedBy: undefined,
    });
  });

  it('shows the error in place of what the app read', () => {
    expect(fieldNotes('f', { error: 'Sai', hint: '1.200.000 ₫' })).toEqual({
      notes: [{ id: 'f-error', tone: 'error', text: 'Sai' }],
      describedBy: 'f-error',
    });
  });

  it('shows what the app read while there is no error', () => {
    expect(fieldNotes('f', { hint: '1.200.000 ₫' })).toEqual({
      notes: [{ id: 'f-read', tone: 'read', text: '1.200.000 ₫' }],
      describedBy: 'f-read',
    });
  });

  it('shows the help last whatever was typed, and reads it with the line above', () => {
    const help = { id: 'f-help', tone: 'help', text: 'Gõ "1,2 tr"' };
    expect(fieldNotes('f', { error: 'Sai', help: help.text })).toEqual({
      notes: [{ id: 'f-error', tone: 'error', text: 'Sai' }, help],
      describedBy: 'f-error f-help',
    });
    expect(fieldNotes('f', { hint: '1.200.000 ₫', help: help.text })).toEqual({
      notes: [{ id: 'f-read', tone: 'read', text: '1.200.000 ₫' }, help],
      describedBy: 'f-read f-help',
    });
    expect(fieldNotes('f', { help: help.text })).toEqual({ notes: [help], describedBy: 'f-help' });
  });
});
