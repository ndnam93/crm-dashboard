import React from 'react';
import {Switch} from 'react-router-dom';
import renderRoutes from 'js/routes/renderRoutes';
import withStyles from '@material-ui/core/styles/withStyles';

import {guestRoutes} from 'js/routes/guest';
import guestStyle from 'assets/jss/material-dashboard-react/layouts/guestStyle';
import image from 'assets/img/sidebar-2.jpg';



const GuestLayout = ({classes}) =>
  <div className={classes.wrapper}>
    <div className={classes.background} style={{backgroundImage: "url(" + image + ")"}}/>
    <div className={classes.container}>
      <Switch>
        {renderRoutes(guestRoutes)}
      </Switch>
    </div>
  </div>
;

export default withStyles(guestStyle)(GuestLayout);
