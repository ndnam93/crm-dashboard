import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';


const ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
};

const ROLE_TEXT = {
  [ROLE.ADMIN]: 'system admin',
  [ROLE.MANAGER]: 'manager',
  [ROLE.AGENT]: 'agent',
};

const TEAM = {
  USER_SUPPORT: 'user_support',
  MERCHANT_SUPPORT: 'merchant_support',
  RISK_SUPPORT: 'risk_support',
  DISPUTE_SUPPORT: 'dispute_support',
};

const TEAM_TEXT = {
  [TEAM.USER_SUPPORT]: 'User Support',
  [TEAM.MERCHANT_SUPPORT]: 'Merchant Support',
  [TEAM.RISK_SUPPORT]: 'Risk Support',
  [TEAM.DISPUTE_SUPPORT]: 'Dispute Support',
};

const PERMISSION = {
  CREATE_AGENT: 'create_agent',
  EDIT_AGENT: 'edit_agent',
  VIEW_AGENT: 'view_agent',
  CREATE_MANAGER: 'create_manager',
  EDIT_MANAGER: 'edit_manager',
  VIEW_MANAGER: 'view_manager',
  CREATE_ADMIN: 'create_admin',
  EDIT_ADMIN: 'edit_admin',
  VIEW_ADMIN: 'view_admin',
  EDIT_USER_ROLE: 'edit_user_role',
  SET_TICKET_MESSAGE_SENDER: 'set_message_sender',
  UPDATE_SERVICE_SETTINGS: 'update_service_settings',
  UPDATE_MAIL_TEMPLATE: 'update_mail_template',
  VIEW_TICKET: 'view_ticket',
  CREATE_TICKET: 'create_ticket',
  EDIT_TICKET: 'edit_ticket',
  CREATE_TICKET_MESSAGE: 'create_ticket_message',
  CREATE_ADMIN_NOTE: 'create_admin_note',
  EDIT_CATEGORY: 'edit_category',
  VIEW_RESOLUTION_TICKET: 'view_resolution_ticket',
};

const getList = async (params) => {
  const {data} = await axios.get('admin?' + qs.stringify(params));
  return data;
};

/**
 * Get admin options to be displayed in dropdowns
 * @param {Object} filters Object containing filter values. E.g. {service_id: 1}
 * @return {Array}
 */
const getOptions = (() => {
  let cachedData;
  return async filters => {
    if (!cachedData) {
      const {data: {admins}} = await axios.get('admin/all');
      cachedData = admins;
    }
    let result = filters
      ? _.filter(cachedData, filters)
      : cachedData;
    result = result.map(admin => ({
      value: admin.admin_id,
      label: `${admin.fullname} [${admin.email}]`,
    }));
    return result;
  };
})();

/**
 * Get admin name by admin id
 *
 * @param id
 * @returns {Promise<null>}
 */
const get = async (id) => {
  const options = await getOptions();
  const option =  _.find(options, option => option.value == id);
  return option ? option.label : null;
};

// Get logged in user's profile
const getProfile = async () => {
  const profile = (await axios.get('/profile')).data.data;

  const getSettingProperty = _.propertyOf(profile.service_settings || {});
  profile.getServiceSetting = (serviceId, path) => {
    path = `${serviceId}.${path}`;
    return getSettingProperty(path);
  };
  profile.hasPermission = permission => _.includes(profile.permissions || [], permission);

  return profile;
};

const create = async (data) => {
  const {data: {admin}} = await axios.post('/admin', data);
  return admin;
};

const update = async (id, params) => {
  params = _.omitBy(params, _.isNil);
  let {data: {admin: updatedAdmin}} = await axios.patch(`admin/${id}`, params);
  return updatedAdmin;
};


export default {
  ROLE,
  ROLE_TEXT,
  TEAM,
  TEAM_TEXT,
  PERMISSION,
  get,
  getProfile,
  getList,
  getOptions,
  create,
  update,
};
