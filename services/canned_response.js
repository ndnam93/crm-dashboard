import axios from 'axios';
import qs from 'qs';

const getList = async (params) => {
  const query = qs.stringify(params, {arrayFormat: 'bracket'});
  const {data: {canned_responses}} = await axios.get('canned-response?' + query);
  return canned_responses;
};

const create = async (params) => {
  const {data: {canned_response}} = await axios.post('canned-response', params);
  return canned_response;
};

const update = async (id, params) => {
  const {data: {canned_response}} = await axios.patch(`canned-response/${id}`, params);
  return canned_response;
};

const destroy = (id) => {
  return axios.delete(`canned-response/${id}`);
};

const buildTemplateData = (ticketData) => ({
  ticketId: ticketData.ticket_id,
  transactionId: ticketData.transaction_id,
});


export default {
  getList,
  create,
  update,
  destroy,
  buildTemplateData,
};