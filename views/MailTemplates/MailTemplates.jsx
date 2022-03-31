import React, {useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import ClientSelectWarning from 'js/components/Snackbar/ClientSelectWarning';
import Admin from 'js/services/admin';
import MailTemplate from 'js/services/mail_template';
import {getOptionList} from 'js/common';
import {AuthContext} from 'js/HOCs/auth';
import {settingsStyle} from 'assets/jss/material-dashboard-react/views/settingsStyle';


const defaultFormData = {
  type: 0,
  subject: '',
  body: '',
};

const MailTemplates = ({classes}) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isPristine, setIsPristine] = useState(true);
  const [disableSaveBtn, setDisableSaveBtn] = useState(false);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    MailTemplate.getTypes().then(typeMap => {
      setTemplateTypes(getOptionList(typeMap));
    });
  }, []);
  useEffect(() => {
    serviceId && MailTemplate.getList({service_id: serviceId}).then(templates => {
      setFormData(templates[0]);
      templates = _.keyBy(templates, 'type');
      setTemplates(templates);
      setIsPristine(true);
    });
  }, [serviceId]);

  const setFormDataValue = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleInputChange = name => event => {
    const value = event.target.value;
    setFormDataValue(name, value);
    setIsPristine(false);
  };

  const handleTypeChange = event => {
    if (!isPristine && !confirm('You have unsaved changes. Do you want to discard them?')) {
      return;
    }
    const newType = event.target.value;
    setFormData(templates[newType] || {...defaultFormData, type: newType});
    setIsPristine(true);
  };

  const submit = async event => {
    event.preventDefault();
    setDisableSaveBtn(true);
    try {
      const params = _.pick(formData, ['type', 'subject', 'body']);
      params.service_id = serviceId;
      const updatedTemplate = await MailTemplate.update(params);
      setTemplates({
        ...templates,
        [updatedTemplate.type]: updatedTemplate,
      });
      setFormData(updatedTemplate);
      setIsPristine(true);
    } catch (e) {
      alert(Object.values(e.response.data.error).join('\n'));
    }
    setDisableSaveBtn(false);
  };

  return (
    <React.Fragment>
      <ServiceSelector />
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>Mail templates</h4>
        </CardHeader>
        <CardBody>
          {!serviceId && auth.userInfo && auth.userInfo.role == Admin.ROLE.ADMIN ? (
            <ClientSelectWarning />
          ) : (
            <form onSubmit={submit} method="POST">
              <Grid container>
                <GridItem xs={6} md={2}>
                  <FormLabel classes={{root: classes.formLabel}}><span>Template type</span></FormLabel>
                </GridItem>
                <GridItem xs={6} md={10}>
                  <Select
                    value={formData.type}
                    onChange={handleTypeChange}
                    className={classes.textInput}
                  >
                    {templateTypes.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </GridItem>
              </Grid>
              <Grid container>
                <GridItem xs={6} md={2}>
                  <FormLabel classes={{root: classes.formLabel}}><span>Subject</span></FormLabel>
                </GridItem>
                <GridItem xs={6} md={10}>
                  <Input value={formData.subject} onChange={handleInputChange('subject')} className={classes.textInput} required/>
                </GridItem>
              </Grid>
              <Grid container>
                <GridItem xs={6} md={2}>
                  <FormLabel classes={{root: classes.formLabel}}><span>Body</span></FormLabel>
                </GridItem>
                <GridItem xs={6} md={10}>
                  <Input
                    value={formData.body}
                    onChange={handleInputChange('body')}
                    className={classes.textInput}
                    classes={{input: classes.templateBodyInput}}
                    multiline={true}
                    rows={30}
                    required
                  />
                </GridItem>
              </Grid>
              <Grid container>
                <Button type="submit" color="primary" variant="contained" size="large" className={classes.saveBtn} disabled={disableSaveBtn}>Save</Button>
              </Grid>
            </form>
          )}
        </CardBody>
      </Card>
    </React.Fragment>
  );
};


export default withStyles(settingsStyle)(MailTemplates);
