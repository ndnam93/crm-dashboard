import React, {useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {formStyle} from 'assets/jss/material-dashboard-react/views/cannedResponseStyle';

const availableVariables = [
  '{$ticketId}',
  '{$transactionId}',
];

const CannedResponseDialog = ({classes, params: initialParams, open, onClose, onSubmit}) => {
  const [params, setParams] = useState({});

  useEffect(() => {
    setParams(initialParams);
  }, [initialParams]);

  const handleVariableClick = variable => {
    const newParams = {
      ...params,
      body: (params.body || '') + variable,
    }
    setParams(newParams);
  };

  const handleChangeInput = name =>  event => {
    setParams({
      ...params,
      [name]: event.target.value,
    })
  };

  const onFormSubmit = event => {
    event.preventDefault();
    onSubmit(params);
  };

  return (
    <Dialog
      className={classes.dialog}
      scroll="body"
      open={open}
      onClose={onClose}
      aria-labelledby="form-title"
      fullWidth
    >
      <form method="POST" onSubmit={onFormSubmit}>
        <DialogTitle id="form-title">
          {params.canned_response_id
            ? 'Edit canned response #' + params.canned_response_id
            : 'Add new canned response'
          }
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Subject"
            fullWidth
            value={params.title || ''}
            onChange={handleChangeInput('title')}
            required
            inputProps={{maxLength: 255}}
          />
          <div className={classes.editor}>
            <TextField
              label="Text"
              multiline
              fullWidth
              rows={8}
              value={params.body || ''}
              onChange={handleChangeInput('body')}
              required
              inputProps={{maxLength: 7000}}
            />
            <div className={classes.left}>
              <p>Available Variables:</p>
              {availableVariables.map((variable, idx) => (
                <a href="javascript:;" key={idx} onClick={() => handleVariableClick(variable)}>{variable}&nbsp;</a>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default withStyles(formStyle)(CannedResponseDialog);
