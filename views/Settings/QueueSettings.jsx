import React, {useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import {ValidatorForm} from 'react-form-validator-core';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import {withSnackbar} from 'js/HOCs/snackbar';
import Ticket from 'js/services/ticket';
import TextValidator from 'js/components/CustomInput/TextValidator';
import HelpTooltip from 'js/components/Tooltip/HelpTooltip';
import CustomCreatableSelect from 'js/components/CustomInput/CustomCreatableSelect';
import ExternalService from 'js/services/external_service';
import Admin from 'js/services/admin';
import {settingsStyle} from 'assets/jss/material-dashboard-react/views/settingsStyle';
import ClientSelectWarning from 'js/components/Snackbar/ClientSelectWarning';


const defaultFormData = {
  email: '',
  from_name: '',
  push_topic: '',
  push_subscription: '',
  forward_addresses: [],
  ignore_list: [],
  skip_notification_list: [],
};

const QueueSettings = ({queue, classes, openSnackBar}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    if (!auth.userInfo) return;

    const currentSettings = auth.userInfo.getServiceSetting(serviceId, 'emails.' + queue);
    setFormData({...defaultFormData, ...currentSettings});
  }, [auth.userInfo, queue, serviceId]);

  const setFormDataValue = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleInputChange = name => event => {
    const value = event.target.value;
    setFormDataValue(name, value);
  };

  const handleSwitchChange = name => event => {
    const value = event.target.checked;
    setFormDataValue(name, value);
  };

  const submit = async () => {
    const filterEmptyValue = value => {
      if (_.isNil(value)) return true;
      if (_.isString(value) && _.isEmpty(value)) return true;
      return false;
    }
    try {
      await ExternalService.updateSettings(serviceId, {
        emails: {
          [queue]: _.omitBy(formData, filterEmptyValue),
        }
      });
      auth.getUserInfo(true);
    } catch (error) {
      openSnackBar(_.values(error.response.data.error).join('\n'));
    }
  };

  const integrateMailbox = async () => {
    const url = await ExternalService.getMailIntegrationUrl(serviceId, queue);
    window.open(url);
  };

  if (!window.onGoogleOauthSuccess) {
    window.onGoogleOauthSuccess = () => {
      auth.getUserInfo(true);
    };
  };

  return (
    <React.Fragment>
      <ServiceSelector />
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>{queue == 'general' ? 'General' : Ticket.QUEUE_NAMES[queue]} queue settings</h4>
          {queue == 'general' && <HelpTooltip title="These settings are applied to all queues"/>}
        </CardHeader>
        <CardBody>
          {!serviceId && auth.userInfo && auth.userInfo.role == Admin.ROLE.ADMIN ? (
            <ClientSelectWarning />
          ) : (
            <ValidatorForm onSubmit={submit}>
              {queue != 'general' && (
                <React.Fragment>
                  <Grid container>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Email address</span> &nbsp;
                        <HelpTooltip title="The address to be displayed in the 'from' field of notification emails"/>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <TextValidator
                        type="email"
                        name="email"
                        formControlProps={{fullWidth: true, className: classes.textValidator}}
                        value={formData.email}
                        inputProps={{
                          onChange: handleInputChange('email'),
                          maxLength: 100,
                        }}
                        validators={['isEmail', 'maxStringLength:100']}
                        errorMessages={['Email is not valid', 'Email must not exceed 100 characters']}
                      />
                    </GridItem>
                  </Grid>
                  <Grid container>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Sender name</span> &nbsp;
                        <HelpTooltip title="The sender name in the 'from' field of notification emails"/>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <TextValidator
                        name="from_name"
                        formControlProps={{fullWidth: true, className: classes.textValidator}}
                        value={formData.from_name}
                        inputProps={{
                          onChange: handleInputChange('from_name'),
                          maxLength: 100,
                        }}
                        validators={['maxStringLength:100']}
                        errorMessages={['Sender name must not exceed 100 characters']}
                      />
                    </GridItem>
                  </Grid>
                  <Grid container classes={{container: classes.marginBtm10}}>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Forward addresses</span> &nbsp;
                        <HelpTooltip title="The list of options for forward email's destination"/>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <CustomCreatableSelect
                        values={formData.forward_addresses}
                        onChange={values => setFormDataValue('forward_addresses', values)}
                      />
                    </GridItem>
                  </Grid>
                  <Grid container classes={{container: classes.marginBtm10}}>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Ignore list</span> &nbsp;
                        <HelpTooltip title="The regex patterns for email addresses whose emails are ignored by email processor"/>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <CustomCreatableSelect
                        values={formData.ignore_list}
                        onChange={values => setFormDataValue('ignore_list', values)}
                      />
                    </GridItem>
                  </Grid>
                  <Grid container classes={{container: classes.marginBtm10}}>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Labels</span> &nbsp;
                        <HelpTooltip title="The labels of emails to be processed in this queue"/>
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <CustomCreatableSelect
                        values={formData.filter_labels}
                        onChange={values => setFormDataValue('filter_labels', values)}
                      />
                    </GridItem>
                  </Grid>
                  <Grid container classes={{container: classes.marginBtm10}}>
                    <GridItem xs={6} md={3}>
                      <FormLabel classes={{root: classes.formLabel}}>
                        <span>Mailbox authorization</span> &nbsp;
                      </FormLabel>
                    </GridItem>
                    <GridItem xs={6} md={6}>
                      <span>{formData.mailbox_integrated ? 'Authorized' : 'Unauthorized'}</span>&nbsp;&nbsp;
                      <Button size="small" variant="contained" onClick={integrateMailbox}>Authorize mailbox</Button>
                    </GridItem>
                  </Grid>
                </React.Fragment>
              )}
              <Grid container classes={{container: classes.marginBtm10}}>
                <GridItem xs={6} md={3}>
                  <FormLabel classes={{root: classes.formLabel}}>
                    <span>Notification skip list</span> &nbsp;
                    <HelpTooltip title="The regex patterns for email addresses which new ticket notification is ignored"/>
                  </FormLabel>
                </GridItem>
                <GridItem xs={6} md={6}>
                  <CustomCreatableSelect
                    values={formData.skip_notification_list}
                    onChange={values => setFormDataValue('skip_notification_list', values)}
                  />
                </GridItem>
              </Grid>
              <Grid container>
                <Button type="submit" color="primary" variant="contained" size="large" className={classes.saveBtn}>Save</Button>
              </Grid>
            </ValidatorForm>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default withSnackbar(withStyles(settingsStyle)(QueueSettings));
