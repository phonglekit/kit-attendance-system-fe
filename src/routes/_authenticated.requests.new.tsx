import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  createLeaveRequest,
  createLateEarlyRequest,
  createOvertimeRequest,
  getRequestFormContext,
} from "@/lib/requests/requests.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Timer,
  Paperclip,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/requests/new")({
  component: NewRequestPage,
});

type Kind = "leave" | "late_early" | "overtime";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

function diffMinutes(a: string, b: string) {
  if (!a || !b) return 0;
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

function countDaysInclusive(start: string, end: string) {
  if (!start || !end) return 0;
  const s = new Date(start + "T00:00:00").getTime();
  const e = new Date(end + "T00:00:00").getTime();
  if (e < s) return 0;
  return Math.floor((e - s) / 86400000) + 1;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function NewRequestPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [kind, setKind] = useState<Kind>("leave");

  const ctxFn = useServerFn(getRequestFormContext);
  const { data: ctx } = useQuery({
    queryKey: ["request-form-context"],
    queryFn: () => ctxFn(),
  });

  const leaveFn = useServerFn(createLeaveRequest);
  const leFn = useServerFn(createLateEarlyRequest);
  const otFn = useServerFn(createOvertimeRequest);

  const onSuccess = () => {
    toast.success("Đã gửi đơn, chờ duyệt");
    qc.invalidateQueries({ queryKey: ["my-requests"] });
    qc.invalidateQueries({ queryKey: ["request-form-context"] });
    navigate({ to: "/requests" });
  };
  const onError = (e: any) =>
    toast.error(e?.message ?? "Không gửi được đơn, vui lòng thử lại");

  const mLeave = useMutation({
    mutationFn: (d: any) => leaveFn({ data: d }),
    onSuccess,
    onError,
  });
  const mLe = useMutation({
    mutationFn: (d: any) => leFn({ data: d }),
    onSuccess,
    onError,
  });
  const mOt = useMutation({
    mutationFn: (d: any) => otFn({ data: d }),
    onSuccess,
    onError,
  });

  const KIND_OPTIONS: { v: Kind; l: string; d: string; Icon: any }[] = [
    { v: "leave", l: "Nghỉ phép", d: "Cả ngày, nửa ngày hoặc theo giờ", Icon: CalendarDays },
    { v: "late_early", l: "Đi muộn / Về sớm", d: "Khai báo vi phạm giờ làm", Icon: Clock },
    { v: "overtime", l: "Tăng ca", d: "Đăng ký làm ngoài giờ", Icon: Timer },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tạo đơn mới</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Điền thông tin chính xác. Đơn sẽ ở trạng thái <b>Chờ duyệt</b> sau khi gửi.
        </p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {KIND_OPTIONS.map((o) => {
          const active = kind === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => setKind(o.v)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <o.Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{o.l}</div>
                  <div className="text-xs text-muted-foreground">{o.d}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Form card */}
      <div className="bg-card border rounded-xl p-6">
        {kind === "leave" && (
          <LeaveForm
            ctx={ctx}
            loading={mLeave.isPending}
            onSubmit={(d: any) => mLeave.mutate(d)}
            onCancel={() => navigate({ to: "/requests" })}
          />
        )}
        {kind === "late_early" && (
          <LeForm
            ctx={ctx}
            loading={mLe.isPending}
            onSubmit={(d: any) => mLe.mutate(d)}
            onCancel={() => navigate({ to: "/requests" })}
          />
        )}
        {kind === "overtime" && (
          <OtForm
            ctx={ctx}
            loading={mOt.isPending}
            onSubmit={(d: any) => mOt.mutate(d)}
            onCancel={() => navigate({ to: "/requests" })}
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Xem lại các đơn đã gửi tại{" "}
        <Link to="/requests" className="text-primary underline">
          Đơn của tôi
        </Link>
        .
      </p>
    </div>
  );
}

/* ---------------- Attachment field ---------------- */
function AttachmentField({
  value,
  onChange,
}: {
  value: { path: string; name: string } | null;
  onChange: (v: { path: string; name: string } | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Chỉ hỗ trợ JPG, PNG, WEBP hoặc PDF");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("File vượt quá 10MB");
      return;
    }
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Phiên đăng nhập hết hạn");
      const ext = file.name.split(".").pop() || "bin";
      const path = `${uid}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("attachments")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      onChange({ path, name: file.name });
      toast.success("Đã tải file lên");
    } catch (err: any) {
      toast.error(err.message ?? "Tải file thất bại");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!value) return;
    await supabase.storage.from("attachments").remove([value.path]).catch(() => {});
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>Đính kèm (tùy chọn)</Label>
      {value ? (
        <div className="flex items-center justify-between p-2 px-3 border rounded-md bg-muted/30">
          <div className="flex items-center gap-2 text-sm truncate">
            <Paperclip className="h-4 w-4 shrink-0" />
            <span className="truncate">{value.name}</span>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={remove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2 p-3 border border-dashed rounded-md cursor-pointer hover:bg-muted/40 text-sm text-muted-foreground">
          <Paperclip className="h-4 w-4" />
          {uploading ? "Đang tải lên…" : "Chọn file (JPG/PNG/WEBP/PDF, ≤10MB)"}
          <input
            type="file"
            className="hidden"
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleSelect}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

/* ---------------- Leave form ---------------- */
function LeaveForm({
  ctx,
  loading,
  onSubmit,
  onCancel,
}: {
  ctx: any;
  loading: boolean;
  onSubmit: (d: any) => void;
  onCancel: () => void;
}) {
  const [leave_type, setType] = useState<"fullday" | "halfday" | "hourly">("fullday");
  const [start_date, setStart] = useState("");
  const [end_date, setEnd] = useState("");
  const [halfday_session, setSession] = useState<"morning" | "afternoon">("morning");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<{ path: string; name: string } | null>(null);

  // sync end_date when halfday/hourly
  useEffect(() => {
    if ((leave_type === "halfday" || leave_type === "hourly") && start_date) {
      setEnd(start_date);
    }
  }, [leave_type, start_date]);

  const wh = ctx?.policy?.working_hours;
  const workHours = wh
    ? Math.max(1, (diffMinutes(wh.start, wh.end) - (wh.lunch_minutes ?? 0)) / 60)
    : 8;

  const computed = useMemo(() => {
    if (leave_type === "fullday") {
      const days = countDaysInclusive(start_date, end_date);
      return { days, hours: days * workHours };
    }
    if (leave_type === "halfday") return { days: 0.5, hours: 4 };
    const mins = diffMinutes(start_time, end_time);
    const hours = mins > 0 ? Math.round((mins / 60) * 100) / 100 : 0;
    const days = hours > 0 ? Math.round((hours / workHours) * 100) / 100 : 0;
    return { days, hours };
  }, [leave_type, start_date, end_date, start_time, end_time, workHours]);

  const errors: Record<string, string> = {};
  if (!start_date) errors.start_date = "Bắt buộc";
  if (!end_date) errors.end_date = "Bắt buộc";
  if (start_date && end_date && new Date(end_date) < new Date(start_date))
    errors.end_date = "Phải sau ngày bắt đầu";
  if (leave_type === "hourly") {
    if (!start_time) errors.start_time = "Bắt buộc";
    if (!end_time) errors.end_time = "Bắt buộc";
    if (start_time && end_time && diffMinutes(start_time, end_time) <= 0)
      errors.end_time = "Phải sau giờ bắt đầu";
  }
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";
  const balance = ctx?.balance;
  const overBalance = balance && computed.days > Number(balance.available) + 0.0001;
  if (overBalance) errors.balance = `Vượt số dư phép (còn ${balance.available} ngày)`;

  const isValid = Object.keys(errors).length === 0 && computed.days > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      leave_type,
      start_date,
      end_date,
      halfday_session: leave_type === "halfday" ? halfday_session : undefined,
      start_time: leave_type === "hourly" ? start_time : undefined,
      end_time: leave_type === "hourly" ? end_time : undefined,
      reason: reason.trim(),
      attachment_path: attachment?.path,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Balance */}
      {balance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <BalanceCell label="Phép năm" value={`${balance.entitled} ngày`} />
          <BalanceCell label="Đã dùng" value={`${balance.used} ngày`} />
          <BalanceCell label="Đang chờ duyệt" value={`${balance.pending_days} ngày`} />
          <BalanceCell
            label="Còn lại có thể dùng"
            value={`${balance.available} ngày`}
            highlight
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Loại nghỉ</Label>
          <Select value={leave_type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fullday">Cả ngày</SelectItem>
              <SelectItem value="halfday">Nửa ngày</SelectItem>
              <SelectItem value="hourly">Theo giờ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {leave_type === "halfday" && (
          <div className="space-y-2 md:col-span-2">
            <Label>Buổi</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["morning", "afternoon"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSession(s)}
                  className={`p-3 border rounded-md text-sm ${
                    halfday_session === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {s === "morning" ? "Buổi sáng" : "Buổi chiều"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            value={start_date}
            onChange={(e) => setStart(e.target.value)}
          />
          <FieldError msg={errors.start_date} />
        </div>
        <div className="space-y-2">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            value={end_date}
            onChange={(e) => setEnd(e.target.value)}
            disabled={leave_type !== "fullday"}
          />
          <FieldError msg={errors.end_date} />
        </div>

        {leave_type === "hourly" && (
          <>
            <div className="space-y-2">
              <Label>Giờ bắt đầu</Label>
              <Input
                type="time"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FieldError msg={errors.start_time} />
            </div>
            <div className="space-y-2">
              <Label>Giờ kết thúc</Label>
              <Input
                type="time"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <FieldError msg={errors.end_time} />
            </div>
          </>
        )}
      </div>

      {/* Calculated */}
      <div className="rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm">
        <Info className="h-4 w-4 text-primary" />
        <span>
          Tổng cộng: <b>{computed.days}</b> ngày
          {computed.hours ? (
            <>
              {" "}
              (~<b>{computed.hours}</b> giờ)
            </>
          ) : null}
        </span>
      </div>

      {overBalance && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {errors.balance}
        </div>
      )}

      <div className="space-y-2">
        <Label>Lý do</Label>
        <Textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Mô tả ngắn gọn lý do nghỉ"
        />
        <FieldError msg={errors.reason} />
      </div>

      <AttachmentField value={attachment} onChange={setAttachment} />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={!isValid || loading}>
          {loading ? "Đang gửi…" : "Gửi đơn"}
        </Button>
      </div>
    </form>
  );
}

function BalanceCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        highlight ? "border-primary bg-primary/5" : "bg-muted/30"
      }`}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold ${highlight ? "text-primary" : ""}`}>
        {value}
      </div>
    </div>
  );
}

/* ---------------- Late / Early form ---------------- */
function LeForm({
  ctx,
  loading,
  onSubmit,
  onCancel,
}: {
  ctx: any;
  loading: boolean;
  onSubmit: (d: any) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<"late" | "early">("late");
  const [date, setDate] = useState("");
  const [actual_time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<{ path: string; name: string } | null>(null);

  const wh = ctx?.policy?.working_hours ?? { start: "08:30", end: "17:30" };
  const grace = Number(ctx?.policy?.late_early_rules?.grace_minutes ?? 0);
  const standard = kind === "late" ? wh.start : wh.end;

  const violation = useMemo(() => {
    if (!actual_time) return 0;
    const raw =
      kind === "late"
        ? diffMinutes(standard, actual_time)
        : diffMinutes(actual_time, standard);
    return Math.max(0, raw - grace);
  }, [kind, actual_time, standard, grace]);

  const errors: Record<string, string> = {};
  if (!date) errors.date = "Bắt buộc";
  if (!actual_time) errors.actual_time = "Bắt buộc";
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";
  if (actual_time && violation <= 0)
    errors.violation = `Trong khoảng cho phép (giờ chuẩn ${standard}, ân hạn ${grace} phút)`;

  const isValid = Object.keys(errors).length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({
          kind,
          date,
          actual_time,
          reason: reason.trim(),
          attachment_path: attachment?.path,
        });
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label>Loại vi phạm</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["late", "early"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={`p-3 border rounded-md text-sm ${
                kind === k
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted/40"
              }`}
            >
              {k === "late" ? "Đi muộn" : "Về sớm"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ngày</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <FieldError msg={errors.date} />
        </div>
        <div className="space-y-2">
          <Label>
            Giờ chuẩn{" "}
            <Badge variant="secondary" className="ml-1">
              {standard}
            </Badge>
          </Label>
          <Input value={standard} disabled />
        </div>
        <div className="space-y-2">
          <Label>Giờ thực tế</Label>
          <Input
            type="time"
            value={actual_time}
            onChange={(e) => setTime(e.target.value)}
          />
          <FieldError msg={errors.actual_time} />
        </div>
        <div className="space-y-2">
          <Label>Số phút vi phạm</Label>
          <Input value={violation} disabled />
        </div>
      </div>

      <div className="rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm">
        <Info className="h-4 w-4 text-primary" />
        Ân hạn tối đa <b>&nbsp;{grace}&nbsp;</b> phút theo quy định. Vi phạm tính sau ân hạn.
      </div>

      {errors.violation && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {errors.violation}
        </div>
      )}

      <div className="space-y-2">
        <Label>Lý do</Label>
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do đi muộn / về sớm"
        />
        <FieldError msg={errors.reason} />
      </div>

      <AttachmentField value={attachment} onChange={setAttachment} />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={!isValid || loading}>
          {loading ? "Đang gửi…" : "Gửi đơn"}
        </Button>
      </div>
    </form>
  );
}

/* ---------------- Overtime form ---------------- */
function OtForm({
  ctx,
  loading,
  onSubmit,
  onCancel,
}: {
  ctx: any;
  loading: boolean;
  onSubmit: (d: any) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState("");
  const [start_time, setStart] = useState("");
  const [end_time, setEnd] = useState("");
  const [project, setProject] = useState("");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<{ path: string; name: string } | null>(null);

  const roundStep = Number(ctx?.policy?.overtime_rules?.rounding_minutes ?? 30);
  const minOt = Number(ctx?.policy?.overtime_rules?.min_minutes ?? 0);

  const mins = diffMinutes(start_time, end_time);
  const actual = mins > 0 ? mins : 0;
  const roundedMinutes = Math.floor(actual / roundStep) * roundStep;
  const rounded = Math.round((roundedMinutes / 60) * 100) / 100;

  const errors: Record<string, string> = {};
  if (!date) errors.date = "Bắt buộc";
  if (!start_time) errors.start_time = "Bắt buộc";
  if (!end_time) errors.end_time = "Bắt buộc";
  if (start_time && end_time && mins <= 0) errors.end_time = "Phải sau giờ bắt đầu";
  if (actual > 0 && actual < minOt) errors.end_time = `Tối thiểu ${minOt} phút`;
  if (project.trim().length === 0) errors.project = "Bắt buộc";
  if (reason.trim().length < 3) errors.reason = "Tối thiểu 3 ký tự";

  const isValid = Object.keys(errors).length === 0 && actual > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({
          date,
          start_time,
          end_time,
          project: project.trim(),
          reason: reason.trim(),
          attachment_path: attachment?.path,
        });
      }}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Ngày tăng ca</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <FieldError msg={errors.date} />
        </div>
        <div className="space-y-2">
          <Label>Từ giờ</Label>
          <Input
            type="time"
            value={start_time}
            onChange={(e) => setStart(e.target.value)}
          />
          <FieldError msg={errors.start_time} />
        </div>
        <div className="space-y-2">
          <Label>Đến giờ</Label>
          <Input
            type="time"
            value={end_time}
            onChange={(e) => setEnd(e.target.value)}
          />
          <FieldError msg={errors.end_time} />
        </div>
        <div className="space-y-2">
          <Label>Số phút thực tế</Label>
          <Input value={actual} disabled />
        </div>
        <div className="space-y-2">
          <Label>Số giờ làm tròn</Label>
          <Input value={rounded} disabled />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Dự án / Nội dung công việc</Label>
          <Input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Tên dự án hoặc công việc"
          />
          <FieldError msg={errors.project} />
        </div>
      </div>

      <div className="rounded-lg bg-muted/40 border p-3 flex items-center gap-2 text-sm">
        <Info className="h-4 w-4 text-primary" />
        Làm tròn theo bước <b>&nbsp;{roundStep}&nbsp;</b> phút. Tối thiểu <b>&nbsp;{minOt}&nbsp;</b> phút.
      </div>

      <div className="space-y-2">
        <Label>Lý do</Label>
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Lý do cần tăng ca"
        />
        <FieldError msg={errors.reason} />
      </div>

      <AttachmentField value={attachment} onChange={setAttachment} />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={!isValid || loading}>
          {loading ? "Đang gửi…" : "Gửi đơn"}
        </Button>
      </div>
    </form>
  );
}
