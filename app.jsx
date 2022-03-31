import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Switch} from 'react-router-dom';
import axios from 'axios';
import {JssProvider} from 'react-jss';
import {loadProgressBar} from 'axios-progress-bar';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {history} from 'js/common';
import 'axios-progress-bar/dist/nprogress.css';
import 'assets/css/material-dashboard-react.css';
import indexRoutes from 'js/routes/index';
import {AuthProvider} from 'js/HOCs/auth';
import PrivateRoute from 'js/components/Route/PrivateRoute';

axios.defaults.baseURL = window.API_ROOT;
_.templateSettings.interpolate = /{\$([\s\S]+?)}/g;
loadProgressBar();
dayjs.extend(utc);


ReactDOM.render(
  <JssProvider classNamePrefix="App-">
    <AuthProvider>
      <Router history={history}>
        <Switch>
          {indexRoutes.map((route, key) => {
            const RouteComponent = route.requireAuth ? PrivateRoute : Route;
            return <RouteComponent path={route.path} component={route.component} key={key}/>;
          })}
        </Switch>
      </Router>
    </AuthProvider>
  </JssProvider>,
  document.getElementById("root")
);
