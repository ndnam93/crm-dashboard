import axios from 'axios';
import {toLocalTime} from 'js/common';
import qs from 'qs';


const create = async formData => {
  const {data: {ticket_admin_note}} = await axios.post('ticket-admin-note', formData);
  return formatNote(ticket_admin_note);
};

const getList = async (ticket_id) => {
  const query = qs.stringify({
    sort: {
      field: 'created_at',
      direction: 'desc',
    },
    ticket_id,
  });
  const {data: {ticket_admin_notes = []}} = await axios.get(`ticket-admin-note/all?${query}`);
  return ticket_admin_notes.map(formatNote);
};

const formatNote = note => {
  return {
    ...note,
    created_at: toLocalTime(note.created_at),
  };
};

export default {
  create,
  getList,
};




