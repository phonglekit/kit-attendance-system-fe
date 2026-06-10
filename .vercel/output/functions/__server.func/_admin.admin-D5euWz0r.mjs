import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useRouterState, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { g as getAdminDashboard } from "./_ssr/admin.functions-DjN6pLOV.mjs";
import "./_libs/seroval.mjs";
import { U as Users, F as FileText, e as CircleCheck, g as Clock } from "./_libs/lucide-react.mjs";
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
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/server-BJi-LNnB.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-956KE-yS.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/zod.mjs";
function AdminSection() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  if (pathname !== "/admin") return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, {});
}
function AdminDashboard() {
  const fn = useServerFn(getAdminDashboard);
  const {
    data
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => fn()
  });
  const d = data ?? {
    employees: 0,
    pending: 0,
    approved: 0,
    otMonth: 0
  };
  const cards = [{
    icon: Users,
    label: "Tổng nhân viên",
    value: d.employees
  }, {
    icon: FileText,
    label: "Đơn chờ duyệt",
    value: d.pending
  }, {
    icon: CircleCheck,
    label: "Đã duyệt",
    value: d.approved
  }, {
    icon: Clock,
    label: "Giờ OT tháng này",
    value: `${d.otMonth}h`
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: c.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-9 w-9 grid place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-3xl font-bold", children: c.value })
  ] }, c.label)) });
}
export {
  AdminSection as component
};
