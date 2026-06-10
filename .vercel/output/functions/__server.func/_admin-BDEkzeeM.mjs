import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useNavigate, e as useRouterState, L as Link, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { s as supabase } from "./_ssr/client-BHmQHd0X.mjs";
import { g as getMe } from "./_ssr/auth.functions-D_V2tK8p.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import "./_libs/seroval.mjs";
import { L as LayoutGrid, U as Users, F as FileText, n as Settings, k as LogOut, B as Bell } from "./_libs/lucide-react.mjs";
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
import "./_ssr/auth-middleware-956KE-yS.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/tailwind-merge.mjs";
const NAV = [{
  to: "/admin",
  label: "Tổng quan",
  icon: LayoutGrid
}, {
  to: "/admin/employees",
  label: "Quản lý nhân viên",
  icon: Users
}, {
  to: "/admin/requests",
  label: "Quản lý đơn",
  icon: FileText
}, {
  to: "/admin/policies",
  label: "Cấu hình chính sách",
  icon: Settings
}];
function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const meFn = useServerFn(getMe);
  const [me, setMe] = reactExports.useState({});
  const [checking, setChecking] = reactExports.useState(true);
  reactExports.useEffect(() => {
    meFn().then((r) => {
      if (!r.isAdmin) {
        navigate({
          to: "/home"
        });
        return;
      }
      setMe({
        full_name: r.profile?.full_name,
        email: r.profile?.email
      });
      setChecking(false);
    }).catch(() => navigate({
      to: "/login"
    }));
  }, [navigate, meFn]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/login"
    });
  };
  if (checking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center text-sm text-muted-foreground", children: "Đang kiểm tra quyền quản trị…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-muted/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 bg-sidebar border-r border-sidebar-border flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center gap-3 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-sm", children: "KAS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "KIT Attendance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Quản trị" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 p-3 space-y-1", children: [
        NAV.map((item) => {
          const active = pathname === item.to || item.to !== "/admin" && pathname.startsWith(item.to);
          const Icon = item.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.to, className: `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            " ",
            item.label
          ] }, item.to);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/home", className: "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
          " Cổng nhân viên"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-sidebar-border space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 rounded-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary-soft text-primary grid place-items-center font-semibold", children: (me.full_name ?? "?").charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold truncate", children: me.full_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: me.email ?? "" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", onClick: handleLogout, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 mr-2" }),
          " Đăng xuất"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 bg-background border-b flex items-center justify-between px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", children: NAV.find((n) => n.to === pathname || n.to !== "/admin" && pathname.startsWith(n.to))?.label ?? "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "h-9 w-9 rounded-full grid place-items-center hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-8 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AdminLayout as component
};
