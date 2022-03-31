import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/lib/Creatable';
import _ from 'lodash';

import {createOption} from 'js/common';


const CustomCreatableSelect = ({suggestedOptions = [], values, onChange, className, placeholder = ''}) => {
  const [textValue, setTextValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const valuesClone = _.isArray(values) ? [...values] : [];
    if (_.isEmpty(_.xor(valuesClone, selectedValues))) return;

    setSelectedValues(valuesClone);
    setSelectedOptions(valuesClone.map(createOption));
  }, [values]);

  useEffect(() => {
    onChange && onChange(selectedValues);
  }, [selectedValues]);

  const handleSelectedOptionsChanged = selectedOptions => {
    setSelectedOptions(selectedOptions);
    setSelectedValues(selectedOptions.map(option => option.value))
  };

  const addNewValue = () => {
    if (!textValue) return;

    const newValues = _.uniq([...selectedValues, textValue]);
    setTextValue('');
    setSelectedOptions(newValues.map(createOption));
    setSelectedValues(newValues);
  };

  const handleKeyDown = event => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        addNewValue();
        event.preventDefault();
    }
  };

  return (
    <CreatableSelect
      inputValue={textValue}
      isCrearable
      isMulti
      onChange={handleSelectedOptionsChanged}
      onInputChange={setTextValue}
      onKeyDown={handleKeyDown}
      onBlur={addNewValue}
      options={suggestedOptions}
      value={selectedOptions}
      placeholder={placeholder}
      className={className}
    />
  );
};


CustomCreatableSelect.propTypes = {
  suggestedOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  values: PropTypes.array,
  onChange: PropTypes.func,
};

export default CustomCreatableSelect;
