import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { u as useNavigate, L as Link } from "./_libs/tanstack__react-router.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { b as createLeaveRequest, a as createLateEarlyRequest, d as createOvertimeRequest, h as getRequestFormContext } from "./_ssr/requests.functions-D16rs9rZ.mjs";
import { s as supabase } from "./_ssr/client-BHmQHd0X.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import { I as Input } from "./_ssr/input-C0QjszdI.mjs";
import { L as Label } from "./_ssr/label-JU3yqRBo.mjs";
import { T as Textarea } from "./_ssr/textarea-DSyJ1nlY.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-NX1S2Qd-.mjs";
import { B as Badge } from "./_ssr/badge-DyfXZgLs.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import { a as CalendarDays, g as Clock, T as Timer, I as Info, q as TriangleAlert, P as Paperclip, X } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
function diffMinutes(a, b) {
  if (!a || !b) return 0;
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}
function countDaysInclusive(start, end) {
  if (!start || !end) return 0;
  const s = (/* @__PURE__ */ new Date(start + "T00:00:00")).getTime();
  const e = (/* @__PURE__ */ new Date(end + "T00:00:00")).getTime();
  if (e < s) return 0;
  return Math.floor((e - s) / 864e5) + 1;
}
function FieldError({
  msg
}) {
  if (!msg) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: msg });
}
function NewRequestPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [kind, setKind] = reactExports.useState("leave");
  const ctxFn = useServerFn(getRequestFormContext);
  const {
    data: ctx
  } = useQuery({
    queryKey: ["request-form-context"],
    queryFn: () => ctxFn()
  });
  const leaveFn = useServerFn(createLeaveRequest);
  const leFn = useServerFn(createLateEarlyRequest);
  const otFn = useServerFn(createOvertimeRequest);
  const onSuccess = () => {
    toast.success("Đã gửi đơn, chờ duyệt");
    qc.invalidateQueries({
      queryKey: ["my-requests"]
    });
    qc.invalidateQueries({
      queryKey: ["request-form-context"]
    });
    navigate({
      to: "/requests"
    });
  };
  const onError = (e) => toast.error(e?.message ?? "Không gửi được đơn, vui lòng thử lại");
  const mLeave = useMutation({
    mutationFn: (d) => leaveFn({
      data: d
    }),
    onSuccess,
    onError
  });
  const mLe = useMutation({
    mutationFn: (d) => leFn({
      data: d
    }),
    onSuccess,
    onError
  });
  const mOt = useMutation({
    mutationFn: (d) => otFn({
      data: d
    }),
    onSuccess,
    onError
  });
  const KIND_OPTIONS = [{
    v: "leave",
    l: "Nghỉ phép",
    d: "Cả ngày, nửa ngày hoặc theo giờ",
    Icon: CalendarDays
  }, {
    v: "late_early",
    l: "Đi muộn / Về sớm",
    d: "Khai báo vi phạm giờ làm",
    Icon: Clock
  }, {
    v: "overtime",
    l: "Tăng ca",
    d: "Đăng ký làm ngoài giờ",
    Icon: Timer
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Tạo đơn mới" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Điền thông tin chính xác. Đơn sẽ ở trạng thái ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Chờ duyệt" }),
        " sau khi gửi."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: KIND_OPTIONS.map((o) => {
      const active = kind === o.v;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setKind(o.v), className: `text-left p-4 rounded-xl border transition-colors ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:bg-muted/40"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-lg flex items-center justify-center ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(o.Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: o.l }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: o.d })
        ] })
      ] }) }, o.v);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border rounded-xl p-6", children: [
      kind === "leave" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeaveForm, { ctx, loading: mLeave.isPending, onSubmit: (d) => mLeave.mutate(d), onCancel: () => navigate({
        to: "/requests"
      }) }),
      kind === "late_early" && /* @__PURE__ */ jsxRuntimeExports.jsx(LeForm, { ctx, loading: mLe.isPending, onSubmit: (d) => mLe.mutate(d), onCancel: () => navigate({
        to: "/requests"
      }) }),
      kind === "overtime" && /* @__PURE__ */ jsxRuntimeExports.jsx(OtForm, { ctx, loading: mOt.isPending, onSubmit: (d) => mOt.mutate(d), onCancel: () => navigate({
        to: "/requests"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
      "Xem lại các đơn đã gửi tại",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/requests", className: "text-primary underline", children: "Đơn của tôi" }),
      "."
    ] })
  ] });
}
function AttachmentField({
  value,
  onChange
}) {
  const [uploading, setUploading] = reactExports.useState(false);
  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Chỉ hỗ trợ JPG, PNG, WEBP hoặc PDF");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File vượt quá 10MB");
      return;
    }
    setUploading(true);
    try {
      const {
        data: userData
      } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Phiên đăng nhập hết hạn");
      const ext = file.name.split(".").pop() || "bin";
      const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const {
        error
      } = await supabase.storage.from("attachments").upload(path, file, {
        upsert: false,
        contentType: file.type
      });
      if (error) throw error;
      onChange({
        path,
        name: file.name
      });
      toast.success("Đã tải file lên");
    } catch (err) {
      toast.error(err.message ?? "Tải file thất bại");
    } finally {
      setUploading(false);
    }
  };
  const remove = async () => {
    if (!value) return;
    await supabase.storage.from("attachments").remove([value.path]).catch(() => {
    });
    onChange(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Đính kèm (tùy chọn)" }),
    value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 px-3 border rounded-md bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: value.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "ghost", onClick: remove, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-center gap-2 p-3 border border-dashed rounded-md cursor-pointer hover:bg-muted/40 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" }),
      uploading ? "Đang tải lên…" : "Chọn file (JPG/PNG/WEBP/PDF, ≤10MB)",
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", className: "hidden", accept: ALLOWED_TYPES.join(","), onChange: handleSelect, disabled: uploading })
    ] })
  ] });
}
function LeaveForm({
  ctx,
  loading,
  onSubmit,
  onCancel
}) {
  const [leave_type, setType] = reactExports.useState("fullday");
  const [start_date, setStart] = reactExports.useState("");
  const [end_date, setEnd] = reactExports.useState("");
  const [halfday_session, setSession] = reactExports.useState("morning");
  const [start_time, setStartTime] = reactExports.useState("");
  const [end_time, setEndTime] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [attachment, setAttachment] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if ((leave_type === "halfday" || leave_type === "hourly") && start_date) {
      setEnd(start_date);
    }
  }, [leave_type, start_date]);
  const wh = ctx?.policy?.working_hours;
  const workHours = wh ? Math.max(1, (diffMinutes(wh.start, wh.end) - (wh.lunch_minutes ?? 0)) / 60) : 8;
  const computed = reactExports.useMemo(() => {
    if (leave_type === "fullday") {
      const days2 = countDaysInclusive(start_date, end_date);
      return {
        days: days2,
        hours: days2 * workHours
      };
    }
    if (leave_type === "halfday") return {
      days: 0.5,
      hours: 4
    };
    const mins = diffMinutes(start_time, end_time);
    const hours = mins > 0 ? Math.round(mins / 60 * 100) / 100 : 0;
    const days = hours > 0 ? Math.round(hours / workHours * 100) / 100 : 0;
    return {
      days,
      hours
    };
  }, [leave_type, start_date, end_date, start_time, end_time, workHours]);
  const errors = {};
  if (!start_date) errors.start_date = "Bắt buộc";
  if (!end_date) errors.end_date = "Bắt buộc";
  if (start_date && end_date && new Date(end_date) < new Date(start_date)) errors.end_date = "Phải sau ngày bắt đầu";
  if (leave_type === "hourly") {
    if (!start_time) errors.start_time = "Bắt buộc";
    if (!end_time) errors.end_time = "Bắt buộc";
    if (start_time && end_time && diffMinutes(start_time, end_time) <= 0) errors.end_time = "Phải sau giờ bắt đầu";
  }
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";
  const balance = ctx?.balance;
  const overBalance = balance && computed.days > Number(balance.available) + 1e-4;
  if (overBalance) errors.balance = `Vượt số dư phép (còn ${balance.available} ngày)`;
  const isValid = Object.keys(errors).length === 0 && computed.days > 0;
  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      leave_type,
      start_date,
      end_date,
      halfday_session: leave_type === "halfday" ? halfday_session : void 0,
      start_time: leave_type === "hourly" ? start_time : void 0,
      end_time: leave_type === "hourly" ? end_time : void 0,
      reason: reason.trim(),
      attachment_path: attachment?.path
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
    balance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCell, { label: "Phép năm", value: `${balance.entitled} ngày` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCell, { label: "Đã dùng", value: `${balance.used} ngày` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCell, { label: "Đang chờ duyệt", value: `${balance.pending_days} ngày` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BalanceCell, { label: "Còn lại có thể dùng", value: `${balance.available} ngày`, highlight: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Loại nghỉ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: leave_type, onValueChange: (v) => setType(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fullday", children: "Cả ngày" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "halfday", children: "Nửa ngày" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hourly", children: "Theo giờ" })
          ] })
        ] })
      ] }),
      leave_type === "halfday" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Buổi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["morning", "afternoon"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setSession(s), className: `p-3 border rounded-md text-sm ${halfday_session === s ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/40"}`, children: s === "morning" ? "Buổi sáng" : "Buổi chiều" }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Từ ngày" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: start_date, onChange: (e) => setStart(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.start_date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Đến ngày" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: end_date, onChange: (e) => setEnd(e.target.value), disabled: leave_type !== "fullday" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.end_date })
      ] }),
      leave_type === "hourly" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Giờ bắt đầu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: start_time, onChange: (e) => setStartTime(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.start_time })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Giờ kết thúc" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: end_time, onChange: (e) => setEndTime(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.end_time })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Tổng cộng: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: computed.days }),
        " ngày",
        computed.hours ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " ",
          "(~",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: computed.hours }),
          " giờ)"
        ] }) : null
      ] })
    ] }),
    overBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex items-center gap-2 text-sm text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      errors.balance
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Lý do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Mô tả ngắn gọn lý do nghỉ" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.reason })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentField, { value: attachment, onChange: setAttachment }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Hủy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: !isValid || loading, children: loading ? "Đang gửi…" : "Gửi đơn" })
    ] })
  ] });
}
function BalanceCell({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border p-3 ${highlight ? "border-primary bg-primary/5" : "bg-muted/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-semibold ${highlight ? "text-primary" : ""}`, children: value })
  ] });
}
function LeForm({
  ctx,
  loading,
  onSubmit,
  onCancel
}) {
  const [kind, setKind] = reactExports.useState("late");
  const [date, setDate] = reactExports.useState("");
  const [actual_time, setTime] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [attachment, setAttachment] = reactExports.useState(null);
  const wh = ctx?.policy?.working_hours ?? {
    start: "08:30",
    end: "17:30"
  };
  const grace = Number(ctx?.policy?.late_early_rules?.grace_minutes ?? 0);
  const standard = kind === "late" ? wh.start : wh.end;
  const violation = reactExports.useMemo(() => {
    if (!actual_time) return 0;
    const raw = kind === "late" ? diffMinutes(standard, actual_time) : diffMinutes(actual_time, standard);
    return Math.max(0, raw - grace);
  }, [kind, actual_time, standard, grace]);
  const errors = {};
  if (!date) errors.date = "Bắt buộc";
  if (!actual_time) errors.actual_time = "Bắt buộc";
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";
  if (actual_time && violation <= 0) errors.violation = `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)`;
  const isValid = Object.keys(errors).length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      kind,
      date,
      actual_time,
      reason: reason.trim(),
      attachment_path: attachment?.path
    });
  }, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Loại vi phạm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["late", "early"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setKind(k), className: `p-3 border rounded-md text-sm ${kind === k ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/40"}`, children: k === "late" ? "Đi muộn" : "Về sớm" }, k)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ngày" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
          "Giờ chuẩn",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1", children: standard })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: standard, disabled: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Giờ thực tế" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: actual_time, onChange: (e) => setTime(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.actual_time })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Số phút vi phạm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: violation, disabled: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-primary" }),
      "Ân hạn tối đa ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        " ",
        grace,
        " "
      ] }),
      " phút theo quy định. Vi phạm tính sau ân hạn."
    ] }),
    errors.violation && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex items-center gap-2 text-sm text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      errors.violation
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Lý do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Lý do đi muộn / về sớm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.reason })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentField, { value: attachment, onChange: setAttachment }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Hủy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: !isValid || loading, children: loading ? "Đang gửi…" : "Gửi đơn" })
    ] })
  ] });
}
function OtForm({
  ctx,
  loading,
  onSubmit,
  onCancel
}) {
  const [date, setDate] = reactExports.useState("");
  const [start_time, setStart] = reactExports.useState("");
  const [end_time, setEnd] = reactExports.useState("");
  const [project, setProject] = reactExports.useState("");
  const [reason, setReason] = reactExports.useState("");
  const [attachment, setAttachment] = reactExports.useState(null);
  const roundStep = Number(ctx?.policy?.overtime_rules?.rounding_minutes ?? 30);
  const minOt = Number(ctx?.policy?.overtime_rules?.min_minutes ?? 0);
  const mins = diffMinutes(start_time, end_time);
  const actual = mins > 0 ? mins : 0;
  const roundedMinutes = Math.floor(actual / roundStep) * roundStep;
  const rounded = Math.round(roundedMinutes / 60 * 100) / 100;
  const errors = {};
  if (!date) errors.date = "Bắt buộc";
  if (!start_time) errors.start_time = "Bắt buộc";
  if (!end_time) errors.end_time = "Bắt buộc";
  if (start_time && end_time && mins <= 0) errors.end_time = "Phải sau giờ bắt đầu";
  if (actual > 0 && actual < minOt) errors.end_time = `Tối thiểu ${minOt} phút`;
  if (project.trim().length === 0) errors.project = "Bắt buộc";
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";
  const isValid = Object.keys(errors).length === 0 && actual > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      date,
      start_time,
      end_time,
      project: project.trim(),
      reason: reason.trim(),
      attachment_path: attachment?.path
    });
  }, className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ngày tăng ca" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: date, onChange: (e) => setDate(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Từ giờ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: start_time, onChange: (e) => setStart(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.start_time })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Đến giờ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "time", value: end_time, onChange: (e) => setEnd(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.end_time })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Số phút thực tế" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: actual, disabled: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Số giờ làm tròn" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: rounded, disabled: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Dự án / Nội dung công việc" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: project, onChange: (e) => setProject(e.target.value), placeholder: "Tên dự án hoặc công việc" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.project })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-primary" }),
      "Làm tròn theo bước ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        " ",
        roundStep,
        " "
      ] }),
      " phút. Tối thiểu ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        " ",
        minOt,
        " "
      ] }),
      " phút."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Lý do" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Lý do cần tăng ca" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { msg: errors.reason })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentField, { value: attachment, onChange: setAttachment }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Hủy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: !isValid || loading, children: loading ? "Đang gửi…" : "Gửi đơn" })
    ] })
  ] });
}
export {
  NewRequestPage as component
};
