import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('index.tsx - Application Rendering', () => {
  it('renders the App component correctly with StrictMode and BrowserRouter', () => {
    const rootDiv = document.createElement('div');
    rootDiv.setAttribute('id', 'root');
    document.body.appendChild(rootDiv);
    render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
    expect(rootDiv).toBeInTheDocument();
    expect(document.querySelector('div#root')).toBeInTheDocument();
  });
});
