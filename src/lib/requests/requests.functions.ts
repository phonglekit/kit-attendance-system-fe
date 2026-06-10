import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Dashboard ----------
export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const year = new Date().getFullYear();
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    const [leaveAll, leAll, otAll, bal] = await Promise.all([
      supabase.from("leave_requests").select("status,decided_at,days").eq("user_id", userId),
      supabase.from("late_early_requests").select("status,decided_at").eq("user_id", userId),
      supabase.from("overtime_requests").select("status,decided_at,rounded_hours,date").eq("user_id", userId),
      supabase.from("leave_balances").select("entitled,used,carried_over").eq("user_id", userId).eq("year", year).maybeSingle(),
    ]);

    const all = [
      ...(leaveAll.data ?? []).map((x: any) => ({ ...x })),
      ...(leAll.data ?? []).map((x: any) => ({ ...x })),
      ...(otAll.data ?? []).map((x: any) => ({ ...x })),
    ];
    const pending = all.filter((r) => r.status === "pending").length;
    const approvedThisMonth = all.filter(
      (r) => r.status === "approved" && r.decided_at && new Date(r.decided_at) >= new Date(monthStart),
    ).length;
    const otHoursThisMonth = (otAll.data ?? [])
      .filter((r: any) => r.status === "approved" && r.date && new Date(r.date) >= new Date(monthStart))
      .reduce((s: number, r: any) => s + Number(r.rounded_hours ?? 0), 0);
    const b = bal.data ?? { entitled: 15, used: 0, carried_over: 0 };
    const leaveRemaining = Number(b.entitled) + Number(b.carried_over) - Number(b.used);

    return { pending, approvedThisMonth, leaveRemaining, otHoursThisMonth };
  });

