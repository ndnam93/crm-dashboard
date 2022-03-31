import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import SnackbarContent from './SnackbarContent';

const ClientSelectWarning = () =>
  <SnackbarContent
    icon={WarningIcon}
    message="Please select client"
    color="warning"
  />
;

export default ClientSelectWarning;
