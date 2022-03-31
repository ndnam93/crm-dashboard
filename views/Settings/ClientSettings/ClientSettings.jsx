import React, {useContext} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import {withSnackbar} from 'js/HOCs/snackbar';
import Admin from 'js/services/admin';
import {settingsStyle} from 'assets/jss/material-dashboard-react/views/settingsStyle';
import TicketSettings from './TicketSettings';
import ApiKey from './ApiKey';
import ClientSelectWarning from 'js/components/Snackbar/ClientSelectWarning';



const ClientSettings = ({classes}) => {
  const {auth} = useContext(AuthContext);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);

  return (
    <React.Fragment>
      <ServiceSelector />
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>Client settings</h4>
        </CardHeader>
      </Card>
      {!serviceId && auth.userInfo && auth.userInfo.role == Admin.ROLE.ADMIN ? (
        <ClientSelectWarning />
      ) : (
        <React.Fragment>
          <TicketSettings />
          {auth.userInfo && auth.userInfo.role == Admin.ROLE.ADMIN && (
            <ApiKey />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withSnackbar(withStyles(settingsStyle)(ClientSettings));
