import axios from 'axios';
import qs from 'qs';

const getTypes = async () => {
  const {data} = await axios.get('mail-template/types');
  return data;
};

const getList = async (params) => {
  const {data: {mail_templates}} = await axios.get('mail-template?' + qs.stringify(params));
  return mail_templates;
};

const update = async (params) => {
  let {data: {mail_template}} = await axios.post('mail-template', params);
  return mail_template;
};


export default {
  getTypes,
  getList,
  update,
};
