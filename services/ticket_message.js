import axios from 'axios';
import qs from 'qs';
import {toLocalTime} from 'js/common';

export const SENDER_TYPE = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  USER: 'user',
};

const create = async formData => {
  const {data: {ticket_message}} = await axios.post('ticket-message', formData);
  return formatMessage(ticket_message);
};

const getList = async (ticket_id, moreParams = {}) => {
  const query = qs.stringify({
    sort: {
      field: 'created_at',
      direction: 'desc',
    },
    ...moreParams,
    ticket_id,
  });
  const {data: {ticket_messages = []}} = await axios.get(`ticket-message/all?${query}`);
  return ticket_messages.map(formatMessage);
};

const formatMessage = (message) => {
  return {
    ...message,
    created_at: toLocalTime(message.created_at),
  };
};

export default {
  create,
  getList,
  SENDER_TYPE,
};
