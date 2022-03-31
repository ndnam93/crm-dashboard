import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import Clear from '@material-ui/icons/Clear';
import Check from '@material-ui/icons/Check';

import customInputStyle from 'assets/jss/material-dashboard-react/components/customInputStyle';

function CustomInput(props) {
  const {classes, id, formControlProps = {}, labelText, labelProps, inputProps: {classes: inputClasses, ...additionalInputProps},
    helperText, helperProps, error, success, select, children} = props;

  const labelClasses = classNames({
    [' ' + classes.labelRootError]: error,
    [' ' + classes.labelRootSuccess]: success && !error,
    [labelProps && labelProps.className]: true,
  });
  // const underlineClasses = classNames({
  //   [classes.underlineError]: error,
  //   [classes.underlineSuccess]: success && !error,
  //   [classes.underline]: true
  // });
  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  const inputProps = {
    classes: {
      root: marginTop,
      disabled: classes.disabled,
      // underline: underlineClasses,
      ...inputClasses
    },
    id,
    endAdornment: props.icon ? <props.icon/> : null,
    ...additionalInputProps
  };

  return (
    <FormControl
      {...formControlProps}
      className={formControlProps.className + ' ' + classes.formControl}
    >
      {labelText !== undefined &&
        <InputLabel
          {...labelProps}
          classes={{root: classes.labelRoot + labelClasses}}
          htmlFor={id}
        >
          {labelText}
        </InputLabel>
      }

      {select ? <Select {...inputProps}>{children}</Select> : <Input {...inputProps}/>}

      {error && <Clear className={classes.feedback + ' ' + classes.labelRootError} />
        || success && <Check className={classes.feedback + ' ' + classes.labelRootSuccess} />
      }
      
      {helperText && <FormHelperText {...helperProps}>{helperText}</FormHelperText>}
    </FormControl>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool
};

export default withStyles(customInputStyle)(CustomInput);
