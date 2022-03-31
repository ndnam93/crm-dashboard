import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { ValidatorComponent } from 'react-form-validator-core';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import NativeSelect from '@material-ui/core/NativeSelect';
// core components
import customInputStyle from 'assets/jss/material-dashboard-react/components/customInputStyle';

class TextValidator extends ValidatorComponent {

  state = {
    ...this.state,
    isPristine: true,
  };

  errorText = () => this.state.isValid
    ? null
    : <div className={this.props.classes.errorText}>
        {this.getErrorMessage()}
      </div>
  ;

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    if (this.props.value != prevState.value) {
      // _.isFunction(this.props.onChange) && this.props.onChange(this.props.value);
      this.setState({isPristine: false});
    }
  }

  render() {
    const {classes, formControlProps = {}, labelText, id, select, children, labelProps, inputProps, value} = this.props;
    const {isValid, isPristine} = this.state;

    const labelClasses = classNames({
      [" " + classes.labelRootError]: !isValid,
      [" " + classes.labelRootSuccess]: !isPristine && isValid
    });
    const underlineClasses = classNames({
      [classes.underlineError]: !isValid,
      [classes.underlineSuccess]: !isPristine && isValid,
      [classes.underline]: true
    });
    const marginTop = classNames({
      [classes.marginTop]: labelText === undefined
    });

    const InputComponent = select ? NativeSelect : Input;
    return (
      <FormControl
        {...formControlProps}
        className={formControlProps.className + " " + classes.formControl}
      >
        {labelText !== undefined ? (
          <InputLabel
            className={classes.labelRoot + labelClasses}
            htmlFor={id}
            {...labelProps}
          >
            {labelText}
          </InputLabel>
        ) : null}

        <InputComponent
          classes={{
            root: marginTop,
            disabled: classes.disabled,
            underline: select ? undefined : underlineClasses,
          }}
          id={id}
          endAdornment={this.props.icon ? <this.props.icon/> : null}
          value={value || ''}
          {...inputProps}
        >
          {select && children ? children : null}
        </InputComponent>

        {this.errorText()}
      </FormControl>
    );
  }
}
TextValidator.propTypes = {
  classes: PropTypes.object.isRequired,
  select: PropTypes.bool,
  children: PropTypes.node,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  validators: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
  errorMessages: PropTypes.array,
};

export default withStyles(customInputStyle)(TextValidator);
