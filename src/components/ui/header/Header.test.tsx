import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import Header from './Header.tsx';
import {renderWithProviders} from '../../../test/utils.tsx';

describe('Header', () => {
  it('links to every top-level page including Teams', () => {
    renderWithProviders(<Header />);

    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/', '/home', '/articles', '/cheat-cards', '/matches', '/teams', '/about']);
  });
});
