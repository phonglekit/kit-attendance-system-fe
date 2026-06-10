import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ---------- Claim admin (first user only) ----------
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) > 0) throw new Error("Đã có quản trị viên trong hệ thống");
    const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

async function assertAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin");
  if (!data || data.length === 0) throw new Error("Không có quyền truy cập");
}

// ---------- Create employee account (auth + profile + role + balance) ----------
const createEmpSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  full_name: z.string().min(1).max(255),
  employee_code: z.string().max(50).optional(),
  title: z.string().max(150).optional(),
  department_id: z.string().uuid().optional(),
  join_date: z.string().optional(),
  role: z.enum(["employee", "hr", "manager", "admin"]).default("employee"),
  leave_entitled: z.number().min(0).max(100).default(15),
});
export const createEmployeeAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createEmpSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (error || !created.user) throw new Error(error?.message ?? "Tạo tài khoản thất bại");
    const uid = created.user.id;
    const year = new Date().getFullYear();

    await supabaseAdmin.from("employee_profiles").upsert({
      id: uid,
      full_name: data.full_name,
      email: data.email,
      employee_code: data.employee_code ?? null,
      title: data.title ?? null,
      department_id: data.department_id ?? null,
      join_date: data.join_date ?? null,
    });
    await supabaseAdmin.from("user_roles").upsert({ user_id: uid, role: data.role }, { onConflict: "user_id,role" });
    await supabaseAdmin
      .from("leave_balances")
      .upsert({ user_id: uid, year, entitled: data.leave_entitled }, { onConflict: "user_id,year" });
    return { ok: true, user_id: uid };
  });

// ---------- List employees ----------
export const listEmployees = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: emps } = await supabaseAdmin.from("employee_profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id,role");
    const byUser: Record<string, string[]> = {};
    (roles ?? []).forEach((r) => {
      byUser[r.user_id] = [...(byUser[r.user_id] ?? []), r.role as string];
    });
    return (emps ?? []).map((e) => ({ ...e, roles: byUser[e.id] ?? [] }));
  });

// ---------- List departments ----------
export const listDepartments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data } = await supabaseAdmin.from("departments").select("*").order("name");
    return data ?? [];
  });

// ---------- All requests (admin) ----------
export const listAllRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [leave, le, ot, emps] = await Promise.all([
      supabaseAdmin.from("leave_requests").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("late_early_requests").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("overtime_requests").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("employee_profiles").select("id,full_name,email"),
    ]);
    const empMap: Record<string, any> = {};
    (emps.data ?? []).forEach((e) => (empMap[e.id] = e));
    const map = (rows: any[], kind: string, titleFn: (r: any) => string) =>
      rows.map((r) => ({ kind, ...r, title: titleFn(r), employee: empMap[r.user_id] }));
    return [
      ...map(leave.data ?? [], "leave", (r) => `Nghỉ phép (${r.leave_type})`),
      ...map(le.data ?? [], "late_early", (r) => (r.kind === "late" ? "Đi muộn" : "Về sớm")),
      ...map(ot.data ?? [], "overtime", () => "Tăng ca"),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

// ---------- Decide request ----------
const decideSchema = z.object({
  kind: z.enum(["leave", "late_early", "overtime"]),
  id: z.string().uuid(),
  status: z.enum(["approved", "rejected"]),
  decision_note: z.string().max(1000).optional(),
});
export const decideRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => decideSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.status === "rejected" && !data.decision_note) throw new Error("Vui lòng nhập lý do từ chối");
    const table =
      data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
    const { error } = await supabaseAdmin
      .from(table)
      .update({
        status: data.status,
        decision_note: data.decision_note ?? null,
        decided_at: new Date().toISOString(),
        approver_id: context.userId,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Admin dashboard ----------
export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const [emps, leave, le, ot] = await Promise.all([
      supabaseAdmin.from("employee_profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("leave_requests").select("status"),
      supabaseAdmin.from("late_early_requests").select("status"),
      supabaseAdmin.from("overtime_requests").select("status,rounded_hours,date"),
    ]);
    const all = [...(leave.data ?? []), ...(le.data ?? []), ...(ot.data ?? [])];
    const pending = all.filter((r) => r.status === "pending").length;
    const approved = all.filter((r) => r.status === "approved").length;
    const now = new Date();
    const otMonth = (ot.data ?? [])
      .filter(
        (r: any) =>
          r.status === "approved" &&
          new Date(r.date).getMonth() === now.getMonth() &&
          new Date(r.date).getFullYear() === now.getFullYear(),
      )
      .reduce((s: number, r: any) => s + Number(r.rounded_hours), 0);
    return { employees: emps.count ?? 0, pending, approved, otMonth };
  });

// ---------- Update employee ----------
const updateEmpSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().min(1).max(255),
  employee_code: z.string().max(50).optional().nullable(),
  title: z.string().max(150).optional().nullable(),
  department_id: z.string().uuid().optional().nullable(),
  join_date: z.string().optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
  roles: z.array(z.enum(["employee", "hr", "admin", "manager"])).min(1),
  leave_entitled: z.number().min(0).max(100).optional(),
  new_password: z.string().min(8).max(72).optional(),
});
export const updateEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateEmpSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const { error: pErr } = await supabaseAdmin
      .from("employee_profiles")
      .update({
        full_name: data.full_name,
        employee_code: data.employee_code ?? null,
        title: data.title ?? null,
        department_id: data.department_id ?? null,
        join_date: data.join_date ?? null,
        status: data.status,
      })
      .eq("id", data.user_id);
    if (pErr) throw new Error(pErr.message);

    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
    const inserts = data.roles.map((r) => ({ user_id: data.user_id, role: r }));
    const { error: rErr } = await supabaseAdmin.from("user_roles").insert(inserts);
    if (rErr) throw new Error(rErr.message);

    if (typeof data.leave_entitled === "number") {
      const year = new Date().getFullYear();
      await supabaseAdmin
        .from("leave_balances")
        .upsert({ user_id: data.user_id, year, entitled: data.leave_entitled }, { onConflict: "user_id,year" });
    }
    if (data.new_password) {
      const { error: aErr } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
        password: data.new_password,
      });
      if (aErr) throw new Error(aErr.message);
    }
    return { ok: true };
  });

