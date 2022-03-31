import React, {useContext, useState} from 'react';
import axios from 'axios';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import GridItem from 'js/components/Grid/GridItem';
import TicketForm from './TicketForm';
import {newTicketStyle} from 'assets/jss/material-dashboard-react/views/newTicketStyle';
import {history} from 'js/common';
import {AuthContext} from 'js/HOCs/auth';
import Ticket from 'js/services/ticket';
import TicketMessage from 'js/services/ticket_message';


const NewTicket = ({classes}) => {
  const {auth: {userInfo}} = useContext(AuthContext);
  const defaultType = userInfo && userInfo.team
    ? _.invert(Ticket.TYPE_TO_TEAM)[userInfo.team]
    : Ticket.TYPE.PAYMENT;
  const [params, setParams] = useState({
    author_type: 'admin',
    type: defaultType,
    source: 'website',
    message: '',
  });
  let formEl;

  const updateParam = (name, value) => {
    setParams({
      ...params,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const {message, ...data} = params;
      const {ticket_id} = await Ticket.create(data);
      if (message.trim().length) {
        await TicketMessage.create({ticket_id, message});
      }
      history.push(`/dashboard/ticket/${ticket_id}`);
    } catch (e) {
      alert(Object.values(e.response.data.error).join('\n'));
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={form => formEl = form} method="POST">
      <Grid container>
        <GridItem xs={12} sm={12} md={12} className={classes.gridItem}>
          <Card>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>New Ticket</h4>
            </CardHeader>
            <CardBody>
              <TicketForm
                params={params}
                updateParam={updateParam}
              />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </form>
  );
}

export default withStyles(newTicketStyle)(NewTicket);
