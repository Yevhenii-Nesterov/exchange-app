import {connect, ConnectedProps} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "../../store";
import {loadRates, RatesState} from '../../modules/rates'
import {BalancesState, loadBalances, makeTransfer} from '../../modules/balances'

function mapStateToProps(state: RootState): {rates: RatesState; balances: BalancesState} {
  return {
    rates: state.rates,
    balances: state.balances
  }
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({loadRates, loadBalances, makeTransfer}, dispatch)
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export type PropsFromState = ConnectedProps<typeof connector>

export default connector;