// ---------- Delete employee ----------
const deleteEmpSchema = z.object({ user_id: z.string().uuid() });
export const deleteEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteEmpSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId) throw new Error("Không thể xoá chính bạn");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Activate / Deactivate employee ----------
const setActiveSchema = z.object({
  user_id: z.string().uuid(),
  active: z.boolean(),
});
export const setEmployeeActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => setActiveSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId && !data.active)
      throw new Error("Không thể khóa chính bạn");
    const { error: pErr } = await supabaseAdmin
      .from("employee_profiles")
      .update({ status: data.active ? "active" : "inactive" })
      .eq("id", data.user_id);
    if (pErr) throw new Error(pErr.message);
    const { error: aErr } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration: data.active ? "none" : "876000h",
    });
    if (aErr) throw new Error(aErr.message);
    return { ok: true };
  });

// ---------- Delete request ----------
const deleteReqSchema = z.object({
  kind: z.enum(["leave", "late_early", "overtime"]),
  id: z.string().uuid(),
});
export const deleteRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => deleteReqSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const table =
      data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
    const { error } = await supabaseAdmin.from(table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Policy settings ----------
const policySchema = z.object({
  working_hours: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/),
    end: z.string().regex(/^\d{2}:\d{2}$/),
    lunch_minutes: z.number().int().min(0).max(240),
  }),
  leave_rules: z.object({
    annual_entitlement: z.number().min(0).max(365),
    carry_over_max: z.number().min(0).max(365),
  }),
  overtime_rules: z.object({
    min_minutes: z.number().int().min(0).max(480),
    rounding_minutes: z.number().int().min(1).max(120),
  }),
  late_early_rules: z.object({
    grace_minutes: z.number().int().min(0).max(120),
  }),
});

export const getPolicySettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin.from("policy_settings").select("key,value");
    if (error) throw new Error(error.message);
    const out: Record<string, unknown> = {};
    for (const r of data ?? []) out[r.key] = r.value;
    return {
      working_hours: out.working_hours ?? { start: "08:30", end: "17:30", lunch_minutes: 60 },
      leave_rules: out.leave_rules ?? { annual_entitlement: 15, carry_over_max: 5 },
      overtime_rules: out.overtime_rules ?? { min_minutes: 30, rounding_minutes: 30 },
      late_early_rules: out.late_early_rules ?? { grace_minutes: 5 },
    };
  });

export const updatePolicySettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => policySchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const rows = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      updated_by: context.userId,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin.from("policy_settings").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
