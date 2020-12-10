const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('pages/Login.vue')
  },

  {
    path: '/',
    name: 'profile',
    component: () => import('pages/PageExternal.vue'),
    children: [
      {
        path: 'auth/reset-password/',
        name: 'changePassword',
        component: () => import('pages/ResetPassword.vue')
      }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: 'index',
        component: () => import('pages/Index.vue')
      },
      {
        name: 'escolas',
        path: 'escolas',
        component: () => import('pages/Escolas.vue')
      },
      {
        name: 'usuarios',
        path: 'usuarios',
        component: () => import('pages/Usuarios.vue')
      },
      {
        name: 'alunos',
        path: 'alunos',
        component: () => import('pages/Alunos.vue')
      },
      {
        name: 'documentos',
        path: 'documentos',
        component: () => import('pages/Documentos.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
