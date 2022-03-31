import React from 'react';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import makeStyles from '@material-ui/styles/makeStyles';

import {history, getOptionList} from 'js/common';
import Card from 'js/components/Card/Card';
import CardBody from 'js/components/Card/CardBody';
import TicketsTable from './TicketsTable';
import Ticket from 'js/services/ticket';
import SearchDrawer from './SearchDrawer';
import {withServiceSelect} from 'js/HOCs/service_select';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import {ticketsStyles} from 'assets/jss/material-dashboard-react/views/ticketsStyle';
import {tableContainer} from 'assets/jss/material-dashboard-react/components/tableStyle';


const initialStatuses = [
  Ticket.STATUS.NEW,
  Ticket.STATUS.IN_PROGRESS,
];

const getStatusOption = statuses => getOptionList(_.pick(Ticket.STATUS_TEXT, statuses));

const getParams = ({status, ...params}) => {
  const searchParams = _.omitBy(params, param => param === '');
  searchParams.status = _.isArray(status) ? status.map(t => t.value) : undefined;
  return searchParams;
};

const StyledTicketsTable = props => <TicketsTable {...props} classes={makeStyles(tableContainer)()}/>


class Tickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: this.getDefaultParams(),
      tickets: {data: []},
      openSearchDrawer: false,
    }
  }

  componentDidMount = () => this.fetchTickets(getParams(this.state.params));

  shouldComponentUpdate = (nextProps, nextState) =>
    !_.isEqual(nextState, this.state)
    || this.props.location != nextProps.location
    || this.props.serviceSelect.serviceId != nextProps.serviceSelect.serviceId;

  componentDidUpdate = (prevProps, prevState) => {
    if (!(_.isEqual(prevProps, this.props) && _.isEqual(prevState.params, this.state.params))) {
      const params = getParams(this.state.params);
      // const query = qs.stringify(params, {arrayFormat: 'brackets'});
      // history.push(this.props.location.pathname + `?${query}`);
      this.fetchTickets(params);
    }
  }

  getDefaultParams = (additionalParams = {}) => {
    return {
      // ...qs.parse(this.props.location.search.substr(1)) || {},
      ...additionalParams,
      status: getStatusOption(additionalParams.statuses || initialStatuses),
      sort: {
        field: 'status_changed_date',
        direction: 'asc',
        ...additionalParams.sort,
      },
    }
  };

  fetchTickets = async ({...params}) => {
    const {serviceSelect: {serviceId}} = this.props;
    params.service_id = serviceId || undefined;
    params.type = this.props.ticket_type;
    params.status.map(option => option.value);
    const tickets = await Ticket.getList(params);
    this.setState({tickets});
  };

  handleChangeType = type => this.setState({params: this.getDefaultParams({type})});

  updateParam = params => this.setState({params: {...this.state.params, ...params}});

  resetParams = () => this.setState({params: this.getDefaultParams()});

  toggleSearchDrawer = () => this.setState({openSearchDrawer: !this.state.openSearchDrawer});

  handleChangeStatus = (value) => {
    this.updateParam({
      page: 1,
      status: value
    });
  };

  render = () => {
    const {classes} = this.props;
    return (
      <React.Fragment>
        <ServiceSelector />
        <Card>
          <CardBody>
            <Select
              isMulti
              className={classes.statusSelect}
              options={Ticket.STATUS_OPTIONS}
              placeholder="Filter Status"
              value={this.state.params.status}
              onChange={this.handleChangeStatus}
            />
            <Button className={classes.openFilterBtn} onClick={this.toggleSearchDrawer}>Filter</Button>
            {/*<Button color="primary" component={Link} to="/dashboard/new-ticket"><AddIcon /> Add ticket</Button>*/}
            <SearchDrawer
              open={this.state.openSearchDrawer}
              onClose={this.toggleSearchDrawer}
              params={this.state.params}
              updateParam={this.updateParam}
              onReset={this.resetParams}
            />
            {this.state.tickets.data && <StyledTicketsTable
              updateParam={this.updateParam}
              {...this.state}
            />}
          </CardBody>
        </Card>
      </React.Fragment>
    );
  };
}

export default withServiceSelect(withStyles(ticketsStyles)(Tickets));
