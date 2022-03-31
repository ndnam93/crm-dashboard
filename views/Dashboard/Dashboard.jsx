import React from 'react';
import PropTypes from 'prop-types';
// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';

import dashboardStyle from 'assets/jss/material-dashboard-react/views/dashboardStyle';

class Dashboard extends React.Component {

}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
