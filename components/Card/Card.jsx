import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// @material-ui/core components
import Card from '@material-ui/core/Card';
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import cardStyle from 'assets/jss/material-dashboard-react/components/cardStyle';

function CustomCard({ ...props }) {
  const {classes, className, children, plain, profile, chart, ...rest} = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    [className]: className !== undefined
  });

  return (
    <Card className={cardClasses} {...rest}>
      {children}
    </Card>
  );
}

CustomCard.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool
};

export default withStyles(cardStyle)(CustomCard);
