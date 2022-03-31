import React, {useEffect, useState} from 'react';
import Drawer from '@material-ui/core/Drawer';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid/Grid';
import GridItem from 'js/components/Grid/GridItem';
import CustomInput from 'js/components/CustomInput/CustomInput';
import Checkbox from 'js/components/Checkbox/Checkbox';
import Button from 'js/components/CustomButtons/Button';
import Admin from 'js/services/admin';
import Ticket from 'js/services/ticket';
import {getOptionList} from 'js/common';

import {searchBoxStyles} from 'assets/jss/material-dashboard-react/views/ticketsStyle';
import withStyles from '@material-ui/core/styles/withStyles';



const SearchDrawer = (props) => {
  const [params, setParams] = useState(props.params);
  const [adminOptions, setAdminOptions] = useState([]);
  const {classes} = props;

  useEffect(() => {
    Admin.getOptions().then(setAdminOptions);
  }, []);
  useEffect(() => {
    setParams(props.params);
  }, [props.params])

  const handleChange = name => event => {
    const value = event.target ? event.target.value : event;
    setParams({
      ...params,
      page: 1,
      [name]: value,
    });
  };

  const handleCheckBox = name => event => {
    setParams({
      ...params,
      [name]: event.target.checked ? 1 : undefined,
    });
  };

  const submit = () => {
    props.updateParam(params);
    props.onClose();
  };

  const reset = () => {
    props.onReset && props.onReset();
    setParams(props.params);
  };

  /** Render text or select input **/
  const renderInput = ({paramName, select, options, inputProps, ...rest}) => {
    return (
      <CustomInput
        labelText=""
        labelProps={{className: classes.inputLabel}}
        formControlProps={{className: classes.formControl}}
        inputProps={{
          ...inputProps,
          value: params[paramName] || '',
          onChange: handleChange(paramName),
          native: select,
          classes: {[select ? 'select' : 'input']: classes.input},
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
  
  const renderCheckBox = ({paramName, labelText}) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={!!params[paramName]}
          defaultValue={0}
          onChange={handleCheckBox(paramName)}
        />
      }
      label={labelText}
      classes={{root: classes.formControlLabel}}
    />
  );

  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <Grid container classes={{container: classes.container}}>
        <GridItem xs={12} sm={6} md={6}>
          {renderInput({
            labelText: 'Inquiry ID',
            paramName: 'ticket_id',
            inputProps: {type: 'number'},
          })}
          {renderInput({
            labelText: 'User Email',
            paramName: 'user_email',
          })}
          {renderInput({
            labelText: 'Merchant Email',
            paramName: 'merchant_email',
          })}
          {renderInput({
            labelText: 'Subject',
            paramName: 'subject',
          })}
          {renderInput({
            labelText: 'Transaction ID',
            paramName: 'transaction_id',
            inputProps: {type: 'number'},
          })}
          {renderInput({
            labelText: 'User ID',
            paramName: 'user_id',
            inputProps: {type: 'number'},
          })}
          {renderCheckBox({
            labelText: 'Headless',
            paramName: 'is_headless',
          })}
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          {renderInput({
            labelText: 'Author Type',
            paramName: 'author_type',
            select: true,
            options: Ticket.AUTHOR_TYPE_OPTIONS,
          })}
          {renderInput({
            labelText: 'Source',
            paramName: 'source',
            select: true,
            options: Ticket.SOURCE_OPTIONS,
          })}
          {renderInput({
            labelText: 'Assigned To',
            paramName: 'assignee_id',
            select: true,
            options: adminOptions,
          })}
          {renderInput({
            labelText: 'Created Date From',
            paramName: 'created_after',
            inputProps: {type: 'date'},
            labelProps: {shrink: true},
          })}
          {renderInput({
            labelText: 'Created Date To',
            paramName: 'created_before',
            inputProps: {type: 'date'},
            labelProps: {shrink: true},
          })}
          {renderInput({
            labelText: 'Merchant ID',
            paramName: 'merchant_id',
            inputProps: {type: 'number'},
          })}
          {renderCheckBox({
            labelText: 'Transferred',
            paramName: 'is_transferred',
          })}
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Select
            isMulti
            className={classes.statusSelect}
            options={Ticket.STATUS_OPTIONS}
            placeholder="Status"
            value={params.status}
            onChange={handleChange('status')}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Button variant="contained" color="primary" onClick={submit} className={classes.searchBtn}>Search</Button>
          <Button variant="contained" color="warning" onClick={reset} className={classes.searchBtn}>Reset</Button>
        </GridItem>
      </Grid>
    </Drawer>
  );
}

SearchDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  updateParam: PropTypes.func.isRequired,
  onReset: PropTypes.func,
};

export default withStyles(searchBoxStyles)(SearchDrawer);
