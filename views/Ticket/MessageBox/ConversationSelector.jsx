import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckedIcon from '@material-ui/icons/CheckBox';
import UncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';

import Ticket from 'js/services/ticket';
import {conversationSelectStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';


const allOptions = {
  [Ticket.CONVERSATION_TYPE.AGENT_USER]: 'Communication with User',
  [Ticket.CONVERSATION_TYPE.AGENT_MERCHANT]: 'Communication with Merchant',
  [Ticket.CONVERSATION_TYPE.MERCHANT_USER]: 'Merchant-User conversation',
};

const ConversationSelector = ({ticket, value, onChange, classes}) => {
  const [selectedValue, setSelectedValue] = useState();
  const [menuAnchor, setMenuAnchor] = useState();

  useEffect(() => {
    if (value != selectedValue) {
      setSelectedValue(value);
    }
  }, [value]);

  const openMenu = event => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const selectConversation = conversationType => () => {
    setSelectedValue(conversationType);
    onChange(conversationType);
    closeMenu();
  };

  if (!ticket.conversation_types) return null;

  const hasMultipleConversations = ticket.conversation_types.length > 1;

  return (
    <React.Fragment>
      <span onClick={hasMultipleConversations ? openMenu : null} className={classNames({[classes.clickable]: hasMultipleConversations})}>
        {allOptions[selectedValue]} &nbsp;
        {hasMultipleConversations && <DropDownIcon fontSize="inherit"/>}
      </span>

      <Menu
        anchorOrigin={{vertical:'bottom', horizontal: 'left'}}
        getContentAnchorEl={null}
        id="conversation-select"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        {ticket.conversation_types.map(conversationType =>
          <MenuItem key={conversationType} onClick={selectConversation(conversationType)}>
            <ListItemIcon>
              {selectedValue == conversationType ? <CheckedIcon /> : <UncheckedIcon/>}
            </ListItemIcon>
            {allOptions[conversationType]}
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
};

ConversationSelector.propTypes = {
  ticket: PropTypes.object.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(conversationSelectStyle)(ConversationSelector);
