import { c as createSsrRpc } from "./createSsrRpc-BssKMh3G.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
import { o as objectType, s as stringType, e as enumType, n as numberType, a as arrayType, b as booleanType } from "../_libs/zod.mjs";
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d8880030865fe28615b85228a966380027b4c19ea2db348944f9e8c2d7b16085"));
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
const createEmployeeAccount = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => createEmpSchema.parse(d)).handler(createSsrRpc("cd993dc452c2b21deae9f8e690ea709656df2c2be06eb653db1e5e27cb204d3f"));
const listEmployees = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5e689bc6fa0033732a6f8045a234cd6d472693e3542c57b35c3085a5b536a655"));
const listDepartments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ce3f2773d87e1057b5196d27b2ca133d4d19b289e4f441774bcb145d6ebeac63"));
const listAllRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b73f2b6a067764769bf2e45f922d4efd6351956eb7815ec4b4b3b71754ec3268"));
const decideSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid(),
  status: enumType(["approved", "rejected"]),
  decision_note: stringType().max(1e3).optional()
});
const decideRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => decideSchema.parse(d)).handler(createSsrRpc("c9a68a8920cb0c610d62bddda8bb589dcc5b28da01bab4c090f0bea6eea15f6b"));
const getAdminDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b15395810d71f47f01a5a3455a4af3c6542d49eef14f42eeb97940282124f273"));
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
const updateEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => updateEmpSchema.parse(d)).handler(createSsrRpc("8c0c749651fb263aa4f88c9737ff28eb17a5e5ac4919954d9d479e4157de8839"));
const deleteEmpSchema = objectType({
  user_id: stringType().uuid()
});
const deleteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => deleteEmpSchema.parse(d)).handler(createSsrRpc("ddf487c87744b3197f47982f95a4ba72a46169c0a2225ce5db3bb1602ca29dc2"));
const setActiveSchema = objectType({
  user_id: stringType().uuid(),
  active: booleanType()
});
const setEmployeeActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => setActiveSchema.parse(d)).handler(createSsrRpc("b6bd8fd34602aba6f5203b7f398a71a1f7d5bc2eb2786c15eaa35736c1b3619f"));
const deleteReqSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid()
});
const deleteRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => deleteReqSchema.parse(d)).handler(createSsrRpc("08f420d526c096d790618d4b979b48aea841a7c8ab1cce24c652936a560cc711"));
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
const getPolicySettings = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("62eefa2612a894bddddfaad64340340726d4191b7227b0b815de603af08b30c0"));
const updatePolicySettings = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => policySchema.parse(d)).handler(createSsrRpc("ac01dd91d5f88df86be549d6f4e88c1c2a104ca08e8d8ea220f4800a9b808935"));
export {
  deleteEmployee as a,
  deleteRequest as b,
  createEmployeeAccount as c,
  decideRequest as d,
  getPolicySettings as e,
  listDepartments as f,
  getAdminDashboard as g,
  listEmployees as h,
  updatePolicySettings as i,
  listAllRequests as l,
  setEmployeeActive as s,
  updateEmployee as u
};
