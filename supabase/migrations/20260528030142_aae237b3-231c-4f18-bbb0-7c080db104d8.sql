
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'hr', 'manager', 'employee');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE public.leave_type AS ENUM ('fullday', 'halfday', 'hourly');
CREATE TYPE public.late_early_kind AS ENUM ('late', 'early');
CREATE TYPE public.account_status AS ENUM ('active', 'inactive');

-- =========================================================
-- DEPARTMENTS
-- =========================================================
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- USER ROLES (separate table — security best practice)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','hr')
  )
$$;

-- =========================================================
-- EMPLOYEE PROFILES
-- =========================================================
CREATE TABLE public.employee_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  employee_code TEXT UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  title TEXT,
  manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  join_date DATE,
  status account_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_profiles TO authenticated;
GRANT ALL ON public.employee_profiles TO service_role;
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- LEAVE BALANCES
-- =========================================================
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  entitled NUMERIC NOT NULL DEFAULT 15,
  used NUMERIC NOT NULL DEFAULT 0,
  carried_over NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_balances TO authenticated;
GRANT ALL ON public.leave_balances TO service_role;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- SEQUENCES for request codes
-- =========================================================
CREATE SEQUENCE public.req_seq START 1;
CREATE SEQUENCE public.ot_seq START 1;
CREATE SEQUENCE public.le_seq START 1;

-- =========================================================
-- LEAVE REQUESTS
-- =========================================================
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT ('REQ-' || lpad(nextval('public.req_seq')::text, 3, '0')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL DEFAULT 'fullday',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hours NUMERIC,
  days NUMERIC NOT NULL DEFAULT 1,
  reason TEXT NOT NULL,
  attachment_path TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- LATE / EARLY REQUESTS
-- =========================================================
CREATE TABLE public.late_early_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT ('LE-' || lpad(nextval('public.le_seq')::text, 3, '0')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind late_early_kind NOT NULL,
  date DATE NOT NULL,
  actual_time TIME NOT NULL,
  minutes INTEGER NOT NULL,
  reason TEXT NOT NULL,
  attachment_path TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.late_early_requests TO authenticated;
GRANT ALL ON public.late_early_requests TO service_role;
ALTER TABLE public.late_early_requests ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- OVERTIME REQUESTS
-- =========================================================
CREATE TABLE public.overtime_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE DEFAULT ('OT-' || lpad(nextval('public.ot_seq')::text, 3, '0')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  actual_minutes INTEGER NOT NULL,
  rounded_hours NUMERIC NOT NULL,
  project TEXT,
  reason TEXT NOT NULL,
  attachment_path TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.overtime_requests TO authenticated;
GRANT ALL ON public.overtime_requests TO service_role;
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICY SETTINGS
-- =========================================================
CREATE TABLE public.policy_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policy_settings TO authenticated;
GRANT ALL ON public.policy_settings TO service_role;
ALTER TABLE public.policy_settings ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- RLS POLICIES
-- =========================================================

-- departments
CREATE POLICY "auth read departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage departments" ON public.departments FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- user_roles
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- employee_profiles
CREATE POLICY "users read own profile" ON public.employee_profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "users update own profile basics" ON public.employee_profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admin manage profiles" ON public.employee_profiles FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- leave_balances
CREATE POLICY "users read own balance" ON public.leave_balances FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admin manage balances" ON public.leave_balances FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- leave_requests
CREATE POLICY "users read own leave" ON public.leave_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "users create own leave" ON public.leave_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "users cancel own pending leave" ON public.leave_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending') WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin manage leave" ON public.leave_requests FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- late_early_requests
CREATE POLICY "users read own le" ON public.late_early_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "users create own le" ON public.late_early_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "users cancel own pending le" ON public.late_early_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending') WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin manage le" ON public.late_early_requests FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- overtime_requests
CREATE POLICY "users read own ot" ON public.overtime_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "users create own ot" ON public.overtime_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "users cancel own pending ot" ON public.overtime_requests FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending') WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin manage ot" ON public.overtime_requests FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- notifications
CREATE POLICY "users read own notif" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL OR public.is_admin(auth.uid()));
CREATE POLICY "users mark own notif read" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin manage notif" ON public.notifications FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- policy_settings
CREATE POLICY "auth read policy" ON public.policy_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage policy" ON public.policy_settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- TRIGGERS
-- =========================================================

-- generic updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_emp_upd BEFORE UPDATE ON public.employee_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_bal_upd BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_lr_upd BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_le_upd BEFORE UPDATE ON public.late_early_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_ot_upd BEFORE UPDATE ON public.overtime_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Leave balance auto-update on approve/revert
CREATE OR REPLACE FUNCTION public.apply_leave_balance()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  y INT := EXTRACT(YEAR FROM NEW.start_date)::INT;
  delta NUMERIC := COALESCE(NEW.days, 1);
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.leave_balances (user_id, year, entitled, used)
      VALUES (NEW.user_id, y, 15, delta)
    ON CONFLICT (user_id, year) DO UPDATE
      SET used = public.leave_balances.used + delta, updated_at = now();
  ELSIF OLD.status = 'approved' AND NEW.status IN ('rejected','cancelled') THEN
    UPDATE public.leave_balances
      SET used = GREATEST(0, used - delta), updated_at = now()
      WHERE user_id = NEW.user_id AND year = y;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_apply_leave_balance
  AFTER UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.apply_leave_balance();

-- Auto-create employee_profile + default role + leave_balance on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  fname TEXT := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  yr INT := EXTRACT(YEAR FROM now())::INT;
BEGIN
  INSERT INTO public.employee_profiles (id, full_name, email)
    VALUES (NEW.id, fname, NEW.email)
    ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'employee')
    ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.leave_balances (user_id, year, entitled)
    VALUES (NEW.id, yr, 15)
    ON CONFLICT (user_id, year) DO NOTHING;

  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- STORAGE BUCKET
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('attachments', 'attachments', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "users upload own attachments" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "users read own attachments" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'attachments' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())));
CREATE POLICY "users delete own attachments" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- =========================================================
-- SEED departments + default policy
-- =========================================================
INSERT INTO public.departments (name, code) VALUES
  ('Engineering','ENG'),
  ('Human Resources','HR'),
  ('Operations','OPS')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.policy_settings (key, value) VALUES
  ('working_hours', '{"start":"08:30","end":"17:30","lunch_minutes":60}'::jsonb),
  ('leave_rules', '{"annual_entitlement":15,"carry_over_max":5}'::jsonb),
  ('overtime_rules', '{"rounding_minutes":30,"min_minutes":30}'::jsonb),
  ('late_early_rules', '{"grace_minutes":5}'::jsonb)
ON CONFLICT (key) DO NOTHING;
