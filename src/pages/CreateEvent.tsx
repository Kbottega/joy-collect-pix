import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, ArrowRight, Sparkles, Calendar, User, Wallet, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateEvent } from '@/hooks/useEvent';

const THEMES = [
  { id: 'divertido', label: '🎉 Divertido', color: 'from-primary to-celebration' },
  { id: 'elegante', label: '✨ Elegante', color: 'from-gold to-gold-light' },
  { id: 'neutro', label: '🎁 Neutro', color: 'from-muted to-secondary' },
];

const MISSIONS = [
  { id: 'jantar', label: '🍽️ Jantar especial', description: 'Um jantar memorável' },
  { id: 'viagem', label: '✈️ Viagem curta', description: 'Uma escapada relaxante' },
  { id: 'spa', label: '💆 Dia de descanso', description: 'Relaxamento total' },
  { id: 'games', label: '🎮 Noite de jogos', description: 'Diversão garantida' },
  { id: 'livre', label: '🎁 Livre escolha', description: 'O aniversariante decide' },
];

const AMOUNTS = [10, 20, 30, 50];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEvent = useCreateEvent();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthday_person_name: '',
    birthday_date: '',
    initial_message: '',
    suggested_amount: 20,
    theme: 'divertido' as 'divertido' | 'elegante' | 'neutro',
    gift_mission: 'livre',
    pix_key: '',
    pix_key_type: 'cpf',
    organizer_name: '',
    organizer_email: '',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const event = await createEvent.mutateAsync(formData);
      toast({
        title: '🎉 Presente criado!',
        description: 'Agora é só compartilhar o link com os amigos.',
      });
      navigate(`/evento/${event.slug}`);
    } catch (error) {
      toast({
        title: 'Erro ao criar evento',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.birthday_person_name && formData.birthday_date;
      case 2:
        return true; // Theme and mission have defaults
      case 3:
        return formData.pix_key && formData.organizer_name;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-celebration-pattern py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <span className="font-bold">Presente Coletivo</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card-celebration"
        >
          {step === 1 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-celebration rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Quem é o aniversariante?</h2>
                  <p className="text-muted-foreground text-sm">Conte sobre quem vai receber o presente</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do aniversariante</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Maria Silva"
                    value={formData.birthday_person_name}
                    onChange={(e) => handleChange('birthday_person_name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data do aniversário</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.birthday_date}
                    onChange={(e) => handleChange('birthday_date', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem inicial (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Uma mensagem carinhosa para começar..."
                    value={formData.initial_message}
                    onChange={(e) => handleChange('initial_message', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-accent rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Personalize o presente</h2>
                  <p className="text-muted-foreground text-sm">Escolha o tema e a missão</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Tema visual</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleChange('theme', theme.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.theme === theme.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`h-8 rounded-lg bg-gradient-to-r ${theme.color} mb-2`} />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Missão do presente</Label>
                  <div className="space-y-2">
                    {MISSIONS.map((mission) => (
                      <button
                        key={mission.id}
                        onClick={() => handleChange('gift_mission', mission.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          formData.gift_mission === mission.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium">{mission.label}</div>
                        <div className="text-sm text-muted-foreground">{mission.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Sugestão de valor por pessoa</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleChange('suggested_amount', amount)}
                        className={`p-3 rounded-xl border-2 font-bold transition-all ${
                          formData.suggested_amount === amount
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        R${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-mint to-primary rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">Dados do organizador</h2>
                  <p className="text-muted-foreground text-sm">Para receber as contribuições</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="organizer">Seu nome</Label>
                  <Input
                    id="organizer"
                    placeholder="Ex: João Santos"
                    value={formData.organizer_name}
                    onChange={(e) => handleChange('organizer_name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Seu email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@email.com"
                    value={formData.organizer_email}
                    onChange={(e) => handleChange('organizer_email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="pixType">Tipo de chave PIX</Label>
                  <select
                    id="pixType"
                    value={formData.pix_key_type}
                    onChange={(e) => handleChange('pix_key_type', e.target.value)}
                    className="mt-1 w-full h-11 px-4 rounded-lg border border-input bg-background"
                  >
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="email">Email</option>
                    <option value="telefone">Telefone</option>
                    <option value="chave_aleatoria">Chave Aleatória</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Input
                    id="pix"
                    placeholder="Sua chave PIX"
                    value={formData.pix_key}
                    onChange={(e) => handleChange('pix_key', e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    As contribuições serão enviadas para esta chave
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4 mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || createEvent.isPending}
              variant="hero"
              className="flex-1"
            >
              {createEvent.isPending ? 'Criando...' : 'Criar presente 🎁'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
