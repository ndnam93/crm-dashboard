import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AttachmentIcon from '@material-ui/icons/AttachmentSharp';

import {ExternalServices} from 'js/services/external_service';
import AttachmentLink from 'js/components/AttachmentLink';
import {SENDER_TYPE} from 'js/services/ticket_message';
import avatarUser from 'assets/img/avatar_user.png';
import {ticketMessageStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';


const MessageItem = ({classes, ticket, message}) => {
  if (!ticket.service_id) return null;

  const service = ExternalServices[ticket.service_id];
  const isFromAdmin = message.sender_type ? message.sender_type == SENDER_TYPE.ADMIN : true;
  const isFromMerchant = message.sender_type == SENDER_TYPE.MERCHANT;

  return (
    <div className={classes.message}>
      <div className={classes.messageHeading}>
        <img src={isFromAdmin ? service['logo'] : avatarUser} width={30} height={30} className={classes.messageAvatar}/>
        <div className={classes.messageHeadingText}>
            <span className={classes.messageUserName}>
              {isFromAdmin
                ? `${service['name']}: ${message.sender_name}`
                : (isFromMerchant ? 'Merchant' : 'User')
              }
            </span>
          <span className={classes.messageDate}>{message.created_at}</span>
        </div>
      </div>
      <div className={classnames({
        [classes.messageBody]: true,
        [classes.adminMessageBody]: isFromAdmin,
        [classes.userMessageBody]: !isFromAdmin,
      })}>
        {message.message}
        {message.attachments.map(attachment =>
          <AttachmentLink
            key={attachment.attachment_id}
            file={attachment}
            className={classes.messageAttachment}
          >
            <AttachmentIcon className={classes.attachmentIcon}/>{attachment.file_name}
          </AttachmentLink>
        )}
      </div>
    </div>
  );
}

MessageItem.propTypes = {
  ticket: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

export default withStyles(ticketMessageStyle)(MessageItem);
