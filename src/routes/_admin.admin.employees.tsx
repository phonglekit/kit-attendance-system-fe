import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listEmployees,
  listDepartments,
  createEmployeeAccount,
  updateEmployee,
  deleteEmployee,
  setEmployeeActive,
} from "@/lib/admin/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/employees")({
  component: EmployeesPage,
});

const ALL_ROLES = ["employee", "hr", "manager", "admin"] as const;
type RoleName = (typeof ALL_ROLES)[number];

function EmployeesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listEmployees);
  const deptFn = useServerFn(listDepartments);
  const createFn = useServerFn(createEmployeeAccount);
  const updateFn = useServerFn(updateEmployee);
  const deleteFn = useServerFn(deleteEmployee);
  const setActiveFn = useServerFn(setEmployeeActive);

  const { data: employees = [] } = useQuery({ queryKey: ["admin-employees"], queryFn: () => listFn() });
  const { data: depts = [] } = useQuery({ queryKey: ["admin-departments"], queryFn: () => deptFn() });

  // create
  const [open, setOpen] = useState(false);
  const emptyForm = {
    email: "",
    password: "",
    full_name: "",
    employee_code: "",
    title: "",
    department_id: undefined as string | undefined,
    join_date: "",
    role: "employee",
    leave_entitled: 15,
  };
  const [form, setForm] = useState<any>(emptyForm);

  const create = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          ...form,
          department_id: form.department_id || undefined,
          join_date: form.join_date || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Đã tạo tài khoản nhân viên");
      setOpen(false);
      setForm(emptyForm);
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // edit
  const [editing, setEditing] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const openEdit = (e: any) => {
    setEditing(e);
    setEditForm({
      user_id: e.id,
      full_name: e.full_name ?? "",
      employee_code: e.employee_code ?? "",
      title: e.title ?? "",
      department_id: e.department_id ?? undefined,
      join_date: e.join_date ?? "",
      status: e.status ?? "active",
      roles: (e.roles?.length ? e.roles : ["employee"]) as RoleName[],
      leave_entitled: undefined as number | undefined,
      new_password: "",
    });
  };
  const update = useMutation({
    mutationFn: () =>
      updateFn({
        data: {
          ...editForm,
          department_id: editForm.department_id || undefined,
          join_date: editForm.join_date || undefined,
          new_password: editForm.new_password ? editForm.new_password : undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Đã cập nhật");
      setEditing(null);
      setEditForm(null);
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // delete
  const [toDelete, setToDelete] = useState<any | null>(null);
  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { user_id: id } }),
    onSuccess: () => {
      toast.success("Đã xoá nhân viên");
      setToDelete(null);
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // lock / unlock
  const [toToggle, setToToggle] = useState<any | null>(null);
  const toggleActive = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) =>
      setActiveFn({ data: { user_id: vars.id, active: vars.active } }),
    onSuccess: (_d, vars) => {
      toast.success(vars.active ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản");
      setToToggle(null);
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleEditRole = (r: RoleName) =>
    setEditForm((f: any) => {
      const has = f.roles.includes(r);
      const next = has ? f.roles.filter((x: RoleName) => x !== r) : [...f.roles, r];
      return { ...f, roles: next.length ? next : f.roles };
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Tạo tài khoản nhân viên</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Tạo tài khoản nhân viên mới</DialogTitle></DialogHeader>
            <form
              onSubmit={(e) => { e.preventDefault(); create.mutate(); }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2 col-span-2">
                <Label>Họ và tên</Label>
                <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email đăng nhập</Label>
                <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mật khẩu khởi tạo</Label>
                <Input type="text" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mã nhân viên</Label>
                <Input value={form.employee_code} onChange={(e) => setForm({ ...form, employee_code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Chức danh</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phòng ban</Label>
                <Select value={form.department_id ?? ""} onValueChange={(v) => setForm({ ...form, department_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                  <SelectContent>
                    {depts.map((d: any) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày vào làm</Label>
                <Input type="date" value={form.join_date} onChange={(e) => setForm({ ...form, join_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vai trò</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Nhân viên</SelectItem>
                    <SelectItem value="hr">Nhân sự</SelectItem>
                    <SelectItem value="manager">Quản lý</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phép năm (ngày)</Label>
                <Input type="number" min={0} max={100} value={form.leave_entitled} onChange={(e) => setForm({ ...form, leave_entitled: Number(e.target.value) })} />
              </div>
              <DialogFooter className="col-span-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={create.isPending}>{create.isPending ? "Đang tạo…" : "Tạo tài khoản"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Mã NV</th>
              <th className="p-3">Họ tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">Chức danh</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Chưa có nhân viên</td></tr>}
            {employees.map((e: any) => (
              <tr key={e.id} className="border-t">
                <td className="p-3 font-mono text-xs">{e.employee_code ?? "—"}</td>
                <td className="p-3 font-medium">{e.full_name}</td>
                <td className="p-3">{e.email}</td>
                <td className="p-3">{e.title ?? "—"}</td>
                <td className="p-3 space-x-1">{e.roles.map((r: string) => <Badge key={r} variant="secondary">{r}</Badge>)}</td>
                <td className="p-3">
                  <Badge variant={e.status === "active" ? "default" : "secondary"}>
                    {e.status === "active" ? "Đang hoạt động" : "Đã khóa"}
                  </Badge>
                </td>
                <td className="p-3 text-right space-x-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setToToggle(e)}
                    title={e.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  >
                    {e.status === "active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(e)} title="Sửa">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setToDelete(e)} title="Xoá" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(v) => { if (!v) { setEditing(null); setEditForm(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Sửa thông tin {editing?.full_name}</DialogTitle></DialogHeader>
          {editForm && (
            <form
              onSubmit={(e) => { e.preventDefault(); update.mutate(); }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2 col-span-2">
                <Label>Họ và tên</Label>
                <Input required value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Mã nhân viên</Label>
                <Input value={editForm.employee_code} onChange={(e) => setEditForm({ ...editForm, employee_code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Chức danh</Label>
                <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phòng ban</Label>
                <Select value={editForm.department_id ?? ""} onValueChange={(v) => setEditForm({ ...editForm, department_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Chọn phòng ban" /></SelectTrigger>
                  <SelectContent>
                    {depts.map((d: any) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày vào làm</Label>
                <Input type="date" value={editForm.join_date ?? ""} onChange={(e) => setEditForm({ ...editForm, join_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phép năm (để trống = không đổi)</Label>
                <Input type="number" min={0} max={100} value={editForm.leave_entitled ?? ""} onChange={(e) => setEditForm({ ...editForm, leave_entitled: e.target.value === "" ? undefined : Number(e.target.value) })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Vai trò (có thể chọn nhiều)</Label>
                <div className="flex flex-wrap gap-4 p-3 border rounded-md">
                  {ALL_ROLES.map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={editForm.roles.includes(r)} onCheckedChange={() => toggleEditRole(r)} />
                      {r}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Đặt lại mật khẩu (để trống = không đổi)</Label>
                <Input type="text" minLength={8} value={editForm.new_password} onChange={(e) => setEditForm({ ...editForm, new_password: e.target.value })} />
              </div>
              <DialogFooter className="col-span-2">
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setEditForm(null); }}>Hủy</Button>
                <Button type="submit" disabled={update.isPending}>{update.isPending ? "Đang lưu…" : "Lưu thay đổi"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(v) => { if (!v) setToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá nhân viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xoá tài khoản đăng nhập của <b>{toDelete?.full_name}</b> ({toDelete?.email}) và toàn bộ dữ liệu liên quan. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); if (toDelete) remove.mutate(toDelete.id); }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {remove.isPending ? "Đang xoá…" : "Xoá"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lock / Unlock confirm */}
      <AlertDialog open={!!toToggle} onOpenChange={(v) => { if (!v) setToToggle(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toToggle?.status === "active" ? "Khóa tài khoản này?" : "Mở khóa tài khoản này?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toToggle?.status === "active" ? (
                <>Nhân viên <b>{toToggle?.full_name}</b> sẽ không thể đăng nhập cho đến khi được mở khóa lại.</>
              ) : (
                <>Nhân viên <b>{toToggle?.full_name}</b> sẽ có thể đăng nhập trở lại.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (toToggle) toggleActive.mutate({ id: toToggle.id, active: toToggle.status !== "active" });
              }}
            >
              {toggleActive.isPending
                ? "Đang xử lý…"
                : toToggle?.status === "active"
                ? "Khóa"
                : "Mở khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
