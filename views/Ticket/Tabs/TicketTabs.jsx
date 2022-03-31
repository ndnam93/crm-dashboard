import React, {useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Inquiries from './Inquiries';
import TicketLogs from './TicketLogs';
import Transactions from './Transactions';
import {tabStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';

const TabContent = props => (
  <div style={{display: props.hidden ? 'none' : 'block'}}>
    {props.children}
  </div>
);

const TicketTabs = ({classes, ticket}) => {
  const [tabValue, setTabValue] = useState('user_inquiries');

  useEffect(() => {
    setTabValue(ticket.user_email ? 'user_inquiries' : 'merchant_inquiries');
  }, [ticket]);

  return (
    <Paper className={classes.paper}>
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={(event, value) => setTabValue(value)}>
          {ticket.user_email && <Tab label="User Inquiries" value="user_inquiries"/>}
          {ticket.merchant_email && <Tab label="Merchant Inquiries" value="merchant_inquiries"/>}
          <Tab label="Transactions" value="transactions"/>
          <Tab label="Logs" value="logs"/>
        </Tabs>
      </AppBar>
      <div className={classes.tabContainer}>
        <TabContent hidden={tabValue != 'user_inquiries'}><Inquiries ticket={ticket} emailParam="user_email" /></TabContent>
        <TabContent hidden={tabValue != 'merchant_inquiries'}><Inquiries ticket={ticket} emailParam="merchant_email" /></TabContent>
        <TabContent hidden={tabValue != 'transactions'}><Transactions ticket={ticket} /></TabContent>
        <TabContent hidden={tabValue != 'logs'}><TicketLogs ticket={ticket} /></TabContent>
      </div>
    </Paper>
  );
}

export default withStyles(tabStyle)(TicketTabs);
