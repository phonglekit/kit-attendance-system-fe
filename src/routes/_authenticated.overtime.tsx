import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyOvertime } from "@/lib/requests/requests.functions";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/overtime")({
  component: OvertimePage,
});

const STATUS_VI: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối", cancelled: "Đã hủy" };

function OvertimePage() {
  const fn = useServerFn(getMyOvertime);
  const { data } = useQuery({ queryKey: ["my-ot"], queryFn: () => fn() });
  const d = data ?? { hoursMonth: 0, hoursYear: 0, pending: 0, chart: [], history: [] };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card label="Giờ tăng ca tháng này" value={`${d.hoursMonth}h`} />
        <Card label="Giờ tăng ca năm nay" value={`${d.hoursYear}h`} />
        <Card label="Đang chờ duyệt" value={d.pending} />
      </div>

      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Tăng ca theo tháng</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.chart}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="p-4 font-semibold">Lịch sử tăng ca</div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Mã</th><th className="p-3">Ngày</th><th className="p-3">Giờ</th><th className="p-3">Trạng thái</th><th className="p-3">Lý do</th>
            </tr>
          </thead>
          <tbody>
            {d.history.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Chưa có dữ liệu</td></tr>}
            {d.history.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-mono text-xs">{r.code}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.rounded_hours}h</td>
                <td className="p-3"><Badge>{STATUS_VI[r.status]}</Badge></td>
                <td className="p-3 max-w-sm truncate">{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
