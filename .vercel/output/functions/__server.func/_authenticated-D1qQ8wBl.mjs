import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useNavigate, e as useRouterState, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { s as supabase } from "./_ssr/client-BHmQHd0X.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import { g as getMe } from "./_ssr/auth.functions-D_V2tK8p.mjs";
import "./_libs/seroval.mjs";
import { L as LayoutGrid, F as FileText, f as CirclePlus, g as Clock, C as Calendar, o as Shield, G as Globe, k as LogOut, B as Bell } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_ssr/server-BJi-LNnB.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_ssr/auth-middleware-956KE-yS.mjs";
const NAV = [{
  to: "/home",
  label: "Trang chủ",
  icon: LayoutGrid
}, {
  to: "/requests",
  label: "Đơn của tôi",
  icon: FileText
}, {
  to: "/requests/new",
  label: "Tạo đơn",
  icon: CirclePlus
}, {
  to: "/overtime",
  label: "Tăng ca",
  icon: Clock
}, {
  to: "/leave-balance",
  label: "Số dư phép",
  icon: Calendar
}];
function AuthLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const meFn = useServerFn(getMe);
  const [profile, setProfile] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    meFn().then((r) => {
      if (r.profile) setProfile({
        full_name: r.profile.full_name,
        email: r.profile.email
      });
      setIsAdmin(r.isAdmin);
    }).catch(() => {
    });
  }, [meFn]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/login"
    });
  };
  const initial = (profile?.full_name ?? "?").charAt(0).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-muted/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 bg-sidebar border-r border-sidebar-border flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center gap-3 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-sm", children: "KAS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "KIT Attendance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 p-3 space-y-1", children: [
        NAV.map((item) => {
          const active = pathname === item.to || item.to !== "/home" && pathname.startsWith(item.to);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            " ",
            item.label
          ] }, item.to);
        }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 border-t mt-2 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
          " Cổng quản trị"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-sidebar-border space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/40 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground grid place-items-center font-semibold shadow-sm shrink-0", children: profile ? initial : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 rounded-full bg-primary-foreground/30 animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold truncate", children: profile.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: profile.email })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-24 rounded bg-muted animate-pulse mb-1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-32 rounded bg-muted/60 animate-pulse" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex-1 flex items-center justify-center gap-2 rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            " Tiếng Việt"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: handleLogout, "aria-label": "Đăng xuất", title: "Đăng xuất", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 bg-background border-b flex items-center justify-between px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PageTitle, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative h-9 w-9 rounded-full grid place-items-center hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-8 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
function PageTitle() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const item = NAV.find((n) => n.to === pathname || n.to !== "/home" && pathname.startsWith(n.to));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", children: item?.label ?? "" });
}
export {
  AuthLayout as component
};
