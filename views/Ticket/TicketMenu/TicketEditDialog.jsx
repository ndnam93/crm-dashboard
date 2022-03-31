import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/es/Button/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from 'js/components/CustomInput/TextValidator';
import Ticket from 'js/services/ticket';
import CategorySelect from 'js/components/CustomInput/CategorySelect';
import CustomInput from 'js/components/CustomInput/CustomInput';
import {withSnackbar} from 'js/HOCs/snackbar';
import {ticketEditStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';

const TicketEditDialog = ({ticket, open, onClose, classes, openSnackBar}) => {
  const [isSubjectEditable, setIsSubjectEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);

  useEffect(() => {
    const subjectEditable = ticket.author_type == Ticket.AUTHOR_TYPE.ADMIN;
    setFormData({
      subject: subjectEditable ? ticket.subject : undefined,
      transaction_date: ticket.transaction_date && ticket.transaction_date.substr(0, 10),
      ..._.pick(ticket, ['user_email', 'merchant_email', 'transaction_id', 'user_id', 'merchant_id', 'category_id']),
    });
    setIsSubjectEditable(subjectEditable);
  }, [ticket]);

  const handleChange = name => event => {
    const value = event.target.value;
    setFormData({...formData, [name]: value});
  };

  const submit = async () => {
    setDisableSaveBtn(true);
    try {
      await Ticket.update(ticket.ticket_id, formData);
      onClose();
    } catch (error) {
      openSnackBar(_.values(error.response.data.error).join('\n'));
    }
    setDisableSaveBtn(false);
  };

  return (
    <Dialog
      className={classes.dialog}
      open={open}
      onClose={onClose}
      aria-labelledby="form-edit-title"
    >
      <DialogTitle id="form-edit-title">Edit ticket</DialogTitle>
      <DialogContent>
        <ValidatorForm onSubmit={submit}>
          {isSubjectEditable && (
            <TextValidator
              labelText="Subject"
              name="subject"
              formControlProps={{fullWidth: true}}
              value={formData.subject}
              inputProps={{
                onChange: handleChange('subject'),
                maxLength: 255,
              }}
              validators={['maxStringLength:255']}
              errorMessages={['Subject must not exceed 255 characters']}
            />
          )}
          <FormControl fullWidth>
            <InputLabel shrink>Category</InputLabel>
            <CategorySelect
              value={formData.category_id}
              serviceId={ticket.service_id}
              onChange={category_id => setFormData({...formData, category_id})}
            />
          </FormControl>
          <TextValidator
            labelText="User Email"
            type="email"
            name="user_email"
            formControlProps={{fullWidth: true}}
            value={formData.user_email}
            inputProps={{
              onChange: handleChange('user_email'),
              maxLength: 100,
            }}
            validators={['maxStringLength:100', 'isEmail']}
            errorMessages={['User email must not exceed 100 characters', 'Email is not valid']}
          />
          <TextValidator
            labelText="Merchant Email"
            type="email"
            name="merchant_email"
            formControlProps={{fullWidth: true}}
            value={formData.merchant_email}
            inputProps={{
              onChange: handleChange('merchant_email'),
              maxLength: 100,
            }}
            validators={['maxStringLength:100', 'isEmail']}
            errorMessages={['Merchant email must not exceed 100 characters', 'Email is not valid']}
          />
          <TextValidator
            labelText="User External ID"
            type="number"
            name="user_id"
            formControlProps={{fullWidth: true}}
            value={formData.user_id}
            inputProps={{
              onChange: handleChange('user_id'),
            }}
            validators={['isNumber', 'isPositive']}
            errorMessages={['Invalid number', 'Invalid number']}
          />
          <TextValidator
            labelText="Merchant External ID"
            type="number"
            name="merchant_id"
            formControlProps={{fullWidth: true}}
            value={formData.merchant_id}
            inputProps={{
              onChange: handleChange('merchant_id'),
            }}
            validators={['isNumber', 'isPositive']}
            errorMessages={['Invalid number', 'Invalid number']}
          />
          <TextValidator
            labelText="Transaction ID"
            type="number"
            name="transaction_id"
            formControlProps={{fullWidth: true}}
            value={formData.transaction_id}
            inputProps={{
              onChange: handleChange('transaction_id'),
            }}
            validators={['isNumber', 'isPositive']}
            errorMessages={['Invalid number', 'Invalid number']}
          />
          <FormControl fullWidth>
            <CustomInput
              labelText="Transaction date"
              inputProps={{
                value: formData.transaction_date || '',
                onChange: handleChange('transaction_date'),
                type: 'date',
              }}
              labelProps={{shrink: true}}
            />
          </FormControl>
        </ValidatorForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} color="primary" disabled={disableSaveBtn}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

TicketEditDialog.propTypes = {
  ticket: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default withSnackbar(withStyles(ticketEditStyle)(TicketEditDialog));
