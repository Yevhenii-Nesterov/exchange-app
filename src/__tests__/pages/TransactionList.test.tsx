import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {fireEvent, render, waitForElementToBeRemoved, wait} from '@testing-library/react';
import {Provider} from 'react-redux';
import {rootReducer, RootState} from '../../store/';
import {configureStore} from "@reduxjs/toolkit";
import mockedState from "../storeState";
import TransactionList from "../../pages/TransactionList";

describe('TransactionList page component tests', () => {

  beforeEach(() => {
  });

  const createComponent = () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: mockedState as unknown as RootState,
    });

    const utils = render(
      <Provider store={store}>
        <TransactionList/>
      </Provider>
    );

    const btn = utils.getByText("Refresh");

    return {
      utils,
      btn,
    };
  };

  it('Should load and render transactions', async () => {
    const {utils} = createComponent();

    utils.getByText("Loading...");

    await waitForElementToBeRemoved(() => utils.getByText("Loading..."), {timeout: 1000});

    const liElements = utils.container.querySelectorAll('li');
    expect(liElements.length).toBeGreaterThanOrEqual(1);

  }, 10 * 1000);

  it('Should load updated state', async () => {
    const {utils, btn} = createComponent();

    utils.getByText("Loading...");

    await waitForElementToBeRemoved(() => utils.getByText("Loading..."), {timeout: 1000});

    fireEvent.click(btn);
    await wait(() => utils.getByText("Loading..."), {timeout: 1000});
    await waitForElementToBeRemoved(() => utils.getByText("Loading..."), {timeout: 1000});
    // there is no changes in the transaction list due to static API, so we can't check for elements changes
  }, 10 * 1000);

  afterEach(() => {
  });
});


