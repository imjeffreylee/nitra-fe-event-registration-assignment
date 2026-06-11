export default [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/attendeeinfo' },
      {
        path: 'attendeeinfo',
        component: () => import('../pages/AttendeeInfoPage.vue'),
      },
      {
        path: 'sessions',
        component: () => import('../pages/SessionsPage.vue'),
      },
      { path: 'addons', component: () => import('../pages/AddonsPage.vue') },
      { path: 'review', component: () => import('../pages/ReviewPage.vue') },
    ],
  },
];
