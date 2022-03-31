import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from 'js/components/Menu/Menu';


class CardMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuAnchor: null,
    }
    _.bindAll(this, ['openMenu', 'closeMenu']);
  }

  openMenu(event) {
    this.setState({ menuAnchor: event.currentTarget });
  }

  closeMenu() {
    this.setState({ menuAnchor: null });
  }

  render() {
    const {menuAnchor} = this.state;
    const id = this.props.id || ('card-menu-' + Math.random());

    return (
      <div>
        <IconButton
          aria-owns={menuAnchor ? id : undefined}
          aria-haspopup="true"
          onClick={this.openMenu}
        >
          <MoreVertIcon/>
        </IconButton>

        <Menu
          anchorOrigin={{vertical:'top', horizontal: 'right'}}
          getContentAnchorEl={null}
          id={id} anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={this.closeMenu}>
          {this.props.children}
        </Menu>
      </div>
    );
  }
}

CardMenu.propTypes = {
  id: PropTypes.string,
};

export default CardMenu;
