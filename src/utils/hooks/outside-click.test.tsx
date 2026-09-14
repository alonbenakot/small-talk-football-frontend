import {describe, expect, it, vi} from 'vitest';
import {act, render, renderHook, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useOutsideClick from './outside-click.tsx';

/** Mirrors how the hook is used in the app: ref on a panel, a sibling outside it. */
const Panel = () => {
  const { isOpen, setIsOpen, elementRef } = useOutsideClick<HTMLDivElement>();
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>open</button>
      <div ref={elementRef} data-testid="panel">
        {isOpen ? 'open' : 'closed'}
        <button>inside</button>
      </div>
      <button>outside</button>
    </div>
  );
};

describe('useOutsideClick', () => {
  it('starts closed', () => {
    const { result } = renderHook(() => useOutsideClick<HTMLDivElement>());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.elementRef.current).toBeNull();
  });

  it('lets callers open it', () => {
    const { result } = renderHook(() => useOutsideClick<HTMLDivElement>());
    act(() => { result.current.setIsOpen(true); });
    expect(result.current.isOpen).toBe(true);
  });

  it('closes when a mousedown lands outside the referenced element', async () => {
    const user = userEvent.setup();
    render(<Panel />);

    await user.click(screen.getByText('open'));
    expect(screen.getByTestId('panel')).toHaveTextContent('open');

    await user.click(screen.getByText('outside'));
    expect(screen.getByTestId('panel')).toHaveTextContent('closed');
  });

  it('stays open when the mousedown lands inside the referenced element', async () => {
    const user = userEvent.setup();
    render(<Panel />);

    await user.click(screen.getByText('open'));
    await user.click(screen.getByText('inside'));

    expect(screen.getByTestId('panel')).toHaveTextContent('open');
  });

  it('removes the document listener on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useOutsideClick<HTMLDivElement>());
    const registered = addSpy.mock.calls.find(([type]) => type === 'mousedown');
    expect(registered).toBeDefined();

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousedown', registered![1]);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
