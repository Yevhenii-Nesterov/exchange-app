import React from 'react';
import ReactDOM from 'react-dom';
import store, {history} from './store/';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import {Route, Switch, Redirect} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import './index.scss';

import RatesPage from './pages/Rates'
import ExchangePage from './pages/Rates'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/rates" component={RatesPage}/>
          <Route path="/exchange" component={ExchangePage}/>

          <Redirect to="/rates"/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
