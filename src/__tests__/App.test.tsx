import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { index } from '../store/store';
import Rates from '../pages/App';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={index}>
      <Rates />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
