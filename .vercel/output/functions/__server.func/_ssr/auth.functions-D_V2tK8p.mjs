import { c as createSsrRpc } from "./createSsrRpc-BssKMh3G.mjs";
import { a as createServerFn } from "./server-BJi-LNnB.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-956KE-yS.mjs";
const getMe = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e82d956efc40ecaf2e7a4af71c5d2bc6afb9de320d54e0f7a61e07d8926cf607"));
export {
  getMe as g
};
