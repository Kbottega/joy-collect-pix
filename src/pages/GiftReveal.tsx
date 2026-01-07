import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Users, Sparkles, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useEvent, useContributions, useEventStats } from '@/hooks/useEvent';
import { Confetti } from '@/components/Confetti';
import { ContributionCard } from '@/components/ContributionCard';

const GiftReveal = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = useEvent(slug || '');
  const { data: contributions } = useContributions(event?.id || '');
  const { total, count } = useEventStats(event?.id || '', contributions);

  const [showConfetti, setShowConfetti] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1000);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          🎁
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-4">Presente não encontrado</h2>
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-celebration-pattern relative overflow-hidden">
      <Confetti isActive={showConfetti} />

      {/* Header */}
      <header className="py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            to={`/evento/${slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Reveal Animation */}
        <AnimatePresence>
          {!revealed ? (
            <motion.div
              key="gift"
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-9xl"
              >
                🎁
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-celebration to-accent flex items-center justify-center mx-auto mb-6 shadow-celebration"
                >
                  <span className="text-6xl">🎂</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-display font-bold mb-4"
                >
                  Feliz Aniversário,{' '}
                  <span className="text-gradient">{event.birthday_person_name}</span>!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-muted-foreground mb-2"
                >
                  {format(new Date(event.birthday_date), "d 'de' MMMM", { locale: ptBR })}
                </motion.p>

                {event.initial_message && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-muted-foreground max-w-md mx-auto italic"
                  >
                    "{event.initial_message}"
                  </motion.p>
                )}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="card-celebration bg-gradient-to-br from-card via-secondary/50 to-card mb-8"
              >
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      <span className="text-sm text-muted-foreground">Total arrecadado</span>
                    </div>
                    <p className="text-4xl font-display font-bold text-gradient">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="w-5 h-5 text-celebration" />
                      <span className="text-sm text-muted-foreground">Com carinho de</span>
                    </div>
                    <p className="text-4xl font-display font-bold">
                      {count} <span className="text-lg">pessoa{count !== 1 && 's'}</span>
                    </p>
                  </div>
                </div>

                {event.gift_mission && event.gift_mission !== 'livre' && (
                  <div className="mt-6 pt-6 border-t border-border text-center">
                    <p className="text-sm text-muted-foreground mb-1">Missão do presente</p>
                    <p className="text-xl font-semibold">
                      {event.gift_mission === 'jantar' && '🍽️ Jantar especial'}
                      {event.gift_mission === 'viagem' && '✈️ Viagem curta'}
                      {event.gift_mission === 'spa' && '💆 Dia de descanso'}
                      {event.gift_mission === 'games' && '🎮 Noite de jogos'}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Messages */}
              {contributions && contributions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-2xl font-display font-bold mb-6 text-center">
                    💝 Mensagens de Carinho
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

              {/* Footer Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12 py-8 border-t border-border"
              >
                <p className="text-muted-foreground">
                  Organizado com ❤️ por <strong>{event.organizer_name}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  via Presente Coletivo
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default GiftReveal;
