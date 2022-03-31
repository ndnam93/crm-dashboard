import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SendIcon from '@material-ui/icons/Send';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';

import CardMenu from 'js/components/Menu/CardMenu';
import CustomCreatableSelect from 'js/components/CustomInput/CustomCreatableSelect';
import GlobalEvent from 'js/services/global_event';
import {withSnackbar} from 'js/HOCs/snackbar';
import {createOption} from 'js/common';
import {messageBoxMenu} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import Events from 'js/variables/events';
import {withAuth} from 'js/HOCs/auth';


class MessageBoxMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openForwardDialog: false,
      emailIds: [],
      comment: '',
      forwardOptions: [],
      disableForwardBtn: false,
    };
    this.cardMenu = React.createRef();
  }

  componentDidMount = async () => {
    const forwardAddresses = this.props.auth.userInfo.getServiceSetting(this.props.ticket.service_id, `emails.${this.props.ticket.type}.forward_addresses`);
    _.isArray(forwardAddresses) && this.setState({
      forwardOptions: forwardAddresses.map(createOption),
    });
  }

  openForwardDialog = () => {
    this.setState({openForwardDialog: true});
    this.cardMenu.current.closeMenu();
  }

  closeForwardDialog = () => {
    this.setState({
      openForwardDialog: false,
      disableForwardBtn: false,
      emailIds: [],
      comment: '',
    });
  }

  submit = async () => {
    const {emailIds, comment} = this.state;
    this.setState({disableForwardBtn: true});
    try {
      await axios.post('/ticket/forward-conversation', {
        emails: emailIds.map(email => email.trim()),
        comment,
        ticket_id: this.props.ticket.ticket_id,
        conversation_type: this.props.conversationType,
      });
      this.closeForwardDialog();
      GlobalEvent.dispatch(Events.TicketConversationForwarded, this.props.ticket.ticket_id);
    } catch (error) {
      this.props.openSnackBar(error.message);
      this.setState({disableForwardBtn: false});
    }
  }

  render() {
    const {classes} = this.props;
    const {emailIds, forwardOptions} = this.state;

    return (
      <React.Fragment>
        <CardMenu ref={this.cardMenu}>
          <MenuItem onClick={this.openForwardDialog}>
            <ListItemIcon><SendIcon /></ListItemIcon>Forward
          </MenuItem>
        </CardMenu>

        <Dialog
          open={this.state.openForwardDialog}
          onClose={this.closeForwardDialog}
          aria-labelledby="form-forward-title"
          classes={{paper: classes.dialogPaper}}
          fullWidth
        >
          <DialogTitle id="form-forward-title">Forward conversation</DialogTitle>
          <DialogContent classes={{root: classes.dialogContent}}>
            <CustomCreatableSelect
              placeholder="Enter email addresses..."
              values={emailIds}
              onChange={emailIds => this.setState({emailIds})}
              suggestedOptions={forwardOptions}
            />
            <TextField
              margin="dense"
              id="comment"
              label="Comment"
              inputProps={{maxLength: 1000}}
              onChange={event => this.setState({comment: event.target.value})}
              value={this.state.comment}
              multiline
              fullWidth
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeForwardDialog}>Cancel</Button>
            <Button onClick={this.submit} disabled={this.state.disableForwardBtn} color="primary">Forward</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

MessageBoxMenu.propTypes = {
  ticket: PropTypes.object.isRequired,
  conversationType: PropTypes.string,
};

export default withAuth(withSnackbar(withStyles(messageBoxMenu)(MessageBoxMenu), {
  place: 'bc',
}));
