import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { g as getMyDashboard } from "./_ssr/requests.functions-D16rs9rZ.mjs";
import "./_libs/seroval.mjs";
import { F as FileText, e as CircleCheck, C as Calendar, g as Clock, f as CirclePlus } from "./_libs/lucide-react.mjs";
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
function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary"
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-sky-100 text-sky-700"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-9 w-9 grid place-items-center rounded-lg ${toneClass[tone]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-3xl font-bold", children: value }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: hint })
  ] });
}
function HomePage() {
  const fn = useServerFn(getMyDashboard);
  const {
    data
  } = useQuery({
    queryKey: ["my-dashboard"],
    queryFn: () => fn()
  });
  const d = data ?? {
    pending: 0,
    approvedThisMonth: 0,
    leaveRemaining: 0,
    otHoursThisMonth: 0
  };
  const tiles = [{
    to: "/requests/new",
    icon: CirclePlus,
    label: "Tạo đơn mới"
  }, {
    to: "/requests",
    icon: FileText,
    label: "Đơn của tôi"
  }, {
    to: "/overtime",
    icon: Clock,
    label: "Tăng ca"
  }, {
    to: "/leave-balance",
    icon: Calendar,
    label: "Số dư phép"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: FileText, label: "Đơn chờ duyệt", value: d.pending, hint: "Đang xử lý", tone: "warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheck, label: "Đã duyệt tháng này", value: d.approvedThisMonth, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Calendar, label: "Phép còn lại", value: d.leaveRemaining, hint: "ngày", tone: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: "Tăng ca tháng này", value: d.otHoursThisMonth, hint: "giờ", tone: "info" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold mb-3", children: "Thao tác nhanh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: tiles.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: "bg-card border rounded-xl p-5 hover:border-primary transition-colors flex flex-col items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-10 w-10 grid place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t.label })
      ] }, t.to)) })
    ] })
  ] });
}
export {
  HomePage as component
};
