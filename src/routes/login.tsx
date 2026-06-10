import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";
import { toast } from "sonner";

function getSafeRedirectPath(redirect?: string) {
  if (!redirect) return "/home";

  try {
    const url = new URL(redirect, window.location.origin);
    if (url.origin !== window.location.origin) return "/home";
    return url.pathname || "/home";
  } catch {
    if (redirect.startsWith("/") && !redirect.startsWith("//")) {
      return redirect.split("?")[0].split("#")[0] || "/home";
    }
    return "/home";
  }
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Đăng nhập — KIT Attendance" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;

    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      throw redirect({ href: getSafeRedirectPath(search.redirect) });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Đăng nhập thất bại", { description: error.message });
      return;
    }
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      toast.error("Không thể xác thực phiên đăng nhập", { description: userError?.message });
      return;
    }
    navigate({ href: getSafeRedirectPath(search.redirect), replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col px-8 lg:px-16 py-10 bg-background">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm text-foreground">
            <Globe className="h-4 w-4" /> VN
          </button>
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">KAS</div>
              <h1 className="text-2xl font-bold">Hệ Thống Chấm Công KIT</h1>
            </div>
            <h2 className="text-xl font-semibold">Đăng nhập vào tài khoản</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Hệ thống chấm công và quản lý đơn hiện đại cho KIT System Solutions Vietnam
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kitsystem.vn" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                  Ghi nhớ đăng nhập
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">Quên mật khẩu?</Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập…" : "Đăng nhập"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex bg-primary text-primary-foreground items-center justify-center p-16">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold">Chào mừng đến với KAS</h2>
          <p className="mt-4 text-primary-foreground/90">
            Hệ thống chấm công và quản lý đơn hiện đại cho KIT System Solutions Vietnam
          </p>
        </div>
      </div>
    </div>
  );
}
