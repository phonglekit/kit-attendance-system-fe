import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPolicySettings, updatePolicySettings } from "@/lib/admin/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/policies")({
  component: PoliciesPage,
});

type Policy = {
  working_hours: { start: string; end: string; lunch_minutes: number };
  leave_rules: { annual_entitlement: number; carry_over_max: number };
  overtime_rules: { min_minutes: number; rounding_minutes: number };
  late_early_rules: { grace_minutes: number };
};

function PoliciesPage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getPolicySettings);
  const updateFn = useServerFn(updatePolicySettings);
  const { data, isLoading } = useQuery({ queryKey: ["policy-settings"], queryFn: () => getFn() });
  const [form, setForm] = useState<Policy | null>(null);

  useEffect(() => {
    if (data) setForm(data as Policy);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (p: Policy) => updateFn({ data: p }),
    onSuccess: () => {
      toast.success("Đã lưu cấu hình chính sách");
      qc.invalidateQueries({ queryKey: ["policy-settings"] });
      qc.invalidateQueries({ queryKey: ["request-form-context"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !form) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Đang tải…
      </div>
    );
  }

  const update = <K extends keyof Policy>(key: K, patch: Partial<Policy[K]>) =>
    setForm((f) => (f ? { ...f, [key]: { ...f[key], ...patch } } : f));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cấu hình chính sách</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Các thiết lập này được áp dụng khi nhân viên tạo đơn (giờ làm chuẩn, ngày nghỉ phép, làm tròn OT, ngưỡng đi muộn/về sớm).
        </p>
      </div>

      <Section title="Giờ làm việc chuẩn" description="Áp dụng cho tính ngày nghỉ và quy đổi giờ → ngày.">
        <Field label="Giờ bắt đầu">
          <Input
            type="time"
            value={form.working_hours.start}
            onChange={(e) => update("working_hours", { start: e.target.value })}
          />
        </Field>
        <Field label="Giờ kết thúc">
          <Input
            type="time"
            value={form.working_hours.end}
            onChange={(e) => update("working_hours", { end: e.target.value })}
          />
        </Field>
        <Field label="Nghỉ trưa (phút)">
          <Input
            type="number"
            min={0}
            max={240}
            value={form.working_hours.lunch_minutes}
            onChange={(e) => update("working_hours", { lunch_minutes: Number(e.target.value) })}
          />
        </Field>
      </Section>

      <Section title="Nghỉ phép" description="Số ngày phép cơ bản và mức tồn chuyển sang năm sau.">
        <Field label="Số ngày phép/năm">
          <Input
            type="number"
            min={0}
            max={365}
            value={form.leave_rules.annual_entitlement}
            onChange={(e) => update("leave_rules", { annual_entitlement: Number(e.target.value) })}
          />
        </Field>
        <Field label="Tối đa được chuyển sang năm sau">
          <Input
            type="number"
            min={0}
            max={365}
            value={form.leave_rules.carry_over_max}
            onChange={(e) => update("leave_rules", { carry_over_max: Number(e.target.value) })}
          />
        </Field>
      </Section>

      <Section title="Tăng ca (OT)" description="Tổng số phút tối thiểu được tính OT và mức làm tròn.">
        <Field label="Tối thiểu (phút)">
          <Input
            type="number"
            min={0}
            max={480}
            value={form.overtime_rules.min_minutes}
            onChange={(e) => update("overtime_rules", { min_minutes: Number(e.target.value) })}
          />
        </Field>
        <Field label="Làm tròn theo (phút)">
          <Input
            type="number"
            min={1}
            max={120}
            value={form.overtime_rules.rounding_minutes}
            onChange={(e) => update("overtime_rules", { rounding_minutes: Number(e.target.value) })}
          />
        </Field>
      </Section>

      <Section title="Đi muộn / Về sớm" description="Khoảng thời gian được bỏ qua (không tính vi phạm).">
        <Field label="Cho phép trễ (phút)">
          <Input
            type="number"
            min={0}
            max={120}
            value={form.late_early_rules.grace_minutes}
            onChange={(e) => update("late_early_rules", { grace_minutes: Number(e.target.value) })}
          />
        </Field>
      </Section>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={() => data && setForm(data as Policy)} disabled={mutation.isPending}>
          Hoàn tác
        </Button>
        <Button onClick={() => form && mutation.mutate(form)} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
