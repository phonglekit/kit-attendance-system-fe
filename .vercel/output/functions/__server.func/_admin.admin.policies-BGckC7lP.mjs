import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { i as updatePolicySettings, e as getPolicySettings } from "./_ssr/admin.functions-DjN6pLOV.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import { I as Input } from "./_ssr/input-C0QjszdI.mjs";
import { L as Label } from "./_ssr/label-JU3yqRBo.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import { h as LoaderCircle, S as Save } from "./_libs/lucide-react.mjs";
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
import "./_libs/tanstack__query-core.mjs";
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
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-primitive.mjs";
function PoliciesPage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getPolicySettings);
  const updateFn = useServerFn(updatePolicySettings);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["policy-settings"],
    queryFn: () => getFn()
  });
  const [form, setForm] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  const mutation = useMutation({
    mutationFn: (p) => updateFn({
      data: p
    }),
    onSuccess: () => {
      toast.success("Đã lưu cấu hình chính sách");
      qc.invalidateQueries({
        queryKey: ["policy-settings"]
      });
      qc.invalidateQueries({
        queryKey: ["request-form-context"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (isLoading || !form) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-20 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin mr-2" }),
      " Đang tải…"
    ] });
  }
  const update = (key, patch) => setForm((f) => f ? {
    ...f,
    [key]: {
      ...f[key],
      ...patch
    }
  } : f);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Cấu hình chính sách" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Các thiết lập này được áp dụng khi nhân viên tạo đơn (giờ làm chuẩn, ngày nghỉ phép, làm tròn OT, ngưỡng đi muộn/về sớm)." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Giờ làm việc chuẩn", description: "Áp dụng cho tính ngày nghỉ và quy đổi giờ → ngày.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Giờ bắt đầu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: form.working_hours.start, onChange: (e) => update("working_hours", {
        start: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Giờ kết thúc", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: form.working_hours.end, onChange: (e) => update("working_hours", {
        end: e.target.value
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nghỉ trưa (phút)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 240, value: form.working_hours.lunch_minutes, onChange: (e) => update("working_hours", {
        lunch_minutes: Number(e.target.value)
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Nghỉ phép", description: "Số ngày phép cơ bản và mức tồn chuyển sang năm sau.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Số ngày phép/năm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 365, value: form.leave_rules.annual_entitlement, onChange: (e) => update("leave_rules", {
        annual_entitlement: Number(e.target.value)
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tối đa được chuyển sang năm sau", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 365, value: form.leave_rules.carry_over_max, onChange: (e) => update("leave_rules", {
        carry_over_max: Number(e.target.value)
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Tăng ca (OT)", description: "Tổng số phút tối thiểu được tính OT và mức làm tròn.", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tối thiểu (phút)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 480, value: form.overtime_rules.min_minutes, onChange: (e) => update("overtime_rules", {
        min_minutes: Number(e.target.value)
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Làm tròn theo (phút)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, max: 120, value: form.overtime_rules.rounding_minutes, onChange: (e) => update("overtime_rules", {
        rounding_minutes: Number(e.target.value)
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Đi muộn / Về sớm", description: "Khoảng thời gian được bỏ qua (không tính vi phạm).", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Cho phép trễ (phút)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 120, value: form.late_early_rules.grace_minutes, onChange: (e) => update("late_early_rules", {
      grace_minutes: Number(e.target.value)
    }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => data && setForm(data), disabled: mutation.isPending, children: "Hoàn tác" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => form && mutation.mutate(form), disabled: mutation.isPending, children: [
        mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
        "Lưu thay đổi"
      ] })
    ] })
  ] });
}
function Section({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: label }),
    children
  ] });
}
export {
  PoliciesPage as component
};
