import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from 'js/HOCs/auth';



const PrivateRoute = ({ component: Component, ...rest }) => {
  const {auth: {userInfo, isLoadingUser, isPristine}} = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        userInfo || isLoadingUser || isPristine ? (
          <Component {...props} />
        ) : (
          <Redirect to='/dashboard/guest/login'/>
        )
      }
    />
  );
}

export default PrivateRoute;
