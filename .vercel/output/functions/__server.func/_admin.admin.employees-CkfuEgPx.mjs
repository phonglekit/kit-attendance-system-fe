import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { b as useQueryClient, a as useQuery, u as useMutation } from "./_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./_ssr/createSsrRpc-BssKMh3G.mjs";
import { c as createEmployeeAccount, u as updateEmployee, a as deleteEmployee, s as setEmployeeActive, h as listEmployees, f as listDepartments } from "./_ssr/admin.functions-DjN6pLOV.mjs";
import { B as Button } from "./_ssr/button-DA2gxxPy.mjs";
import { I as Input } from "./_ssr/input-C0QjszdI.mjs";
import { L as Label } from "./_ssr/label-JU3yqRBo.mjs";
import { S as Select, c as SelectTrigger, d as SelectValue, a as SelectContent, b as SelectItem } from "./_ssr/select-NX1S2Qd-.mjs";
import { C as Checkbox } from "./_ssr/checkbox-mmp_duDa.mjs";
import { D as Dialog, e as DialogTrigger, a as DialogContent, c as DialogHeader, d as DialogTitle, b as DialogFooter } from "./_ssr/dialog-B3Vp7yo_.mjs";
import { A as AlertDialog, c as AlertDialogContent, f as AlertDialogHeader, g as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, b as AlertDialogCancel, a as AlertDialogAction } from "./_ssr/alert-dialog-N6xqGEhh.mjs";
import { B as Badge } from "./_ssr/badge-DyfXZgLs.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import { m as Plus, i as Lock, j as LockOpen, l as Pencil, p as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-checkbox.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__react-alert-dialog.mjs";
const ALL_ROLES = ["employee", "hr", "manager", "admin"];
function EmployeesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listEmployees);
  const deptFn = useServerFn(listDepartments);
  const createFn = useServerFn(createEmployeeAccount);
  const updateFn = useServerFn(updateEmployee);
  const deleteFn = useServerFn(deleteEmployee);
  const setActiveFn = useServerFn(setEmployeeActive);
  const {
    data: employees = []
  } = useQuery({
    queryKey: ["admin-employees"],
    queryFn: () => listFn()
  });
  const {
    data: depts = []
  } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: () => deptFn()
  });
  const [open, setOpen] = reactExports.useState(false);
  const emptyForm = {
    email: "",
    password: "",
    full_name: "",
    employee_code: "",
    title: "",
    department_id: void 0,
    join_date: "",
    role: "employee",
    leave_entitled: 15
  };
  const [form, setForm] = reactExports.useState(emptyForm);
  const create = useMutation({
    mutationFn: () => createFn({
      data: {
        ...form,
        department_id: form.department_id || void 0,
        join_date: form.join_date || void 0
      }
    }),
    onSuccess: () => {
      toast.success("Đã tạo tài khoản nhân viên");
      setOpen(false);
      setForm(emptyForm);
      qc.invalidateQueries({
        queryKey: ["admin-employees"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const [editing, setEditing] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState(null);
  const openEdit = (e) => {
    setEditing(e);
    setEditForm({
      user_id: e.id,
      full_name: e.full_name ?? "",
      employee_code: e.employee_code ?? "",
      title: e.title ?? "",
      department_id: e.department_id ?? void 0,
      join_date: e.join_date ?? "",
      status: e.status ?? "active",
      roles: e.roles?.length ? e.roles : ["employee"],
      leave_entitled: void 0,
      new_password: ""
    });
  };
  const update = useMutation({
    mutationFn: () => updateFn({
      data: {
        ...editForm,
        department_id: editForm.department_id || void 0,
        join_date: editForm.join_date || void 0,
        new_password: editForm.new_password ? editForm.new_password : void 0
      }
    }),
    onSuccess: () => {
      toast.success("Đã cập nhật");
      setEditing(null);
      setEditForm(null);
      qc.invalidateQueries({
        queryKey: ["admin-employees"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const [toDelete, setToDelete] = reactExports.useState(null);
  const remove = useMutation({
    mutationFn: (id) => deleteFn({
      data: {
        user_id: id
      }
    }),
    onSuccess: () => {
      toast.success("Đã xoá nhân viên");
      setToDelete(null);
      qc.invalidateQueries({
        queryKey: ["admin-employees"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const [toToggle, setToToggle] = reactExports.useState(null);
  const toggleActive = useMutation({
    mutationFn: (vars) => setActiveFn({
      data: {
        user_id: vars.id,
        active: vars.active
      }
    }),
    onSuccess: (_d, vars) => {
      toast.success(vars.active ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
      setToToggle(null);
      qc.invalidateQueries({
        queryKey: ["admin-employees"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleEditRole = (r) => setEditForm((f) => {
    const has = f.roles.includes(r);
    const next = has ? f.roles.filter((x) => x !== r) : [...f.roles, r];
    return {
      ...f,
      roles: next.length ? next : f.roles
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        " Tạo tài khoản nhân viên"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Tạo tài khoản nhân viên mới" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          create.mutate();
        }, className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Họ và tên" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: form.full_name, onChange: (e) => setForm({
              ...form,
              full_name: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email đăng nhập" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: form.email, onChange: (e) => setForm({
              ...form,
              email: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mật khẩu khởi tạo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", required: true, minLength: 8, value: form.password, onChange: (e) => setForm({
              ...form,
              password: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mã nhân viên" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.employee_code, onChange: (e) => setForm({
              ...form,
              employee_code: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chức danh" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title, onChange: (e) => setForm({
              ...form,
              title: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phòng ban" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.department_id ?? "", onValueChange: (v) => setForm({
              ...form,
              department_id: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chọn phòng ban" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: depts.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.id, children: d.name }, d.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ngày vào làm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.join_date, onChange: (e) => setForm({
              ...form,
              join_date: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Vai trò" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.role, onValueChange: (v) => setForm({
              ...form,
              role: v
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "employee", children: "Nhân viên" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hr", children: "Nhân sự" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manager", children: "Quản lý" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Quản trị viên" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phép năm (ngày)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 100, value: form.leave_entitled, onChange: (e) => setForm({
              ...form,
              leave_entitled: Number(e.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setOpen(false), children: "Hủy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: create.isPending, children: create.isPending ? "Đang tạo…" : "Tạo tài khoản" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Mã NV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Họ tên" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Chức danh" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Vai trò" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Trạng thái" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Thao tác" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        employees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-8 text-center text-muted-foreground", children: "Chưa có nhân viên" }) }),
        employees.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-xs", children: e.employee_code ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: e.full_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: e.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: e.title ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 space-x-1", children: e.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: r }, r)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: e.status === "active" ? "default" : "secondary", children: e.status === "active" ? "Đang hoạt động" : "Đã khóa" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right space-x-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setToToggle(e), title: e.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản", children: e.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => openEdit(e), title: "Sửa", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setToDelete(e), title: "Xoá", className: "text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }, e.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editing, onOpenChange: (v) => {
      if (!v) {
        setEditing(null);
        setEditForm(null);
      }
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Sửa thông tin ",
        editing?.full_name
      ] }) }),
      editForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        update.mutate();
      }, className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Họ và tên" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: editForm.full_name, onChange: (e) => setEditForm({
            ...editForm,
            full_name: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mã nhân viên" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editForm.employee_code, onChange: (e) => setEditForm({
            ...editForm,
            employee_code: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Chức danh" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: editForm.title, onChange: (e) => setEditForm({
            ...editForm,
            title: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phòng ban" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editForm.department_id ?? "", onValueChange: (v) => setEditForm({
            ...editForm,
            department_id: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Chọn phòng ban" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: depts.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d.id, children: d.name }, d.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ngày vào làm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: editForm.join_date ?? "", onChange: (e) => setEditForm({
            ...editForm,
            join_date: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Trạng thái" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: editForm.status, onValueChange: (v) => setEditForm({
            ...editForm,
            status: v
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Đang làm việc" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Đã nghỉ" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phép năm (để trống = không đổi)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 100, value: editForm.leave_entitled ?? "", onChange: (e) => setEditForm({
            ...editForm,
            leave_entitled: e.target.value === "" ? void 0 : Number(e.target.value)
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Vai trò (có thể chọn nhiều)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 p-3 border rounded-md", children: ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: editForm.roles.includes(r), onCheckedChange: () => toggleEditRole(r) }),
            r
          ] }, r)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Đặt lại mật khẩu (để trống = không đổi)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "text", minLength: 8, value: editForm.new_password, onChange: (e) => setEditForm({
            ...editForm,
            new_password: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => {
            setEditing(null);
            setEditForm(null);
          }, children: "Hủy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: update.isPending, children: update.isPending ? "Đang lưu…" : "Lưu thay đổi" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!toDelete, onOpenChange: (v) => {
      if (!v) setToDelete(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Xoá nhân viên?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Hành động này sẽ xoá tài khoản đăng nhập của ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: toDelete?.full_name }),
          " (",
          toDelete?.email,
          ") và toàn bộ dữ liệu liên quan. Không thể hoàn tác."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Hủy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          if (toDelete) remove.mutate(toDelete.id);
        }, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: remove.isPending ? "Đang xoá…" : "Xoá" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!toToggle, onOpenChange: (v) => {
      if (!v) setToToggle(null);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: toToggle?.status === "active" ? "Khóa tài khoản này?" : "Mở khóa tài khoản này?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: toToggle?.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Nhân viên ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: toToggle?.full_name }),
          " sẽ không thể đăng nhập cho đến khi được mở khóa lại."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Nhân viên ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: toToggle?.full_name }),
          " sẽ có thể đăng nhập trở lại."
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Hủy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          if (toToggle) toggleActive.mutate({
            id: toToggle.id,
            active: toToggle.status !== "active"
          });
        }, children: toggleActive.isPending ? "Đang xử lý…" : toToggle?.status === "active" ? "Khóa" : "Mở khóa" })
      ] })
    ] }) })
  ] });
}
export {
  EmployeesPage as component
};
