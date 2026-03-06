import React, { useRef } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

// ─── IntersectionObserver mock ────────────────────────────────────────────

let observerCallback = null;
let observerOptions = null;
const observedElements = new Set();

const MockIntersectionObserver = jest.fn(function (callback, options) {
  observerCallback = callback;
  observerOptions = options;
  this.observe = jest.fn((el) => observedElements.add(el));
  this.unobserve = jest.fn((el) => observedElements.delete(el));
  this.disconnect = jest.fn();
});

beforeAll(() => {
  window.IntersectionObserver = MockIntersectionObserver;
});

beforeEach(() => {
  observerCallback = null;
  observerOptions = null;
  observedElements.clear();
  MockIntersectionObserver.mockClear();
});

// Helper component
function TestComponent({ threshold, rootMargin } = {}) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin });
  return (
    <div ref={ref} data-testid="target">
      {isVisible ? 'visible' : 'hidden'}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

describe('useScrollAnimation', () => {
  it('starts with isVisible=false', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('target').textContent).toBe('hidden');
  });

  it('creates an IntersectionObserver on mount', () => {
    render(<TestComponent />);
    expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it('observes the element ref', () => {
    render(<TestComponent />);
    expect(observedElements.size).toBe(1);
  });

  it('uses threshold=0.1 by default', () => {
    render(<TestComponent />);
    expect(observerOptions.threshold).toBe(0.1);
  });

  it('uses rootMargin="0px" by default', () => {
    render(<TestComponent />);
    expect(observerOptions.rootMargin).toBe('0px');
  });

  it('accepts a custom threshold', () => {
    render(<TestComponent threshold={0.5} />);
    expect(observerOptions.threshold).toBe(0.5);
  });

  it('accepts a custom rootMargin', () => {
    render(<TestComponent rootMargin="-100px" />);
    expect(observerOptions.rootMargin).toBe('-100px');
  });

  it('sets isVisible=true when intersection is detected', () => {
    render(<TestComponent />);

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(screen.getByTestId('target').textContent).toBe('visible');
  });

  it('does not set isVisible=true when isIntersecting is false', () => {
    render(<TestComponent />);

    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(screen.getByTestId('target').textContent).toBe('hidden');
  });

  it('unobserves the element after first intersection (one-shot)', () => {
    const { unmount } = render(<TestComponent />);

    const observer = MockIntersectionObserver.mock.instances[0];

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(observer.unobserve).toHaveBeenCalled();
  });

  it('stays visible after subsequent non-intersecting callbacks', () => {
    render(<TestComponent />);

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Even if another callback fires, it should still be visible
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    // isVisible is set once and never goes back to false
    expect(screen.getByTestId('target').textContent).toBe('visible');
  });

  it('cleans up the observer on unmount', () => {
    const { unmount } = render(<TestComponent />);
    const observer = MockIntersectionObserver.mock.instances[0];

    unmount();

    expect(observer.unobserve).toHaveBeenCalled();
  });

  it('returns a ref that is attached to the DOM element', () => {
    let capturedRef;
    function RefCapture() {
      const { ref, isVisible } = useScrollAnimation();
      capturedRef = ref;
      return <div ref={ref} data-testid="el">{String(isVisible)}</div>;
    }

    render(<RefCapture />);
    expect(capturedRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
