import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageDropDown from './LanguageDropDown.tsx';
import {Lang} from '../../features/language/Lang.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const renderDropDown = (route = '/matches') => {
  const view = renderWithProviders(<LanguageDropDown />, {
    route,
    preloadedState: { lang: { lang: Lang.BRITISH } },
  });
  return { ...view, user: userEvent.setup() };
};

const toggle = () => screen.getByRole('button', { name: /Language/ });
// The <Flag> svg contributes e.g. "US Flag" to each button's accessible name,
// so match the label as a substring rather than the whole name.
const option = (label: string) => screen.getByRole('button', { name: new RegExp(label) });
const queryOption = (label: string) =>
  screen.queryByRole('button', { name: new RegExp(label) });

describe('LanguageDropDown', () => {
  it('starts closed', () => {
    renderDropDown();

    expect(queryOption('American')).not.toBeInTheDocument();
  });

  it('opens on click and offers every language', async () => {
    const { user } = renderDropDown();

    await user.click(toggle());

    expect(option('American')).toBeInTheDocument();
    expect(option('British')).toBeInTheDocument();
    expect(option('Hebrew')).toBeInTheDocument();
    expect(option('Chinese')).toBeInTheDocument();
  });

  it('toggles closed on a second click', async () => {
    const { user } = renderDropDown();

    await user.click(toggle());
    await user.click(toggle());

    expect(queryOption('American')).not.toBeInTheDocument();
  });

  it('selects a language and closes', async () => {
    const { user, store } = renderDropDown();

    await user.click(toggle());
    await user.click(option('American'));

    expect(store.getState().lang.lang).toBe(Lang.AMERICAN);
    expect(queryOption('American')).not.toBeInTheDocument();
  });

  it('closes when a click lands outside it', async () => {
    const { user } = renderDropDown();
    await user.click(toggle());

    await user.click(document.body);

    expect(queryOption('American')).not.toBeInTheDocument();
  });

  // Cheat cards have no Hebrew content, so the option is hidden on that route.
  describe('on the cheat-cards route', () => {
    it('hides Hebrew', async () => {
      const { user } = renderDropDown('/cheat-cards');

      await user.click(toggle());

      expect(queryOption('Hebrew')).not.toBeInTheDocument();
      expect(option('American')).toBeInTheDocument();
      expect(option('British')).toBeInTheDocument();
    });

    it('still hides Hebrew on a nested cheat-card url', async () => {
      const { user } = renderDropDown('/cheat-cards/c1');

      await user.click(toggle());

      expect(queryOption('Hebrew')).not.toBeInTheDocument();
    });
  });

  describe('the Chinese option', () => {
    it('explains that Chinese is unsupported instead of switching', async () => {
      const { user, store } = renderDropDown();

      await user.click(toggle());
      await user.click(option('Chinese'));

      expect(screen.getByText('Not English!')).toBeInTheDocument();
      expect(screen.getByText(/not supported at this time/)).toBeInTheDocument();
      expect(store.getState().lang.lang).toBe(Lang.BRITISH);
    });

    it('closes the dropdown while showing the notice', async () => {
      const { user } = renderDropDown();

      await user.click(toggle());
      await user.click(option('Chinese'));

      expect(queryOption('American')).not.toBeInTheDocument();
    });

    it('dismisses the notice on "Sorry"', async () => {
      const { user } = renderDropDown();
      await user.click(toggle());
      await user.click(option('Chinese'));

      await user.click(screen.getByRole('button', { name: 'Sorry' }));

      expect(screen.queryByText('Not English!')).not.toBeInTheDocument();
    });
  });
});
