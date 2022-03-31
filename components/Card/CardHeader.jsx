import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import CardHeader from '@material-ui/core/CardHeader';
// core components
import cardHeaderStyle from 'assets/jss/material-dashboard-react/components/cardHeaderStyle';

function CustomCardHeader({ ...props }) {
  const {classes, className, children, color, plain, stats, icon, ...rest} = props;
  const rootClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + "CardHeader"]]: color,
    [classes.cardHeaderPlain]: plain,
    [classes.cardHeaderStats]: stats,
    [classes.cardHeaderIcon]: icon,
    [className]: className !== undefined
  });

  return (
    <CardHeader
      classes={{
        root: rootClasses,
        title: classes.cardHeaderTitle,
      }}
      {...rest}
      title={children || rest.title}
    />
  );
}

CustomCardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary", "rose"]),
  plain: PropTypes.bool,
  stats: PropTypes.bool,
  icon: PropTypes.bool
};

export default withStyles(cardHeaderStyle)(CustomCardHeader);
