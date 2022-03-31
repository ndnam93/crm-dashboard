import React from 'react';
import TablePagination from '@material-ui/core/es/TablePagination/TablePagination';
import TablePaginationActions from 'js/components/Table/TablePaginationActions';
import TableFooter from '@material-ui/core/es/TableFooter/TableFooter';
import TableRow from '@material-ui/core/TableRow';


export default ({tableColumns, data, updateParam}) =>
  <TableFooter>
    <TableRow>
      <TablePagination
        colSpan={Object.values(tableColumns).length}
        count={data.total ? data.total/1 : 0}
        rowsPerPage={data.per_page ? data.per_page/1 : 0}
        page={(data.current_page - 1) || 0}
        rowsPerPageOptions={[20, 50, 100]}
        onChangePage={(e, page) => updateParam({'page': page + 1})}
        onChangeRowsPerPage={e => updateParam({'per_page': e.target.value})}
        ActionsComponent={TablePaginationActions}
      />
    </TableRow>
  </TableFooter>
;
