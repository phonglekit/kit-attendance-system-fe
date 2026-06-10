import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Đã gửi email đặt lại mật khẩu");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-muted/40 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Quên mật khẩu</h1>
        <p className="text-sm text-muted-foreground mb-6">Nhập email để nhận liên kết đặt lại mật khẩu.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Đang gửi…" : "Gửi liên kết"}</Button>
          <Link to="/login" className="block text-center text-sm text-primary hover:underline">Quay lại đăng nhập</Link>
        </form>
      </div>
    </div>
  );
}
