import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import {renderTemplate} from 'js/common';
import {withAuth} from 'js/HOCs/auth';
import Ticket from 'js/services/ticket';
import TicketMessageService from 'js/services/ticket_message';
import MessageBoxMenu from './MessageBoxMenu';
import MessageItem from '../MessageItem';
import TicketMessageForm from './TicketMessageForm';
import ConversationSelector from './ConversationSelector';
import {messageStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import _ from 'lodash';


const MessageBox = ({ticket, attachments}) => {
  const [messages, setMessages] = useState([]);
  const [conversationType, setConversationType] = useState();
  const [messageFormDisabled, setMessageFormDisabled] = useState(false);

  useEffect(() => {
    setMessages([]);
    fetchMessages();
  }, [ticket.ticket_id, conversationType]);
  useEffect(() => {
    setMessageFormDisabled(ticket.type == Ticket.TYPE.RESOLUTION
      || conversationType == Ticket.CONVERSATION_TYPE.MERCHANT_USER);
  }, [ticket.type, conversationType]);
  useEffect(() => {
    if (ticket.conversation_types && !_.includes(ticket.conversation_types, conversationType)) {
      setConversationType(ticket.conversation_types[0]);
    }
  }, [ticket.ticket_id]);

  const formatMessage = message => {
    message.attachments = attachments
      .filter(attachment => attachment.message_id == message.message_id)
      .map(({ticket_attachment_id, ...attachment}) => ({
        ...attachment,
        attachment_id: ticket_attachment_id,
      }));
    return message;
  };

  const fetchMessages = () => {
    if (!ticket.ticket_id || !conversationType) return;

    TicketMessageService.getList(ticket.ticket_id, {conversation_type: conversationType}).then(setMessages);
  };

  return (
    <Card>
      <CardHeader
        action={<MessageBoxMenu ticket={ticket} conversationType={conversationType}/>}
        title={<ConversationSelector ticket={ticket} value={conversationType} onChange={setConversationType}/>}
      />
      {messageFormDisabled || <CardBody>
        <TicketMessageForm
          ticket={ticket}
          conversationType={conversationType}
          onSubmit={fetchMessages}
        />
      </CardBody>}
      <CardBody>
        {messages.map(formatMessage).map(message => (
          <MessageItem key={message.message_id} message={message} ticket={ticket}/>
        ))}
      </CardBody>
    </Card>
  );
}

MessageBox.propTypes = {
  ticket: PropTypes.object.isRequired,
  attachments: PropTypes.array.isRequired,
};

export default withAuth(withStyles(messageStyle)(MessageBox));
