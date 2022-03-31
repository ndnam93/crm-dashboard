import DashboardLayout from 'js/layouts/dashboard/DashboardLayout';
import GuestLayout from 'js/layouts/GuestLayout';
import NotFoundPage from 'js/views/404';

export default [
  { path: "/dashboard/404", component: NotFoundPage },
  { path: "/dashboard/guest", component: GuestLayout },
  { path: "/dashboard", component: DashboardLayout, requireAuth: true },
];
