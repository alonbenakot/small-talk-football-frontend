import '@testing-library/jest-dom/vitest';
import {cleanup} from '@testing-library/react';
import {afterEach} from 'vitest';

// jsdom does not implement these; `motion` and some UI primitives probe for them.
// Deliberately plain functions rather than vi.fn(): a test calling
// vi.resetAllMocks() would otherwise strip the implementation and leave
// matchMedia returning undefined, which crashes motion on mount.
const noop = () => {};
window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

afterEach(() => {
  cleanup();
  localStorage.clear();
});
