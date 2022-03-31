import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Search from '@material-ui/icons/Search';
// core components
import CustomInput from 'js/components/CustomInput/CustomInput';
import Button from 'js/components/CustomButtons/Button';

import headerLinksStyle from 'assets/jss/material-dashboard-react/components/headerLinksStyle';

import {withAuth} from 'js/HOCs/auth';

class HeaderLinks extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          anchorElForProfileMenu: null,
      };
  }

  handleProfileClick(event) {
    this.setState({ anchorElForProfileMenu: event.currentTarget });
  }

  handleProfileClose() {
    this.setState({ anchorElForProfileMenu: null });
  }

  searchBox() {
    const { classes } = this.props;
    return (
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search/>
        </Button>
      </div>
    );
  }

  render() {
    const { classes, auth: {userInfo, signOut} } = this.props;
    const { anchorElForProfileMenu } = this.state;

    return (
      <div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          size={window.innerWidth > 959 ? 'sm' : null}
          simple={!(window.innerWidth > 959)}
          className={classes.buttonLink}
          aria-label="Person"
          aria-owns={anchorElForProfileMenu ? 'profile-menu' : null}
          aria-haspopup
          onClick={e => this.handleProfileClick(e)}
        >
          <Person className={classes.icons}/>
          <Hidden mdUp>
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Menu
          id="profile-menu"
          anchorEl={anchorElForProfileMenu}
          open={Boolean(anchorElForProfileMenu)}
          onClose={() => this.handleProfileClose()}
        >
          <MenuItem>{userInfo && userInfo.email}</MenuItem>
          <MenuItem onClick={signOut}>Sign out</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withAuth(withStyles(headerLinksStyle)(HeaderLinks));
