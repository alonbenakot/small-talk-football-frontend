import {describe, expect, it} from 'vitest';
import {screen} from '@testing-library/react';
import Footer from './Footer.tsx';
import {renderWithProviders} from '../../../test/utils.tsx';

describe('Footer', () => {
  it('links to About next to the copyright', () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText(/Alon Benakot/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});
