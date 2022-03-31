import React from 'react';
import Menu from '@material-ui/core/Menu';

const CustomMenu = ({children, ...props}) =>
  <Menu
    MenuListProps={{dense: true, disablePadding: true}}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  >
    {children}
  </Menu>;

export default CustomMenu;