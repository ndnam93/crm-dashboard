import React, {useContext, useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import {withSnackbar} from 'js/HOCs/snackbar';
import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardBody from 'js/components/Card/CardBody';
import ExternalService from 'js/services/external_service';
import {settingsStyle} from 'assets/jss/material-dashboard-react/views/settingsStyle';

const ApiKey = ({classes}) => {
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const [service, setService] = useState();

  useEffect(() => {
    setService(null);
    ExternalService.get(serviceId).then(setService);
  }, [serviceId]);

  const getNewApiKey = async () => {
    if (!confirm(`Generate new API key for ${service.display_name}?`)) return;

    setService({...service, api_key: null});
    const api_key = await ExternalService.getNewApiKey(serviceId);
    setService({...service, api_key});
  };

  return (
    <Card>
      <CardBody>
        <h4 className={classes.sectionTitle}><b>API key</b></h4>
        <Grid container>
          <GridItem xs={6} md={4}>
            <FormLabel classes={{root: classes.formLabel}}>
              <span>Current API key:</span>
            </FormLabel>
          </GridItem>
          <GridItem xs={6} md={6}>
            <span>{service && service.api_key}</span>
          </GridItem>
        </Grid>
        <Grid container>
          {service && <Button color="primary" variant="contained" size="large" className={classes.saveBtn} onClick={getNewApiKey}>New API key</Button>}
        </Grid>
      </CardBody>
    </Card>
  );
}

export default withStyles(settingsStyle)(ApiKey);