import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TicketLog from 'js/services/ticket_log';

import {logStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';

const tableColumns = {
  'created_at_text': 'Datetime',
  'action_text'    : 'Action',
  'description'    : 'Description',
  'caller_name'    : 'Caller',
};


const TicketLogs = ({classes, ticket: {ticket_id}}) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs([]);
    ticket_id && TicketLog.getList({ticket_id}).then(logs => setLogs(logs));
  }, [ticket_id]);

  return (
    <Table classes={{root: classes.tableContainer}}>
      <TableHead>
        <TableRow>
          {Object.values(tableColumns).map((title, key) => <TableCell key={key}>{title}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {logs && logs.map((dataRow) => (
          <TableRow key={dataRow.ticket_log_id}>
            {Object.keys(tableColumns).map((col) => (
              <TableCell key={col}>{dataRow[col]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

TicketLogs.propTypes = {
  ticket: PropTypes.object,
}
export default withStyles(logStyle)(TicketLogs);
