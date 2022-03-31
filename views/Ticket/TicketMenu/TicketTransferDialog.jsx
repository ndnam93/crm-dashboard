import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {ValidatorForm} from 'react-form-validator-core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/es/Button/Button';

import TextValidator from 'js/components/CustomInput/TextValidator';
import Ticket from 'js/services/ticket';
import {AuthContext} from 'js/HOCs/auth';


const TRANSFERABLE_TYPES = [Ticket.TYPE.PAYMENT, Ticket.TYPE.MERCHANT, Ticket.TYPE.RISK];

const TicketTransferDialog = ({ticket, open, onClose}) => {
  const [formData, setFormData] = useState({});
  const [ticketTypeList, setTicketTypeList] = useState([]);
  const [disableTransferBtn, setDisableTransferBtn] = useState(false);

  useEffect(() => {
    setTicketTypeList(_.filter(TRANSFERABLE_TYPES, type => type != ticket.type));
  }, [ticket]);

  const handleChange = name => event => {
    const value = event.target.value;
    setFormData({...formData, [name]: value});
  };

  const submit = async () => {
    setDisableTransferBtn(true);
    try {
      Ticket.transfer({
        ...formData,
        ticket_id: ticket.ticket_id
      });
      onClose();
    } catch (e) {
      alert(Object.values(e.response.data.error).join('\n'));
    }
    setDisableTransferBtn(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-transfer-title"
      fullWidth
    >
      <ValidatorForm onSubmit={submit}>
        <DialogTitle id="form-transfer-title">Transfer ticket</DialogTitle>
        <DialogContent>
          <TextValidator
            select
            labelText="Target queue"
            name="ticket_type"
            formControlProps={{fullWidth: true, autoFocus: true}}
            inputProps={{
              onChange: handleChange('target_type'),
            }}
            value={formData.target_type}
            validators={['required']}
            errorMessages={['Please select target queue']}
          >
            <option></option>
            {ticketTypeList.map(ticketType => (<option key={ticketType} value={ticketType}>{_.capitalize(ticketType)}</option>))}
          </TextValidator>
          <TextValidator
            labelText="Comment"
            name="comment"
            formControlProps={{fullWidth: true}}
            value={formData.comment}
            inputProps={{
              onChange: handleChange('comment'),
              maxLength: 1000,
              multiline: true,
              rows: 4,
            }}
            validators={['required', 'maxStringLength:1000']}
            errorMessages={['Please write a comment', 'Comment must not exceed 1000 characters']}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={disableTransferBtn}>Transfer</Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
};

TicketTransferDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default TicketTransferDialog;
