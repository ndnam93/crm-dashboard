import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import TicketsTable from 'js/views/Tickets/TicketsTable';
import Ticket from 'js/services/ticket';
import {inquiriesStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';

const Inquiries = ({ticket, emailParam}) => {
  const [tickets, setTickets] = useState({data: []});
  const [params, setParams] = useState({
    type: ticket.type,
    sort: {},
  });

  useEffect(() => {
    if (!ticket[emailParam]) return;
    Ticket.getList({
      [emailParam]: ticket[emailParam],
      ...params
    }).then(setTickets);
  }, [params, ticket.ticket_id]);

  const updateParam = newParams => setParams({...params, ...newParams});

  const tableProps = {
    classes: makeStyles(inquiriesStyle)(),
    updateParam, params, tickets
  };
  return (
    <TicketsTable {...tableProps}/>
  );
}

Inquiries.propTypes = {
  ticket: PropTypes.object.isRequired,
}
export default Inquiries;
