import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import _ from 'lodash';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {AuthContext} from 'js/HOCs/auth';
import CannedResponse from 'js/services/canned_response';
import TicketMessageService from 'js/services/ticket_message';
import GlobalEvent from 'js/services/global_event';
import Events from 'js/variables/events';
import {messageStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import AddAttachments from '../AddAttachments';


const TicketMessageForm = ({ticket, conversationType, onSubmit, classes}) => {
  const [message, setMessage] = useState();
  const [languageCodes, setLanguageCodes] = useState({});
  const [selectedLanguageCode, setSelectedLanguageCode] = useState(0);
  const [selectedResponseId, setSelectedResponseId] = useState(0);
  const [cannedResponses, setCannedResponses] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const [disableSendBtn, setDisableSendBtn] = useState(false);
  const [clearAttachmentsInput, setClearAttachmentsInput] = useState(0);
  const {auth: {userInfo}} = useContext(AuthContext);

  useEffect(() => {
    axios.get('translator/languages').then(({data: languageCodes}) => setLanguageCodes(languageCodes));
  }, []);
  useEffect(() => {
    if (userInfo) {
      CannedResponse.getList({
        status: 'active',
        admin_id: [0, userInfo.admin_id]
      }).then(setCannedResponses);
    }
  }, [userInfo]);
  useEffect(() => {
    clearInputs();
  }, [ticket]);

  const clearInputs = () => {
    setMessage('Hello');
    setNewAttachments([]);
    setDisableSendBtn(!ticket.user_email && !ticket.merchant_email);
    setClearAttachmentsInput(clearAttachmentsInput + 1);
  };

  const handleSubmit = async () => {
    setDisableSendBtn(true);
    const formData = new FormData();
    formData.append('message', message);
    formData.append('ticket_id', ticket.ticket_id);
    formData.append('conversation_type', conversationType);
    for (let i in newAttachments) {
      const attachment = newAttachments[i];
      formData.append(`attachments[${i}][file]`, attachment);
      formData.append(`attachments[${i}][name]`, attachment.file_name);
    }

    try {
      const newTicketMessage = await TicketMessageService.create(formData);
      if (!_.isEmpty(newTicketMessage.attachments)) {
        GlobalEvent.dispatch(Events.TicketAttachmentAdded, ticket.ticket_id, newTicketMessage.attachments);
      }
      onSubmit && onSubmit();
    } catch (e) {
      console.error(e);
    }
    clearInputs();
  };


  const handleResponseChange = (event) => {
    const responseId = event.target.value;
    const res = cannedResponses.find(t => t.canned_response_id == responseId);
    const body = res ? res.body : '';
    setMessage(_.template(body)(CannedResponse.buildTemplateData(ticket)));
    setSelectedResponseId(responseId);
  };

  const renderResponseSelect = () =>
    <TextField
        select
        value={selectedResponseId}
        className={classes.select}
        onChange={handleResponseChange}
        fullWidth={true}
      >
        <option value={0}>Canned Responses</option>
        {cannedResponses && cannedResponses.map((res, idx) => <option key={idx} value={res.canned_response_id}>{res.title}</option>)}
      </TextField>
  ;

  const renderLanguageSelect = () =>
      <TextField
        select
        value={selectedLanguageCode}
        className={classes.select}
        onChange={handleLanguageChange}
        fullWidth={true}
      >
        <option value="0">Add translation</option>
        {languageCodes && Object.keys(languageCodes).map(key => <option key={key} value={key}>{languageCodes[key]}</option>)}
      </TextField>
  ;

  const handleLanguageChange = event => {
    const translateTo = event.target.value;
    setSelectedLanguageCode(translateTo);
    axios.post('translator/translate', {
      text: message,
      to: translateTo,
    }).then(({data}) => {
      if (data.success) {
        const translated = message + "\n\n"
          + '--------------------------------------------------\n'
          + "Translation:\n\n"
          + data.translation;
        setMessage(translated);
      } else {
        alert(data.error);
      }
    });
  };

  return (
    <form>
      {renderResponseSelect()}
      {renderLanguageSelect()}
      <TextField
        multiline
        fullWidth
        rows={4}
        rowsMax={8}
        value={message}
        onChange={event => setMessage(event.target.value)}
      />
      <AddAttachments
        onChange={setNewAttachments}
        clear={clearAttachmentsInput}
        id="ticket-attachment-upload"
      />
      <Button variant="contained" color="primary" size="small" onClick={handleSubmit} className={classes.sendMessageBtn} disabled={disableSendBtn || !message}>
        <SendIcon fontSize="small" />&nbsp; Send
      </Button>
    </form>
  );
};

TicketMessageForm.propTypes = {
  ticket: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(messageStyle)(TicketMessageForm);
