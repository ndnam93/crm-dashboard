import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ValidatorForm} from 'react-form-validator-core';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import Checkbox from 'js/components/Checkbox/Checkbox';
import Admin from 'js/services/admin';
import ExternalService from 'js/services/external_service';
import TextValidator from 'js/components/CustomInput/TextValidator';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import {adminDialogStyle} from 'assets/jss/material-dashboard-react/views/adminsStyle';


const roleOptions = _.pick(Admin.ROLE_TEXT, [Admin.ROLE.MANAGER, Admin.ROLE.AGENT]);

const AdminDialog = ({data: initialData, open, onClose, onSubmit, classes}) => {
  const roleText = Admin.ROLE_TEXT[initialData.role];
  const [data, setData] = useState({});
  const [services, setServices] = useState([]);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const {auth: {userInfo}} = useContext(AuthContext);
  const isEditing = !!data.admin_id;

  useEffect(() => {
    const filters = isEditing ? null : {is_active: true};
    ExternalService.getOptions(filters).then(setServices);
  }, [isEditing]);
  useEffect(() => {
    const defaultData = {
      team: Admin.TEAM.USER_SUPPORT,
      is_active: true,
      service_id: serviceId || services[0] && services[0].value,
    };
    setData({
      ...defaultData,
      ...initialData,
    });
  }, [initialData, serviceId, services]);

  const handleChangeInput = name => event => {
    setData({
      ...data,
      [name]: event.target.value,
    });
  };

  const handleCheckBox = name => event => {
    setData({
      ...data,
      [name]: event.target.checked,
    });
  };

  const onFormSubmit = event => {
    onSubmit(data);
  };

  const renderSelect = ({label, paramName, options, selectProps}) => {
    return (
      <TextField
        select
        fullWidth
        label={label}
        name={paramName}
        onChange={handleChangeInput(paramName)}
        value={data[paramName]}
        SelectProps={{native: true, ...selectProps}}
        className={classes.select}
      >
        {options.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
      </TextField>
    );
  };

  return (
    <Dialog
      scroll="body"
      open={open}
      onClose={onClose}
      aria-labelledby="form-title"
      fullWidth
    >
      <ValidatorForm onSubmit={onFormSubmit}>
        <DialogTitle id="form-title">
          {isEditing
            ? `Edit ${roleText} #${data.admin_id}`
            : `Add new ${roleText}`
          }
        </DialogTitle>
        <DialogContent>
          <TextValidator
            name="email"
            labelText="Email"
            value={data.email || ''}
            formControlProps={{fullWidth: true}}
            inputProps={{
              onChange: handleChangeInput('email'),
              disabled: isEditing,
            }}
            validators={['required', 'isEmail', 'maxStringLength:50']}
            errorMessages={['Email is required', 'Invalid email', 'Email must not exceed 50 characters']}
          />
          <TextValidator
            name="firstname"
            labelText="First name"
            value={data.firstname || ''}
            formControlProps={{fullWidth: true}}
            inputProps={{
              onChange: handleChangeInput('firstname'),
            }}
            validators={['maxStringLength:50']}
            errorMessages={['First name must not exceed 50 characters']}
          />
          <TextValidator
            name="lastname"
            labelText="Last name"
            value={data.lastname || ''}
            formControlProps={{fullWidth: true}}
            inputProps={{
              onChange: handleChangeInput('lastname'),
            }}
            validators={['maxStringLength:50']}
            errorMessages={['Last name must not exceed 50 characters']}
          />
          {!serviceId && data.role != Admin.ROLE.ADMIN && renderSelect({
            label: 'Client',
            paramName: 'service_id',
            options: services,
            selectProps: {disabled: isEditing},
          })}
          {isEditing && data.role != Admin.ROLE.ADMIN && userInfo && userInfo.hasPermission(Admin.PERMISSION.EDIT_USER_ROLE) && renderSelect({
            label: 'Role',
            paramName: 'role',
            options: _.transform(roleOptions, (result, label, value) => {
              result.push({value, label: _.capitalize(label)});
            }, [])
          })}
          {data.role == Admin.ROLE.AGENT && renderSelect({
            label: 'Team',
            paramName: 'team',
            options: _.transform(Admin.TEAM_TEXT, (result, label, value) => {
              result.push({label, value});
            }, []),
          })}
          <FormControlLabel
            control={
              <Checkbox
                checked={data.is_active}
                defaultValue={0}
                onChange={handleCheckBox('is_active')}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">Save</Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}

AdminDialog.propTypes = {
  data: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(adminDialogStyle)(AdminDialog);
