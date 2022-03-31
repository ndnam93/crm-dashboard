import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ConversationIcon from '@material-ui/icons/OpenInNew';
import HelpIcon from '@material-ui/icons/HelpOutlineSharp';
import ToolTip from '@material-ui/core/Tooltip';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import {problemStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import Ticket from 'js/services/ticket';
import {toLocalTime} from 'js/common';
import ConversationDialog from './ConversationDialog';


const ProblemDetails = ({ticket, classes}) => {
  const [openConversationDialog, setOpenConversationDialog] = useState(false);
  const [dialogTicket, setDialogTicket] = useState({});
  const {transferred_from_ticket: fromTicket, transferred_to_tickets: toTickets} = ticket;

  const handleOpenDialog = targetTicket => () => {
    setDialogTicket(targetTicket);
    setOpenConversationDialog(true);
  };

  return (
    <Card className={classes.card}>
      <CardHeader title="Problem details"/>
      <CardBody className={classes.cardBody}>
        <p><b>Subject</b> {ticket.subject}</p>
        <p><b>User Email</b> {ticket.user_email}</p>
        <p><b>Merchant Email</b> {ticket.merchant_email}</p>
        <p><b>Source</b> {ticket.source_text}</p>
        <p><b>Transaction ID</b> {ticket.transaction_id}</p>
        <p><b>Transaction Date</b> {toLocalTime(ticket.transaction_date, 'DD-MM-YYYY')}</p>
        <p><b>User ID</b> {ticket.user_id}</p>
        <p><b>Merchant ID</b> {ticket.merchant_id}</p>
        <p><b>Category</b> {ticket.category_name}</p>
        <p><b>Assignee</b> {ticket.assignee_name}</p>
        <p><b>Description</b> {ticket.description}</p>
        {fromTicket && (
          <p>
            <b>Transferred from </b>
            <span className={classes.transferItem}>
              {Ticket.QUEUE_NAMES[fromTicket.type]} #{fromTicket.ticket_id} | {Ticket.STATUS_TEXT[fromTicket.status]}&nbsp;
              <ToolTip title="View conversation" placement="top">
                <ConversationIcon onClick={handleOpenDialog(fromTicket)} fontSize="small" className={classes.inlineIcon}/>
              </ToolTip>
            </span>
          </p>
        )}
        {!_.isEmpty(toTickets) && (
          <p>
            <b>Transferred to </b>
            <span className={classes.transferItem}>
              {toTickets.map(toTicket => `${Ticket.QUEUE_NAMES[toTicket.type]} #${toTicket.ticket_id} | ${Ticket.STATUS_TEXT[toTicket.status]}`).join(', ')}
            </span>
          </p>
        )}
        <ConversationDialog ticket={dialogTicket} open={openConversationDialog} onClose={() => setOpenConversationDialog(false)}/>
      </CardBody>
    </Card>
  );
}

ProblemDetails.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default withStyles(problemStyle)(ProblemDetails);
