import {beforeEach, describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OneLinerGenerator from './OneLinerGenerator.tsx';
import {OneLinerOption} from './models/OneLinerOption.ts';
import {renderWithProviders} from '../../../test/utils.tsx';

const navigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));

type Side = 'HOME' | 'AWAY';
type Payload = { text: string };

const options: OneLinerOption<Side>[] = [
  { value: 'HOME', label: 'Liverpool', icon: <span/> },
  { value: 'AWAY', label: 'Arsenal', icon: <span/> },
];

const envelope = (text: string) => ({ data: { text }, statusCode: 200 });

const renderGenerator = (overrides: { options?: OneLinerOption<Side>[] } = {}) => {
  const fetchOneLiner = vi.fn();
  const onResult = vi.fn();
  renderWithProviders(
    <OneLinerGenerator<Payload, Side>
      title="Choose your team!"
      options={overrides.options ?? options}
      defaultValue={overrides.options ? undefined : 'HOME'}
      fetchOneLiner={fetchOneLiner}
      getText={(data) => data.text}
      onResult={onResult}
      backLabel="Back to Teams"
      backTo="/teams"
    />,
  );
  return { fetchOneLiner, onResult, user: userEvent.setup() };
};

const generate = () => screen.getByRole('button', { name: /Generate One-Liner/ });

describe('OneLinerGenerator', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the form and no result initially', () => {
    renderGenerator();

    expect(generate()).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Copy/ })).not.toBeInTheDocument();
  });

  it('shows the result beneath the form while keeping the form on screen', async () => {
    const { fetchOneLiner, user } = renderGenerator();
    fetchOneLiner.mockResolvedValue(envelope('Liverpool bossed it'));

    await user.click(generate());

    expect(await screen.findByText(/Liverpool bossed it/)).toBeInTheDocument();
    expect(fetchOneLiner).toHaveBeenCalledWith('HOME');
    expect(generate()).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Liverpool/ })).toBeInTheDocument();
  });

  it('replaces the result when generating again with another choice', async () => {
    const { fetchOneLiner, user } = renderGenerator();
    fetchOneLiner.mockResolvedValueOnce(envelope('First line'));
    fetchOneLiner.mockResolvedValueOnce(envelope('Second line'));

    await user.click(generate());
    await screen.findByText(/First line/);
    await user.click(screen.getByRole('radio', { name: /Arsenal/ }));
    await user.click(generate());

    expect(await screen.findByText(/Second line/)).toBeInTheDocument();
    expect(screen.queryByText(/First line/)).not.toBeInTheDocument();
    expect(fetchOneLiner).toHaveBeenLastCalledWith('AWAY');
  });

  it('passes the payload to onResult', async () => {
    const { fetchOneLiner, onResult, user } = renderGenerator();
    fetchOneLiner.mockResolvedValue(envelope('A line'));

    await user.click(generate());
    await screen.findByText(/A line/);

    expect(onResult).toHaveBeenCalledWith({ text: 'A line' });
  });

  it('renders only title and buttons with no options and submits undefined', async () => {
    const { fetchOneLiner, user } = renderGenerator({ options: [] });
    fetchOneLiner.mockResolvedValue(envelope('A line'));

    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    await user.click(generate());

    await screen.findByText(/A line/);
    expect(fetchOneLiner).toHaveBeenCalledWith(undefined);
  });

  it('keeps the form and shows no result when the request fails', async () => {
    const { fetchOneLiner, user } = renderGenerator();
    fetchOneLiner.mockRejectedValue(new Error('AI unavailable'));

    await user.click(generate());

    expect(await screen.findByRole('button', { name: /Generate One-Liner/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Copy/ })).not.toBeInTheDocument();
  });

  it('navigates to backTo from the back button', async () => {
    const { user } = renderGenerator();

    await user.click(screen.getByRole('button', { name: 'Back to Teams' }));

    expect(navigate).toHaveBeenCalledWith('/teams');
  });
});
