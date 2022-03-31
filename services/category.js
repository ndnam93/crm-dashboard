import axios from 'axios';
import qs from 'qs';
import _ from 'lodash';

const ASSIGN_TO = {
  AGENT: 'agent',
  MERCHANT: 'merchant',
};

const getAll = async (params) => {
  const {data} = await axios.get('category?' + qs.stringify(params));
  return data;
};

const getParentOptions = async (params) => {
  const {data} = await axios.get('category?' + qs.stringify(params));
  return data.map(category => ({
    value: category.category_id,
    label: category.name,
  }));
};

const getOptions = async (params) => {
    const categories = await getAll(params);
    return categories.map(parentCat => ({
      label: parentCat.name,
      options: parentCat.children
        ? parentCat.children.map(childCat => ({
          value: childCat.category_id,
          label: childCat.name,
        }))
        : [],
    }));
  };

const create = async (params) => {
  params = _.omitBy(params, value => value === '');
  const {data: {category}} = await axios.post('/category', params);
  return category;
};

const update = async (id, params) => {
  params = _.omitBy(params, value => value === '');
  const {data: {category}} = await axios.patch(`category/${id}`, params);
  return category;
};


export default {
  ASSIGN_TO,
  getAll,
  getParentOptions,
  getOptions,
  create,
  update,
};
