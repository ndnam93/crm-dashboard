import React, {useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import FileViewer from 'react-file-viewer';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import attachmentLinkStyle from 'assets/jss/material-dashboard-react/components/attachmentLinkStyle';
import {withAuth} from 'js/HOCs/auth';


const AttachmentLink = ({file, classes, auth, ...props}) => {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const regexResult = /(gif|jpg|jpeg|png|bmp|pdf|csv|doc|docx|xls|xlsx|mp4|webm|mp3)$/i.exec(file.file_name);
  const fileType = regexResult && regexResult[0].toLowerCase();
  file.url_with_token = file.internal_url + '?token=' + auth.accessToken;

  const closeDialog = () => setOpenPreviewDialog(false);

  const onError = error => console.log(error);

  return (
    <React.Fragment>
      <a
        href={fileType ? undefined : file.url_with_token}
        onClick={fileType ? () => setOpenPreviewDialog(true) : undefined}
        {...props}
      />
      {openPreviewDialog && <Dialog
          scroll="body"
          open={openPreviewDialog}
          onClose={closeDialog}
          aria-labelledby="preview-dialog"
          maxWidth="lg"
          classes={{paper: classes.dialog}}
        >
          <DialogTitle id="preview-dialog" classes={{root: classes.dialogTitle}}>{file.file_name}</DialogTitle>
          <DialogContent classes={{root: classes.dialogContent}}>
            <FileViewer
              fileType={fileType}
              filePath={file.url_with_token}
              onError={onError}
            />
          </DialogContent>
          <DialogActions>
            <Button href={file.url_with_token} classes={{label: classes.dialogBtnLabel}}><DownloadIcon/>&nbsp;&nbsp; Download File</Button>
            <Button onClick={closeDialog} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      }
    </React.Fragment>
  );
};

export default withAuth(withStyles(attachmentLinkStyle)(AttachmentLink));
