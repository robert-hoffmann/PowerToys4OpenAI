import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Routes for BEX Application
  {
    path     : '/index',
    component: () => import('layouts/MainLayout.vue'),
    children : [
      {
        path     : '',
        component: () => import('src/pages/ConversationsPage.vue'),
        props    : () => {
          return {
            settings : null
          }
        }
      },
      {
        path     : '/index/conversations/:conversationId(\\d+)',
        component: () => import('src/pages/ConversationsPage.vue'),
        props    : (route) => {
          return {
            settings       : null,
            conversationId : Number.parseInt(route.params.conversationId as string, 10) || 0
          }
        }
      },
      {
        path     : '/index/profiles/:id(\\d+)',
        component: () => import('src/pages/ProfilesPage.vue'),
        props    : (route) => {
          return {
            id : Number.parseInt(route.params.id as string, 10) || 0
          }
        }
      },
      {
        // TODO: move this to it's own page
        path     : '/index/settings/:type?',
        component: () => import('src/pages/ConversationsPage.vue'),
        props    : (route) => {
          return {
            settings : route.params.type || null
          }
        }
      },
    ],
  },
  // Routes for BEX
  {
    path     : '/search-companion',
    component: () => import('src/layouts/CompanionLayout.vue'),
    children : [
      {
        path     : '',
        component: () => import('src/pages/CompanionPage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path       : '/:catchAll(.*)*',
    component  : () => import('pages/ErrorNotFound.vue'),
    beforeEnter: () => {
      // reject the navigation
      return true;
    },
  },
];

export default routes;
