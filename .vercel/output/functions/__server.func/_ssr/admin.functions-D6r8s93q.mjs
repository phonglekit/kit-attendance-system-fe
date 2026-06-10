import { c as createServerRpc } from "./createServerRpc-voLkbgFD.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType, a as arrayType, b as booleanType } from "../_libs/zod.mjs";
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
const claimAdmin_createServerFn_handler = createServerRpc({
  id: "d8880030865fe28615b85228a966380027b4c19ea2db348944f9e8c2d7b16085",
  name: "claimAdmin",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => claimAdmin.__executeServer(opts));
const claimAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(claimAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const {
    count,
    error: cErr
  } = await supabaseAdmin.from("user_roles").select("*", {
    count: "exact",
    head: true
  }).eq("role", "admin");
  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) > 0) throw new Error("Đã có quản trị viên trong hệ thống");
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: userId,
    role: "admin"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
async function assertAdmin(userId) {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
  if (!data || data.length === 0) throw new Error("Không có quyền truy cập");
}
const createEmpSchema = objectType({
  email: stringType().email().max(255),
  password: stringType().min(8).max(72),
  full_name: stringType().min(1).max(255),
  employee_code: stringType().max(50).optional(),
  title: stringType().max(150).optional(),
  department_id: stringType().uuid().optional(),
  join_date: stringType().optional(),
  role: enumType(["employee", "hr", "manager", "admin"]).default("employee"),
  leave_entitled: numberType().min(0).max(100).default(15)
});
const createEmployeeAccount_createServerFn_handler = createServerRpc({
  id: "cd993dc452c2b21deae9f8e690ea709656df2c2be06eb653db1e5e27cb204d3f",
  name: "createEmployeeAccount",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => createEmployeeAccount.__executeServer(opts));
const createEmployeeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createEmpSchema.parse(d)).handler(createEmployeeAccount_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name
    }
  });
  if (error || !created.user) throw new Error(error?.message ?? "Tạo tài khoản thất bại");
  const uid = created.user.id;
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  await supabaseAdmin.from("employee_profiles").upsert({
    id: uid,
    full_name: data.full_name,
    email: data.email,
    employee_code: data.employee_code ?? null,
    title: data.title ?? null,
    department_id: data.department_id ?? null,
    join_date: data.join_date ?? null
  });
  await supabaseAdmin.from("user_roles").upsert({
    user_id: uid,
    role: data.role
  }, {
    onConflict: "user_id,role"
  });
  await supabaseAdmin.from("leave_balances").upsert({
    user_id: uid,
    year,
    entitled: data.leave_entitled
  }, {
    onConflict: "user_id,year"
  });
  return {
    ok: true,
    user_id: uid
  };
});
const listEmployees_createServerFn_handler = createServerRpc({
  id: "5e689bc6fa0033732a6f8045a234cd6d472693e3542c57b35c3085a5b536a655",
  name: "listEmployees",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => listEmployees.__executeServer(opts));
const listEmployees = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listEmployees_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: emps
  } = await supabaseAdmin.from("employee_profiles").select("*").order("created_at", {
    ascending: false
  });
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("user_id,role");
  const byUser = {};
  (roles ?? []).forEach((r) => {
    byUser[r.user_id] = [...byUser[r.user_id] ?? [], r.role];
  });
  return (emps ?? []).map((e) => ({
    ...e,
    roles: byUser[e.id] ?? []
  }));
});
const listDepartments_createServerFn_handler = createServerRpc({
  id: "ce3f2773d87e1057b5196d27b2ca133d4d19b289e4f441774bcb145d6ebeac63",
  name: "listDepartments",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => listDepartments.__executeServer(opts));
const listDepartments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listDepartments_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data
  } = await supabaseAdmin.from("departments").select("*").order("name");
  return data ?? [];
});
const listAllRequests_createServerFn_handler = createServerRpc({
  id: "b73f2b6a067764769bf2e45f922d4efd6351956eb7815ec4b4b3b71754ec3268",
  name: "listAllRequests",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => listAllRequests.__executeServer(opts));
const listAllRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAllRequests_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const [leave, le, ot, emps] = await Promise.all([supabaseAdmin.from("leave_requests").select("*").order("created_at", {
    ascending: false
  }), supabaseAdmin.from("late_early_requests").select("*").order("created_at", {
    ascending: false
  }), supabaseAdmin.from("overtime_requests").select("*").order("created_at", {
    ascending: false
  }), supabaseAdmin.from("employee_profiles").select("id,full_name,email")]);
  const empMap = {};
  (emps.data ?? []).forEach((e) => empMap[e.id] = e);
  const map = (rows, kind, titleFn) => rows.map((r) => ({
    kind,
    ...r,
    title: titleFn(r),
    employee: empMap[r.user_id]
  }));
  return [...map(leave.data ?? [], "leave", (r) => `Nghỉ phép (${r.leave_type})`), ...map(le.data ?? [], "late_early", (r) => r.kind === "late" ? "Đi muộn" : "Về sớm"), ...map(ot.data ?? [], "overtime", () => "Tăng ca")].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});
const decideSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid(),
  status: enumType(["approved", "rejected"]),
  decision_note: stringType().max(1e3).optional()
});
const decideRequest_createServerFn_handler = createServerRpc({
  id: "c9a68a8920cb0c610d62bddda8bb589dcc5b28da01bab4c090f0bea6eea15f6b",
  name: "decideRequest",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => decideRequest.__executeServer(opts));
const decideRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => decideSchema.parse(d)).handler(decideRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  if (data.status === "rejected" && !data.decision_note) throw new Error("Vui lòng nhập lý do từ chối");
  const table = data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
  const {
    error
  } = await supabaseAdmin.from(table).update({
    status: data.status,
    decision_note: data.decision_note ?? null,
    decided_at: (/* @__PURE__ */ new Date()).toISOString(),
    approver_id: context.userId
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getAdminDashboard_createServerFn_handler = createServerRpc({
  id: "b15395810d71f47f01a5a3455a4af3c6542d49eef14f42eeb97940282124f273",
  name: "getAdminDashboard",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => getAdminDashboard.__executeServer(opts));
const getAdminDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAdminDashboard_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const [emps, leave, le, ot] = await Promise.all([supabaseAdmin.from("employee_profiles").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("leave_requests").select("status"), supabaseAdmin.from("late_early_requests").select("status"), supabaseAdmin.from("overtime_requests").select("status,rounded_hours,date")]);
  const all = [...leave.data ?? [], ...le.data ?? [], ...ot.data ?? []];
  const pending = all.filter((r) => r.status === "pending").length;
  const approved = all.filter((r) => r.status === "approved").length;
  const now = /* @__PURE__ */ new Date();
  const otMonth = (ot.data ?? []).filter((r) => r.status === "approved" && new Date(r.date).getMonth() === now.getMonth() && new Date(r.date).getFullYear() === now.getFullYear()).reduce((s, r) => s + Number(r.rounded_hours), 0);
  return {
    employees: emps.count ?? 0,
    pending,
    approved,
    otMonth
  };
});
const updateEmpSchema = objectType({
  user_id: stringType().uuid(),
  full_name: stringType().min(1).max(255),
  employee_code: stringType().max(50).optional().nullable(),
  title: stringType().max(150).optional().nullable(),
  department_id: stringType().uuid().optional().nullable(),
  join_date: stringType().optional().nullable(),
  status: enumType(["active", "inactive"]).default("active"),
  roles: arrayType(enumType(["employee", "hr", "admin", "manager"])).min(1),
  leave_entitled: numberType().min(0).max(100).optional(),
  new_password: stringType().min(8).max(72).optional()
});
const updateEmployee_createServerFn_handler = createServerRpc({
  id: "8c0c749651fb263aa4f88c9737ff28eb17a5e5ac4919954d9d479e4157de8839",
  name: "updateEmployee",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => updateEmployee.__executeServer(opts));
const updateEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => updateEmpSchema.parse(d)).handler(updateEmployee_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const {
    error: pErr
  } = await supabaseAdmin.from("employee_profiles").update({
    full_name: data.full_name,
    employee_code: data.employee_code ?? null,
    title: data.title ?? null,
    department_id: data.department_id ?? null,
    join_date: data.join_date ?? null,
    status: data.status
  }).eq("id", data.user_id);
  if (pErr) throw new Error(pErr.message);
  await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
  const inserts = data.roles.map((r) => ({
    user_id: data.user_id,
    role: r
  }));
  const {
    error: rErr
  } = await supabaseAdmin.from("user_roles").insert(inserts);
  if (rErr) throw new Error(rErr.message);
  if (typeof data.leave_entitled === "number") {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    await supabaseAdmin.from("leave_balances").upsert({
      user_id: data.user_id,
      year,
      entitled: data.leave_entitled
    }, {
      onConflict: "user_id,year"
    });
  }
  if (data.new_password) {
    const {
      error: aErr
    } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      password: data.new_password
    });
    if (aErr) throw new Error(aErr.message);
  }
  return {
    ok: true
  };
});
const deleteEmpSchema = objectType({
  user_id: stringType().uuid()
});
const deleteEmployee_createServerFn_handler = createServerRpc({
  id: "ddf487c87744b3197f47982f95a4ba72a46169c0a2225ce5db3bb1602ca29dc2",
  name: "deleteEmployee",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => deleteEmployee.__executeServer(opts));
const deleteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => deleteEmpSchema.parse(d)).handler(deleteEmployee_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  if (data.user_id === context.userId) throw new Error("Không thể xoá chính bạn");
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const setActiveSchema = objectType({
  user_id: stringType().uuid(),
  active: booleanType()
});
const setEmployeeActive_createServerFn_handler = createServerRpc({
  id: "b6bd8fd34602aba6f5203b7f398a71a1f7d5bc2eb2786c15eaa35736c1b3619f",
  name: "setEmployeeActive",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => setEmployeeActive.__executeServer(opts));
const setEmployeeActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => setActiveSchema.parse(d)).handler(setEmployeeActive_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  if (data.user_id === context.userId && !data.active) throw new Error("Không thể khóa chính bạn");
  const {
    error: pErr
  } = await supabaseAdmin.from("employee_profiles").update({
    status: data.active ? "active" : "inactive"
  }).eq("id", data.user_id);
  if (pErr) throw new Error(pErr.message);
  const {
    error: aErr
  } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
    ban_duration: data.active ? "none" : "876000h"
  });
  if (aErr) throw new Error(aErr.message);
  return {
    ok: true
  };
});
const deleteReqSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid()
});
const deleteRequest_createServerFn_handler = createServerRpc({
  id: "08f420d526c096d790618d4b979b48aea841a7c8ab1cce24c652936a560cc711",
  name: "deleteRequest",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => deleteRequest.__executeServer(opts));
const deleteRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => deleteReqSchema.parse(d)).handler(deleteRequest_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const table = data.kind === "leave" ? "leave_requests" : data.kind === "late_early" ? "late_early_requests" : "overtime_requests";
  const {
    error
  } = await supabaseAdmin.from(table).delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const policySchema = objectType({
  working_hours: objectType({
    start: stringType().regex(/^\d{2}:\d{2}$/),
    end: stringType().regex(/^\d{2}:\d{2}$/),
    lunch_minutes: numberType().int().min(0).max(240)
  }),
  leave_rules: objectType({
    annual_entitlement: numberType().min(0).max(365),
    carry_over_max: numberType().min(0).max(365)
  }),
  overtime_rules: objectType({
    min_minutes: numberType().int().min(0).max(480),
    rounding_minutes: numberType().int().min(1).max(120)
  }),
  late_early_rules: objectType({
    grace_minutes: numberType().int().min(0).max(120)
  })
});
const getPolicySettings_createServerFn_handler = createServerRpc({
  id: "62eefa2612a894bddddfaad64340340726d4191b7227b0b815de603af08b30c0",
  name: "getPolicySettings",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => getPolicySettings.__executeServer(opts));
const getPolicySettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getPolicySettings_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("policy_settings").select("key,value");
  if (error) throw new Error(error.message);
  const out = {};
  for (const r of data ?? []) out[r.key] = r.value;
  return {
    working_hours: out.working_hours ?? {
      start: "08:30",
      end: "17:30",
      lunch_minutes: 60
    },
    leave_rules: out.leave_rules ?? {
      annual_entitlement: 15,
      carry_over_max: 5
    },
    overtime_rules: out.overtime_rules ?? {
      min_minutes: 30,
      rounding_minutes: 30
    },
    late_early_rules: out.late_early_rules ?? {
      grace_minutes: 5
    }
  };
});
const updatePolicySettings_createServerFn_handler = createServerRpc({
  id: "ac01dd91d5f88df86be549d6f4e88c1c2a104ca08e8d8ea220f4800a9b808935",
  name: "updatePolicySettings",
  filename: "src/lib/admin/admin.functions.ts"
}, (opts) => updatePolicySettings.__executeServer(opts));
const updatePolicySettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => policySchema.parse(d)).handler(updatePolicySettings_createServerFn_handler, async ({
  context,
  data
}) => {
  await assertAdmin(context.userId);
  const rows = Object.entries(data).map(([key, value]) => ({
    key,
    value,
    updated_by: context.userId,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }));
  const {
    error
  } = await supabaseAdmin.from("policy_settings").upsert(rows, {
    onConflict: "key"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  claimAdmin_createServerFn_handler,
  createEmployeeAccount_createServerFn_handler,
  decideRequest_createServerFn_handler,
  deleteEmployee_createServerFn_handler,
  deleteRequest_createServerFn_handler,
  getAdminDashboard_createServerFn_handler,
  getPolicySettings_createServerFn_handler,
  listAllRequests_createServerFn_handler,
  listDepartments_createServerFn_handler,
  listEmployees_createServerFn_handler,
  setEmployeeActive_createServerFn_handler,
  updateEmployee_createServerFn_handler,
  updatePolicySettings_createServerFn_handler
};
