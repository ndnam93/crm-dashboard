import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';
import SettingsAppIcon from '@material-ui/icons/SettingsApplications';
import CategoryIcon from '@material-ui/icons/ViewList';
import EmailIcon from '@material-ui/icons/Email';
import AdminsPage from 'js/views/Admins/Admins';
import CategoriesPage from 'js/views/Categories/Categories';
import TicketsPage from 'js/views/Tickets/Tickets';
import TicketPage from 'js/views/Ticket/Ticket';
import CannedResponsePage from 'js/views/CannedResponse/CannedResponse';
import NewTicketPage from 'js/views/NewTicket/NewTicket';
import QueueSettingsPage from 'js/views/Settings/QueueSettings';
import ClientSettingsPage from 'js/views/Settings/ClientSettings/ClientSettings';
import MailTemplatesPage from 'js/views/MailTemplates/MailTemplates';
import NewTicketButton from 'js/layouts/dashboard/Sidebar/NewTicketButton';
import Admin from 'js/services/admin';
import Ticket from 'js/services/ticket';


export const dashboardRoutes = [{
  sidebarName: 'Admins',
  icon: PeopleIcon,
  accessControl: {
    permission: [Admin.PERMISSION.EDIT_AGENT],
  },
  subRoutes: [{
    path: '/dashboard/admins/admin',
    sidebarName: 'System Admins',
    component: AdminsPage,
    extraProps: {role: Admin.ROLE.ADMIN},
    accessControl: {
      permission: [Admin.PERMISSION.VIEW_ADMIN],
    },
  }, {
    path: '/dashboard/admins/manager',
    sidebarName: 'Managers',
    component: AdminsPage,
    extraProps: {role: Admin.ROLE.MANAGER},
    accessControl: {
      permission: [Admin.PERMISSION.VIEW_MANAGER],
    },
  }, {
    path: '/dashboard/admins/agent',
    sidebarName: 'Agents',
    component: AdminsPage,
    extraProps: {role: Admin.ROLE.AGENT},
    accessControl: {
      permission: [Admin.PERMISSION.VIEW_AGENT],
    },
  }],
}, {
  path: '/dashboard/category',
  sidebarName: 'Categories',
  icon: CategoryIcon,
  component: CategoriesPage,
  accessControl: {
    permission: [Admin.PERMISSION.EDIT_CATEGORY],
  },
}, {
  path: '/dashboard/mail-template',
  sidebarName: 'Mail templates',
  icon: EmailIcon,
  component: MailTemplatesPage,
  accessControl: {
    permission: [Admin.PERMISSION.UPDATE_MAIL_TEMPLATE],
  },
}, {
  sidebarName: 'Client Settings',
  icon: SettingsAppIcon,
  accessControl: {
    permission: [Admin.PERMISSION.UPDATE_SERVICE_SETTINGS],
  },
  subRoutes: [{
    path: '/dashboard/service_settings/general',
    sidebarName: 'General',
    component: ClientSettingsPage,
  }, {
    sidebarName: 'Queues',
    subRoutes: [{
      path: '/dashboard/service_settings/queue/payment',
      sidebarName: 'User Support',
      component: QueueSettingsPage,
      extraProps: {queue: Ticket.TYPE.PAYMENT},
    }, {
      path: '/dashboard/service_settings/queue/merchant',
      sidebarName: 'Merchant Support',
      component: QueueSettingsPage,
      extraProps: {queue: Ticket.TYPE.MERCHANT},
    }, {
      path: '/dashboard/service_settings/queue/risk',
      sidebarName: 'Risk Support',
      component: QueueSettingsPage,
      extraProps: {queue: Ticket.TYPE.RISK},
    }, {
      path: '/dashboard/service_settings/queue/resolution',
      sidebarName: 'Resolution Center',
      component: QueueSettingsPage,
      extraProps: {queue: Ticket.TYPE.RESOLUTION},
    }, {
      path: '/dashboard/service_settings/queue/general',
      sidebarName: 'General Queue Settings',
      component: QueueSettingsPage,
      extraProps: {queue: 'general'},
    }],
  }],
}, {
  sidebarName: 'Tickets',
  icon: ListIcon,
  navItemButton: NewTicketButton,
  accessControl: {
    permission: [Admin.PERMISSION.VIEW_TICKET],
  },
  subRoutes: [{
    path: '/dashboard/tickets/payment',
    sidebarName: 'User Support',
    component: TicketsPage,
    extraProps: {ticket_type: Ticket.TYPE.PAYMENT},
    accessControl: {
      team: Admin.TEAM.USER_SUPPORT,
    },
  }, {
    path: '/dashboard/tickets/risk',
    sidebarName: 'Risk',
    component: TicketsPage,
    extraProps: {ticket_type: Ticket.TYPE.RISK},
    accessControl: {
      team: Admin.TEAM.RISK_SUPPORT,
    },
  }, {
    path: '/dashboard/tickets/merchant',
    sidebarName: 'Merchant Support',
    component: TicketsPage,
    extraProps: {ticket_type: Ticket.TYPE.MERCHANT},
    accessControl: {
      team: Admin.TEAM.MERCHANT_SUPPORT,
    },
  }, {
    path: '/dashboard/tickets/resolution',
    sidebarName: 'Resolution Center',
    component: TicketsPage,
    extraProps: {ticket_type: Ticket.TYPE.RESOLUTION},
    accessControl: {
      permission: [Admin.PERMISSION.VIEW_RESOLUTION_TICKET],
    },
  }, {
    path: '/dashboard/tickets/dispute',
    sidebarName: 'Dispute Center',
    component: TicketsPage,
    extraProps: {ticket_type: Ticket.TYPE.DISPUTE},
    accessControl: {
      team: Admin.TEAM.DISPUTE_SUPPORT,
    },
  }],
}, {
  path: '/dashboard/ticket/create',
  component: NewTicketPage,
}, {
  path: '/dashboard/ticket/:ticket_id',
  component: TicketPage,
}, {
  path: '/dashboard/canned-response',
  sidebarName: 'Canned Responses',
  component: CannedResponsePage,
}];
