import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { H as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-COfFpKmw.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$f = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "KIT Attendance Hub is a web-based system for managing employee attendance, requests, and user accounts." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "KIT Attendance Hub is a web-based system for managing employee attendance, requests, and user accounts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "twitter:description", content: "KIT Attendance Hub is a web-based system for managing employee attendance, requests, and user accounts." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f3f30469-7dfc-4b2f-a2f6-e49db8a790dc/id-preview-bbac92f3--56b0c9e5-0257-4b9a-8cfb-a36918bbb57a.lovable.app-1779943824463.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f3f30469-7dfc-4b2f-a2f6-e49db8a790dc/id-preview-bbac92f3--56b0c9e5-0257-4b9a-8cfb-a36918bbb57a.lovable.app-1779943824463.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$f.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$d = () => import("./reset-password-Kd-I0_BB.mjs");
const Route$e = createFileRoute("/reset-password")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
function getSafeRedirectPath(redirect2) {
  if (!redirect2) return "/home";
  try {
    const url = new URL(redirect2, window.location.origin);
    if (url.origin !== window.location.origin) return "/home";
    return url.pathname || "/home";
  } catch {
    if (redirect2.startsWith("/") && !redirect2.startsWith("//")) {
      return redirect2.split("?")[0].split("#")[0] || "/home";
    }
    return "/home";
  }
}
const $$splitComponentImporter$c = () => import("./login-CgV1CojX.mjs");
const Route$d = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Đăng nhập — KIT Attendance"
    }]
  }),
  validateSearch: (search) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : void 0
  }),
  beforeLoad: async ({
    search
  }) => {
    if (typeof window === "undefined") return;
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (!error && data.user) {
      throw redirect({
        href: getSafeRedirectPath(search.redirect)
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./forgot-password-CmsLyMCE.mjs");
const Route$c = createFileRoute("/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("../_authenticated-D1qQ8wBl.mjs");
const Route$b = createFileRoute("/_authenticated")({
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data
    } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        href: `/login?redirect=${encodeURIComponent(location.href)}`
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("../_admin-BDEkzeeM.mjs");
const Route$a = createFileRoute("/_admin")({
  beforeLoad: async ({
    location
  }) => {
    if (typeof window === "undefined") return;
    const {
      data
    } = await supabase.auth.getSession();
    if (!data.session) throw redirect({
      href: `/login?redirect=${encodeURIComponent(location.href)}`
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const Route$9 = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/home" });
  }
});
const $$splitComponentImporter$8 = () => import("../_authenticated.requests-3OHPhpkP.mjs");
const Route$8 = createFileRoute("/_authenticated/requests")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("../_authenticated.overtime-BLRUgC05.mjs");
const Route$7 = createFileRoute("/_authenticated/overtime")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("../_authenticated.leave-balance-Cf53NnRe.mjs");
const Route$6 = createFileRoute("/_authenticated/leave-balance")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_authenticated.home-DcVr9cQh.mjs");
const Route$5 = createFileRoute("/_authenticated/home")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("../_admin.admin-D5euWz0r.mjs");
const Route$4 = createFileRoute("/_admin/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_authenticated.requests.new-CEG3N4cx.mjs");
const Route$3 = createFileRoute("/_authenticated/requests/new")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_admin.admin.requests-LedZsQUL.mjs");
const Route$2 = createFileRoute("/_admin/admin/requests")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_admin.admin.policies-BGckC7lP.mjs");
const Route$1 = createFileRoute("/_admin/admin/policies")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("../_admin.admin.employees-CkfuEgPx.mjs");
const Route = createFileRoute("/_admin/admin/employees")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResetPasswordRoute = Route$e.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$f
});
const LoginRoute = Route$d.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$f
});
const ForgotPasswordRoute = Route$c.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$f
});
const AuthenticatedRoute = Route$b.update({
  id: "/_authenticated",
  getParentRoute: () => Route$f
});
const AdminRoute = Route$a.update({
  id: "/_admin",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const AuthenticatedRequestsRoute = Route$8.update({
  id: "/requests",
  path: "/requests",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedOvertimeRoute = Route$7.update({
  id: "/overtime",
  path: "/overtime",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedLeaveBalanceRoute = Route$6.update({
  id: "/leave-balance",
  path: "/leave-balance",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedHomeRoute = Route$5.update({
  id: "/home",
  path: "/home",
  getParentRoute: () => AuthenticatedRoute
});
const AdminAdminRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AdminRoute
});
const AuthenticatedRequestsNewRoute = Route$3.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => AuthenticatedRequestsRoute
});
const AdminAdminRequestsRoute = Route$2.update({
  id: "/requests",
  path: "/requests",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminPoliciesRoute = Route$1.update({
  id: "/policies",
  path: "/policies",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminEmployeesRoute = Route.update({
  id: "/employees",
  path: "/employees",
  getParentRoute: () => AdminAdminRoute
});
const AdminAdminRouteChildren = {
  AdminAdminEmployeesRoute,
  AdminAdminPoliciesRoute,
  AdminAdminRequestsRoute
};
const AdminAdminRouteWithChildren = AdminAdminRoute._addFileChildren(
  AdminAdminRouteChildren
);
const AdminRouteChildren = {
  AdminAdminRoute: AdminAdminRouteWithChildren
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const AuthenticatedRequestsRouteChildren = {
  AuthenticatedRequestsNewRoute
};
const AuthenticatedRequestsRouteWithChildren = AuthenticatedRequestsRoute._addFileChildren(
  AuthenticatedRequestsRouteChildren
);
const AuthenticatedRouteChildren = {
  AuthenticatedHomeRoute,
  AuthenticatedLeaveBalanceRoute,
  AuthenticatedOvertimeRoute,
  AuthenticatedRequestsRoute: AuthenticatedRequestsRouteWithChildren
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute,
  ResetPasswordRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$d as R,
  getSafeRedirectPath as g,
  router as r
};
