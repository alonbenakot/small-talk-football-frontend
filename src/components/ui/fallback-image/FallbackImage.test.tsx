import {describe, expect, it} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import FallbackImage from './FallbackImage.tsx';

describe('FallbackImage', () => {
  it('renders the image when a source is given', () => {
    render(<FallbackImage src="crest.png" alt="Arsenal crest" fallback="crest" />);

    expect(screen.getByRole('img', { name: 'Arsenal crest' })).toHaveAttribute('src', 'crest.png');
  });

  it('renders the placeholder when the source is empty', () => {
    render(<FallbackImage src="" alt="Arsenal crest" fallback="crest" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Arsenal crest')).toBeInTheDocument();
  });

  it('swaps to the placeholder when the image fails to load', () => {
    render(<FallbackImage src="broken.png" alt="Haaland" fallback="player" />);

    fireEvent.error(screen.getByRole('img'));

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Haaland')).toBeInTheDocument();
  });
});
