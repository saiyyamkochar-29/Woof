import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import SearchPage from '../pages/SearchPage';
import { waitFor } from "@testing-library/react";

// Mock the useNavigate hook from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders SearchPage component', () => {
  render(<SearchPage />);
  const linkElement = screen.getByText(/search for a new friend/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders pagination buttons', () => {
render(<SearchPage />);
const previousButton = screen.getByText('< Previous');
const nextButton = screen.getByText('Next >');
expect(previousButton).toBeInTheDocument();
expect(nextButton).toBeInTheDocument();
});

test('renders logout button', () => {
render(<SearchPage />);
const logoutButton = screen.getByRole('button', { name: /Logout/i });
expect(logoutButton).toBeInTheDocument();
});

test('renders search options', () => {
render(<SearchPage />);
const breedFilter = screen.getByLabelText(/Filter by Breed/i);
const sortOrder = screen.getByLabelText(/Sort Order/i);
expect(breedFilter).toBeInTheDocument();
expect(sortOrder).toBeInTheDocument();
});

test('renders search result list', () => {
render(<SearchPage />);
const dogList = screen.getByRole('list');
expect(dogList).toBeInTheDocument();
});
  
