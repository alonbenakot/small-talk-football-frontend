import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import Matches from './Matches.tsx';
import MatchModel from './models/MatchModel.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const makeMatch = (
  id: string,
  competition: string,
  matchDateTime: Date,
  homeName = `Home ${id}`,
): MatchModel =>
  ({
    id,
    competition,
    matchDateTime,
    venue: 'Somewhere',
    score: { winner: '', draw: '', home: 0, away: 0 },
    homeTeam: { id: `h${id}`, name: homeName, coach: '', crest: '' },
    awayTeam: { id: `a${id}`, name: `Away ${id}`, coach: '', crest: '' },
    goals: [],
    durationInMinutes: 90,
    finished: false,
    oneLiners: [],
  }) as MatchModel;

const matchDay = new Date(2025, 2, 14);

const renderMatches = (props: {
  matches: MatchModel[];
  selectedCompetition?: string;
  selectedDate?: Date;
}) =>
  renderWithProviders(
    <Matches
      matches={props.matches}
      selectedCompetition={props.selectedCompetition ?? 'PREMIER_LEAGUE'}
      selectedDate={props.selectedDate ?? matchDay}
    />,
  );

/** Team names in DOM order, used to assert the sort. */
const renderedHomeTeams = () =>
  screen.getAllByRole('listitem').map((li) => li.querySelector('span')!.textContent);

describe('Matches', () => {
  it('renders the matches for the selected competition and date', () => {
    renderMatches({
      matches: [makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18, 0))],
    });

    expect(screen.getByText('Home 1')).toBeInTheDocument();
    expect(screen.getByText('Away 1')).toBeInTheDocument();
  });

  it('filters out other competitions', () => {
    renderMatches({
      matches: [
        makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18, 0)),
        makeMatch('2', 'LA_LIGA', new Date(2025, 2, 14, 20, 0)),
      ],
    });

    expect(screen.getByText('Home 1')).toBeInTheDocument();
    expect(screen.queryByText('Home 2')).not.toBeInTheDocument();
  });

  it('compares the competition case-insensitively', () => {
    renderMatches({
      matches: [makeMatch('1', 'premier_league', new Date(2025, 2, 14, 18, 0))],
      selectedCompetition: 'PREMIER_LEAGUE',
    });

    expect(screen.getByText('Home 1')).toBeInTheDocument();
  });

  it('filters out matches on other days', () => {
    renderMatches({
      matches: [
        makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18, 0)),
        makeMatch('2', 'PREMIER_LEAGUE', new Date(2025, 2, 15, 18, 0)),
      ],
    });

    expect(screen.getByText('Home 1')).toBeInTheDocument();
    expect(screen.queryByText('Home 2')).not.toBeInTheDocument();
  });

  it('keeps matches at any time on the selected day', () => {
    renderMatches({
      matches: [
        makeMatch('1', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 0, 5)),
        makeMatch('2', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 23, 55)),
      ],
    });

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('orders matches by kickoff time, latest first', () => {
    renderMatches({
      matches: [
        makeMatch('early', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 13, 0)),
        makeMatch('late', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 20, 0)),
        makeMatch('mid', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 17, 0)),
      ],
    });

    expect(renderedHomeTeams()).toEqual(['Home late', 'Home mid', 'Home early']);
  });

  it('accepts ISO date strings from the API and still sorts them', () => {
    renderMatches({
      matches: [
        makeMatch('early', 'PREMIER_LEAGUE', '2025-03-14T13:00:00' as unknown as Date),
        makeMatch('late', 'PREMIER_LEAGUE', '2025-03-14T20:00:00' as unknown as Date),
      ],
    });

    expect(renderedHomeTeams()).toEqual(['Home late', 'Home early']);
  });

  it('links each match to its own route', () => {
    renderMatches({
      matches: [makeMatch('42', 'PREMIER_LEAGUE', new Date(2025, 2, 14, 18, 0))],
    });

    expect(screen.getByRole('link')).toHaveAttribute('href', '/42');
  });

  it('renders nothing when no match survives the filters', () => {
    renderMatches({
      matches: [makeMatch('1', 'LA_LIGA', new Date(2025, 2, 14, 18, 0))],
    });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders an empty list rather than throwing when matches is undefined', () => {
    renderMatches({ matches: undefined as unknown as MatchModel[] });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
