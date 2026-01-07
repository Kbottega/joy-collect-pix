import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ArrowRight, Users, Smartphone, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: '01',
    icon: Gift,
    title: 'Crie um evento',
    description: 'Informe o nome do aniversariante, data e escolha a missão do presente. É rápido e fácil!',
    color: 'from-primary to-celebration',
  },
  {
    number: '02',
    icon: Users,
    title: 'Convide os amigos',
    description: 'Compartilhe o link via WhatsApp. Cada pessoa pode contribuir com o valor que quiser.',
    color: 'from-gold to-accent',
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Todos contribuem via PIX',
    description: 'Cada contribuinte faz um PIX e deixa uma mensagem carinhosa para o aniversariante.',
    color: 'from-mint to-primary',
  },
  {
    number: '04',
    icon: Heart,
    title: 'Presente mágico!',
    description: 'O aniversariante recebe uma página especial com todas as mensagens e o valor arrecadado.',
    color: 'from-celebration to-lavender',
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-celebration-pattern">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            Simples e emocionante
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Como funciona o{' '}
            <span className="text-gradient">Presente Coletivo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforme contribuições em momentos inesquecíveis em apenas 4 passos
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-celebration flex flex-col md:flex-row items-center gap-6"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                <step.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="text-center md:text-left">
                <span className="text-sm font-bold text-primary mb-1 block">
                  Passo {step.number}
                </span>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-display font-bold text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <div className="card-celebration">
              <h4 className="font-bold mb-2">É gratuito?</h4>
              <p className="text-muted-foreground">
                Sim! Criar um presente coletivo é totalmente gratuito.
              </p>
            </div>
            <div className="card-celebration">
              <h4 className="font-bold mb-2">Como funciona o PIX?</h4>
              <p className="text-muted-foreground">
                O organizador cadastra sua chave PIX. Os contribuintes fazem o PIX diretamente para essa chave e confirmam no app.
              </p>
            </div>
            <div className="card-celebration">
              <h4 className="font-bold mb-2">Preciso me cadastrar?</h4>
              <p className="text-muted-foreground">
                Não! Nem o organizador nem os contribuintes precisam criar conta. É tudo pelo link.
              </p>
            </div>
            <div className="card-celebration">
              <h4 className="font-bold mb-2">Quando o aniversariante vê o presente?</h4>
              <p className="text-muted-foreground">
                O organizador pode compartilhar o link da página do presente a qualquer momento com o aniversariante.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center card-celebration bg-gradient-to-br from-secondary via-card to-secondary"
        >
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-2xl font-display font-bold mb-4">
            Pronto para começar?
          </h2>
          <Button asChild variant="hero" size="lg">
            <Link to="/criar">
              Criar presente agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Feito com ❤️ para celebrar momentos especiais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
