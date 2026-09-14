import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import MobileNavbar from './MobileNavbar.tsx';
import {renderWithProviders} from '../../../test/utils.tsx';

describe('MobileNavbar', () => {
  it('offers Home, Articles, Matches, Teams and Cheat Cards in that order', () => {
    renderWithProviders(<MobileNavbar />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/home', '/articles', '/matches', '/teams', '/cheat-cards']);
  });

  it('does not link to About', () => {
    renderWithProviders(<MobileNavbar />);

    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
  });
});
