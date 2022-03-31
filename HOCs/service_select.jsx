import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from './auth';


const ServiceSelectContext = React.createContext({
  serviceSelect: {
    serviceId: 0,
    setServiceId: () => true,
  },
});
const {Provider, Consumer} = ServiceSelectContext;


const ServiceSelectProvider = (props) => {
  const [serviceId, setServiceId] = useState(0);
  const {auth} = useContext(AuthContext);

  useEffect(() => {
    // Set service id when log in as manager
    if (!serviceId && auth.userInfo && auth.userInfo.service_id) {
      setServiceId(auth.userInfo.service_id);
    }
  }, [auth.userInfo]);

  return (
    <Provider value={{serviceSelect: {serviceId, setServiceId}}}>
      {props.children}
    </Provider>
  );
}

export {ServiceSelectContext, ServiceSelectProvider, Consumer as ServiceSelectConsumer};

export const withServiceSelect = WrappedComponent => props =>
  <Consumer>
    {(contextProps) => (
      <WrappedComponent {...contextProps} {...props}/>
    )}
  </Consumer>
;
