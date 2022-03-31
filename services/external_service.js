import axios from 'axios';
import qs from 'qs';
import _ from "lodash";

export const ExternalServices = _.keyBy([
  {id: 1, name: 'Paymentwall', logo: '/images/avatar_admin.png'},
  {id: 6, name: 'FasterPay', logo: '/images/fasterpay/logo_icon.png'},
  {id: 7, name: 'Terminal3', logo: '/images/terminal3/logo_icon.png'},
], 'id');


const getList = async (params) => {
  const {data: {external_services}} = await axios.get('external-service?' + qs.stringify(params));
  return external_services;
};

/**
 * Get service options to be displayed in dropdowns
 * @param {Object} filters Object containing filter values. E.g. {is_active: 1}
 * @return {Array}
 */
const getOptions = (() => {
  let cachedData, promise;
  return async filters => {
    if (!cachedData) {
      if (!promise) {
        promise = axios.get('external-service/all');
      }
      const {data: {external_services}} = await promise;
      cachedData = external_services;
    }
    let result = filters
      ? _.filter(cachedData, filters)
      : cachedData;
    result = result.map(service => ({
      value: service.service_id,
      label: service.display_name,
    }));

    return result;
  };
})();

const updateSettings = async (service_id, settings) => {
  const {data: newSettings} = await axios.post('service-settings', {
    ...settings,
    service_id,
  });
  return newSettings;
};

const get = async (id) => {
  const {data: {external_service}} = await axios.get(`external-service/${id}`);
  return external_service;
};

const getNewApiKey = async (id) => {
  const {data: {new_api_key}} = await axios.get(`external-service/new-api-key?service_id=${id}`);
  return new_api_key;
};

const getMailIntegrationUrl = async (serviceId, ticketType) => {
  const {data} = await axios.get(`external-service/get-oauth-uri?service_id=${serviceId}&ticket_type=${ticketType}`);
  return data;
}

export default {
  get,
  getList,
  getOptions,
  updateSettings,
  getNewApiKey,
  getMailIntegrationUrl,
};
