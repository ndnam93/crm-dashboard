import React, {useEffect, useState} from 'react';
import qs from 'qs';
import axios from 'axios';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from 'js/components/Table/TablePagination';
import {inquiriesStyle} from 'assets/jss/material-dashboard-react/views/ticketStyle';
import dayjs from 'dayjs';
import TransactionsSearchBox from './TransactionsSearchBox';

const tableColumns={
  'transaction_id'   : 'OID',
  'user_id'          : 'UID',
  'merchant_text'    : 'MID',
  'merchant_order_id': 'Merchant OID',
  'amount_text'      : 'Amount',
  'payment_system'   : 'System',
  'country'          : 'Country',
  'status'           : 'Status',
  'date'             : 'Date',
  'converted_text'   : 'C',
  'approved_text'    : 'A',
  'refunded_text'    : 'R',
  'pingback_text'    : 'P',
  'delivery_text'    : 'D',
  'attempt_text'     : 'At',
};

const Transactions = ({classes, ticket}) => {
  const {user_id, service_id} = ticket;
  const [params, setParams] = useState({
    to: dayjs().format('YYYY-MM-DD'),
    from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    limit: 20,
    page: 1,
    service_id,
    user_id,
  });
  const [data, setData] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, [qs.stringify(params)]);
  useEffect(() => {
    updateParam({user_id, service_id});
  }, [user_id, service_id])

  const formatData = (data) => {
    data.data = data.data.map(t => {
      t.merchant_text  = `[${t.merchant_id}] ${t.merchant_name}`;
      t.amount_text    = t.amount + ' ' + t.currency;
      t.approved_text  = t.approved ? 'Yes' : 'No';
      t.converted_text = t.converted ? 'Yes' : 'No';
      t.refunded_text  = t.refunded ? 'Yes' : 'No';
      t.attempt_text   = t.attempt ? 'Yes' : 'No';
      t.pingback_text  = t.pingback ? 'Yes' : 'No';
      t.delivery_text  = t.delivery ? 'Yes' : 'No';
      return t;
    });

    return data;
  }

  const fetchTransactions = async () => {
    setData({});
    const {user_id, service_id} = params;
    if (!service_id || !user_id) return;

    const query = qs.stringify(params);
    const {data} = await axios.get(`external-service/transactions?${query}`);
    data && setData(formatData(data));
  };

  const updateParam = newParams => {
    setParams({...params, ...newParams});
  };

  return (
    <div className={classes.tableContainer}>
      <TransactionsSearchBox {...{params, updateParam}} />
      <Table>
        <TableHead>
          <TableRow>
            {Object.values(tableColumns).map((title, key) => <TableCell key={key}>{title}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data && data.data.map((dataRow) => (
            <TableRow key={dataRow.transaction_id}>
              {Object.keys(tableColumns).map((col) => (
                  <TableCell key={col}>{dataRow[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TablePagination {...{tableColumns, data, updateParam}}/>
      </Table>
    </div>
  );
}

Transactions.propTypes = {
  ticket: PropTypes.object.isRequired,
};
export default withStyles(inquiriesStyle)(Transactions);
