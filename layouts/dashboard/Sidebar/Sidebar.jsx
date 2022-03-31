import React, {useContext} from 'react';
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ArrowBack from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForward from '@material-ui/icons/ArrowForwardIosRounded';
// core components
import sidebarStyle from 'assets/jss/material-dashboard-react/components/sidebarStyle';
import {AuthContext} from 'js/HOCs/auth';
import SidebarItem from './SidebarItem';

const Sidebar = (props) => {
  const { classes, color, logo, image, logoText, routes } = props;
  const {auth: {userInfo, signOut}} = useContext(AuthContext);

  return (
    <div>
      <button
        className={classNames({
          [classes.toggleButton]: true,
          [classes.toggleButtonClose]: props.open,
          [classes.toggleButtonOpen]: !props.open,
        })}
        onClick={props.handleDrawerToggle}
        title={props.open ? 'Close drawer' : 'Open drawer'}
      >
        {props.open ? <ArrowBack/> : <ArrowForward/>}
      </button>

      <Drawer
        anchor="left"
        variant="persistent"
        open={props.open}
        classes={{
          paper: classes.drawerPaper
        }}
        onClose={props.handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
      >
        <div className={classes.logo}>
          <a href="/" className={classes.logoLink}>
            <div className={classes.logoImage}>
              <img src={logo} alt="logo" className={classes.img} />
            </div>
            {logoText}
          </a>
        </div>
        <div className={classes.profileWrapper}>
          <img src="/images/placeholder-user.png" className={classes.avatar}/>
          <span className={classes.adminName}>
            {userInfo && (`${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim() || userInfo.email)}
            <a onClick={signOut} className={classes.logoutButton}>Logout</a>
          </span>
        </div>
        <div className={classes.sidebarWrapper}>
          <List className={classes.list}>
            {routes.map((route, key) => <SidebarItem route={route} key={key} color={color}/>)}
          </List>
        </div>
        {image &&
          <div
            className={classes.background}
            style={{ backgroundImage: "url(" + image + ")" }}
          />
        }
      </Drawer>
    </div>
  );
};

export default withStyles(sidebarStyle)(Sidebar);
