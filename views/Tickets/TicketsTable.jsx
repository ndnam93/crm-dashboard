import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from 'js/components/Table/TablePagination';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import ExternalService from 'js/services/external_service';



const getOpposite = direction => direction == 'asc' ? 'desc' : 'asc';

const TicketsTable = (props) => {
  const {
    classes, tickets, updateParam,
    params: {sort: {field: sortFieldParam, direction: sortDirectionParam}}
  } = props;
  const {serviceSelect} = useContext(ServiceSelectContext);
  const tableColumns = [
    {field: 'ticket_id', sortField: 'ticket_id', sortable: true, label: 'Inquiry ID'},
    {field: 'subject', sortable: false, label: 'Subject'},
    {field: 'status_text', sortField: 'status', sortable: true, label: 'Status'},
    {field: 'source_text', label: 'Source'},
    {field: 'assignee_name', sortField: 'assignee_id', sortable: true, label: 'Assigned To'},
    {field: 'wait_time', sortField: 'status_changed_date', sortable: true, label: 'Wait time'},
  ];
  const [services, setServices] = useState([]);

  useEffect(() => {
    ExternalService.getOptions().then(services => {
      services = _.mapValues(_.keyBy(services, 'value'), 'label');
      setServices(services);
    });
  }, []);

  const renderHeadCells = ({field, label, sortable, sortField}) => {
    const isFieldSorted = sortFieldParam === sortField;
    const opposite = getOpposite(sortDirectionParam);
    const direction = field == 'wait_time' ? opposite : sortDirectionParam;
    return sortable
      ? <TableCell
          key={field}
          sortDirection={isFieldSorted && direction}
        >
          <TableSortLabel
            active={isFieldSorted}
            direction={direction}
            onClick={e => props.updateParam({page: 1, sort: {field: sortField, direction: field == 'wait_time' ? direction : opposite}})}
          >
            {label}
          </TableSortLabel>
        </TableCell>
      : <TableCell key={field}>{label}</TableCell>
    ;
  };

  const renderTableRow = (() => {
      const fields = tableColumns.slice(2).map(col => col.field);
      return (dataRow, index) =>
        <TableRow key={index}>
          <TableCell>
            <Link to={`/dashboard/ticket/${dataRow.ticket_id}`}>{dataRow.ticket_id}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/dashboard/ticket/${dataRow.ticket_id}`}>{dataRow.subject || '<empty subject>'}</Link>
          </TableCell>
          {fields.map(field => <TableCell key={field}>{dataRow[field]}</TableCell>)}
          {serviceSelect.serviceId ? null : <TableCell>{services[dataRow.service_id]}</TableCell>}
        </TableRow>
      ;
    })();
  ;

  return tickets.data
    ? <Table classes={{root: classes.tableContainer}}>
        <TableHead>
          <TableRow>
            {tableColumns.map(renderHeadCells)}
            {serviceSelect.serviceId ? null : <TableCell>Client</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.data.map(renderTableRow)}
        </TableBody>
        <TablePagination {...{tableColumns, data: tickets, updateParam}}/>
      </Table>
    : null
  ;
}

TicketsTable.propTypes = {
  updateParam: PropTypes.func.isRequired,
  params: PropTypes.object,
  tickets: PropTypes.object,
};
export default TicketsTable;
