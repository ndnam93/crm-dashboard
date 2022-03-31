import React, {useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import withStyles from '@material-ui/core/styles/withStyles';

import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import Category from 'js/services/category';
import CategoryRow from './CategoryRow';
import {categoryStyle} from 'assets/jss/material-dashboard-react/views/categoryStyle';
import ClientSelectWarning from 'js/components/Snackbar/ClientSelectWarning';
import {withSnackbar} from 'js/HOCs/snackbar';
import CategoryDialog from './CategoryDialog';


const Categories = ({openSnackBar, classes}) => {
  const {serviceSelect: {serviceId}} = useContext(ServiceSelectContext);
  const [categories, setCategories] = useState([]);
  const [dialogData, setDialogData] = useState({});
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  useEffect(() => {
    serviceId && fetchCategories();
  }, [serviceId]);

  const fetchCategories = () => {
    Category.getAll({
      service_id: serviceId,
      include_inactive: true,
    }).then(setCategories);
  };

  const openDialog = data => {
    data = _.pick(data, ['category_id', 'name', 'description', 'assign_to', 'is_transaction_id_mandatory', 'is_transaction_date_mandatory', 'is_active', 'parent_id']);
    data = _.omitBy(data, _.isNil);
    setDialogData(data);
    setDialogIsOpen(true);
  };

  const onDialogSubmit = async ({category_id, ...data}) => {
    try {
      if (category_id) {
        await Category.update(category_id, data);
      } else {
        data.service_id = serviceId;
        await Category.create(data);
      }
      setDialogIsOpen(false);
      fetchCategories();
    } catch (error) {
      openSnackBar(_.values(error.response.data.error).join('\n'));
    }
  };

  return (
    <React.Fragment>
      <ServiceSelector />
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>Categories</h4>
          {serviceId ? (
            <Fab color="primary" className={classes.addButton} size="small" onClick={() => openDialog({})} title="Add category">
              <AddIcon />
            </Fab>
          ) : null}
        </CardHeader>
        <CardBody className={classes.cardBody}>
          {!serviceId ? (
            <ClientSelectWarning />
          ) : (
            <div className={classes.categoriesContainer}>
              {_.isEmpty(categories) ? (
                <p>No categories available</p>
              ) : categories.map(category => <CategoryRow key={category.category_id} data={category} openDialog={openDialog}/>)}
            </div>
          )}
        </CardBody>
      </Card>
      <CategoryDialog data={dialogData} open={dialogIsOpen} onClose={() => setDialogIsOpen(false)} onSubmit={onDialogSubmit}/>
    </React.Fragment>
  );
}

export default withSnackbar(withStyles(categoryStyle)(Categories));
