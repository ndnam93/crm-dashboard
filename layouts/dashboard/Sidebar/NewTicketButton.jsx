import React from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';

import sidebarStyle from 'assets/jss/material-dashboard-react/components/sidebarStyle';


const NewTicketButton = ({classes}) =>
  <Link className={classes.navItemButton} to="/dashboard/ticket/create">
    <AddIcon  className={classes.navItemButtonIcon}/> Add ticket
  </Link>
;


export default withStyles(sidebarStyle)(NewTicketButton);