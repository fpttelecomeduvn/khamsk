import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header Component', () => {
  it('should render the header component', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should contain header structure', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const header = screen.getByRole('heading');
    expect(header).toBeInTheDocument();
  });
});
