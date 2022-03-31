import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from 'js/components/CustomInput/TextValidator';
import {statusStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import Problem from 'js/services/problem';
import Ticket from 'js/services/ticket';


const StatusButtons = ({ticket, classes}) => {
  const [openProblemDialog, setOpenProblemDialog] = useState(false);
  const [problemOptions, setProblemOptions] = useState([]);
  const [params, setParams] = useState({});
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  useEffect(() => {
    Problem.getOptions({type: ticket.type}).then(setProblemOptions);
  }, []);
  useEffect(() => {
    if (!params.status) return;
    params.status == Ticket.STATUS.RESOLVED
      ? setOpenProblemDialog(true)
      : submit();
  }, [params.status]);


  const closeDialog = () => {
    setOpenProblemDialog(false);
    updateParams({status: undefined});
    setDisableSubmitBtn(false);
  };

  const updateParams = ({problem_id, ...newParams}) => {
    setParams({
      ...params,
      ...newParams,
      problem_id: problem_id && problem_id/1,
    });
  };

  const submit = async () => {
    setDisableSubmitBtn(true);
    if (Object.keys(params).length == 0) return;
    await Ticket.update(ticket.ticket_id, params);
    closeDialog();
  };

  const StatusButton = ({status}) => <Button variant="outlined" classes={{root: classes.statusBtn}} onClick={() => updateParams({status})}>{status}</Button>;

  return (
    <div className={classes.statusButtonGroup}>
      {ticket.type == Ticket.TYPE.DISPUTE ? (
        <React.Fragment>
          <StatusButton status={Ticket.STATUS.WON} />
          <StatusButton status={Ticket.STATUS.LOST} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {!_.includes([Ticket.STATUS.PENDING, Ticket.STATUS.RESOLVED], ticket.status) && <StatusButton status={Ticket.STATUS.PENDING} />}
          {ticket.status != Ticket.STATUS.RESOLVED && <StatusButton status={Ticket.STATUS.RESOLVED} />}
        </React.Fragment>
      )}

      <Dialog
        scroll="body"
        open={openProblemDialog}
        onClose={closeDialog}
        aria-labelledby="form-dialog-problem"
      >
        <ValidatorForm onSubmit={submit}>
          <DialogTitle id="form-dialog-problem">Please select a problem</DialogTitle>
          <DialogContent>
            <TextValidator
              select
              labelText="Problem"
              name="problem"
              formControlProps={{fullWidth: true, autoFocus: true}}
              inputProps={{
                onChange: e => updateParams({problem_id: e.target.value}),
              }}
              value={params.problem_id}
              validators={['required']}
              errorMessages={['Problem is required.']}
            >
              <option></option>
              {problemOptions.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
            </TextValidator>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit" color="primary" disabled={disableSubmitBtn}>Submit</Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </div>
  );
}

StatusButtons.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default withStyles(statusStyle)(StatusButtons);
