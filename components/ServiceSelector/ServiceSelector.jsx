import React, {useContext, useEffect, useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ExternalService from 'js/services/external_service';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import Admin from 'js/services/admin';
import serviceSelectorStyle from 'assets/jss/material-dashboard-react/components/serviceSelectorStyle';


const ServiceSelector = ({classes}) => {
  const [services, setServices] = useState([]);
  const {auth} = useContext(AuthContext);
  const {serviceSelect: {serviceId, setServiceId}} = useContext(ServiceSelectContext);

  useEffect(() => {
    ExternalService.getOptions({is_active: true}).then(setServices);
  }, []);

  return !auth.userInfo || auth.userInfo.role != Admin.ROLE.ADMIN
    ? null
    : (
    <div className={classes.container}>
      <label htmlFor="service-select" className={classes.label}>Select Client:</label>
      <Select
        value={serviceId}
        onChange={event => setServiceId(event.target.value/1)}
        inputProps={{
          id: 'service-select'
        }}
        classes={{root: classes.select}}
      >
        <MenuItem value="0">All clients</MenuItem>
        {services.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </div>
  );
}


export default withStyles(serviceSelectorStyle)(ServiceSelector);
