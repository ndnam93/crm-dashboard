import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import GlobalEvent from 'js/services/global_event';
import Events from 'js/variables/events';
import {toLocalTime, getOptionList} from 'js/common';
import Admin from 'js/services/admin';


const STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  EXPIRED: 'expired',
  WON: 'won',
  LOST: 'lost',
};

const STATUS_TEXT = {
  [STATUS.NEW]: 'New',
  [STATUS.IN_PROGRESS]: 'In Progress',
  [STATUS.PENDING]: 'Pending',
  [STATUS.RESOLVED]: 'Resolved',
  [STATUS.EXPIRED]: 'Expired',
  [STATUS.WON]: 'Won',
  [STATUS.LOST]: 'Lost',
};

const STATUS_OPTIONS = getOptionList(STATUS_TEXT);

const TYPE = {
  PAYMENT: 'payment',
  RISK: 'risk',
  MERCHANT: 'merchant',
  RESOLUTION: 'resolution',
  DISPUTE: 'dispute',
};

const TYPE_TEXT = {
  [TYPE.PAYMENT]: 'Payment',
  [TYPE.RISK]: 'Risk',
  [TYPE.MERCHANT]: 'Merchant',
};

const TYPE_OPTIONS = getOptionList(TYPE_TEXT);

const TYPE_TO_TEAM = {
  [TYPE.PAYMENT]: Admin.TEAM.USER_SUPPORT,
  [TYPE.MERCHANT]: Admin.TEAM.MERCHANT_SUPPORT,
  [TYPE.RISK]: Admin.TEAM.RISK_SUPPORT,
  [TYPE.DISPUTE]: Admin.TEAM.DISPUTE_SUPPORT,
};

const SOURCE = {
  API: 'api',
  SITE: 'website',
  EMAIL: 'email',
};

const SOURCE_TEXT = {
  [SOURCE.API]: 'Api',
  [SOURCE.SITE]: 'Site',
  [SOURCE.EMAIL]: 'Email',
};

const SOURCE_OPTIONS = getOptionList(SOURCE_TEXT);

const AUTHOR_TYPE = {
  USER: 'user',
  ADMIN: 'admin',
  SERVICE: 'service',
};

const AUTHOR_TYPE_TEXT = {
  [AUTHOR_TYPE.USER]: 'User',
  [AUTHOR_TYPE.ADMIN]: 'Admin',
  [AUTHOR_TYPE.SERVICE]: 'Service',
};

const AUTHOR_TYPE_OPTIONS = getOptionList(AUTHOR_TYPE_TEXT);

const QUEUE_NAMES = {
  [TYPE.PAYMENT]: 'User support',
  [TYPE.MERCHANT]: 'Merchant support',
  [TYPE.RISK]: 'Risk support',
  [TYPE.RESOLUTION]: 'Resolution center',
  [TYPE.DISPUTE]: 'Dispute center',
};

const CONVERSATION_TYPE = {
  AGENT_USER: 'agent_user',
  AGENT_MERCHANT: 'agent_merchant',
  MERCHANT_USER: 'merchant_user',
};


const get = async (id, params) => {
  const {data: {ticket}} = await axios.get(`ticket/${id}`, {params});
  return ticket ? formatTicket(ticket) : {};
};

const getList = async (params) => {
  const {data} = await axios.get('ticket?' + qs.stringify(params));
  data.data = data.data.map(ticket => {
    ticket = formatTicket(ticket);
    ticket.subject = _.truncate(ticket.subject, {length: 50});
    return ticket;
  });
  return data;
};

const create = async (params) => {
  if (params.transaction_date) {
    params.transaction_date += ' 00:00:00';
  }
  const {data: {ticket}} = await axios.post('/ticket', params);
  return ticket;
};

const update = async (id, params) => {
  params = _.omitBy(params, p => !p);
  if (params.transaction_date) {
    params.transaction_date += ' 00:00:00';
  }
  let {data: {ticket: updatedTicket}} = await axios.patch(`ticket/${id}`, params);
  if (!updatedTicket) return false;

  updatedTicket = formatTicket(updatedTicket);
  GlobalEvent.dispatch(Events.TicketUpdated, updatedTicket);
  return updatedTicket;
};

const transfer = async params => {
  const {data: {ticket: newTicket}} = await axios.post('ticket/transfer-type', params);
  GlobalEvent.dispatch(Events.TicketUpdated, {
    ticket_id: newTicket.transferred_from_id,
    transferred_to_id: newTicket.ticket_id,
  });
  GlobalEvent.dispatch(Events.TicketAdminNoteAdded, newTicket.transferred_from_id);
  return newTicket;
};

const transferToMerchant = async params => {
  const {data: {ticket}} = await axios.post('ticket/transfer-to-merchant', params);
  return ticket;
};

const formatTicket = ticket => ({
  ...ticket,
  status_text: STATUS_TEXT[ticket.status],
  source_text: SOURCE_TEXT[ticket.source],
});

export default {
  create,
  get,
  getList,
  update,
  transfer,
  transferToMerchant,
  STATUS,
  STATUS_TEXT,
  STATUS_OPTIONS,
  TYPE,
  TYPE_TEXT,
  TYPE_OPTIONS,
  TYPE_TO_TEAM,
  SOURCE,
  SOURCE_TEXT,
  SOURCE_OPTIONS,
  AUTHOR_TYPE,
  AUTHOR_TYPE_TEXT,
  AUTHOR_TYPE_OPTIONS,
  QUEUE_NAMES,
  CONVERSATION_TYPE,
};
