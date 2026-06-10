import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { a as useQuery } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { e as getMyLeaveBalance } from "./_ssr/requests.functions-D16rs9rZ.mjs";
import { B as Badge } from "./_ssr/badge-DyfXZgLs.mjs";
import { R as Root, I as Indicator } from "./_libs/radix-ui__react-progress.mjs";
import { c as cn } from "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/seroval.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-router.mjs";
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
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/tailwind-merge.mjs";
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
const STATUS_VI = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  cancelled: "Đã hủy"
};
function LeaveBalancePage() {
  const fn = useServerFn(getMyLeaveBalance);
  const {
    data
  } = useQuery({
    queryKey: ["my-leave-balance"],
    queryFn: () => fn()
  });
  const b = data?.balance ?? {
    entitled: 15,
    used: 0,
    carried_over: 0,
    year: (/* @__PURE__ */ new Date()).getFullYear()
  };
  const total = Number(b.entitled) + Number(b.carried_over);
  const remaining = total - Number(b.used);
  const pct = total > 0 ? Number(b.used) / total * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Phép cơ bản", value: b.entitled }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Phép chuyển từ năm trước", value: b.carried_over }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Đã dùng", value: b.used }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { label: "Còn lại", value: remaining, highlight: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
          "Tiến độ sử dụng phép năm ",
          b.year
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          b.used,
          " / ",
          total,
          " ngày"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 font-semibold", children: "Lịch sử nghỉ phép" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Mã" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Loại" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Từ - Đến" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Số ngày" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Trạng thái" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (data?.history ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-8 text-center text-muted-foreground", children: "Chưa có dữ liệu" }) }),
          data?.history.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs", children: r.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.leave_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
              r.start_date,
              " → ",
              r.end_date
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.days }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: STATUS_VI[r.status] }) })
          ] }, r.id))
        ] })
      ] })
    ] })
  ] });
}
function Card({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `border rounded-xl p-5 ${highlight ? "bg-primary text-primary-foreground" : "bg-card"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${highlight ? "opacity-90" : "text-muted-foreground"}`, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold mt-2", children: value })
  ] });
}
export {
  LeaveBalancePage as component
};
