import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';

import {toLocalTime} from 'js/common';
import AttachmentLink from 'js/components/AttachmentLink';
import {attachmentStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';




const Attachments = ({classes, attachments}) => {
  const Attachment = ({file}) => {
    if (!file) return null;

    file.created_at = toLocalTime(file.created_at, 'MMM DD, YYYY');
    return (
      <div>
        •&nbsp;<AttachmentLink file={file} className={classes.attachmentLinkStyle}>{file.file_name}</AttachmentLink>
        &nbsp;<span title={file.created_at} className={classes.attachedTime}>{file.created_at}</span>
      </div>
    );
  };

  return (
    <Card className={classes.card}>
      <CardHeader title="Attachments"/>
      <CardBody>
        {attachments && attachments.map(attachment => <Attachment file={attachment} key={attachment.file_id}/>)}
      </CardBody>
    </Card>
  );
}

Attachments.propTypes = {
  ticket: PropTypes.object,
  attachments: PropTypes.array.isRequired,
};

export default withStyles(attachmentStyle)(Attachments);
