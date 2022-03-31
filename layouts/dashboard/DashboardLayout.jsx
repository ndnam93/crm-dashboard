import React, {useEffect, useState} from 'react';
import {Switch} from 'react-router-dom';
import renderRoutes from 'js/routes/renderRoutes';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/es/withWidth/withWidth';

import dashboardStyle from 'assets/jss/material-dashboard-react/layouts/dashboardStyle';

import image from 'assets/img/sidebar-2.jpg';
import logo from 'assets/img/pw-glyph-logo-gold.png';

import Footer from 'js/layouts/dashboard/Footer/Footer';
import Sidebar from 'js/layouts/dashboard/Sidebar/Sidebar';
import {ServiceSelectProvider} from 'js/HOCs/service_select';
import {dashboardRoutes} from 'js/routes/dashboard';


const DashboardLayout = props => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(['md', 'lg', 'xl'].indexOf(props.width) > -1);
  }, [props.width]);


  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const {classes, ...rest} = props;
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={dashboardRoutes}
        logoText={"CRM Service"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={sidebarOpen}
        color="gray"
        {...rest}
      />
      <div className={classNames(classes.mainPanel, {
        [classes.mainPanelShift]: !sidebarOpen
      })}>
        <div className={classes.content}>
          <ServiceSelectProvider>
            <Switch>
              {renderRoutes(dashboardRoutes)}
            </Switch>
          </ServiceSelectProvider>
        </div>
        <Footer/>
      </div>
    </div>
  );
}

export default withWidth({
  resizeInterval: 0,
})(withStyles(dashboardStyle)(DashboardLayout));
