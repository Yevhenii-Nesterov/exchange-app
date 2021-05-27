import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {CurrencySelector} from '../../../pages/exchange/CurrencySelector';
import {currencyCode} from "../../../models/BankAccount";

describe('CurrencySelector component tests', () => {

  const makeComponent = (selected: currencyCode = 'GBP', unavailable: currencyCode = 'USD') => {
    const onSelect = jest.fn();

    const utils = render(
      <CurrencySelector onSelect={onSelect}
                        selected={selected}
                        unavailable={[unavailable]}
                        codes={['USD', 'GBP', 'EUR']}/>
    );

    const usdElement = utils.getByText('USD');
    const eurElement = utils.getByText('EUR');
    const gbpElement = utils.getByText('GBP');

    return {
      utils,
      usdElement,
      eurElement,
      gbpElement,
      onSelect
    };
  };

  it('Should render', async () => {

    const {eurElement, gbpElement, usdElement} = makeComponent();

    expect(eurElement).toBeInTheDocument();
    expect(gbpElement).toBeInTheDocument();
    expect(usdElement).toBeInTheDocument();
  });

  it('Should activate selected element', async () => {

    const {eurElement, gbpElement, usdElement} = makeComponent("EUR");

    expect(eurElement).toHaveClass('selected');
    expect(gbpElement).not.toHaveClass('selected');
    expect(usdElement).not.toHaveClass('selected');
  });


  it('Should inactivate unavailable element', async () => {

    const {eurElement, gbpElement, usdElement} = makeComponent("EUR", "GBP");

    expect(eurElement).not.toHaveClass('inactive');
    expect(gbpElement).toHaveClass('inactive');
    expect(usdElement).not.toHaveClass('inactive');
  });

  it('Should trigger selection on available element', async () => {

    const {usdElement, onSelect} = makeComponent("EUR", "GBP");


    fireEvent.click(usdElement);

    expect(onSelect).toBeCalledWith('USD');
  });

  it('Should not trigger selection on unavailable elements', async () => {

    const {gbpElement, onSelect} = makeComponent("EUR", "GBP");

    fireEvent.click(gbpElement);

    expect(onSelect).not.toBeCalled();
  });

});


