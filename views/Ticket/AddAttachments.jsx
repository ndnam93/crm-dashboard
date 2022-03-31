import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AttachmentIcon from '@material-ui/icons/AttachmentSharp';
import withStyles from '@material-ui/core/styles/withStyles';
import {addAttachmentStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';


const AddAttachments = (props) => {
  const [renamingAttachmentIndex, setRenamingAttachmentIndex] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const attachmentInput = React.createRef();

  useEffect(() => {
    props.onChange(attachments);
  }, [attachments]);

  useEffect(() => {
    setAttachments([]);
  }, [props.clear]);

  const handleAttachmentInputChanged = (event) => {
    const {files} = attachmentInput.current;
    const newAttachments = [];
    for (let newFile of files) {
      newFile.file_name = newFile.name;
      newAttachments.push(newFile);
    }
    setAttachments([...attachments, ...newAttachments]);
  };

  const updateAttachments = (callback) => {
    let clonedAttachments = [...attachments];
    clonedAttachments = callback(clonedAttachments);
    clonedAttachments && setAttachments(clonedAttachments);
  };

  const removeAttachment = (index) => {
    updateAttachments(attachments => {
      attachments.splice(index, 1);
      return attachments;
    });
    setRenamingAttachmentIndex(null);
  };

  const renameAttachment = (index, newName) => {
    updateAttachments(attachments => {
      attachments[index].file_name = newName;
      return attachments;
    });
  };

  const cancelRenaming = () => {
    updateAttachments(attachments => {
      const attachment = attachments[renamingAttachmentIndex];
      attachment.file_name = attachment.name;
      return attachments;
    });
    setRenamingAttachmentIndex(null);
  };

  const confirmAttachmentName = () => {
    let success = false;
    updateAttachments(attachments => {
      const attachment = attachments[renamingAttachmentIndex];
      const newName = attachment.file_name.trim();
      if (newName.length == 0) {
        alert('Attachment name cannot be blank');
        return attachments;
      }
      attachment.file_name = newName;
      success = true;
      return attachments;
    });
    success && setRenamingAttachmentIndex(null);
  };

  const handleRenameInputKeypress = event => {
    event.preventDefault();
    if (event.key === 'Enter') {
      confirmAttachmentName();
    }
  }

  const {classes} = props;
  return (
    <div className={classes.addAttachmentBox}>
      <Button className={classes.addAttachmentBtn} component="label" htmlFor={props.id} size="small">
        <AttachmentIcon className={classes.attachmentIcon}/>+ attachment
      </Button>
      <input type="file" multiple={true} id={props.id} ref={attachmentInput} onChange={handleAttachmentInputChanged}/>
      {attachments.map((attachment, index) =>
        <div key={index} className={classes.newAttachmentItem}>
          {renamingAttachmentIndex == index ? (
            <span>
              <input
                value={attachment.file_name}
                onChange={event => renameAttachment(index, event.target.value)}
                onKeyPress={handleRenameInputKeypress}
              />
              <i onClick={confirmAttachmentName} className="material-icons success" title="OK">check</i>
              <i onClick={cancelRenaming} className="material-icons danger" title="Cancel">clear</i>
            </span>
          ) : (
            <span>
              •&nbsp;{attachment.file_name}&nbsp;&nbsp;
              <i onClick={() => setRenamingAttachmentIndex(index)} className="material-icons success" title="Rename file">edit</i>
                <i onClick={() => removeAttachment(index)} className="material-icons danger" title="Remove">delete_forever</i>
              </span>
          )}
        </div>
      )}
    </div>
  )
};

AddAttachments.propTypes = {
  onChange: PropTypes.func.isRequired,
  clear: PropTypes.number,
};
export default withStyles(addAttachmentStyle)(AddAttachments);
