import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/es/Button/Button';

import MessageItem from '../MessageItem';
import TicketMessageService from 'js/services/ticket_message';


const ConversationDialog = ({ticket, open, onClose}) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ticket.ticket_id && TicketMessageService.getList(ticket.ticket_id, {with: 'attachments'}).then(setMessages);
  }, [ticket.ticket_id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="conversation-dialog-title"
      fullWidth
    >
      <DialogTitle id="conversation-dialog-title">Ticket #{ticket.ticket_id} - {ticket.subject}</DialogTitle>
      <DialogContent>
        {messages.map(message => (
          <MessageItem key={message.message_id} message={message} ticket={ticket}/>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

ConversationDialog.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default ConversationDialog;
