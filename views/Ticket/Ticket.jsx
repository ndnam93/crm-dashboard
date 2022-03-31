import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid/Grid';
import GridItem from 'js/components/Grid/GridItem';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import {AuthConsumer} from 'js/HOCs/auth';
import GlobalEvent from 'js/services/global_event';
import NotFoundPage from 'js/views/404';

import Events from 'js/variables/events';
import Ticket from 'js/services/ticket';
import TicketAttachment from 'js/services/ticket_attachment';
import ProblemDetails from './ProblemDetails/ProblemDetails';
import MessageBox from './MessageBox/MessageBox';
import Attachments from './Attachments/Attachments';
import AdminNotes from './AdminNotes/AdminNotes';
import TicketTabs from './Tabs/TicketTabs';
import StatusButtons from './StatusButtons';
import TicketMenu from './TicketMenu/TicketMenu';
import {ticketStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import {toLocalTime} from 'js/common';

class TicketPage extends React.Component {
  state = {
    ticket: null,
    ticketId: this.props.match.params.ticket_id,
    attachments: [],
  };

  componentDidMount() {
    const {ticketId} = this.state;
    this.fetchTicket(ticketId);
    this.fetchAttachments();

    this.ticketUpdatedListener = GlobalEvent.addListener(Events.TicketUpdated, updatedTicket => {
      (updatedTicket.ticket_id == ticketId) && this.fetchTicket(ticketId);
    });
    this.attachmentAddedListener = GlobalEvent.addListener(Events.TicketAttachmentAdded, (ticket_id, addedAttachments) => {
      (ticket_id == ticketId) && this.setState({
        attachments: [...this.state.attachments, ...addedAttachments]
      });
    });
  }

  componentWillUnmount() {
    GlobalEvent.removeListener(Events.TicketUpdated, this.ticketUpdatedListener);
    GlobalEvent.removeListener(Events.TicketAttachmentAdded, this.attachmentAddedListener);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {ticket_id: ticketId} = this.props.match.params;
    if (ticketId != prevProps.match.params.ticket_id) {
      this.setState({
        ticketId,
        ticket: {},
        attachments: [],
      }, () => {
        this.componentWillUnmount();
        this.componentDidMount();
      })
    }
  }

  fetchTicket = async (ticketId) => {
    try {
      const ticket = await Ticket.get(ticketId, {with: ['transferredToTickets', 'transferredFromTicket']});
      this.setState({ticket});
    } catch (error) {
      if (error.response.status == 404) {
        this.setState({ticket: false});
      }
    }
  }

  async fetchAttachments() {
    this.setState({
      attachments: await TicketAttachment.getList(this.state.ticketId),
    });
  }

  render() {
    const {classes} = this.props;
    const {ticket, attachments} = this.state;
    if (ticket === null) return null;

    return ticket === false
      ? <NotFoundPage/>
      : (
        <Grid container>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader
                action={<TicketMenu ticket={ticket}/>}
                plain color="primary"
              >
                <h4 className={classes.cardTitleWhite}>Inquiry #{this.props.match.params.ticket_id} {toLocalTime(ticket.created_at, 'MMM DD, YYYY')} - {ticket.status_text}</h4>
                <StatusButtons ticket={ticket}/>
              </CardHeader>
              <CardBody>
                <Grid container>
                  <GridItem xs={12} sm={4} md={4} className={classes.ticketDetailsArea}>
                    <GridItem xs={12} sm={12} md={12}>
                      <ProblemDetails ticket={ticket} />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <Attachments ticket={ticket} attachments={attachments}/>
                    </GridItem>
                  </GridItem>
                  <GridItem xs={12} sm={8} md={8}>
                    <GridItem xs={12} sm={12} md={12}>
                      <TicketTabs ticket={ticket} />
                    </GridItem>
                    <Grid container className={classes.communicationArea}>
                      <GridItem xs={12} sm={6} md={6}>
                        <MessageBox ticket={ticket} attachments={attachments}/>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={6}>
                        <AdminNotes ticket={ticket} />
                      </GridItem>
                    </Grid>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )
    ;
  }
}

export default withStyles(ticketStyle)(TicketPage);
