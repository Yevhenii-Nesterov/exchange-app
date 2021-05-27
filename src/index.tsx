import React from 'react';
import ReactDOM from 'react-dom';
import store, {history} from './store/';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {Redirect, Route, Switch} from 'react-router-dom';

import './index.scss';

import ExchangePage from './pages/Exchange';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/exchange" render={(props) => <ExchangePage {...props} ratesUpdateIntervalSec={10}/>}/>
          <Redirect to="/exchange"/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
