import _ from 'lodash';

const eventListeners = {};

const addListener = (event, callback) => {
  eventListeners[event] || (eventListeners[event] = []);
  eventListeners[event].push(callback);
  return callback;
};

const removeListener = (event, callback) => {
  if (_.isArray(callback)) {
    callback.forEach(callbackItem => removeListener(event, callbackItem));
    return;
  }
  _.pull(eventListeners[event], callback);
};

const dispatch = (event, ...params) => {
  eventListeners[event] && eventListeners[event].map(callback => callback(...params));
};

export default {
  addListener,
  removeListener,
  dispatch,
};

