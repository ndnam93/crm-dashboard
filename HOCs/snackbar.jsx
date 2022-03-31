import React from 'react';
import Snackbar from 'js/components/Snackbar/Snackbar';
import _ from 'lodash';

/**
 * Adds SnackBar to component and provide methods to control it
 * @param initialSnackBarProps object Overrides the default SnackBar config
 */
export const withSnackbar = (WrappedComponent, initialSnackBarProps = {}) =>
  class extends React.Component {
    constructor(props) {
      super(props);
      initialSnackBarProps = {
        place: 'tc',
        color: 'danger',
        autoHideDuration: 4000,
        ...initialSnackBarProps,
      };
      this.state = {
        open: false,
        message: '',
        snackBarProps: initialSnackBarProps,
      };
      _.bindAll(this, ['openSnackBar', 'closeSnackBar']);
    }

    /**
     * Show SnackBar
     * @param snackBarMsg string|array The message to be displayed
     * @param snackBarProps object One-time SnackBar config
     */
    openSnackBar(message = '', snackBarProps = {}) {
      if (Array.isArray(message)) {
        message = message.join('\r\n');
      }
      this.setState({
        open: true,
        message,
        snackBarProps: {
          ...initialSnackBarProps,
          ...snackBarProps,
        },
      });
    }

    closeSnackBar() {
      this.setState({
        open: false,
        message: '',
      });
    }

    render() {
      const {snackBarProps} = this.state;
      return (
        <div>
          <WrappedComponent
            {...this.props}
            openSnackBar={this.openSnackBar}
            closeSnackBar={this.closeSnackBar}
          />
          <Snackbar
            place={snackBarProps.place}
            color={snackBarProps.color}
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={snackBarProps.autoHideDuration}
            onClose={() => this.closeSnackBar()}
          />
        </div>
      );
    }
  }
;
