import React from 'react';
import {Route} from 'react-router';
import _ from 'lodash';


const renderRoutes = routes => {
  return routes && routes.map((route, i) => {
    if (route.path) {
      const routeProps = _.pick(route, ['path', 'exact', 'strict']);
      return (
        <Route
          {...routeProps}
          key={route.path}
          render={props => route.render
            ? route.render({...props, ...route.extraProps, route})
            : <route.component {...props} {...route.extraProps} route={route}/>
          }
        />
      );
    }
    if (route.subRoutes) {
      return renderRoutes(route.subRoutes);
    }
  });
};

export default renderRoutes;
