import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  slug: string;
  birthday_person_name: string;
  birthday_date: string;
  photo_url?: string;
  initial_message?: string;
  suggested_amount: number;
  theme: 'divertido' | 'elegante' | 'neutro';
  gift_mission?: string;
  pix_key: string;
  pix_key_type: string;
  organizer_name: string;
  organizer_email?: string;
  status: 'active' | 'revealed' | 'closed';
  created_at: string;
}

export interface Contribution {
  id: string;
  event_id: string;
  contributor_name: string;
  amount: number;
  message?: string;
  emoji?: string;
  is_confirmed: boolean;
  created_at: string;
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data as Event | null;
    },
    enabled: !!slug,
  });
}

export function useContributions(eventId: string) {
  return useQuery({
    queryKey: ['contributions', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contribution[];
    },
    enabled: !!eventId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: Omit<Event, 'id' | 'slug' | 'created_at' | 'status' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, slug: null }])
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useCreateContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contribution: Omit<Contribution, 'id' | 'created_at' | 'is_confirmed'>) => {
      const { data, error } = await supabase
        .from('contributions')
        .insert([contribution])
        .select()
        .single();

      if (error) throw error;
      return data as Contribution;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contributions', variables.event_id] });
    },
  });
}

// Hook para estatísticas do evento
export function useEventStats(eventId: string, contributions?: Contribution[]) {
  const total = contributions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;
  const count = contributions?.length || 0;
  
  return { total, count };
}
