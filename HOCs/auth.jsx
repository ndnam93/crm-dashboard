import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {withEvent} from 'js/HOCs/event';
import Admin from 'js/services/admin';


const defaultState = {
  isPristine: true,
  isLoadingUser: false,
  userInfo: null,
  error: null,
  getUserInfo: () => true,
  signIn: () => true,
  signOut: () => true,
};
const AuthContext = React.createContext(defaultState);
const {Provider, Consumer} = AuthContext;


class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    _.bindAll(this, ['getUserInfo', 'signIn', 'signOut', 'handleFailedRequest', 'refreshAccessToken']);

    this.state = {
      ...defaultState,
      // isLoadingUser: true,
      getUserInfo: (refresh = false) => new Promise(resolve => {
        // All other getUserInfo calls should defer after the initial one
        setTimeout(async () => resolve(await this.getUserInfo(refresh)));
      }),
      signIn: this.signIn,
      signOut: this.signOut,
    };
    this.accessToken = null;
    this.isRefreshing = false;

    // Refresh expired access token
    axios.interceptors.response.use(null, this.handleFailedRequest);

    this.storeAccessToken(window.localStorage.access_token);
  }

  handleFailedRequest(error) {
    const { config: originalRequest, response: { status } } = error;

    if (!this.accessToken || status != 401) {
      return Promise.reject(error);
    }

    if (!this.isRefreshing) {
      this.refreshAccessToken();
    }

    return new Promise((resolve, reject) => {
      this.props.addEventListener('tokenRefreshed', token => {
        if (!token) {
          reject(error);
          return;
        }
        // replace the expired token and retry
        originalRequest.headers.Authorization = 'Bearer ' + token;
        resolve(axios(originalRequest));
      });
    });
  }

  storeAccessToken(token) {
    if (token) {
      axios.defaults.headers.common.Authorization = 'Bearer ' +  token;
      window.localStorage.setItem('access_token', token);
    } else {
      axios.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem('access_token');
    }
    this.accessToken = token;
  }

  async refreshAccessToken() {
    this.isRefreshing = true;
    const axiosInstance = axios.create();
    let accessToken;
    try {
      accessToken = (await axiosInstance.get('/auth/refresh')).data.access_token;
      this.storeAccessToken(accessToken);
    } catch (error) {
      this.signOut();
    }
    this.isRefreshing = false;
    this.props.dispatchEvent('tokenRefreshed', accessToken);
    return accessToken;
  }

  async signIn(params) {
    params = _.omitBy(params, _.isNil);
    const {data: {access_token}} = await axios.post('/auth/login', params);
    this.storeAccessToken(access_token);
    await this.getUserInfo();
    return access_token;
  }

  componentDidMount() {
    // Initial auth status check/User info fetching
    this.getUserInfo();
  }

  async getUserInfo(refresh = false) {
    if (!refresh && this.state.userInfo) {
      return this.state.userInfo;
    }
    if (this.state.isLoadingUser) {
      return new Promise(resolve => {
        this.props.addOnceEventListener('userInfoFetched', function(userInfo) {
          resolve(userInfo);
        });
      });
    }

    this.setState({isLoadingUser: true, isPristine: false});
    let userInfo;
    try {
      userInfo = await Admin.getProfile();
      this.props.dispatchEvent('userInfoFetched', userInfo);
    } catch (error) {
      this.setState({error});
    }
    this.setState({userInfo, isLoadingUser: false});
    return userInfo;
  }

  signOut() {
    axios.get('/auth/logout');
    this.setState({userInfo: null, isLoadingUser: false});
    this.storeAccessToken(null);
  }

  render() {
    return (
      <Provider value={{auth: {...this.state, accessToken: this.accessToken}}}>
        {this.props.children}
      </Provider>
    );
  }
}

AuthProvider = withEvent(AuthProvider);

export {AuthContext, AuthProvider, Consumer as AuthConsumer, defaultState};

export const withAuth = WrappedComponent => props =>
  <Consumer>
    {authProps => <WrappedComponent {...authProps} {...props}/>}
  </Consumer>
