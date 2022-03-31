import qs from 'qs';
import axios from 'axios';
import _ from 'lodash';
import Admin from './admin';
import Ticket from 'js/services/ticket';
import {toLocalTime, getOptionList} from '../common';


const ACTION = {
  CREATED: 1,
  STATUS_UPDATED: 2,
  ASSIGNED: 3,
  USER_EMAIL_CHANGED: 4,
  MESSAGE_ADDED: 5,
  NOTE_ADDED: 6,
  TICKET_REOPENED: 7,
  MERCHANT_EMAIL_CHANGED: 8,
  TICKET_TYPE_CHANGED: 10,
};

const ACTION_TEXT = {
  [ACTION.CREATED]: 'Created',
  [ACTION.STATUS_UPDATED]: 'Status Updated',
  [ACTION.ASSIGNED]: 'Assigned',
  [ACTION.USER_EMAIL_CHANGED]: 'User Email Changed',
  [ACTION.MESSAGE_ADDED]: 'Message Added',
  [ACTION.NOTE_ADDED]: 'Admin Note Added',
  [ACTION.TICKET_REOPENED]: 'Reopened',
  [ACTION.MERCHANT_EMAIL_CHANGED]: 'Merchant Email Changed',
  [ACTION.TICKET_TYPE_CHANGED]: 'Ticket Type Changed',
}

const ACTION_OPTIONS = getOptionList(ACTION_TEXT);

const formatLog = (() => {
  let admins;
  setTimeout(() => {
    Admin.getOptions().then(options => {
      admins = _.reduce(options, (result, option) => {
        result[option.value] = option.label;
        return result;
      }, {});
    });
  }, 0);

  return ({log_data, ...log}) => {
    if (_.includes([ACTION.STATUS_UPDATED, ACTION.TICKET_REOPENED], log.action) && log_data) {
      const {old_status, new_status} = log_data;
      log.description = (Ticket.STATUS_TEXT[old_status] || old_status) + ' → ' + (Ticket.STATUS_TEXT[new_status] || new_status);
    } else if (log.action == ACTION.ASSIGNED) {
      const {new_assignee_id, old_assignee_id} = log_data;
      const [newAssignee, oldAssignee] = [admins[new_assignee_id], admins[old_assignee_id]]
      log.description = oldAssignee || 'Assigned to ';
      log.description += newAssignee || 'admin #' + new_assignee_id;
    } else if (log.action == ACTION.TICKET_TYPE_CHANGED) {
      const {old_type, new_type} = log_data;
      log.description = old_type + ' → ' + new_type;
    } else if (_.includes([ACTION.USER_EMAIL_CHANGED, ACTION.MERCHANT_EMAIL_CHANGED], log.action)) {
      const {old_email, new_email} = log_data;
      log.description = old_email + ' → ' + new_email;
    }
    log.action_text = ACTION_TEXT[log.action] || 'N/A';
    log.created_at_text = toLocalTime(log.created_at,'ddd MMM DD YYYY, HH:mm:ss');
    return log;
  };
})();

const getList = async (params) => {
  const query = qs.stringify(params);
  const {data: {ticket_logs}} = await axios.get(`ticket-log/all?${query}`);
  return ticket_logs.map(item => formatLog(item));
};

export default {
  getList,
  ACTION,
  ACTION_TEXT,
  ACTION_OPTIONS,
};
