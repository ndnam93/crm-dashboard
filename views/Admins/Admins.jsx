import React, {useContext, useEffect, useState} from 'react';
import _ from 'lodash';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import Checkbox from 'js/components/Checkbox/Checkbox';
import IconButton from 'js/components/CustomButtons/IconButton';
import Admin from 'js/services/admin';
import TablePagination from 'js/components/Table/TablePagination';
import {adminsStyle} from 'assets/jss/material-dashboard-react/views/adminsStyle';
import AdminDialog from './AdminDialog';
import ServiceSelector from 'js/components/ServiceSelector/ServiceSelector';
import {withSnackbar} from 'js/HOCs/snackbar';
import {ServiceSelectContext} from 'js/HOCs/service_select';
import {AuthContext} from 'js/HOCs/auth';
import ExternalService from 'js/services/external_service';


const tableColumns = {
  'admin_id': 'ID',
  'firstname': 'First name',
  'lastname' : 'Last name',
  'email': 'Email',
};

const Admins = (props) => {
  const {classes, role} = props;
  const roleText = Admin.ROLE_TEXT[role];
  const {auth} = useContext(AuthContext);
  const {serviceSelect} = useContext(ServiceSelectContext);
  const [list, setList] = useState({data: []});
  const [params, setParams] = useState({
    role,
    service_id: serviceSelect.serviceId || undefined,
  });
  const [dialogData, setDialogData] = useState({});
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    role != params.role && updateParam({role});
  }, [role]);
  useEffect(() => {
    if (serviceSelect.serviceId != (params.service_id || 0)) {
      updateParam({service_id: serviceSelect.serviceId || undefined});
    }
  }, [serviceSelect.serviceId]);
  useEffect(() => {
    setList({data: []});
    fetchAdmins();
  }, [params]);
  useEffect(() => {
    ExternalService.getOptions().then(services => {
      services = _.mapValues(_.keyBy(services, 'value'), 'label');
      setServices(services);
    });
  }, []);

  const fetchAdmins = () => {
    const fetchParams = role == Admin.ROLE.ADMIN ? _.omit(params, ['service_id']) : params;
    Admin.getList(fetchParams).then(setList);
  };

  const updateParam = newParams => setParams({...params, ...newParams});

  const openDialog = data => {
    data = _.pick(data, ['admin_id', 'email', 'firstname', 'lastname', 'is_active', 'service_id', 'team']);
    data.role = role;
    setDialogData(data);
    setDialogIsOpen(true);
  };

  const onDialogSubmit = async ({admin_id, ...data}) => {
    try {
      if (admin_id) {
        await Admin.update(admin_id, data);
      } else {
        await Admin.create(data);
      }
      setDialogIsOpen(false);
      fetchAdmins();
    } catch (error) {
      props.openSnackBar(_.values(error.response.data.error).join('\n'));
    }
  };

  return (
    <React.Fragment>
      {role != Admin.ROLE.ADMIN && <ServiceSelector />}
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>{_.capitalize(roleText)}s</h4>
          {(role != Admin.ROLE.AGENT || auth.userInfo && auth.userInfo.hasPermission(Admin.PERMISSION.CREATE_AGENT)) && (
            <Fab color="primary" className={classes.addButton} size="small" onClick={() => openDialog({})} title={'Add ' + roleText}>
              <AddIcon />
            </Fab>
          )}
        </CardHeader>
        <CardBody>
          <Table classes={{root: classes.tableContainer}}>
            <TableHead>
              <TableRow>
                {Object.values(tableColumns).map((title, key) => (
                  <TableCell key={key}>
                    {title}
                  </TableCell>
                ))}
                {serviceSelect.serviceId || role == Admin.ROLE.ADMIN ? null : <TableCell>Client</TableCell>}
                {role == Admin.ROLE.AGENT && <TableCell>Team</TableCell>}
                <TableCell>Active</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.data.map((admin, index) => (
                <TableRow key={admin.admin_id}>
                  {Object.keys(tableColumns).map((colName, index) => (
                    <TableCell key={index}>
                      {admin[colName]}
                    </TableCell>
                  ))}
                  {serviceSelect.serviceId || role == Admin.ROLE.ADMIN ? null : <TableCell>{services[admin.service_id]}</TableCell>}
                  {role == Admin.ROLE.AGENT && <TableCell>{Admin.TEAM_TEXT[admin.team]}</TableCell>}
                  <TableCell>
                    <Checkbox checked={!!admin.is_active} disabled/>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" title="Edit" onClick={() => openDialog(admin)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TablePagination {...{tableColumns, data: list, updateParam}}/>
          </Table>
        </CardBody>
        <AdminDialog data={dialogData} open={dialogIsOpen} onClose={() => setDialogIsOpen(false)} onSubmit={onDialogSubmit}/>
      </Card>
    </React.Fragment>
  );
};

export default withSnackbar(withStyles(adminsStyle)(Admins));
