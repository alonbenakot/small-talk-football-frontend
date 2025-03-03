import { screen } from '@testing-library/react';

test('jest-dom matchers work', () => {
  document.body.innerHTML = '<div data-testid="element"></div>';
  const element = screen.getByTestId('element');

  expect(element).toBeInTheDocument();
});
