import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateNavigator from './DateNavigator.tsx';

const dates = [
  new Date(2025, 2, 10),
  new Date(2025, 2, 12),
  new Date(2025, 2, 16),
];

const previousButton = () => screen.getByLabelText('Previous date');
const nextButton = () => screen.getByLabelText('Next date');

describe('DateNavigator', () => {
  it('labels the selected date', () => {
    render(<DateNavigator selectedDate={dates[1]} onDateChange={vi.fn()} availableDates={dates} />);
    expect(screen.getByText('12/03/25')).toBeInTheDocument();
  });

  it('moves to the previous available date', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(<DateNavigator selectedDate={dates[1]} onDateChange={onDateChange} availableDates={dates} />);

    await user.click(previousButton());

    expect(onDateChange).toHaveBeenCalledWith(dates[0]);
  });

  it('moves to the next available date', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(<DateNavigator selectedDate={dates[1]} onDateChange={onDateChange} availableDates={dates} />);

    await user.click(nextButton());

    expect(onDateChange).toHaveBeenCalledWith(dates[2]);
  });

  it('matches the selected date by calendar day, not by exact timestamp', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DateNavigator
        selectedDate={new Date(2025, 2, 12, 20, 45)}
        onDateChange={onDateChange}
        availableDates={dates}
      />,
    );

    await user.click(previousButton());

    expect(onDateChange).toHaveBeenCalledWith(dates[0]);
  });

  it('disables the previous button on the first date', () => {
    render(<DateNavigator selectedDate={dates[0]} onDateChange={vi.fn()} availableDates={dates} />);

    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeEnabled();
  });

  it('disables the next button on the last date', () => {
    render(<DateNavigator selectedDate={dates[2]} onDateChange={vi.fn()} availableDates={dates} />);

    expect(nextButton()).toBeDisabled();
    expect(previousButton()).toBeEnabled();
  });

  it('shows "No Matches" and disables both arrows when there are no dates', () => {
    render(<DateNavigator selectedDate={dates[0]} onDateChange={vi.fn()} availableDates={[]} />);

    expect(screen.getByText('No Matches')).toBeInTheDocument();
    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();
  });

  // currentIndex is -1 here; neither arrow has a defined neighbour to move to.
  it('disables both arrows when the selected date is not in the list', () => {
    render(
      <DateNavigator selectedDate={new Date(2025, 5, 1)} onDateChange={vi.fn()} availableDates={dates} />,
    );

    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();
  });

  it('does not fire onDateChange when a disabled arrow is clicked', async () => {
    const onDateChange = vi.fn();
    const user = userEvent.setup();
    render(<DateNavigator selectedDate={dates[0]} onDateChange={onDateChange} availableDates={dates} />);

    await user.click(previousButton());

    expect(onDateChange).not.toHaveBeenCalled();
  });

  it('renders a single-date list with both arrows disabled', () => {
    render(<DateNavigator selectedDate={dates[0]} onDateChange={vi.fn()} availableDates={[dates[0]]} />);

    expect(previousButton()).toBeDisabled();
    expect(nextButton()).toBeDisabled();
  });
});
