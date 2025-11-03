import React from 'react';
import { render } from '@testing-library/react-native';
import { ErrorBoundary } from '../../utils/error-boundary';
import { Text } from 'react-native';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test Content</Text>
      </ErrorBoundary>,
    );

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render error message when error is thrown', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });
});

