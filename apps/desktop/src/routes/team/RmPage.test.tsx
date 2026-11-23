import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Boundary } from './Boundary';
import { CadenceFailed, PageFailed } from './RmPage';

/** What `Boundary` draws once a child threw `error` (React's own path, which no static render runs). */
function failedWith(error: unknown, fallback: Boundary['props']['fallback']): string {
  const boundary = new Boundary({ fallback, children: null });
  boundary.state = Boundary.getDerivedStateFromError(error);
  return renderToStaticMarkup(<>{boundary.render()}</>);
}

// Mockup search-rm-team.html #states.
describe('the failures of the RM page', () => {
  it('says the RM page failed, with the way back to Team and the detail (L232)', () => {
    const html = failedWith(new TypeError('no cadence'), (error) => <PageFailed error={error} />);
    expect(html).toContain('Trang RM này gặp lỗi và không hiển thị được');
    expect(html).toContain('← Team &amp; nhân sự</button>');
    expect(html).toContain('TypeError: no cadence');
  });

  it('says the strips failed in their card, with Thử lại', () => {
    const html = failedWith(new Error('x'), (_, retry) => <CadenceFailed retry={retry} />);
    expect(html).toContain('Không tính được nhịp gặp 8 tuần');
    expect(html).toContain('Bốn số ở đầu trang vẫn đúng.');
    expect(html).toContain('Thử lại</button>');
  });
});
