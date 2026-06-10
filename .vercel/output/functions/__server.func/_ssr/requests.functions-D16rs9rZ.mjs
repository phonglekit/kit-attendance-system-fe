import { c as createSsrRpc } from "./createSsrRpc-BssKMh3G.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
const getMyDashboard = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("bb1d0ff517a40da3469224d3056fd4a4cdfacedb54daec0658a50671f84de706"));
const listMyRequests = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7c3b6af66d40fb1be56459222b790782f790d8b6f304482ab22329d4d7d3c595"));
const getRequestFormContext = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("99886005148b7901f1e3e7211f3ed9f87cbc614b84b4bb36f25d0201fc3508a4"));
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
const createLeaveRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => leaveSchema.parse(d)).handler(createSsrRpc("b8bdd7d28207890dc8b2650cc0dba107b7ba338231c3cba6286a6714207573e6"));
const leSchema = objectType({
  kind: enumType(["late", "early"]),
  date: stringType().min(1),
  actual_time: stringType().min(1),
  reason: stringType().trim().min(3).max(1e3),
  attachment_path: stringType().max(500).optional().nullable()
});
const createLateEarlyRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => leSchema.parse(d)).handler(createSsrRpc("28c2427903d2805461f8a4234152fcce4eac930833d0d0c39a84e162841191eb"));
const otSchema = objectType({
  date: stringType().min(1),
  start_time: stringType().min(1),
  end_time: stringType().min(1),
  project: stringType().trim().max(200).optional(),
  reason: stringType().trim().min(3).max(1e3),
  attachment_path: stringType().max(500).optional().nullable()
});
const createOvertimeRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => otSchema.parse(d)).handler(createSsrRpc("a85a90af9e35901caad3aa991fc8661327825b23b70f4b9b035896ef5729aa3c"));
const cancelSchema = objectType({
  kind: enumType(["leave", "late_early", "overtime"]),
  id: stringType().uuid()
});
const cancelRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => cancelSchema.parse(d)).handler(createSsrRpc("8ce7766bbbb595faf31420c5bc3affa27945003733c576ec397758dc1114cd0d"));
const getMyLeaveBalance = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("9ea8301cc14af35af9218f553c9eafc1905c73af0c8b40d3cf6f8759ea4d5235"));
const getMyOvertime = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("faf4432fda79be2e4b66c1b2392fc43992ca4613c943b74f6c24d5090e321d66"));
export {
  createLateEarlyRequest as a,
  createLeaveRequest as b,
  cancelRequest as c,
  createOvertimeRequest as d,
  getMyLeaveBalance as e,
  getMyOvertime as f,
  getMyDashboard as g,
  getRequestFormContext as h,
  listMyRequests as l
};
