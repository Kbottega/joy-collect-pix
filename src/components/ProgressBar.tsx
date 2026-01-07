import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  goal?: number;
  showAmount?: boolean;
}

export const ProgressBar = ({ current, goal, showAmount = true }: ProgressBarProps) => {
  const percentage = goal ? Math.min((current / goal) * 100, 100) : 100;

  return (
    <div className="w-full">
      {showAmount && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-gradient font-display">
            R$ {current.toFixed(2).replace('.', ',')}
          </span>
          {goal && (
            <span className="text-sm text-muted-foreground">
              Meta: R$ {goal.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
      )}
      <div className="h-4 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-celebration to-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
};
