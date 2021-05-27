import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import {AmountInput} from '../../../pages/exchange/AmountInput';

describe('AmountInput component tests', () => {

  const makeInput = (amount: string) => {
    const onChange = jest.fn();

    const utils = render(
      <AmountInput amount={amount} onAmountChange={onChange} sign="+"/>
    );

    const inputElement = utils.getByTitle('Currency input');

    return {
      utils,
      inputElement,
      onChange
    };
  };

  it('Should render', async () => {

    const {inputElement} = makeInput('20.2');

    expect(inputElement).toBeInTheDocument();
  });


  it('Should show sign if there is a value', async () => {

    const {utils} = makeInput('20.2');

    const signElement = utils.getByText('+');

    expect(signElement).toHaveClass('hasValue');
  });

  it('Should hide sign if there is no value', async () => {

    const {utils} = makeInput(' ');

    const signElement = utils.getByText('+');

    expect(signElement).not.toHaveClass('hasValue');
  });

  it('Should call change value for valid inputs', async () => {

    const {onChange, inputElement} = makeInput('20.2');

    expect(inputElement).toHaveValue('20.2');

    fireEvent.change(inputElement, {
      target: {
        value: ''
      }
    });

    expect(onChange).toBeCalledWith('');
  });

  it('Should not call change value for invalid inputs', async () => {

    const {onChange, inputElement} = makeInput('2');

    fireEvent.change(inputElement, {
      target: {
        value: 'a'
      }
    });

    fireEvent.change(inputElement, {
      target: {
        value: '.0'
      }
    });

    fireEvent.change(inputElement, {
      target: {
        value: '.0009'
      }
    });

    expect(onChange).not.toBeCalled();
  });
});


