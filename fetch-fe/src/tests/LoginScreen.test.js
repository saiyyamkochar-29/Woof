import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import LoginScreen from '../pages/LoginScreen';
import { waitFor } from "@testing-library/react";

// Mock the useNavigate hook from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the axios module
jest.mock('axios');

test('renders LoginScreen component', () => {
  render(<LoginScreen />);
  const headingElement = screen.getByText(/login to find a new friend!/i);
  expect(headingElement).toBeInTheDocument();
});

test('calls axios.post with form data when the Login button is clicked', () => {
  // Mock the implementation of axios.post
  axios.post.mockImplementationOnce(() => Promise.resolve({ data: {} }));

  render(<LoginScreen />);
  
  // Simulate user input
  fireEvent.change(screen.getByLabelText(/enter your name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/enter your email/i), {
    target: { value: 'john@example.com' },
  });

  // Simulate form submission
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  // Assert that axios.post was called with the correct arguments
  expect(axios.post).toHaveBeenCalledWith(
    'https://frontend-take-home-service.fetch.com/auth/login',
    { name: 'John Doe', email: 'john@example.com' },
    { withCredentials: true }
  );
});
