import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchesPage from './MatchesPage.tsx';
import MatchModel from '../components/features/matches/models/MatchModel.ts';
import FixturesResponse from '../components/features/matches/models/FixturesResponse.ts';
import {MatchesLoaderOutput} from '../routes/loaders/MatchesLoader.ts';
import {renderWithProviders} from '../test/utils.tsx';

const loaderData = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useLoaderData: () => loaderData(),
}));

const makeMatch = (id: string, competition: string, matchDateTime: unknown): MatchModel =>
  ({
    id, competition, matchDateTime,
    venue: '', score: { winner: '', draw: '', home: 0, away: 0 },
    homeTeam: { id: `h${id}`, name: `Home ${id}`, coach: '', crest: '' },
    awayTeam: { id: `a${id}`, name: `Away ${id}`, coach: '', crest: '' },
    goals: [], durationInMinutes: 90, finished: false, oneLiners: [],
  }) as unknown as MatchModel;

const renderPage = (data: Partial<FixturesResponse>) => {
  loaderData.mockReturnValue({
    data: { competitions: [], fixtures: [], ...data },
  } as MatchesLoaderOutput);
  return renderWithProviders(<MatchesPage />);
};

const dateLabel = () => screen.getByLabelText('Previous date').parentElement!.querySelector('span')!.textContent;

describe('MatchesPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2025, 2, 14, 12, 0));
    loaderData.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('selects the first competition by default', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE', 'LA_LIGA'],
      fixtures: [makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18))],
    });

    expect(screen.getByText('Home 1')).toBeInTheDocument();
  });

  it('shows today when today has fixtures', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      fixtures: [makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18))],
    });

    expect(dateLabel()).toBe('Today');
  });

  it('snaps to the nearest available date when today has no fixtures', () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      fixtures: [
        makeMatch('past', 'PREMIER_LEAGUE', new Date(2025, 2, 10, 18)),
        makeMatch('future', 'PREMIER_LEAGUE', new Date(2025, 2, 16, 18)),
      ],
    });

    expect(dateLabel()).toBe('16/03/25');
    expect(screen.getByText('Home future')).toBeInTheDocument();
  });

  it('collapses several fixtures on one day into a single navigable date', async () => {
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      fixtures: [
        makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 15)),
        makeMatch('2', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18)),
      ],
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByLabelText('Previous date')).toBeDisabled();
    expect(screen.getByLabelText('Next date')).toBeDisabled();
  });

  it('navigates between days', async () => {
    const user = userEvent.setup();
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      fixtures: [
        makeMatch('yesterday', 'PREMIER_LEAGUE', new Date(2025, 2, 13, 18)),
        makeMatch('today', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18)),
      ],
    });
    expect(screen.getByText('Home today')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Previous date'));

    expect(dateLabel()).toBe('Yesterday');
    expect(screen.getByText('Home yesterday')).toBeInTheDocument();
    expect(screen.queryByText('Home today')).not.toBeInTheDocument();
  });

  it('re-derives the available dates when the competition changes', async () => {
    const user = userEvent.setup();
    renderPage({
      competitions: ['PREMIER_LEAGUE', 'LA_LIGA'],
      fixtures: [
        makeMatch('pl', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18)),
        makeMatch('ll', 'LA_LIGA', new Date(2025, 2, 20, 18)),
      ],
    });
    expect(screen.getByText('Home pl')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'La Liga' }));

    expect(dateLabel()).toBe('20/03/25');
    expect(screen.getByText('Home ll')).toBeInTheDocument();
  });

  it('skips fixtures with an unparseable date instead of failing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderPage({
      competitions: ['PREMIER_LEAGUE'],
      fixtures: [
        makeMatch('bad', 'PREMIER_LEAGUE', 'not-a-date'),
        makeMatch('good', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18)),
      ],
    });

    expect(screen.getByText('Home good')).toBeInTheDocument();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('shows "No Matches" when the competition has no fixtures', () => {
    renderPage({ competitions: ['PREMIER_LEAGUE'], fixtures: [] });

    expect(screen.getByText('No Matches')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // Regression guard for bugs.md #2. Change this expectation when the bug is fixed.
  it('currently crashes when competitions is empty but fixtures are not', () => {
    expect(() =>
      renderPage({
        competitions: [],
        fixtures: [makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18))],
      }),
    ).toThrow(/toLowerCase/);
  });

  // Regression guard for bugs.md #2.
  it('currently crashes on a fixture whose competition is null', () => {
    expect(() =>
      renderPage({
        competitions: ['PREMIER_LEAGUE'],
        fixtures: [makeMatch('1', null as unknown as string, new Date(2025, 2, 14, 18))],
      }),
    ).toThrow(/toLowerCase/);
  });
});
