import {describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheatCardDisplay from './CheatCardDisplay.tsx';
import CheatCardModel from '../models/CheatCardModel.ts';
import {Lang} from '../../language/Lang.ts';
import {makeTestStore, renderWithProviders} from '../../../../test/utils.tsx';

const card = (id: string, langs: Lang[] = [Lang.AMERICAN, Lang.BRITISH]): CheatCardModel => ({
  id,
  title: `Title ${id}`,
  subtitle: `Subtitle ${id}`,
  infoTexts: langs.map((lang) => ({ text: `${lang} body ${id}`, lang })),
  infoCategory: 'RULES',
});

const cards = [card('a'), card('b'), card('c')];

const renderDisplay = (opts: { index?: number; lang?: Lang; cards?: CheatCardModel[] } = {}) => {
  const list = opts.cards ?? cards;
  const index = opts.index ?? 0;
  const onNext = vi.fn();
  const onPrev = vi.fn();
  const onCardSelect = vi.fn();
  const store = makeTestStore({ lang: { lang: opts.lang ?? Lang.AMERICAN } });
  renderWithProviders(
    <CheatCardDisplay
      currentCard={list[index]}
      selectedCategory="RULES"
      selectedCardIndex={index}
      filteredCards={list}
      onNext={onNext}
      onPrev={onPrev}
      onCardSelect={onCardSelect}
    />,
    { store },
  );
  return { onNext, onPrev, onCardSelect, user: userEvent.setup() };
};

const prev = () => screen.getByRole('button', { name: /Previous/ });
const next = () => screen.getByRole('button', { name: /Next/ });

describe('CheatCardDisplay', () => {
  describe('content', () => {
    it('shows the current card title and subtitle', () => {
      renderDisplay();

      expect(screen.getByText('Title a')).toBeInTheDocument();
      expect(screen.getByText('Subtitle a')).toBeInTheDocument();
    });

    it('shows the body text for the selected language', () => {
      renderDisplay({ lang: Lang.BRITISH });

      expect(screen.getByText('BRITISH body a')).toBeInTheDocument();
      expect(screen.queryByText('AMERICAN body a')).not.toBeInTheDocument();
    });

    // Cheat cards have no Hebrew translations; the card body simply comes out blank.
    it('renders no body when the card has no text in the selected language', () => {
      renderDisplay({ lang: Lang.HEBREW });

      expect(screen.queryByText(/body a/)).not.toBeInTheDocument();
      expect(screen.getByText('Title a')).toBeInTheDocument();
    });
  });

  describe('navigation controls', () => {
    it('disables Previous on the first card', () => {
      renderDisplay({ index: 0 });

      expect(prev()).toBeDisabled();
      expect(next()).toBeEnabled();
    });

    it('disables Next on the last card', () => {
      renderDisplay({ index: 2 });

      expect(next()).toBeDisabled();
      expect(prev()).toBeEnabled();
    });

    it('enables both in the middle', () => {
      renderDisplay({ index: 1 });

      expect(prev()).toBeEnabled();
      expect(next()).toBeEnabled();
    });

    it('disables both for a single card', () => {
      renderDisplay({ cards: [card('solo')], index: 0 });

      expect(prev()).toBeDisabled();
      expect(next()).toBeDisabled();
    });

    it('calls onNext', async () => {
      const { user, onNext } = renderDisplay({ index: 0 });

      await user.click(next());

      expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onPrev', async () => {
      const { user, onPrev } = renderDisplay({ index: 1 });

      await user.click(prev());

      expect(onPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('the dot indicators', () => {
    it('renders one per card in the category', () => {
      renderDisplay();

      // Two labelled nav buttons plus one unlabelled dot per card.
      const dots = screen.getAllByRole('button').filter((b) => b.textContent === '');
      expect(dots).toHaveLength(3);
    });

    it('jumps to the card whose dot is clicked', async () => {
      const { user, onCardSelect } = renderDisplay();
      const dots = screen.getAllByRole('button').filter((b) => b.textContent === '');

      await user.click(dots[2]);

      expect(onCardSelect).toHaveBeenCalledWith(2);
    });

    it('highlights the dot for the current card', () => {
      renderDisplay({ index: 1 });
      const dots = screen.getAllByRole('button').filter((b) => b.textContent === '');

      expect(dots[1]).toHaveClass('bg-emerald-600');
      expect(dots[0]).toHaveClass('bg-slate-300');
    });
  });
});
