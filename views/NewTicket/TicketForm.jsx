import React, {useState, useEffect, useContext} from 'react';
import Select from 'react-select';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import GridItem from 'js/components/Grid/GridItem';
import CustomInput from 'js/components/CustomInput/CustomInput';
import {AuthContext} from 'js/HOCs/auth';
import Admin from 'js/services/admin';
import ExternalService from 'js/services/external_service';
import Ticket from 'js/services/ticket';
import {createOption} from 'js/common';
import CategorySelect from 'js/components/CustomInput/CategorySelect';
import {newTicketStyle} from 'assets/jss/material-dashboard-react/views/newTicketStyle';


const TicketForm = props => {
  const {classes, params, updateParam} = props;
  const {auth: {userInfo}} = useContext(AuthContext);
  const [adminOptions, setAdminOptions] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    ExternalService.getOptions({is_active: true}).then(setServices);
  }, [])
  useEffect(() => {
    const service_id = parseInt(params.service_id);
    const filters = service_id ? {service_id} : null;
    Admin.getOptions(filters).then(setAdminOptions);
  }, [params.service_id]);

  const handleInputChange = name => event => updateParam(name, event.target.value);

  const renderInput = ({paramName, select, options, inputProps, labelProps, formControlProps, ...rest}) => {
    return (
      <CustomInput
        labelText=''
        labelProps={{className: classes.inputLabel, ...labelProps}}
        formControlProps={{
          className: classes.formControl,
          fullWidth: true,
          ...formControlProps
        }}
        inputProps={{
          ...inputProps,
          value: params[paramName] || '',
          onChange: handleInputChange(paramName),
          native: select,
          classes: {[select ? 'select' : 'input']: classes.textField},
        }}
        helperProps={{
          classes: {root: classes.helperText}
        }}
        {...rest}
        {...(select && options && {
          select,
          children: [{label: '', value: ''}, ...options].map(option => <option key={option.value} value={option.value}>{option.label}</option>)
        })}
      />
    );
  };

  return (
    <Grid container>
      <GridItem xs={6} sm={12} md={6} className={classes.gridItem}>
        {renderInput({
          labelText: 'Ticket Type',
          paramName: 'type',
          select: true,
          options: Ticket.TYPE_OPTIONS,
          inputProps: {
            disabled: userInfo && userInfo.role == Admin.ROLE.AGENT,
          }
        })}
        {renderInput({
          labelText: 'Ticket Subject',
          paramName: 'subject',
        })}
        {renderInput({
          labelText: 'User Email',
          paramName: 'user_email',
          inputProps: {type: 'email', required: params.type != Ticket.TYPE.MERCHANT},
        })}
        {renderInput({
          labelText: 'Merchant Email',
          paramName: 'merchant_email',
          inputProps: {type: 'email', required: params.type == Ticket.TYPE.MERCHANT},
        })}
        {renderInput({
          labelText: 'Transaction ID',
          paramName: 'transaction_id',
          inputProps: {type: 'number'},
        })}
      </GridItem>
      <GridItem xs={6} sm={12} md={6} className={classes.gridItem}>
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel shrink>Assignee</InputLabel>
          <Select
            isSearchable
            className={classes.assigneeSelect}
            options={adminOptions}
            onChange={option => updateParam('assignee_id', option.value)}
          />
        </FormControl>
        {/*<FormControl fullWidth className={classes.formControl}>
          <InputLabel shrink>Category</InputLabel>
          <CategorySelect
            serviceId={params.service_id}
            value={params.category_id}
            onChange={value => updateParam('category_id', value)}
          />
        </FormControl>*/}
        {renderInput({
          labelText: 'User External ID',
          paramName: 'user_id',
          inputProps: {type: 'number'},
        })}
        {renderInput({
          labelText: 'Merchant External ID',
          paramName: 'merchant_id',
          inputProps: {type: 'number'},
        })}
        {renderInput({
          labelText: 'Transaction Date',
          paramName: 'transaction_date',
          inputProps: {type: 'date'},
          labelProps: {shrink: true},
        })}
      </GridItem>
      <GridItem xs={12} sm={12} md={12} className={classes.gridItem}>
        {renderInput({
          labelText: 'Message',
          paramName: 'message',
          inputProps: {multiline: true, rows: 3},
        })}
        {userInfo && userInfo.role == Admin.ROLE.ADMIN && renderInput({
          labelText: 'Select Client',
          paramName: 'service_id',
          select: true,
          options: services,
          inputProps: {required: true},
        })}
        <Button type='submit' variant='contained' color='primary' className={classes.btnSubmit}>Submit</Button>
      </GridItem>
    </Grid>
  );
}

export default withStyles(newTicketStyle)(TicketForm);
