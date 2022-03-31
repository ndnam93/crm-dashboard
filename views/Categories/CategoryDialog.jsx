import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {ValidatorForm} from 'react-form-validator-core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import Checkbox from 'js/components/Checkbox/Checkbox';
import Category from 'js/services/category';
import TextValidator from 'js/components/CustomInput/TextValidator';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {ExternalServices} from 'js/services/external_service';
import {getOptionList} from 'js/common';
import {categoryDialogStyle} from 'assets/jss/material-dashboard-react/views/categoryStyle';

const defaultData = {
  is_transaction_id_mandatory: false,
  is_transaction_date_mandatory: false,
  is_active: true,
  assign_to: Category.ASSIGN_TO.AGENT,
  parent_id: '',
};

const CategoryDialog = ({data: initialData, open, onClose, onSubmit, classes}) => {
  const [data, setData] = useState({});
  const [isChild, setIsChild] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const isEditing = !!data.category_id;

  useEffect(() => {
    setData({...defaultData, ...initialData});
  }, [initialData]);
  useEffect(() => {
    if (!open || isEditing) return;

    setParentOptions([]);
    Category.getParentOptions({service_id: serviceId}).then(options => {
      setParentOptions([
        {value: '', label: ''},
        ...options,
      ]);
    });
  }, [open, isEditing]);
  useEffect(() => {
    setIsChild(!!data.parent_id);
  }, [data.parent_id]);

  const getAssignToOptions = () => {
    return getOptionList({
      [Category.ASSIGN_TO.AGENT]: ExternalServices[serviceId]['name'] + ' Agent',
      [Category.ASSIGN_TO.MERCHANT]: 'Merchant',
    });
  };

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

  const renderCheckbox = ({label, paramName, defaultValue = true}) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={data[paramName]}
            onChange={handleCheckBox(paramName)}
          />
        }
        label={label}
        className={classes.checkbox}
      />
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
            ? `Edit category #${data.category_id}`
            : `Add new category`
          }
        </DialogTitle>
        <DialogContent>
          <TextValidator
            name="name"
            labelText="Name"
            value={data.name || ''}
            formControlProps={{fullWidth: true}}
            inputProps={{
              onChange: handleChangeInput('name'),
            }}
            validators={['maxStringLength:255']}
            errorMessages={['Name must not exceed 255 characters']}
          />
          <TextValidator
            name="description"
            labelText="Description"
            value={data.description || ''}
            formControlProps={{fullWidth: true}}
            inputProps={{
              onChange: handleChangeInput('description'),
            }}
            validators={['maxStringLength:1000']}
            errorMessages={['Description must not exceed 1000 characters']}
          />
          {isChild && renderSelect({
            label: 'Automatically assign tickets in this category to',
            paramName: 'assign_to',
            options: getAssignToOptions(),
          })}
          {!isEditing && renderSelect({
            label: 'Parent',
            paramName: 'parent_id',
            options: parentOptions,
          })}
          {isChild && renderCheckbox({
            label: 'Transaction ID mandatory',
            paramName: 'is_transaction_id_mandatory',
            defaultValue: false,
          })}
          {isChild && renderCheckbox({
            label: 'Transaction date mandatory',
            paramName: 'is_transaction_date_mandatory',
            defaultValue: false,
          })}
          {renderCheckbox({
            label: 'Active',
            paramName: 'is_active',
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">Save</Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
};


CategoryDialog.propTypes = {
  data: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(categoryDialogStyle)(CategoryDialog);
