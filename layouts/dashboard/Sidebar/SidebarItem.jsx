import React, {useContext, useEffect, useState} from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {AuthContext} from 'js/HOCs/auth';
import Ticket from 'js/services/ticket';

import sidebarStyle from 'assets/jss/material-dashboard-react/components/sidebarStyle';

const TEAM_TO_TYPE = _.invert(Ticket.TYPE_TO_TEAM);


let SidebarItem = props => {
  const {route, classes, color} = props;
  const isActive = activeRoute(route);
  const {auth: {userInfo}} = useContext(AuthContext);
  const [openSubMenu, setOpenSubMenu] = useState(isActive);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  let subMenuRef = React.createRef();

  useEffect(() => {
    toggleSubmenu(openSubMenu);
  }, [userInfo]);

  // verifies if route or one of its children is active
  function activeRoute(route) {
    if (route.subRoutes) {
      for (let subRoute of route.subRoutes) {
        if (activeRoute(subRoute)) return true;
      }
    }
    return props.location.pathname.indexOf(route.path) > -1;
  }

  function checkAccess(route) {
    if (route.accessControl && userInfo) {
      const {permission, team} = route.accessControl;
      if (permission && _.difference(permission, _.intersection(permission, userInfo.permissions)).length > 0) return false;
      if (team && userInfo.team && userInfo.team != team) return false;
    }
    return true;
  }

  function toggleSubmenu(open = true) {
    const subMenuEl = subMenuRef.current;
    if (!subMenuEl) return;

    if (open) {
      subMenuEl.style.height = subMenuHeight + 'px';
      setTimeout(() => {
        subMenuEl.style.height = null;
      }, 200);
    } else {
      setSubMenuHeight(subMenuEl.offsetHeight);
      subMenuEl.style.height = subMenuEl.offsetHeight + 'px';
      setTimeout(() => {
        subMenuEl.style.height = '0px';
      }, 0);
    }
    setOpenSubMenu(open);
  }

  if (!route.sidebarName || (route.accessControl && !userInfo) || !checkAccess(route)) return null;

  const listItemClasses = classNames({
    [" " + classes[color]]: isActive
  });
  const whiteFontClasses = classNames({
    [" " + classes.whiteFont]: isActive
  });

  const WrapperComponent = route.subRoutes ? ({activeClassName, to, ...props}) => <div {...props}/> : NavLink;

  return (
    <div className={classes.sidebarItem}>
      <WrapperComponent
        to={route.path}
        className={classes.item}
        activeClassName="active"
        onClick={() => toggleSubmenu(!openSubMenu)}
      >
        <ListItem button className={classes.itemLink + listItemClasses}>
          {route.icon && <ListItemIcon className={classes.itemIcon + whiteFontClasses}>
            <route.icon />
          </ListItemIcon>}
          <ListItemText
            primary={route.sidebarName}
            className={classes.itemText + whiteFontClasses}
            disableTypography={true}
          />
        </ListItem>
      </WrapperComponent>
      {route.navItemButton && <route.navItemButton/> }
      {route.subRoutes &&
      <div className={classNames({[classes.subMenu]: true})} ref={subMenuRef}>
        {route.subRoutes.map((subRoute, key) => <SidebarItem key={key} route={subRoute} color={color}/>)}
      </div>
      }
    </div>
  );
};

SidebarItem = withRouter(withStyles(sidebarStyle)(SidebarItem));
SidebarItem.propTypes = {
  route: PropTypes.object.isRequired
};

export default SidebarItem;
