import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StartupError } from './StartupError';

describe('StartupError', () => {
  it('names the data folder Rust gave in its help (L185)', () => {
    const page = renderToStaticMarkup(
      <StartupError error="FILE_IN_USE" folder="E:\Heritas L-CRM\Project2C-data" />,
    );
    expect(page).toContain('trong thư mục dữ liệu của app (E:\\Heritas L-CRM\\Project2C-data)');
  });
});
