-- Enum para status do evento
CREATE TYPE public.event_status AS ENUM ('active', 'revealed', 'closed');

-- Enum para temas visuais
CREATE TYPE public.event_theme AS ENUM ('divertido', 'elegante', 'neutro');

-- Tabela de eventos de aniversário
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  birthday_person_name TEXT NOT NULL,
  birthday_date DATE NOT NULL,
  photo_url TEXT,
  initial_message TEXT,
  suggested_amount DECIMAL(10,2) DEFAULT 20.00,
  theme event_theme DEFAULT 'divertido',
  gift_mission TEXT,
  pix_key TEXT NOT NULL,
  pix_key_type TEXT NOT NULL DEFAULT 'cpf',
  organizer_name TEXT NOT NULL,
  organizer_email TEXT,
  status event_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de contribuições
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  contributor_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  emoji TEXT DEFAULT '🎉',
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Políticas para eventos (público pode ler eventos ativos)
CREATE POLICY "Anyone can view active events"
ON public.events
FOR SELECT
USING (status = 'active' OR status = 'revealed');

-- Política para criar eventos (qualquer um pode criar)
CREATE POLICY "Anyone can create events"
ON public.events
FOR INSERT
WITH CHECK (true);

-- Políticas para contribuições (público pode ler)
CREATE POLICY "Anyone can view contributions"
ON public.contributions
FOR SELECT
USING (true);

-- Política para criar contribuições
CREATE POLICY "Anyone can create contributions"
ON public.contributions
FOR INSERT
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION public.generate_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
  new_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  -- Gera slug baseado no nome + random string
  new_slug := lower(regexp_replace(NEW.birthday_person_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
  
  -- Verifica se já existe
  SELECT EXISTS(SELECT 1 FROM public.events WHERE slug = new_slug) INTO slug_exists;
  
  WHILE slug_exists LOOP
    new_slug := lower(regexp_replace(NEW.birthday_person_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
    SELECT EXISTS(SELECT 1 FROM public.events WHERE slug = new_slug) INTO slug_exists;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_event_slug
BEFORE INSERT ON public.events
FOR EACH ROW
WHEN (NEW.slug IS NULL)
EXECUTE FUNCTION public.generate_unique_slug();

-- Habilitar realtime para contribuições
ALTER PUBLICATION supabase_realtime ADD TABLE public.contributions;