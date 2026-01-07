import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Users, Heart, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingEmoji } from '@/components/FloatingEmoji';

const features = [
  {
    icon: Gift,
    title: 'Crie um evento',
    description: 'Monte o presente de aniversário em segundos. Escolha a missão do presente!',
  },
  {
    icon: Users,
    title: 'Convide amigos',
    description: 'Compartilhe o link via WhatsApp. Cada pessoa contribui com PIX.',
  },
  {
    icon: Heart,
    title: 'Mensagens especiais',
    description: 'Cada contribuição vem com uma mensagem carinhosa.',
  },
  {
    icon: Sparkles,
    title: 'Surpreenda!',
    description: 'O aniversariante recebe uma página mágica com todo o carinho.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-celebration-pattern relative overflow-hidden">
      <FloatingEmoji />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-foreground mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              Presentes com significado
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight"
          >
            Transforme <span className="text-gradient">PIX</span> em{' '}
            <br className="hidden md:block" />
            presentes <span className="text-gradient">inesquecíveis</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Junte amigos, colegas ou família para criar presentes colaborativos cheios de carinho, 
            mensagens especiais e momentos únicos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/criar">
                Criar presente agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/como-funciona">
                Como funciona?
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🎁
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 text-6xl opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          🎂
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Simples como deve ser
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Em 3 passos você cria uma experiência mágica para quem você ama
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-celebration text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-celebration rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center card-celebration bg-gradient-to-br from-secondary via-card to-secondary"
        >
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para surpreender alguém?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Crie um presente coletivo em menos de 1 minuto. É grátis!
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/criar">
              Começar agora
              <Gift className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Feito com ❤️ para celebrar momentos especiais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
