import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import MatchCard from './MatchCard.tsx';
import MatchModel from './models/MatchModel.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const match = {
  id: '42',
  competition: 'PREMIER_LEAGUE',
  matchDateTime: new Date(2025, 2, 14, 18, 30),
  venue: 'Anfield',
  score: { winner: '', draw: '', home: 2, away: 1 },
  homeTeam: { id: '64', name: 'Liverpool', coach: '', crest: 'liverpool.jpg' },
  awayTeam: { id: '57', name: 'Arsenal', coach: '', crest: 'arsenal.jpg' },
  goals: [],
  durationInMinutes: 90,
  finished: true,
  oneLiners: [],
} as MatchModel;

describe('MatchCard', () => {
  it('shows both teams, the date and the score of a finished match', () => {
    renderWithProviders(<MatchCard match={match} />);

    expect(screen.getByText('Liverpool')).toBeInTheDocument();
    expect(screen.getByText('Arsenal')).toBeInTheDocument();
    expect(screen.getByText('14/03/25')).toBeInTheDocument();
    expect(screen.getByText('2 - 1')).toBeInTheDocument();
  });

  it('hides the score of an unfinished match', () => {
    renderWithProviders(<MatchCard match={{ ...match, finished: false }} />);

    expect(screen.queryByText('2 - 1')).not.toBeInTheDocument();
  });

  it('renders no links by default so it can sit inside the list Link', () => {
    renderWithProviders(<MatchCard match={match} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('links each team to its team page when linkTeams is set', () => {
    renderWithProviders(<MatchCard match={match} linkTeams />);

    expect(screen.getByRole('link', { name: /Liverpool/ })).toHaveAttribute('href', '/teams/64');
    expect(screen.getByRole('link', { name: /Arsenal/ })).toHaveAttribute('href', '/teams/57');
  });
});
