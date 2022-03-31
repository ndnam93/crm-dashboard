import _ from 'lodash';
import { createBrowserHistory } from 'history';
import dayjs from 'dayjs';
import React from 'react';

export const history = createBrowserHistory();

export const createOption = label => ({
  label,
  value: label,
});

export const getOptionList = valueMap => _.transform(valueMap, (result, label, value) => {
  result.push({label, value});
}, [])

export const toLocalTime = (timeStr, format = 'DD-MM-YYYY, hh:mm A') => timeStr && dayjs.utc(timeStr).local().format(format);
