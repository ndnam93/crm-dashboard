import React from 'react';
import HelpIcon from '@material-ui/icons/HelpOutlineSharp';
import ToolTip from '@material-ui/core/Tooltip';
import withStyles from '@material-ui/core/styles/withStyles';

import {tooltipStyle} from 'assets/jss/material-dashboard-react/components/tooltipStyle';


const HelpTooltip = ({title, classes}) => {
  return (
    <ToolTip
      title={<span className={classes.textStyle}>{title}</span>}
      placement="top"
    >
      <HelpIcon fontSize="small" className={classes.iconStyle}/>
    </ToolTip>
  );
};

export default withStyles(tooltipStyle)(HelpTooltip);
