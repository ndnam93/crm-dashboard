import React from 'react';
import qs from 'qs';
import axios from 'axios/index';
import _ from 'lodash';
import { HotKeys } from 'react-hotkeys';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {ValidatorForm} from 'react-form-validator-core';
import TextValidator from 'js/components/CustomInput/TextValidator';
import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import Grid from '@material-ui/core/Grid/Grid';
import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import Button from 'js/components/CustomButtons/Button';
import CardFooter from 'js/components/Card/CardFooter';
import {withAuth} from 'js/HOCs/auth';
import {withSnackbar} from 'js/HOCs/snackbar';
import {history} from 'js/common';
import ExternalService from 'js/services/external_service';

import loginStyle from 'assets/jss/material-dashboard-react/views/loginStyle';
import {Link} from 'react-router-dom';

const PASSPORT_SERVICE_ID_STORAGE_KEY = 'passport_login_service_id';

const keyMap = {
  TOGGLE_SIMPLE_LOGIN: "ctrl+alt+space",
};

class Login extends React.Component {
  state = {
    services: [],
    service_id: this.props.is_admin ? undefined : 6,
    email: null,
    password: null,
    enableSimpleLogin: false,
  };
  cancelTokenSources = [];
  hotKeysHandlers = {
    TOGGLE_SIMPLE_LOGIN: () => this.setState({enableSimpleLogin: !this.state.enableSimpleLogin}),
  };

  componentDidMount() {
    const {id_token} = qs.parse(this.props.location.search.slice(1)) || {};
    const service_id = window.localStorage.getItem(PASSPORT_SERVICE_ID_STORAGE_KEY);
    service_id && this.setState({service_id});
    window.localStorage.removeItem(PASSPORT_SERVICE_ID_STORAGE_KEY);
    id_token && this.props.auth.signIn({
      id_token,
      service_id,
      is_admin: this.props.is_admin,
    }).then(response => {
      this.redirect();
    }).catch(e => {
      this.props.openSnackBar('Unable to login via Passport\nReason: ' + e.response.data.message);
    });
    if (!this.props.is_admin) {
      ExternalService.getOptions({is_active: true}).then(services => this.setState({services}));
    }
  }

  componentWillUnmount() {
    this.cancelTokenSources.forEach(source => source.cancel());
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !_.isEqual(nextState, this.state) || !_.isEqual(nextProps.auth.userInfo, this.props.auth.userInfo);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.auth.userInfo && !_.isEqual(prevProps.auth.userInfo, this.props.auth.userInfo)) {
      this.redirect();
    }
  }

  async fetchToState(stateKey, url) {
    const cancelTokenSource = axios.CancelToken.source();
    this.cancelTokenSources.push(cancelTokenSource);
    const response = await axios.get(url, {
      cancelToken: cancelTokenSource.token,
    });
    this.setState({
      [stateKey]: response.data
    });
  }

  submitForm = () => {
    if (!this.state.email || !this.state.password) return;

    this.props.auth.signIn(_.pick(this.state, ['email', 'password', 'service_id'])).then(() => {
      this.redirect();
    }).catch(error => {
      error.response && this.props.openSnackBar(error.response.data.message);
    });
  }

  setInputState = (name, value) => {
    this.setState({
      [name]: value,
      [name + 'Error']: !value,
    });
  }

  loginWithPassport = () => {
    if (this.state.service_id) {
      window.localStorage.setItem(PASSPORT_SERVICE_ID_STORAGE_KEY, this.state.service_id);
    }
    window.location = window.PASSPORT_AUTH_URL + '/oauth/v2/authorize?response_type=id_token&redirect_uri=' + encodeURI(window.location.origin + window.location.pathname);
  }

  redirect = () => {
    history.push('/dashboard/tickets');
  }

  render() {
    const {classes} = this.props;
    return (
        <HotKeys keyMap={keyMap} handlers={this.hotKeysHandlers} >
          <Grid container className={classes.gridContainer}>
            <GridItem xs={10} sm={7} md={5} lg={4}>
              <Card>
                <ValidatorForm onSubmit={e => this.submitForm()} debounceTime={500}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <img src={require('assets/img/pw_logo.png')} alt="PW Logo"/>
                    <h4>CRM system {this.props.is_admin && 'admin'} login</h4>
                  </CardHeader>
                  <CardBody>
                    <Grid container>
                      {!this.props.is_admin && (
                        <GridItem xs={12} sm={12} md={12}>
                          <FormControl fullWidth>
                            <InputLabel htmlFor="service-select">Select client</InputLabel>
                            <Select
                              value={this.state.service_id}
                              onChange={event => this.setState({service_id: event.target.value})}
                              inputProps={{
                                name: 'service_id',
                                id: 'service-select'
                              }}
                            >
                              {this.state.services.map((options) => (
                                <MenuItem key={options.value} value={options.value}>{options.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                      )}
                      {this.state.enableSimpleLogin && (
                        <GridItem xs={12} sm={12} md={12}>
                          <TextValidator
                            name="email"
                            labelText="Email"
                            value={this.state.email}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: (event) => this.setInputState('email', event.target.value),
                              autoFocus: true,
                              error: this.state.emailError,
                            }}
                            icon={MailIcon}
                            validators={['isEmail']}
                            errorMessages={['Email is not valid.']}
                          />
                        </GridItem>
                      )}
                      {this.state.enableSimpleLogin && (
                        <GridItem xs={12} sm={12} md={12}>
                          <TextValidator
                            name="password"
                            value={this.state.password}
                            labelText="Password"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: 'password',
                              onChange: (event) => this.setInputState('password', event.target.value),
                              error: this.state.passwordError,
                            }}
                            icon={LockIcon}
                            validators={['required']}
                            errorMessages={['Password is required.']}
                          />
                        </GridItem>
                      )}
                    </Grid>
                  </CardBody>
                  <CardFooter>
                    <Grid container>
                      {this.state.enableSimpleLogin && (
                        <GridItem xs={12}>
                          <Button color="primary" fullWidth type="submit">Login</Button>
                        </GridItem>
                      )}
                      <GridItem xs={12}>
                        <Button color="success" fullWidth onClick={this.loginWithPassport}>Login via Passport</Button>
                      </GridItem>
                      {this.props.is_admin
                        ? (
                          <GridItem>
                            <Link to='/dashboard/guest/login' className={classes.adminLoginLink}>Go to agent login</Link>
                          </GridItem>
                        ) : (
                          <GridItem>
                            <Link to='/dashboard/guest/admin-login' className={classes.adminLoginLink}>Go to admin login</Link>
                          </GridItem>
                        )
                      }
                    </Grid>
                  </CardFooter>
                </ValidatorForm>
              </Card>
            </GridItem>
          </Grid>
        </HotKeys>
    );
  }
}

export default withSnackbar(withAuth(withStyles(loginStyle)(Login)));
