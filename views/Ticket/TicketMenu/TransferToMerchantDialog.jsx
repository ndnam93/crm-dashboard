import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {AuthContext} from 'js/HOCs/auth';
import Ticket from 'js/services/ticket';
import Admin from 'js/services/admin';
import GlobalEvent from 'js/services/global_event';
import Events from 'js/variables/events';
import {history} from 'js/common';

const TransferToMerchantDialog = ({ticket, open, onClose}) => {
  const [formData, setFormData] = useState({ticket_id: ticket.ticket_id});
  const [disableTransferBtn, setDisableTransferBtn] = useState(false);
  const {auth: {userInfo}} = useContext(AuthContext);

  const submit = async (event) => {
    event.preventDefault();
    setDisableTransferBtn(true);
    try {
      await Ticket.transferToMerchant(formData);
      if (userInfo.role == Admin.ROLE.AGENT) {
        history.push('/dashboard/tickets/' + _.invert(Ticket.TYPE_TO_TEAM)[userInfo.team]);
      } else {
        onClose();
        GlobalEvent.dispatch(Events.TicketUpdated, ticket);
      }
    } catch (e) {
      alert(e.response.data.message);
    }
    setDisableTransferBtn(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="form-transfer-to-merchant-title"
      fullWidth
    >
      <form onSubmit={submit} method="POST">
        <DialogTitle id="form-transfer-to-merchant-title">Transfer ticket to merchant</DialogTitle>
        <DialogContent>
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={event => setFormData({...formData, description: event.target.value})}
            multiline
            rows={4}
            fullWidth={true}
            required={true}
            inputProps={{maxLength: 7500}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={disableTransferBtn}>Transfer</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

TransferToMerchantDialog.propTypes = {
  ticket: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default TransferToMerchantDialog;

