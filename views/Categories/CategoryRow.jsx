import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import IconButton from 'js/components/CustomButtons/IconButton';
import {categoryStyle} from 'assets/jss/material-dashboard-react/views/categoryStyle';

let CategoryRow = ({data, openDialog, classes}) => {
  const isChild = !!data.parent_id;
  const rootClass = classNames({
    [classes.categoryRow]: true,
    [classes.childCategory]: isChild,
  });
  const categoryNameClass = classNames({
    [classes.categoryName]: true,
    'inactive': !data.is_active,
  });

  return (
    <React.Fragment>
      <div className={rootClass}>
        <span className={categoryNameClass}>{data.name}</span>
        <div className={classes.toolBox}>
          {!isChild && <IconButton size="small" title="Add child category" onClick={() => openDialog({parent_id: data.category_id})}>
            <AddIcon/>
          </IconButton>}
          <IconButton size="small" title="Edit" onClick={() => openDialog(data)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
      {data.children && data.children.map(category => <CategoryRow key={category.category_id} data={category} openDialog={openDialog}/>)}
    </React.Fragment>
  )
};

CategoryRow = withStyles(categoryStyle)(CategoryRow);
CategoryRow.propTypes = {
  data: PropTypes.object.isRequired,
  openDialog: PropTypes.func.isRequired,
};

export default CategoryRow;
