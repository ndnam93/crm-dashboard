import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Card from 'js/components/Card/Card';
import CardHeader from 'js/components/Card/CardHeader';
import CardBody from 'js/components/Card/CardBody';
import IconButton from 'js/components/CustomButtons/IconButton';
import CannedResponseDialog from './CannedResponseDialog';
import Checkbox from 'js/components/Checkbox/Checkbox';
import {history} from 'js/common';
import {withAuth} from 'js/HOCs/auth';
import CannedResponse from 'js/services/canned_response';
import {cannedResponseStyle} from 'assets/jss/material-dashboard-react/views/cannedResponseStyle';
import {withSnackbar} from 'js/HOCs/snackbar';


const tableColumns = {
  'canned_response_id': 'ID',
  'title': 'Title',
  'body' : 'Body',
};

const CannedResponsePage = (props) => {
  const {classes} = props;
  const [list, setList] = useState([]);
  const [dialogParams, setDialogParams] = useState({});
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    props.auth.getUserInfo().then(async (userInfo) => {
      setUserInfo(userInfo);
      const {admin_id} = userInfo;
      let list = await CannedResponse.getList({admin_id});
      list = _.keyBy(list, 'canned_response_id');
      setList(list);
    });
  }, []);

  const updateCannedResponse = async (id, data) => {
    const cannedResponse = await CannedResponse.update(id, data);
    const newList = {...list};
    newList[id] = cannedResponse;
    setList(newList);
    return cannedResponse;
  };

  const toggleStatus = (id) => {
    const newStatus = list[id].status === 'active' ? 'inactive' : 'active';
    updateCannedResponse(id, {status: newStatus});
  };

  const openDialog = (params = {}) => {
    params = _.pick(params, ['title', 'body', 'admin_id', 'canned_response_id']);
    setDialogParams(params);
    setDialogIsOpen(true);
  };

  const onDialogSubmit = async ({canned_response_id, ...params}) => {
    params.admin_id = userInfo.admin_id;
    try {
      if (canned_response_id) {
        await updateCannedResponse(canned_response_id, params);
      } else {
        const newCannedResponse = await CannedResponse.create(params);
        newCannedResponse.status = 'active';
        const newList = {...list};
        newList[newCannedResponse.canned_response_id] = newCannedResponse;
        setList(newList);
      }
      setDialogIsOpen(false);
    } catch (error) {
      props.openSnackBar(_.values(error.response.data.error).join('\n'));
    }
  };

  const destroy = async (id) => {
    if (confirm('Do you want to delete canned response #' + id + '?')) {
      await CannedResponse.destroy(id);
      const newList = {...list};
      delete newList[id];
      setList(newList);
    }
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader plain color="primary">
          <h4 className={classes.cardTitleWhite}>Canned Responses - {userInfo && userInfo.firstname}</h4>
          <Fab color="primary" className={classes.addResponseButton} size="small" onClick={() => openDialog()} title="Add canned response">
            <AddIcon />
          </Fab>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHead>
              <TableRow>
                {Object.values(tableColumns).map((title, key) => (
                  <TableCell key={key}>
                    {title}
                  </TableCell>
                ))}
                <TableCell>Active</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.values(list).map((cannedResponse, index) => (
                <TableRow key={cannedResponse.canned_response_id}>
                  {Object.keys(tableColumns).map((colName, index) => {
                    return (
                      <TableCell key={index}>
                        {cannedResponse[colName]}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Checkbox onClick={() => toggleStatus(cannedResponse.canned_response_id)} checked={cannedResponse.status == 'active'} />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => openDialog(cannedResponse)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => destroy(cannedResponse.canned_response_id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <CannedResponseDialog params={dialogParams} open={dialogIsOpen} onClose={() => setDialogIsOpen(false)} onSubmit={onDialogSubmit}/>
    </React.Fragment>
  );
}
export default withSnackbar(withAuth(withStyles(cannedResponseStyle)(CannedResponsePage)));
