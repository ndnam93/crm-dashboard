import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    padding: 0,
    color: '#4caf50',
    '&$checked': {
      color: '#4caf50'
    }
  },
  checked: {}
};

function CustomCheckbox(props) {
  return <Checkbox
    classes={{
      root: props.classes.root,
      checked: props.classes.checked,
    }}
    {...props} />
}

export default withStyles(styles)(CustomCheckbox);
