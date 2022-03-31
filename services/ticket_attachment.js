import axios from 'axios';
import {toLocalTime} from 'js/common';


const create = async formData => {
  const {data: {ticket_attachment}} = await axios.post('ticket-attachment', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
  return ticket_attachment;
};

const getList = async (ticket_id) => {
  const {data: {ticket_attachments = []}} = await axios.get(`ticket-attachment/?ticket_id=${ticket_id}`);
  return ticket_attachments;
};


export default {
  create,
  getList,
};