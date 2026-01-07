import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContributionCardProps {
  name: string;
  message?: string;
  emoji?: string;
  amount: number;
  createdAt: string;
  index: number;
}

export const ContributionCard = ({
  name,
  message,
  emoji = '🎉',
  amount,
  createdAt,
  index,
}: ContributionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card-celebration flex gap-4"
    >
      <div className="text-4xl emoji-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
        {emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-foreground">{name}</h4>
          <span className="text-sm font-semibold text-primary">
            R$ {amount.toFixed(2).replace('.', ',')}
          </span>
        </div>
        {message && (
          <p className="text-muted-foreground text-sm mb-2">{message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>
    </motion.div>
  );
};
