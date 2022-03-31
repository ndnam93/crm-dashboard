import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import Events from 'js/variables/events';
import GlobalEvent from 'js/services/global_event';
import AdminNote from 'js/services/admin_note';
import MessageItem from '../MessageItem';
import AddAttachments from '../AddAttachments';
import {messageStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';

const getInitialFormData = props => ({
  ticket_id: props.ticket.ticket_id,
  message: '',
});

class AdminNotes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      formData: getInitialFormData(props),
      newAttachments: [],
      clearAttachmentsInput: 0,
      disableSendBtn: false,
    };

    const handleRefreshNotes = ticketId => {
      if (ticketId == props.ticket.ticket_id) {
        this.fetchAdminNotes();
      }
    };
    this.conversationForwardedListener = GlobalEvent.addListener(Events.TicketConversationForwarded, handleRefreshNotes);
    this.noteAddedListener = GlobalEvent.addListener(Events.TicketAdminNoteAdded, handleRefreshNotes);
  }

  componentDidMount() {
    this.fetchAdminNotes();
  }

  componentWillUnmount() {
    GlobalEvent.removeListener(Events.TicketConversationForwarded, this.conversationForwardedListener);
    GlobalEvent.removeListener(Events.TicketAdminNoteAdded, this.noteAddedListener);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {ticket_id: ticketId} = this.props.ticket;
    if (ticketId != prevProps.ticket.ticket_id) {
      this.setState({messages: []});
      this.fetchAdminNotes();
      this.clearInputs();
    }
  }

  formatMessage = message => {
    message.attachments = message.attachments.map(({ticket_admin_note_attachment_id, ...attachment}) => ({
      ...attachment,
      attachment_id: ticket_admin_note_attachment_id,
    }));
    return message;
  };

  fetchAdminNotes = async () => {
    const {ticket_id} = this.props.ticket;
    if (!ticket_id) return;

    let messages = await AdminNote.getList(this.props.ticket.ticket_id);
    messages = messages.map(this.formatMessage);
    this.setState({messages});
  }

  handleSubmit = async () => {
    this.setState({disableSendBtn: true});
    const formData = new FormData();
    for (let paramName in this.state.formData) {
      formData.append(paramName, this.state.formData[paramName]);
    }
    for (let i in this.state.newAttachments) {
      formData.append(`attachments[${i}][file]`, this.state.newAttachments[i]);
    }

    try {
      await AdminNote.create(formData);
      this.fetchAdminNotes();
    } catch (e) {
      console.error(e);
    }
    this.clearInputs();
  }

  clearInputs = () => {
    this.setState({
      formData: getInitialFormData(this.props),
      newAttachments: [],
      disableSendBtn: false,
      clearAttachmentsInput: this.state.clearAttachmentsInput + 1,
    });
  }

  handleChangeInput = name => event => {
    const value = event.target.value;
    this.setState({
      formData: {...this.state.formData, [name]: value}
    });
  };


  render() {
    const {ticket, classes} = this.props;
    const {messages, formData} = this.state;

    return (
      <Card>
        <CardHeader title="Admin notes"/>
        <CardBody>
          <form>
            <TextField
              multiline
              fullWidth
              rows={4}
              rowsMax={8}
              value={formData.message}
              onChange={event => this.setState({formData: {...this.state.formData, message: event.target.value}})}
            />
            <AddAttachments
              onChange={newAttachments => this.setState({newAttachments})}
              clear={this.state.clearAttachmentsInput}
              id="admin-note-attachment-upload"
            />
            <Button variant="contained" color="primary" size="small" onClick={this.handleSubmit} className={classes.sendMessageBtn} disabled={this.state.disableSendBtn || !formData.message}>
              <SendIcon fontSize="small" />&nbsp; Save
            </Button>
          </form>
        </CardBody>
        <CardBody>
          {messages.map(message => (
            <MessageItem key={message.note_id} ticket={ticket} message={message} />
          ))}
        </CardBody>
      </Card>
    );
  }
}

export default withStyles(messageStyle)(AdminNotes);
