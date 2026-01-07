import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Users, Share2, Calendar, Copy, MessageCircle, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEvent, useContributions, useEventStats } from '@/hooks/useEvent';
import { ContributionCard } from '@/components/ContributionCard';
import { ProgressBar } from '@/components/ProgressBar';
import { FloatingEmoji } from '@/components/FloatingEmoji';

const EventPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { data: event, isLoading } = useEvent(slug || '');
  const { data: contributions } = useContributions(event?.id || '');
  const { total, count } = useEventStats(event?.id || '', contributions);

  const shareUrl = `${window.location.origin}/evento/${slug}`;
  
  const shareWhatsApp = () => {
    const text = `🎁 Vamos presentear ${event?.birthday_person_name}!\n\nParticipe do presente coletivo: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: '📋 Link copiado!',
      description: 'Agora é só enviar para os amigos.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🎁</div>
          <p className="text-muted-foreground">Carregando presente...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-2">Evento não encontrado</h2>
          <p className="text-muted-foreground mb-4">Este presente pode ter sido removido.</p>
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-celebration-pattern relative">
      <FloatingEmoji />
      
      {/* Header */}
      <header className="py-4 px-4 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copyLink}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={shareWhatsApp}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-celebration flex items-center justify-center mx-auto mb-4 text-5xl shadow-celebration">
            🎂
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Presente para {event.birthday_person_name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(event.birthday_date), "d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
          {event.initial_message && (
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              {event.initial_message}
            </p>
          )}
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-celebration mb-6"
        >
          <ProgressBar current={total} />
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">{count} pessoa{count !== 1 && 's'} participando</span>
            </div>
            {event.gift_mission && event.gift_mission !== 'livre' && (
              <span className="text-sm bg-secondary px-3 py-1 rounded-full">
                Missão: {event.gift_mission}
              </span>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Button asChild variant="hero" size="xl" className="w-full">
            <Link to={`/evento/${slug}/contribuir`}>
              Participar do presente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Sugestão: R$ {Number(event.suggested_amount).toFixed(0)} por pessoa
          </p>
        </motion.div>

        {/* Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mb-8"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={shareWhatsApp}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Compartilhar no WhatsApp
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={copyLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar link
          </Button>
        </motion.div>

        {/* Contributions */}
        {contributions && contributions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-display font-bold mb-4">
              💝 Mensagens ({contributions.length})
            </h2>
            <div className="space-y-4">
              {contributions.map((contribution, index) => (
                <ContributionCard
                  key={contribution.id}
                  name={contribution.contributor_name}
                  message={contribution.message || undefined}
                  emoji={contribution.emoji || '🎉'}
                  amount={Number(contribution.amount)}
                  createdAt={contribution.created_at}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {(!contributions || contributions.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">💝</div>
            <h3 className="text-lg font-semibold mb-2">Seja o primeiro a participar!</h3>
            <p className="text-muted-foreground">
              Sua contribuição vai fazer {event.birthday_person_name} muito feliz.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-8">
        <p>Organizado por {event.organizer_name}</p>
      </footer>
    </div>
  );
};

export default EventPage;
