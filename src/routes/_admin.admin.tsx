import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminDashboard } from "@/lib/admin/admin.functions";
import { Users, FileText, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_admin/admin")({
  component: AdminSection,
});

function AdminSection() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname !== "/admin") return <Outlet />;

  return <AdminDashboard />;
}

function AdminDashboard() {
  const fn = useServerFn(getAdminDashboard);
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: () => fn() });
  const d = data ?? { employees: 0, pending: 0, approved: 0, otMonth: 0 };

  const cards = [
    { icon: Users, label: "Tổng nhân viên", value: d.employees },
    { icon: FileText, label: "Đơn chờ duyệt", value: d.pending },
    { icon: CheckCircle2, label: "Đã duyệt", value: d.approved },
    { icon: Clock, label: "Giờ OT tháng này", value: `${d.otMonth}h` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{c.label}</span>
            <span className="h-9 w-9 grid place-items-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 text-3xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
