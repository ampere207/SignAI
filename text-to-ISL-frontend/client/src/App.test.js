import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./Pages/Convert', () => function MockConvert() {
  return <div>Text and Audio to Indian Sign Language</div>;
});

test('renders signai heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/text and audio to indian sign language/i);
  expect(headingElement).toBeInTheDocument();
});
