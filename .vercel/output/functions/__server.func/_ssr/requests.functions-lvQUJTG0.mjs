import { c as createServerRpc } from "./createServerRpc-voLkbgFD.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const getMyDashboard_createServerFn_handler = createServerRpc({
  id: "bb1d0ff517a40da3469224d3056fd4a4cdfacedb54daec0658a50671f84de706",
  name: "getMyDashboard",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => getMyDashboard.__executeServer(opts));
const getMyDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyDashboard_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const monthStart = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString();
  const [leaveAll, leAll, otAll, bal] = await Promise.all([supabase.from("leave_requests").select("status,decided_at,days").eq("user_id", userId), supabase.from("late_early_requests").select("status,decided_at").eq("user_id", userId), supabase.from("overtime_requests").select("status,decided_at,rounded_hours,date").eq("user_id", userId), supabase.from("leave_balances").select("entitled,used,carried_over").eq("user_id", userId).eq("year", year).maybeSingle()]);
  const all = [...(leaveAll.data ?? []).map((x) => ({
    ...x
  })), ...(leAll.data ?? []).map((x) => ({
    ...x
  })), ...(otAll.data ?? []).map((x) => ({
    ...x
  }))];
  const pending = all.filter((r) => r.status === "pending").length;
  const approvedThisMonth = all.filter((r) => r.status === "approved" && r.decided_at && new Date(r.decided_at) >= new Date(monthStart)).length;
  const otHoursThisMonth = (otAll.data ?? []).filter((r) => r.status === "approved" && r.date && new Date(r.date) >= new Date(monthStart)).reduce((s, r) => s + Number(r.rounded_hours ?? 0), 0);
  const b = bal.data ?? {
    entitled: 15,
    used: 0,
    carried_over: 0
  };
  const leaveRemaining = Number(b.entitled) + Number(b.carried_over) - Number(b.used);
  return {
    pending,
    approvedThisMonth,
    leaveRemaining,
    otHoursThisMonth
  };
});
const listMyRequests_createServerFn_handler = createServerRpc({
  id: "7c3b6af66d40fb1be56459222b790782f790d8b6f304482ab22329d4d7d3c595",
  name: "listMyRequests",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => listMyRequests.__executeServer(opts));
const listMyRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyRequests_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const [leave, le, ot] = await Promise.all([supabase.from("leave_requests").select("*").eq("user_id", userId).order("created_at", {
    ascending: false
  }), supabase.from("late_early_requests").select("*").eq("user_id", userId).order("created_at", {
    ascending: false
  }), supabase.from("overtime_requests").select("*").eq("user_id", userId).order("created_at", {
    ascending: false
  })]);
  const items = [...(leave.data ?? []).map((r) => ({
    kind: "leave",
    ...r,
    title: `Nghỉ phép (${r.leave_type})`
  })), ...(le.data ?? []).map((r) => ({
    kind: "late_early",
    ...r,
    title: r.kind === "late" ? "Đi muộn" : "Về sớm"
  })), ...(ot.data ?? []).map((r) => ({
    kind: "overtime",
    ...r,
    title: "Tăng ca"
  }))].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return items;
});
async function getPolicy(supabase) {
  const {
    data
  } = await supabase.from("policy_settings").select("key,value");
  const map = {};
  (data ?? []).forEach((r) => map[r.key] = r.value);
  return {
    working_hours: map.working_hours ?? {
      start: "08:30",
      end: "17:30",
      lunch_minutes: 60
    },
    leave_rules: map.leave_rules ?? {
      annual_entitlement: 15,
      carry_over_max: 5
    },
    overtime_rules: map.overtime_rules ?? {
      rounding_minutes: 30,
      min_minutes: 30
    },
    late_early_rules: map.late_early_rules ?? {
      grace_minutes: 5
    }
  };
}
function diffMinutes(a, b) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}
function countDaysInclusive(start, end) {
  const s = /* @__PURE__ */ new Date(start + "T00:00:00");
  const e = /* @__PURE__ */ new Date(end + "T00:00:00");
  const ms = e.getTime() - s.getTime();
  return Math.floor(ms / 864e5) + 1;
}
const getRequestFormContext_createServerFn_handler = createServerRpc({
  id: "99886005148b7901f1e3e7211f3ed9f87cbc614b84b4bb36f25d0201fc3508a4",
  name: "getRequestFormContext",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => getRequestFormContext.__executeServer(opts));
const getRequestFormContext = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getRequestFormContext_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const policy = await getPolicy(supabase);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    data: bal
  } = await supabase.from("leave_balances").select("entitled,used,carried_over").eq("user_id", userId).eq("year", year).maybeSingle();
  const {
    data: pendingRows
  } = await supabase.from("leave_requests").select("days,start_date").eq("user_id", userId).eq("status", "pending");
  const pending_days = (pendingRows ?? []).filter((r) => new Date(r.start_date).getFullYear() === year).reduce((s, r) => s + Number(r.days ?? 0), 0);
  const entitled = Number(bal?.entitled ?? policy.leave_rules.annual_entitlement ?? 15);
  const carried = Number(bal?.carried_over ?? 0);
  const used = Number(bal?.used ?? 0);
  const available = entitled + carried - used - pending_days;
  return {
    policy,
    balance: {
      entitled,
      carried_over: carried,
      used,
      pending_days,
      available,
      year
    }
  };
});
const leaveSchema = objectType({
  leave_type: enumType(["fullday", "halfday", "hourly"]),
  start_date: stringType().min(1),
  end_date: stringType().min(1),
  halfday_session: enumType(["morning", "afternoon"]).optional(),
  start_time: stringType().optional(),
  end_time: stringType().optional(),
  reason: stringType().trim().min(3).max(1e3),
  attachment_path: stringType().max(500).optional().nullable()
});
const createLeaveRequest_createServerFn_handler = createServerRpc({
  id: "b8bdd7d28207890dc8b2650cc0dba107b7ba338231c3cba6286a6714207573e6",
  name: "createLeaveRequest",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => createLeaveRequest.__executeServer(opts));
const createLeaveRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => leaveSchema.parse(d)).handler(createLeaveRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const policy = await getPolicy(supabase);
  if (new Date(data.end_date) < new Date(data.start_date)) throw new Error("Ngày kết thúc không thể trước ngày bắt đầu");
  let days = 0;
  let hours;
  let reason = data.reason.trim();
  if (data.leave_type === "fullday") {
    days = countDaysInclusive(data.start_date, data.end_date);
    if (days < 1) throw new Error("Khoảng ngày không hợp lệ");
  } else if (data.leave_type === "halfday") {
    if (data.start_date !== data.end_date) throw new Error("Nghỉ nửa ngày phải trong cùng một ngày");
    if (!data.halfday_session) throw new Error("Vui lòng chọn buổi sáng hoặc buổi chiều");
    days = 0.5;
    hours = 4;
    reason = `[${data.halfday_session === "morning" ? "Buổi sáng" : "Buổi chiều"}] ${reason}`;
  } else {
    if (data.start_date !== data.end_date) throw new Error("Nghỉ theo giờ phải trong cùng một ngày");
    if (!data.start_time || !data.end_time) throw new Error("Vui lòng nhập giờ bắt đầu và kết thúc");
    const mins = diffMinutes(data.start_time, data.end_time);
    if (mins <= 0) throw new Error("Giờ kết thúc phải sau giờ bắt đầu");
    hours = Math.round(mins / 60 * 100) / 100;
    const workMins = diffMinutes(policy.working_hours.start, policy.working_hours.end) - (policy.working_hours.lunch_minutes ?? 0);
    const workHours = Math.max(1, workMins / 60);
    days = Math.round(hours / workHours * 100) / 100;
    reason = `[${data.start_time}-${data.end_time}] ${reason}`;
  }
  const year = new Date(data.start_date).getFullYear();
  const {
    data: bal
  } = await supabase.from("leave_balances").select("entitled,used,carried_over").eq("user_id", userId).eq("year", year).maybeSingle();
  const {
    data: pendingRows
  } = await supabase.from("leave_requests").select("days,start_date").eq("user_id", userId).eq("status", "pending");
  const pendingDays = (pendingRows ?? []).filter((r) => new Date(r.start_date).getFullYear() === year).reduce((s, r) => s + Number(r.days ?? 0), 0);
  const entitled = Number(bal?.entitled ?? policy.leave_rules.annual_entitlement ?? 15);
  const available = entitled + Number(bal?.carried_over ?? 0) - Number(bal?.used ?? 0) - pendingDays;
  if (days > available + 1e-4) throw new Error(`Vượt số dư phép. Còn ${available} ngày, đơn yêu cầu ${days} ngày.`);
  const {
    error,
    data: row
  } = await supabase.from("leave_requests").insert({
    user_id: userId,
    leave_type: data.leave_type,
    start_date: data.start_date,
    end_date: data.end_date,
    days,
    hours: hours ?? null,
    reason,
    attachment_path: data.attachment_path ?? null
  }).select().single();
  if (error) throw new Error(error.message);
  return row;
});
const leSchema = objectType({
  kind: enumType(["late", "early"]),
  date: stringType().min(1),
  actual_time: stringType().min(1),
  reason: stringType().trim().min(3).max(1e3),
  attachment_path: stringType().max(500).optional().nullable()
});
const createLateEarlyRequest_createServerFn_handler = createServerRpc({
  id: "28c2427903d2805461f8a4234152fcce4eac930833d0d0c39a84e162841191eb",
  name: "createLateEarlyRequest",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => createLateEarlyRequest.__executeServer(opts));
const createLateEarlyRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => leSchema.parse(d)).handler(createLateEarlyRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const policy = await getPolicy(supabase);
  const standard = data.kind === "late" ? policy.working_hours.start : policy.working_hours.end;
  const grace = Number(policy.late_early_rules.grace_minutes ?? 0);
  const rawMinutes = data.kind === "late" ? diffMinutes(standard, data.actual_time) : diffMinutes(data.actual_time, standard);
  const minutes = rawMinutes - grace;
  if (minutes <= 0) throw new Error(data.kind === "late" ? `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)` : `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)`);
  if (minutes > 480) throw new Error("Số phút vi phạm vượt quá 8 tiếng");
  const {
    error,
    data: row
  } = await supabase.from("late_early_requests").insert({
    user_id: userId,
    kind: data.kind,
    date: data.date,
    actual_time: data.actual_time,
    minutes,
    reason: data.reason.trim(),
    attachment_path: data.attachment_path ?? null
  }).select().single();
  if (error) throw new Error(error.message);
  return row;
});
const otSchema = objectType({
  date: stringType().min(1),
  start_time: stringType().min(1),
  end_time: stringType().min(1),
  project: stringType().trim().max(200).optional(),
  reason: stringType().trim().min(3).max(1e3),
  attachment_path: stringType().max(500).optional().nullable()
});
const createOvertimeRequest_createServerFn_handler = createServerRpc({
  id: "a85a90af9e35901caad3aa991fc8661327825b23b70f4b9b035896ef5729aa3c",
  name: "createOvertimeRequest",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => createOvertimeRequest.__executeServer(opts));
const createOvertimeRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => otSchema.parse(d)).handler(createOvertimeRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const policy = await getPolicy(supabase);
  const minutes = diffMinutes(data.start_time, data.end_time);
  if (minutes <= 0) throw new Error("Giờ kết thúc phải sau giờ bắt đầu");
  const minOt = Number(policy.overtime_rules.min_minutes ?? 0);
  if (minutes < minOt) throw new Error(`Tăng ca tối thiểu ${minOt} phút`);
  const {
    data: leaves
  } = await supabase.from("leave_requests").select("start_date,end_date,status").eq("user_id", userId).in("status", ["approved", "pending"]);
  const otDate = (/* @__PURE__ */ new Date(data.date + "T00:00:00")).getTime();
  const overlap = (leaves ?? []).find((l) => (/* @__PURE__ */ new Date(l.start_date + "T00:00:00")).getTime() <= otDate && (/* @__PURE__ */ new Date(l.end_date + "T00:00:00")).getTime() >= otDate);
  if (overlap) throw new Error("Ngày tăng ca trùng với đơn nghỉ phép đã có");
  const roundStep = Number(policy.overtime_rules.rounding_minutes ?? 30);
  const roundedMinutes = Math.floor(minutes / roundStep) * roundStep;
  const rounded = Math.round(roundedMinutes / 60 * 100) / 100;
  const {
    error,
    data: row
  } = await supabase.from("overtime_requests").insert({
    user_id: userId,
    date: data.date,
    start_time: data.start_time,
    end_time: data.end_time,
    actual_minutes: minutes,
    rounded_hours: rounded,
    project: data.project || null,
    reason: data.reason.trim(),
    attachment_path: data.attachment_path ?? null
  }).select().single();
  if (error) throw new Error(error.message);
  return row;
});
const cancelSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid()
});
const cancelRequest_createServerFn_handler = createServerRpc({
  id: "8ce7766bbbb595faf31420c5bc3affa27945003733c576ec397758dc1114cd0d",
  name: "cancelRequest",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => cancelRequest.__executeServer(opts));
const cancelRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => cancelSchema.parse(d)).handler(cancelRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  const {
    supabase,
    userId
  } = context;
  const table = data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
  const {
    error
  } = await supabase.from(table).update({
    status: "cancelled"
  }).eq("id", data.id).eq("user_id", userId).eq("status", "pending");
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getMyLeaveBalance_createServerFn_handler = createServerRpc({
  id: "9ea8301cc14af35af9218f553c9eafc1905c73af0c8b40d3cf6f8759ea4d5235",
  name: "getMyLeaveBalance",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => getMyLeaveBalance.__executeServer(opts));
const getMyLeaveBalance = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyLeaveBalance_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    data: bal
  } = await supabase.from("leave_balances").select("*").eq("user_id", userId).eq("year", year).maybeSingle();
  const {
    data: history
  } = await supabase.from("leave_requests").select("*").eq("user_id", userId).order("created_at", {
    ascending: false
  }).limit(50);
  return {
    balance: bal ?? {
      entitled: 15,
      used: 0,
      carried_over: 0,
      year
    },
    history: history ?? []
  };
});
const getMyOvertime_createServerFn_handler = createServerRpc({
  id: "faf4432fda79be2e4b66c1b2392fc43992ca4613c943b74f6c24d5090e321d66",
  name: "getMyOvertime",
  filename: "src/lib/requests/requests.functions.ts"
}, (opts) => getMyOvertime.__executeServer(opts));
const getMyOvertime = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyOvertime_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: rows
  } = await supabase.from("overtime_requests").select("*").eq("user_id", userId).order("date", {
    ascending: false
  });
  const list = rows ?? [];
  const approved = list.filter((r) => r.status === "approved");
  const now = /* @__PURE__ */ new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const hoursMonth = approved.filter((r) => new Date(r.date) >= monthStart).reduce((s, r) => s + Number(r.rounded_hours), 0);
  const hoursYear = approved.filter((r) => new Date(r.date) >= yearStart).reduce((s, r) => s + Number(r.rounded_hours), 0);
  const pending = list.filter((r) => r.status === "pending").length;
  const chart = Array.from({
    length: 12
  }, (_, m) => ({
    month: `T${m + 1}`,
    hours: approved.filter((r) => new Date(r.date).getFullYear() === now.getFullYear() && new Date(r.date).getMonth() === m).reduce((s, r) => s + Number(r.rounded_hours), 0)
  }));
  return {
    hoursMonth,
    hoursYear,
    pending,
    chart,
    history: list
  };
});
export {
  cancelRequest_createServerFn_handler,
  createLateEarlyRequest_createServerFn_handler,
  createLeaveRequest_createServerFn_handler,
  createOvertimeRequest_createServerFn_handler,
  getMyDashboard_createServerFn_handler,
  getMyLeaveBalance_createServerFn_handler,
  getMyOvertime_createServerFn_handler,
  getRequestFormContext_createServerFn_handler,
  listMyRequests_createServerFn_handler
};
