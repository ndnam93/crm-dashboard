import React, {useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import {ValidatorForm} from 'react-form-validator-core';
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
import HelpTooltip from 'js/components/Tooltip/HelpTooltip';
import TextValidator from 'js/components/CustomInput/TextValidator';
import ExternalService from 'js/services/external_service';
import {settingsStyle} from 'assets/jss/material-dashboard-react/views/settingsStyle';


const defaultFormData = {
  pending_expiry_period: 0,
  email_checking_interval: 0,
};

const TicketSettings = ({classes, openSnackBar}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    if (!auth.userInfo) return;

    const currentSettings = auth.userInfo.getServiceSetting(serviceId, 'tickets');
    setFormData({...defaultFormData, ...currentSettings});
  }, [auth.userInfo, serviceId]);

  const handleInputChange = name => event => {
    const value = event.target.value;
    setFormData({...formData, [name]: value});
  };

  const submit = async () => {
    try {
      await ExternalService.updateSettings(serviceId, {
        tickets: _.omitBy(formData, _.isNil),
      });
      auth.getUserInfo(true);
    } catch (error) {
      openSnackBar(_.values(error.response.data.error).join('\n'));
    }
  };

  return (
    <Card>
      <CardBody>
        <ValidatorForm onSubmit={submit}>
          <h4 className={classes.sectionTitle}><b>Ticket settings</b></h4>
          <Grid container>
            <GridItem xs={6} md={4}>
              <FormLabel classes={{root: classes.formLabel}}>
                <span>Pending expiry period</span> &nbsp;
                <HelpTooltip title="Number of hours a ticket can be pending before it's expired. Default 48 hours."/>
              </FormLabel>
            </GridItem>
            <GridItem xs={6} md={2}>
              <TextValidator
                type="number"
                name="pending_expiry_period"
                formControlProps={{fullWidth: true, className: classes.textValidator}}
                value={formData.pending_expiry_period}
                inputProps={{
                  onChange: handleInputChange('pending_expiry_period'),
                }}
                validators={['isNumber']}
                errorMessages={['Enter a valid number']}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem xs={6} md={4}>
              <FormLabel classes={{root: classes.formLabel}}>
                <span>Email checking interval</span> &nbsp;
                <HelpTooltip title="The interval which email processor is run. If no new email has been processed since the last run, it'll check for new emails in mailbox. Default 20 minutes."/>
              </FormLabel>
            </GridItem>
            <GridItem xs={6} md={2}>
              <TextValidator
                type="number"
                name="email_checking_interval"
                formControlProps={{fullWidth: true, className: classes.textValidator}}
                value={formData.email_checking_interval}
                inputProps={{
                  onChange: handleInputChange('email_checking_interval'),
                }}
                validators={['isNumber']}
                errorMessages={['Enter a valid number']}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <Button type="submit" color="primary" variant="contained" size="large" className={classes.saveBtn}>Save</Button>
          </Grid>
        </ValidatorForm>
      </CardBody>
    </Card>
  );
}

export default withSnackbar(withStyles(settingsStyle)(TicketSettings));
