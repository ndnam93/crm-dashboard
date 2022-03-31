import React from 'react';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';

import withStyles from '@material-ui/core/styles/withStyles';
import {iconButtonStyle} from 'assets/jss/material-dashboard-react/components/buttonStyle';

const CustomIconButton = ({classes, size, ...props}) => {
  const rootClasses = classNames({
    [classes[size]]: size,
  });

  return (
    <IconButton classes={{root: rootClasses}} {...props} />
  );
}

export default withStyles(iconButtonStyle)(CustomIconButton);
