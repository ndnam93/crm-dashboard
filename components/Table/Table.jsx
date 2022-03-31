import React from 'react';
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/es/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/es/TablePagination/TablePagination';

import tableStyle from 'assets/jss/material-dashboard-react/components/tableStyle';
import TablePaginationActions from 'js/components/Table/TablePaginationActions';

function CustomTable({...props}) {
  const {classes, tableColumns, tableData = {data: []}, tableHeaderColor, onChangePage, onChangeRowsPerPage} = props;
  const emptyRows = tableData.per_page - tableData.data.length;

  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
          <TableRow className={classes.tableHeadRow}>
            {Object.values(tableColumns).map((prop, key) => {
              return (
                <TableCell
                  className={classes.tableCell + " " + classes.tableHeadCell}
                  key={key}
                >
                  {prop}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.data.map((dataRow, index) => {
            return (
              <TableRow key={index} className={classes.tableBodyRow}>
                {Object.keys(tableColumns).map((colName, index) => {
                  return (
                    <TableCell className={classes.tableCell} key={index}>
                      {dataRow[colName]}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {emptyRows > 0 && (
            <TableRow>
              <TableCell colSpan={Object.values(tableColumns).length} />
            </TableRow>
          )}
        </TableBody>
        {tableData.per_page && tableData.total && (
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={Object.values(tableColumns).length}
                count={tableData.total || 0}
                rowsPerPage={tableData.per_page || 0}
                page={(tableData.current_page - 1) || 0}
                rowsPerPageOptions={[20, 50, 100]}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
          )}
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableColumns: PropTypes.object.isRequired,
  tableData: PropTypes.object,
};

export default withStyles(tableStyle)(CustomTable);
