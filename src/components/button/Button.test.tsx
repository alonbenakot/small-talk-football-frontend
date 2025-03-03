import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  test('renders children correctly', () => {
    render(<Button buttonType="primary">Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('applies primary button styles', () => {
    render(<Button buttonType="primary">Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-emerald-600', 'px-2', 'py-1', 'hover:bg-emerald-700');
  });

  test('applies secondary button styles', () => {
    render(<Button buttonType="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-white', 'text-emerald-600', 'border', 'hover:bg-emerald-600', 'hover:text-white');
  });

  test('applies cta button styles', () => {
    render(<Button buttonType="cta">CTA</Button>);
    const button = screen.getByText('CTA');
    expect(button).toHaveClass('bg-emerald-500', 'px-4', 'py-2', 'hover:bg-slate-300', 'hover:text-emerald-600');
  });

  test('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button buttonType="primary" onClick={handleClick}>Click</Button>);
    const button = screen.getByText('Click');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
