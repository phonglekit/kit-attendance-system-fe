import { createFileRoute, redirect, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, FileText, PlusCircle, Clock, Calendar, Bell, Globe, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMe } from "@/lib/auth/auth.functions";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ href: `/login?redirect=${encodeURIComponent(location.href)}` });
    }
  },
  component: AuthLayout,
});

const NAV = [
  { to: "/home", label: "Trang chủ", icon: LayoutGrid },
  { to: "/requests", label: "Đơn của tôi", icon: FileText },
  { to: "/requests/new", label: "Tạo đơn", icon: PlusCircle },
  { to: "/overtime", label: "Tăng ca", icon: Clock },
  { to: "/leave-balance", label: "Số dư phép", icon: Calendar },
];

function AuthLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meFn = useServerFn(getMe);
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    meFn().then((r) => {
      if (r.profile) setProfile({ full_name: r.profile.full_name, email: r.profile.email });
      setIsAdmin(r.isAdmin);
    }).catch(() => {});
  }, [meFn]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  const initial = (profile?.full_name ?? "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold text-sm">KAS</div>
          <span className="font-semibold">KIT Attendance</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || (item.to !== "/home" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 border-t mt-2 pt-3">
              <Shield className="h-4 w-4" /> Cổng quản trị
            </Link>
          )}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/40 transition-colors">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground grid place-items-center font-semibold shadow-sm shrink-0">
              {profile ? initial : <span className="h-4 w-4 rounded-full bg-primary-foreground/30 animate-pulse" />}
            </div>
            <div className="min-w-0 flex-1">
              {profile ? (
                <>
                  <div className="text-sm font-semibold truncate">{profile.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{profile.email}</div>
                </>
              ) : (
                <>
                  <div className="h-3.5 w-24 rounded bg-muted animate-pulse mb-1.5" />
                  <div className="h-3 w-32 rounded bg-muted/60 animate-pulse" />
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Globe className="h-4 w-4" /> Tiếng Việt
            </button>
            <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Đăng xuất" title="Đăng xuất">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-background border-b flex items-center justify-between px-8">
          <PageTitle />
          <button className="relative h-9 w-9 rounded-full grid place-items-center hover:bg-muted">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PageTitle() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const item = NAV.find((n) => n.to === pathname || (n.to !== "/home" && pathname.startsWith(n.to)));
  return <h1 className="text-lg font-semibold">{item?.label ?? ""}</h1>;
}
