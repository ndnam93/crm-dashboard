import LoginPage from 'js/views/Guest/Login';

export const guestRoutes = [{
  path: "/dashboard/guest/login",
  component: LoginPage,
}, {
  path: "/dashboard/guest/admin-login",
  component: LoginPage,
  extraProps: {is_admin: true},
}];

