import React, { useState } from 'react';
import PropType from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import CustomInput from 'js/components/CustomInput/CustomInput';
import GridItem from 'js/components/Grid/GridItem';

import {searchBoxStyles} from 'assets/jss/material-dashboard-react/views/ticketStyle';


const TransactionsSearchBox = (props) => {
  const [params, setParams] = useState(props.params);
  const {classes} = props;

  const handleChange = name => event => {
    const value = event.target ? event.target.value : event;
    setParams({
      ...params,
      page: 1,
      [name]: value,
    });
  };
  const submit = () => props.updateParam(params);

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

  return (
      <Grid container classes={{container: classes.container}}>
        <GridItem xs={12} sm={12} md={12}>
          {renderInput({
            labelText: "Merchant OID",
            paramName: "merchant_order_id",
          })}
          {renderInput({
            labelText: "From",
            paramName: "from",
            inputProps: {type: "date"},
            labelProps: {shrink: true},
          })}
          {renderInput({
            labelText: "To",
            paramName: "to",
            inputProps: {type: "date"},
            labelProps: {shrink: true},
          })}
          <Button variant="contained" color="primary" size="small" onClick={submit} style={{marginTop: 11, minWidth: 40}}>
            <SearchIcon fontSize="small" />
          </Button>
        </GridItem>
      </Grid>
  );
};

TransactionsSearchBox.propTypes = {
  updateParam: PropType.func.isRequired,
  params: PropType.object.isRequired,
};
export default withStyles(searchBoxStyles)(TransactionsSearchBox);
