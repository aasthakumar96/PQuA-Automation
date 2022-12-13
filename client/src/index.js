import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider, defaultTheme } from '@adobe/react-spectrum';
import { Provider as ReduxProvider }  from 'react-redux'
import store from './store';

ReactDOM.render(
  <React.StrictMode>
      <Provider theme={defaultTheme} colorScheme="light">
        <ReduxProvider store={store}>
          <App/>
        </ReduxProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//theme={defaultTheme} colorScheme="light"