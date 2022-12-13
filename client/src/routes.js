import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Imported all page components here
 */
import App from './components/App';
import ExtractPquaAqbData from './components/ExtractPquaAqbData';
import ViewBugData from './components/ViewBugData';
import AddUpdateProduct from './components/AddUpdateProduct';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="/pqua-data" component={ExtractPquaAqbData} />
    <Route path="/bug-data" component={ViewBugData} />
    <Route path="/add-update-queries" component={AddUpdateProduct} />
  </Route>
);