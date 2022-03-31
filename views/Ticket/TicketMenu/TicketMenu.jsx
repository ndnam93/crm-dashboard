import React, {useState} from 'react';
import PropTypes from 'prop-types';
import TransferIcon from '@material-ui/icons/NearMe';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditIcon from '@material-ui/icons/Edit';

import Ticket from 'js/services/ticket';
import TicketTransferDialog from './TicketTransferDialog';
import TicketEditDialog from './TicketEditDialog';
import TransferToMerchantDialog from './TransferToMerchantDialog';
import CardMenu from 'js/components/Menu/CardMenu';



const TicketMenu = ({ticket}) => {
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openTransferToMerchantDialog, setOpenTransferToMerchantDialog] = useState(false);
  const [openTicketEditDialog, setOpenTicketEditDialog] = useState(false);
  const cardMenu = React.createRef();

  const openDialog = setter => {
    setter(true);
    cardMenu.current.closeMenu();
  };

  const handleOpenTransferDialog = () => openDialog(setOpenTransferDialog);
  const handleOpenTicketEditDialog = () => openDialog(setOpenTicketEditDialog);
  const handleOpenTransferToMerchantDialog = () => openDialog(setOpenTransferToMerchantDialog);

  return (
    <React.Fragment>
      <CardMenu ref={cardMenu}>
        <MenuItem onClick={handleOpenTransferDialog}>
          <ListItemIcon><TransferIcon /></ListItemIcon>Transfer ticket
        </MenuItem>
        <MenuItem onClick={handleOpenTicketEditDialog}>
          <ListItemIcon><EditIcon /></ListItemIcon>Edit ticket details
        </MenuItem>
        {ticket.type == Ticket.TYPE.PAYMENT && <MenuItem onClick={handleOpenTransferToMerchantDialog}>
          <ListItemIcon><TransferIcon /></ListItemIcon>Transfer to merchant
        </MenuItem>}
      </CardMenu>

      <TicketTransferDialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} ticket={ticket}/>
      <TicketEditDialog open={openTicketEditDialog} onClose={() => setOpenTicketEditDialog(false)} ticket={ticket}/>
      <TransferToMerchantDialog open={openTransferToMerchantDialog} onClose={() => setOpenTransferToMerchantDialog(false)} ticket={ticket}/>
    </React.Fragment>
  );
}

TicketMenu.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default TicketMenu;