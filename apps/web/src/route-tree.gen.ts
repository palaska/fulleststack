/* eslint-disable eslint-comments/no-unlimited-disable */

/* eslint-disable */

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as AdminRouteImport } from './routes/_admin/route'
import { Route as IndexImport } from './routes/index'
import { Route as TaskIdImport } from './routes/task/$id'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'
import { Route as AuthVerifyEmailImport } from './routes/_auth/verify-email'
import { Route as AuthSignupImport } from './routes/_auth/signup'
import { Route as AuthSigninImport } from './routes/_auth/signin'
import { Route as AuthResetPasswordImport } from './routes/_auth/reset-password'
import { Route as AuthForgotPasswordImport } from './routes/_auth/forgot-password'
import { Route as AdminAdminDashboardIndexImport } from './routes/_admin/admin-dashboard/index'
import { Route as TaskEditIdImport } from './routes/task/edit.$id'

// Create/Update Routes

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AdminRouteRoute = AdminRouteImport.update({
  id: '/_admin',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TaskIdRoute = TaskIdImport.update({
  id: '/task/$id',
  path: '/task/$id',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthVerifyEmailRoute = AuthVerifyEmailImport.update({
  id: '/_auth/verify-email',
  path: '/verify-email',
  getParentRoute: () => rootRoute,
} as any)

const AuthSignupRoute = AuthSignupImport.update({
  id: '/_auth/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const AuthSigninRoute = AuthSigninImport.update({
  id: '/_auth/signin',
  path: '/signin',
  getParentRoute: () => rootRoute,
} as any)

const AuthResetPasswordRoute = AuthResetPasswordImport.update({
  id: '/_auth/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const AuthForgotPasswordRoute = AuthForgotPasswordImport.update({
  id: '/_auth/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRoute,
} as any)

const AdminAdminDashboardIndexRoute = AdminAdminDashboardIndexImport.update({
  id: '/admin-dashboard/',
  path: '/admin-dashboard/',
  getParentRoute: () => AdminRouteRoute,
} as any)

const TaskEditIdRoute = TaskEditIdImport.update({
  id: '/task/edit/$id',
  path: '/task/edit/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_admin': {
      id: '/_admin'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/_auth/forgot-password': {
      id: '/_auth/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordImport
      parentRoute: typeof rootRoute
    }
    '/_auth/reset-password': {
      id: '/_auth/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof AuthResetPasswordImport
      parentRoute: typeof rootRoute
    }
    '/_auth/signin': {
      id: '/_auth/signin'
      path: '/signin'
      fullPath: '/signin'
      preLoaderRoute: typeof AuthSigninImport
      parentRoute: typeof rootRoute
    }
    '/_auth/signup': {
      id: '/_auth/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof AuthSignupImport
      parentRoute: typeof rootRoute
    }
    '/_auth/verify-email': {
      id: '/_auth/verify-email'
      path: '/verify-email'
      fullPath: '/verify-email'
      preLoaderRoute: typeof AuthVerifyEmailImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/task/$id': {
      id: '/task/$id'
      path: '/task/$id'
      fullPath: '/task/$id'
      preLoaderRoute: typeof TaskIdImport
      parentRoute: typeof rootRoute
    }
    '/task/edit/$id': {
      id: '/task/edit/$id'
      path: '/task/edit/$id'
      fullPath: '/task/edit/$id'
      preLoaderRoute: typeof TaskEditIdImport
      parentRoute: typeof rootRoute
    }
    '/_admin/admin-dashboard/': {
      id: '/_admin/admin-dashboard/'
      path: '/admin-dashboard'
      fullPath: '/admin-dashboard'
      preLoaderRoute: typeof AdminAdminDashboardIndexImport
      parentRoute: typeof AdminRouteImport
    }
  }
}

// Create and export the route tree

interface AdminRouteRouteChildren {
  AdminAdminDashboardIndexRoute: typeof AdminAdminDashboardIndexRoute
}

const AdminRouteRouteChildren: AdminRouteRouteChildren = {
  AdminAdminDashboardIndexRoute: AdminAdminDashboardIndexRoute,
}

const AdminRouteRouteWithChildren = AdminRouteRoute._addFileChildren(
  AdminRouteRouteChildren,
)

interface AuthenticatedRouteRouteChildren {
  AuthenticatedProfileRoute: typeof AuthenticatedProfileRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedProfileRoute: AuthenticatedProfileRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteRouteWithChildren
  '/forgot-password': typeof AuthForgotPasswordRoute
  '/reset-password': typeof AuthResetPasswordRoute
  '/signin': typeof AuthSigninRoute
  '/signup': typeof AuthSignupRoute
  '/verify-email': typeof AuthVerifyEmailRoute
  '/profile': typeof AuthenticatedProfileRoute
  '/task/$id': typeof TaskIdRoute
  '/task/edit/$id': typeof TaskEditIdRoute
  '/admin-dashboard': typeof AdminAdminDashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteRouteWithChildren
  '/forgot-password': typeof AuthForgotPasswordRoute
  '/reset-password': typeof AuthResetPasswordRoute
  '/signin': typeof AuthSigninRoute
  '/signup': typeof AuthSignupRoute
  '/verify-email': typeof AuthVerifyEmailRoute
  '/profile': typeof AuthenticatedProfileRoute
  '/task/$id': typeof TaskIdRoute
  '/task/edit/$id': typeof TaskEditIdRoute
  '/admin-dashboard': typeof AdminAdminDashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_admin': typeof AdminRouteRouteWithChildren
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/_auth/forgot-password': typeof AuthForgotPasswordRoute
  '/_auth/reset-password': typeof AuthResetPasswordRoute
  '/_auth/signin': typeof AuthSigninRoute
  '/_auth/signup': typeof AuthSignupRoute
  '/_auth/verify-email': typeof AuthVerifyEmailRoute
  '/_authenticated/profile': typeof AuthenticatedProfileRoute
  '/task/$id': typeof TaskIdRoute
  '/task/edit/$id': typeof TaskEditIdRoute
  '/_admin/admin-dashboard/': typeof AdminAdminDashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/forgot-password'
    | '/reset-password'
    | '/signin'
    | '/signup'
    | '/verify-email'
    | '/profile'
    | '/task/$id'
    | '/task/edit/$id'
    | '/admin-dashboard'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/forgot-password'
    | '/reset-password'
    | '/signin'
    | '/signup'
    | '/verify-email'
    | '/profile'
    | '/task/$id'
    | '/task/edit/$id'
    | '/admin-dashboard'
  id:
    | '__root__'
    | '/'
    | '/_admin'
    | '/_authenticated'
    | '/_auth/forgot-password'
    | '/_auth/reset-password'
    | '/_auth/signin'
    | '/_auth/signup'
    | '/_auth/verify-email'
    | '/_authenticated/profile'
    | '/task/$id'
    | '/task/edit/$id'
    | '/_admin/admin-dashboard/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRouteRoute: typeof AdminRouteRouteWithChildren
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
  AuthResetPasswordRoute: typeof AuthResetPasswordRoute
  AuthSigninRoute: typeof AuthSigninRoute
  AuthSignupRoute: typeof AuthSignupRoute
  AuthVerifyEmailRoute: typeof AuthVerifyEmailRoute
  TaskIdRoute: typeof TaskIdRoute
  TaskEditIdRoute: typeof TaskEditIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AdminRouteRoute: AdminRouteRouteWithChildren,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthResetPasswordRoute: AuthResetPasswordRoute,
  AuthSigninRoute: AuthSigninRoute,
  AuthSignupRoute: AuthSignupRoute,
  AuthVerifyEmailRoute: AuthVerifyEmailRoute,
  TaskIdRoute: TaskIdRoute,
  TaskEditIdRoute: TaskEditIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_admin",
        "/_authenticated",
        "/_auth/forgot-password",
        "/_auth/reset-password",
        "/_auth/signin",
        "/_auth/signup",
        "/_auth/verify-email",
        "/task/$id",
        "/task/edit/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_admin": {
      "filePath": "_admin/route.tsx",
      "children": [
        "/_admin/admin-dashboard/"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/profile"
      ]
    },
    "/_auth/forgot-password": {
      "filePath": "_auth/forgot-password.tsx"
    },
    "/_auth/reset-password": {
      "filePath": "_auth/reset-password.tsx"
    },
    "/_auth/signin": {
      "filePath": "_auth/signin.tsx"
    },
    "/_auth/signup": {
      "filePath": "_auth/signup.tsx"
    },
    "/_auth/verify-email": {
      "filePath": "_auth/verify-email.tsx"
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/task/$id": {
      "filePath": "task/$id.tsx"
    },
    "/task/edit/$id": {
      "filePath": "task/edit.$id.tsx"
    },
    "/_admin/admin-dashboard/": {
      "filePath": "_admin/admin-dashboard/index.tsx",
      "parent": "/_admin"
    }
  }
}
ROUTE_MANIFEST_END */