// ---------- List my requests ----------
export const listMyRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [leave, le, ot] = await Promise.all([
      supabase.from("leave_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("late_early_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("overtime_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    const items = [
      ...(leave.data ?? []).map((r: any) => ({ kind: "leave" as const, ...r, title: `Nghỉ phép (${r.leave_type})` })),
      ...(le.data ?? []).map((r: any) => ({ kind: "late_early" as const, ...r, title: r.kind === "late" ? "Đi muộn" : "Về sớm" })),
      ...(ot.data ?? []).map((r: any) => ({ kind: "overtime" as const, ...r, title: "Tăng ca" })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return items;
  });

// ---------- Helpers ----------
async function getPolicy(supabase: any) {
  const { data } = await supabase.from("policy_settings").select("key,value");
  const map: Record<string, any> = {};
  (data ?? []).forEach((r: any) => (map[r.key] = r.value));
  return {
    working_hours: map.working_hours ?? { start: "08:30", end: "17:30", lunch_minutes: 60 },
    leave_rules: map.leave_rules ?? { annual_entitlement: 15, carry_over_max: 5 },
    overtime_rules: map.overtime_rules ?? { rounding_minutes: 30, min_minutes: 30 },
    late_early_rules: map.late_early_rules ?? { grace_minutes: 5 },
  };
}

function diffMinutes(a: string, b: string) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

function countDaysInclusive(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const ms = e.getTime() - s.getTime();
  return Math.floor(ms / 86400000) + 1;
}

// ---------- Form context (policy + balance) ----------
export const getRequestFormContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const policy = await getPolicy(supabase);
    const year = new Date().getFullYear();
    const { data: bal } = await supabase
      .from("leave_balances")
      .select("entitled,used,carried_over")
      .eq("user_id", userId)
      .eq("year", year)
      .maybeSingle();
    const { data: pendingRows } = await supabase
      .from("leave_requests")
      .select("days,start_date")
      .eq("user_id", userId)
      .eq("status", "pending");
    const pending_days = (pendingRows ?? [])
      .filter((r: any) => new Date(r.start_date).getFullYear() === year)
      .reduce((s: number, r: any) => s + Number(r.days ?? 0), 0);
    const entitled = Number(bal?.entitled ?? policy.leave_rules.annual_entitlement ?? 15);
    const carried = Number(bal?.carried_over ?? 0);
    const used = Number(bal?.used ?? 0);
    const available = entitled + carried - used - pending_days;
    return {
      policy,
      balance: { entitled, carried_over: carried, used, pending_days, available, year },
    };
  });

// ---------- Create leave ----------
const leaveSchema = z.object({
  leave_type: z.enum(["fullday", "halfday", "hourly"]),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  halfday_session: z.enum(["morning", "afternoon"]).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  reason: z.string().trim().min(3).max(1000),
  attachment_path: z.string().max(500).optional().nullable(),
});
export const createLeaveRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => leaveSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const policy = await getPolicy(supabase);

    if (new Date(data.end_date) < new Date(data.start_date))
      throw new Error("Ngày kết thúc không thể trước ngày bắt đầu");

    let days = 0;
    let hours: number | undefined;
    let reason = data.reason.trim();

    if (data.leave_type === "fullday") {
      days = countDaysInclusive(data.start_date, data.end_date);
      if (days < 1) throw new Error("Khoảng ngày không hợp lệ");
    } else if (data.leave_type === "halfday") {
      if (data.start_date !== data.end_date)
        throw new Error("Nghỉ nửa ngày phải trong cùng một ngày");
      if (!data.halfday_session) throw new Error("Vui lòng chọn buổi sáng hoặc buổi chiều");
      days = 0.5;
      hours = 4;
      reason = `[${data.halfday_session === "morning" ? "Buổi sáng" : "Buổi chiều"}] ${reason}`;
    } else {
      // hourly
      if (data.start_date !== data.end_date)
        throw new Error("Nghỉ theo giờ phải trong cùng một ngày");
      if (!data.start_time || !data.end_time)
        throw new Error("Vui lòng nhập giờ bắt đầu và kết thúc");
      const mins = diffMinutes(data.start_time, data.end_time);
      if (mins <= 0) throw new Error("Giờ kết thúc phải sau giờ bắt đầu");
      hours = Math.round((mins / 60) * 100) / 100;
      const workMins = diffMinutes(policy.working_hours.start, policy.working_hours.end) - (policy.working_hours.lunch_minutes ?? 0);
      const workHours = Math.max(1, workMins / 60);
      days = Math.round((hours / workHours) * 100) / 100;
      reason = `[${data.start_time}-${data.end_time}] ${reason}`;
    }

    // balance check
    const year = new Date(data.start_date).getFullYear();
    const { data: bal } = await supabase
      .from("leave_balances")
      .select("entitled,used,carried_over")
      .eq("user_id", userId)
      .eq("year", year)
      .maybeSingle();
    const { data: pendingRows } = await supabase
      .from("leave_requests")
      .select("days,start_date")
      .eq("user_id", userId)
      .eq("status", "pending");
    const pendingDays = (pendingRows ?? [])
      .filter((r: any) => new Date(r.start_date).getFullYear() === year)
      .reduce((s: number, r: any) => s + Number(r.days ?? 0), 0);
    const entitled = Number(bal?.entitled ?? policy.leave_rules.annual_entitlement ?? 15);
    const available = entitled + Number(bal?.carried_over ?? 0) - Number(bal?.used ?? 0) - pendingDays;
    if (days > available + 0.0001)
      throw new Error(`Vượt số dư phép. Còn ${available} ngày, đơn yêu cầu ${days} ngày.`);

    const { error, data: row } = await supabase
      .from("leave_requests")
      .insert({
        user_id: userId,
        leave_type: data.leave_type,
        start_date: data.start_date,
        end_date: data.end_date,
        days,
        hours: hours ?? null,
        reason,
        attachment_path: data.attachment_path ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---------- Create late/early ----------
const leSchema = z.object({
  kind: z.enum(["late", "early"]),
  date: z.string().min(1),
  actual_time: z.string().min(1),
  reason: z.string().trim().min(3).max(1000),
  attachment_path: z.string().max(500).optional().nullable(),
});
export const createLateEarlyRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => leSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const policy = await getPolicy(supabase);
    const standard = data.kind === "late" ? policy.working_hours.start : policy.working_hours.end;
    const grace = Number(policy.late_early_rules.grace_minutes ?? 0);
    const rawMinutes =
      data.kind === "late"
        ? diffMinutes(standard, data.actual_time)
        : diffMinutes(data.actual_time, standard);
    const minutes = rawMinutes - grace;
    if (minutes <= 0)
      throw new Error(
        data.kind === "late"
          ? `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)`
          : `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)`,
      );
    if (minutes > 480) throw new Error("Số phút vi phạm vượt quá 8 tiếng");

    const { error, data: row } = await supabase
      .from("late_early_requests")
      .insert({
        user_id: userId,
        kind: data.kind,
        date: data.date,
        actual_time: data.actual_time,
        minutes,
        reason: data.reason.trim(),
        attachment_path: data.attachment_path ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---------- Create OT ----------
const otSchema = z.object({
  date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  project: z.string().trim().max(200).optional(),
  reason: z.string().trim().min(3).max(1000),
  attachment_path: z.string().max(500).optional().nullable(),
});
export const createOvertimeRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => otSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const policy = await getPolicy(supabase);
    const minutes = diffMinutes(data.start_time, data.end_time);
    if (minutes <= 0) throw new Error("Giờ kết thúc phải sau giờ bắt đầu");
    const minOt = Number(policy.overtime_rules.min_minutes ?? 0);
    if (minutes < minOt) throw new Error(`Tăng ca tối thiểu ${minOt} phút`);

    // overlap with approved leave?
    const { data: leaves } = await supabase
      .from("leave_requests")
      .select("start_date,end_date,status")
      .eq("user_id", userId)
      .in("status", ["approved", "pending"]);
    const otDate = new Date(data.date + "T00:00:00").getTime();
    const overlap = (leaves ?? []).find(
      (l: any) =>
        new Date(l.start_date + "T00:00:00").getTime() <= otDate &&
        new Date(l.end_date + "T00:00:00").getTime() >= otDate,
    );
    if (overlap) throw new Error("Ngày tăng ca trùng với đơn nghỉ phép đã có");

    const roundStep = Number(policy.overtime_rules.rounding_minutes ?? 30);
    const roundedMinutes = Math.floor(minutes / roundStep) * roundStep;
    const rounded = Math.round((roundedMinutes / 60) * 100) / 100;

    const { error, data: row } = await supabase
      .from("overtime_requests")
      .insert({
        user_id: userId,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        actual_minutes: minutes,
        rounded_hours: rounded,
        project: data.project || null,
        reason: data.reason.trim(),
        attachment_path: data.attachment_path ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

// ---------- Cancel ----------
const cancelSchema = z.object({ kind: z.enum(["leave", "late_early", "overtime"]), id: z.string().uuid() });
export const cancelRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => cancelSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const table = data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
    const { error } = await supabase.from(table).update({ status: "cancelled" }).eq("id", data.id).eq("user_id", userId).eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Leave balance ----------
export const getMyLeaveBalance = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const year = new Date().getFullYear();
    const { data: bal } = await supabase.from("leave_balances").select("*").eq("user_id", userId).eq("year", year).maybeSingle();
    const { data: history } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    return { balance: bal ?? { entitled: 15, used: 0, carried_over: 0, year }, history: history ?? [] };
  });

// ---------- OT summary ----------
export const getMyOvertime = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: rows } = await supabase
      .from("overtime_requests")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    const list = rows ?? [];
    const approved = list.filter((r) => r.status === "approved");
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const hoursMonth = approved.filter((r) => new Date(r.date) >= monthStart).reduce((s, r) => s + Number(r.rounded_hours), 0);
    const hoursYear = approved.filter((r) => new Date(r.date) >= yearStart).reduce((s, r) => s + Number(r.rounded_hours), 0);
    const pending = list.filter((r) => r.status === "pending").length;

    // monthly chart for current year
    const chart = Array.from({ length: 12 }, (_, m) => ({
      month: `T${m + 1}`,
      hours: approved
        .filter((r) => new Date(r.date).getFullYear() === now.getFullYear() && new Date(r.date).getMonth() === m)
        .reduce((s, r) => s + Number(r.rounded_hours), 0),
    }));
    return { hoursMonth, hoursYear, pending, chart, history: list };
  });
