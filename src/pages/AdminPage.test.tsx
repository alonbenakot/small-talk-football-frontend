import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminPage from './AdminPage.tsx';
import {
  deleteFixtures,
  deleteTeams,
  fetchFixtures,
  initArticles,
  initCheatCards,
  initTeams,
  refreshStandings,
} from '../utils/api/http.ts';
import {renderWithProviders} from '../test/utils.tsx';

vi.mock('../utils/api/http.ts', () => ({
  initArticles: vi.fn(),
  initCheatCards: vi.fn(),
  initTeams: vi.fn(),
  fetchFixtures: vi.fn(),
  deleteTeams: vi.fn(),
  deleteFixtures: vi.fn(),
  refreshStandings: vi.fn(),
}));

const renderPage = () => {
  const view = renderWithProviders(<AdminPage />, { route: '/admin' });
  return { ...view, user: userEvent.setup() };
};

const action = (name: string) => screen.getByRole('button', { name });
const confirm = () => screen.getByRole('button', { name: 'Yes' });

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const fn of [initArticles, initCheatCards, initTeams, fetchFixtures, deleteTeams, deleteFixtures, refreshStandings]) {
      vi.mocked(fn).mockResolvedValue({ data: null, statusCode: 200 });
    }
  });

  it('offers every admin action', () => {
    renderPage();

    for (const label of [
      'Initialize Articles', 'Initialize Cheat Cards', 'Initialize Teams',
      'Delete Teams', 'Refresh Standings', 'Fetch Fixtures', 'Delete Fixtures',
    ]) {
      expect(action(label)).toBeInTheDocument();
    }
  });

  describe('confirmation gate', () => {
    it('does not call the api on the first click', async () => {
      const { user } = renderPage();

      await user.click(action('Delete Fixtures'));

      expect(deleteFixtures).not.toHaveBeenCalled();
    });

    it('explains what the action will do', async () => {
      const { user } = renderPage();

      await user.click(action('Delete Teams'));

      expect(screen.getByText(/delete all teams\? This action cannot be undone/)).toBeInTheDocument();
    });

    it('runs the action only after confirmation', async () => {
      const { user } = renderPage();

      await user.click(action('Delete Fixtures'));
      await user.click(confirm());

      await waitFor(() => expect(deleteFixtures).toHaveBeenCalledTimes(1));
    });

    it('abandons the action on "No"', async () => {
      const { user } = renderPage();

      await user.click(action('Delete Teams'));
      await user.click(screen.getByRole('button', { name: 'No' }));

      expect(deleteTeams).not.toHaveBeenCalled();
      expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
    });

    it('closes the dialog once the action completes', async () => {
      const { user } = renderPage();

      await user.click(action('Refresh Standings'));
      await user.click(confirm());

      await waitFor(() => expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument());
    });
  });

  // Each button must be wired to its own endpoint — an easy thing to get wrong
  // in a list of seven near-identical entries.
  describe('each button calls its own endpoint', () => {
    it.each([
      ['Initialize Articles', initArticles],
      ['Initialize Cheat Cards', initCheatCards],
      ['Initialize Teams', initTeams],
      ['Delete Teams', deleteTeams],
      ['Refresh Standings', refreshStandings],
      ['Fetch Fixtures', fetchFixtures],
      ['Delete Fixtures', deleteFixtures],
    ])('%s', async (label, apiFn) => {
      const { user } = renderPage();

      await user.click(action(label));
      await user.click(confirm());

      await waitFor(() => expect(apiFn).toHaveBeenCalledTimes(1));
      const others = [initArticles, initCheatCards, initTeams, deleteTeams, refreshStandings, fetchFixtures, deleteFixtures]
        .filter((fn) => fn !== apiFn);
      for (const fn of others) {
        expect(fn).not.toHaveBeenCalled();
      }
    });
  });
});
