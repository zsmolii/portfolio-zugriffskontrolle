-- ULTIMATIVES SQL-SCRIPT: Löscht alles und erstellt neu mit korrekten RLS-Policies
-- Führe dieses Script in Supabase SQL Editor aus

-- Schritt 1: Lösche alle bestehenden Tabellen
DROP TABLE IF EXISTS public.theme_settings CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.portfolio_content CASCADE;
DROP TABLE IF EXISTS public.invitation_links CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Schritt 2: Erstelle users Tabelle
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  access_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schritt 3: Aktiviere RLS für users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Schritt 4: Erstelle RLS-Policies für users (WICHTIG - VEREINFACHT!)
-- Vereinfachte RLS-Policies, die garantiert funktionieren

-- Policy 1: Jeder authentifizierte User kann sein eigenes Profil lesen
CREATE POLICY "authenticated_read_own"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Jeder authentifizierte User kann sein eigenes Profil aktualisieren
CREATE POLICY "authenticated_update_own"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Admins können alles (für spätere Admin-Features)
CREATE POLICY "admins_all"
ON public.users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.is_admin = true
  )
);

-- Schritt 5: Füge deinen Admin-User ein
-- Verwende die korrekte UUID aus Supabase Auth
INSERT INTO public.users (id, email, company_name, contact_person, is_admin, is_active, access_expires_at, created_at, updated_at)
VALUES (
  'b9b907a6-f05a-4606-93ef-3404f8ae6572'::UUID,
  'zsmolii@icloud.com',
  'Admin',
  'Zaid Smolii',
  true,
  true,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  company_name = EXCLUDED.company_name,
  contact_person = EXCLUDED.contact_person,
  is_admin = EXCLUDED.is_admin,
  is_active = EXCLUDED.is_active,
  access_expires_at = EXCLUDED.access_expires_at,
  updated_at = NOW();

-- Schritt 6: Erstelle invitation_links Tabelle
CREATE TABLE public.invitation_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  access_duration_days INTEGER DEFAULT 30,
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invitation_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_invitation_links"
ON public.invitation_links
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  )
);

CREATE POLICY "public_read_valid_invites"
ON public.invitation_links
FOR SELECT
TO anon, authenticated
USING (NOT is_used AND expires_at > NOW());

-- Schritt 7: Erstelle portfolio_content Tabelle
CREATE TABLE public.portfolio_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_portfolio"
ON public.portfolio_content
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_portfolio"
ON public.portfolio_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  )
);

-- Schritt 8: Erstelle projects Tabelle
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  icon TEXT,
  demo_url TEXT,
  ai_role TEXT,
  challenges TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_projects"
ON public.projects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_projects"
ON public.projects
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  )
);

-- Schritt 9: Erstelle theme_settings Tabelle
CREATE TABLE public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  background_color TEXT DEFAULT '#0a0a0a',
  background_image TEXT,
  font_family TEXT DEFAULT 'Inter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_read_theme"
ON public.theme_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admin_manage_theme"
ON public.theme_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.is_admin = true
  )
);

-- Schritt 10: Füge Demo-Daten ein
INSERT INTO public.theme_settings (background_color, background_image, font_family)
VALUES ('#0a0a0a', NULL, 'Inter')
ON CONFLICT DO NOTHING;

-- Schritt 11: Zeige Ergebnisse zur Bestätigung
SELECT 'Admin User:' as info;
SELECT id, email, is_admin, is_active, access_expires_at FROM public.users;

SELECT 'RLS Policies für users Tabelle:' as info;
SELECT policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users';
