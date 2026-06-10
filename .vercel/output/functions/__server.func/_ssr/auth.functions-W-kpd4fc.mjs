import { c as createServerRpc } from "./createServerRpc-voLkbgFD.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
import { s as supabaseAdmin } from "./client.server-U_pH-Evd.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getMe_createServerFn_handler = createServerRpc({
  id: "e82d956efc40ecaf2e7a4af71c5d2bc6afb9de320d54e0f7a61e07d8926cf607",
  name: "getMe",
  filename: "src/lib/auth/auth.functions.ts"
}, (opts) => getMe.__executeServer(opts));
const getMe = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMe_createServerFn_handler, async ({
  context
}) => {
  const {
    userId
  } = context;
  const [{
    data: profile
  }, {
    data: roles
  }] = await Promise.all([supabaseAdmin.from("employee_profiles").select("*").eq("id", userId).maybeSingle(), supabaseAdmin.from("user_roles").select("role").eq("user_id", userId)]);
  const roleList = (roles ?? []).map((r) => r.role);
  return {
    userId,
    profile,
    roles: roleList,
    isAdmin: roleList.includes("admin")
  };
});
export {
  getMe_createServerFn_handler
};
