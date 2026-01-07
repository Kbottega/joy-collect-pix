import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useEvent, useCreateContribution } from '@/hooks/useEvent';
import { generatePixCode, formatPixKey } from '@/lib/pix';

const EMOJIS = ['🎉', '❤️', '🎂', '🌟', '🎁', '💝', '✨', '🥳', '🎈', '💫'];

const ContributePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: event, isLoading } = useEvent(slug || '');
  const createContribution = useCreateContribution();

  const [step, setStep] = useState<'form' | 'pix' | 'done'>('form');
  const [formData, setFormData] = useState({
    contributor_name: '',
    amount: 0,
    message: '',
    emoji: '🎉',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToPix = () => {
    if (!formData.contributor_name || formData.amount <= 0) {
      toast({
        title: 'Preencha os campos',
        description: 'Nome e valor são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    setStep('pix');
  };

  const handleConfirmPayment = async () => {
    if (!event) return;
    
    try {
      await createContribution.mutateAsync({
        event_id: event.id,
        contributor_name: formData.contributor_name,
        amount: formData.amount,
        message: formData.message,
        emoji: formData.emoji,
      });
      setStep('done');
    } catch (error) {
      toast({
        title: 'Erro ao registrar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const copyPixKey = () => {
    if (event) {
      navigator.clipboard.writeText(event.pix_key);
      toast({
        title: '📋 Chave PIX copiada!',
        description: 'Cole no seu app de banco.',
      });
    }
  };

  const pixCode = event
    ? generatePixCode({
        pixKey: event.pix_key,
        pixKeyType: event.pix_key_type as any,
        merchantName: event.organizer_name,
        merchantCity: 'BRASIL',
        amount: formData.amount,
        description: `Presente ${event.birthday_person_name}`,
      })
    : '';

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: '📋 Código PIX copiado!',
      description: 'Cole no seu app de banco.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-5xl animate-bounce">🎁</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-4">Evento não encontrado</h2>
          <Button asChild>
            <Link to="/">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-celebration-pattern py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/evento/${slug}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </div>
        </div>

        {/* Form Step */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-celebration"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">💝</div>
              <h2 className="text-2xl font-display font-bold">
                Participar do presente
              </h2>
              <p className="text-muted-foreground">
                Para {event.birthday_person_name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Seu nome</Label>
                <Input
                  id="name"
                  placeholder="Como quer ser chamado?"
                  value={formData.contributor_name}
                  onChange={(e) => handleChange('contributor_name', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Valor da contribuição</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[10, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleChange('amount', amount)}
                      className={`p-3 rounded-xl border-2 font-bold transition-all ${
                        formData.amount === amount
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      R${amount}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <Input
                    type="number"
                    placeholder="Outro valor"
                    value={formData.amount || ''}
                    onChange={(e) => handleChange('amount', Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <Label>Escolha um emoji</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleChange('emoji', emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        formData.emoji === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message">Mensagem carinhosa (opcional)</Label>
                <Textarea
                  id="message"
                  placeholder="Deixe um recado especial..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleProceedToPix}
                variant="hero"
                size="lg"
                className="w-full mt-4"
              >
                Continuar para o PIX
              </Button>
            </div>
          </motion.div>
        )}

        {/* PIX Step */}
        {step === 'pix' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-celebration"
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📱</div>
              <h2 className="text-2xl font-display font-bold">Faça o PIX</h2>
              <p className="text-muted-foreground">
                R$ {formData.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="space-y-4">
              {/* PIX Code */}
              <div className="bg-secondary rounded-xl p-4">
                <div className="text-center mb-3">
                  <p className="text-sm text-muted-foreground mb-2">PIX Copia e Cola</p>
                  <div className="bg-background rounded-lg p-3 font-mono text-xs break-all">
                    {pixCode.substring(0, 50)}...
                  </div>
                </div>
                <Button onClick={copyPixCode} variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar código PIX
                </Button>
              </div>

              {/* PIX Key */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Ou use a chave PIX</p>
                <div className="flex items-center justify-center gap-2 bg-secondary rounded-lg p-3">
                  <span className="font-mono">{formatPixKey(event.pix_key, event.pix_key_type)}</span>
                  <button onClick={copyPixKey} className="text-primary">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.pix_key_type.toUpperCase()}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Após fazer o PIX, clique no botão abaixo
                </p>
                <Button
                  onClick={handleConfirmPayment}
                  variant="celebration"
                  size="lg"
                  className="w-full"
                  disabled={createContribution.isPending}
                >
                  {createContribution.isPending ? 'Registrando...' : 'Já fiz o PIX ✓'}
                </Button>
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                ← Voltar e editar
              </button>
            </div>
          </motion.div>
        )}

        {/* Done Step */}
        {step === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-celebration text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-mint to-primary flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <h2 className="text-2xl font-display font-bold mb-2">
              Obrigado, {formData.contributor_name}!
            </h2>
            <p className="text-muted-foreground mb-6">
              Sua contribuição vai fazer {event.birthday_person_name} muito feliz! 🎉
            </p>

            <div className="bg-secondary rounded-xl p-4 mb-6">
              <p className="text-4xl mb-2">{formData.emoji}</p>
              {formData.message && (
                <p className="text-sm italic">"{formData.message}"</p>
              )}
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link to={`/evento/${slug}`}>Ver todas as mensagens</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContributePage;
