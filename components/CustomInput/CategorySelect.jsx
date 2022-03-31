import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Category from 'js/services/category';
import {categorySelectStyle} from 'assets/jss/material-dashboard-react/components/customInputStyle';


const CategorySelect = ({value, onChange, serviceId, classes}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState({value: 0, label: ''});
  useEffect(() => {
    serviceId && Category.getOptions({service_id: serviceId}).then(setOptions);
  }, [serviceId]);
  useEffect(() => {
    for (let optionGroup of options) {
      const option = _.find(optionGroup.options, {value});
      if (option) {
        setSelectedOption(option);
        break;
      }
    }
  }, [value, options]);

  const handleChange = option => {
    onChange && onChange(option.value);
  };

  return (
    <Select
      isSearchable
      className={classes.categorySelect}
      options={options}
      value={selectedOption}
      onChange={handleChange}
    />
  )
};

CategorySelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default withStyles(categorySelectStyle)(CategorySelect);
