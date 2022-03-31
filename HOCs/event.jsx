import React from 'react';
import _ from 'lodash';


export const withEvent = (WrappedComponent) =>
  class extends React.Component {
    // listeners that persist
    eventListeners = {};
    // listeners that are only called once
    onceEventListeners = {};

    constructor(props) {
      super(props);
      _.bindAll(this, ['addEventListener', 'addOnceEventListener', 'removeEventListener', 'dispatchEvent']);
    }

    addEventListener(event, callback) {
      this.eventListeners[event] || (this.eventListeners[event] = []);
      this.eventListeners[event].push(callback);
      return callback;
    }

    addOnceEventListener(event, callback) {
      this.onceEventListeners[event] || (this.onceEventListeners[event] = []);
      this.onceEventListeners[event].push(callback);
      return callback;
    }

    removeEventListener(event, callback) {
      _.pull(this.eventListeners[event], callback);
      _.pull(this.onceEventListeners[event], callback);
    }

    dispatchEvent(event, ...params) {
      this.eventListeners[event] && this.eventListeners[event].map(callback => callback(...params));
      if (this.onceEventListeners[event]) {
        this.onceEventListeners[event].map(callback => callback(...params));
        this.onceEventListeners[event] = [];
      }
    }

    render() {
      return (
          <WrappedComponent
            {...this.props}
            addEventListener={this.addEventListener}
            addOnceEventListener={this.addOnceEventListener}
            removeEventListener={this.removeEventListener}
            dispatchEvent={this.dispatchEvent}
          />
      );
    }
  }