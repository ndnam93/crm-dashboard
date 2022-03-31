import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Grid from '@material-ui/core/Grid/Grid';
import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';

import loginStyle from 'assets/jss/material-dashboard-react/views/loginStyle';


const NotFoundPage = ({classes}) =>
    <Grid container className={classes.gridContainer}>
      <GridItem xs={10} sm={7} md={5} lg={4}>
        <Card>
          <CardHeader color="primary" className={classes.cardHeader}>
            <img src={require('assets/img/pw_logo.png')} alt="PW Logo"/>
            <h4>404</h4>
          </CardHeader>
          <CardBody>
            <Grid container>
              <GridItem xs={12} sm={12} md={12}>
                <p>Page not found</p>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>

NotFoundPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(loginStyle)(NotFoundPage);