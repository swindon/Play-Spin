import React from 'react';
import {
  Activity,
  BedDouble,
  Bike,
  BookOpen,
  Blocks,
  CircleDot,
  Crown,
  Dices,
  FlaskConical,
  Gem,
  Moon,
  Music,
  Palette,
  Puzzle,
  Scissors,
  Shirt,
  Sparkles,
  Sun,
  Tent,
  TrainFront,
  Utensils,
} from 'lucide-react';
import type { ActivityIconKey } from '../data/activities';

interface ActivityIconProps {
  icon: ActivityIconKey;
  className?: string;
  strokeWidth?: number;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({
  icon,
  className = 'w-6 h-6',
  strokeWidth = 2.2,
}) => {
  switch (icon) {
    case 'book':
      return <BookOpen className={className} strokeWidth={strokeWidth} />;
    case 'blocks':
      return <Blocks className={className} strokeWidth={strokeWidth} />;
    case 'stretch':
      return <Activity className={className} strokeWidth={strokeWidth} />;
    case 'puzzle':
      return <Puzzle className={className} strokeWidth={strokeWidth} />;
    case 'palette':
      return <Palette className={className} strokeWidth={strokeWidth} />;
    case 'bike':
      return <Bike className={className} strokeWidth={strokeWidth} />;
    case 'train':
      return <TrainFront className={className} strokeWidth={strokeWidth} />;
    case 'soccer':
      return <CircleDot className={className} strokeWidth={strokeWidth} />;
    case 'crown':
      return <Crown className={className} strokeWidth={strokeWidth} />;
    case 'music':
      return <Music className={className} strokeWidth={strokeWidth} />;
    case 'beads':
      return <Gem className={className} strokeWidth={strokeWidth} />;
    case 'flask':
      return <FlaskConical className={className} strokeWidth={strokeWidth} />;
    case 'scissors':
      return <Scissors className={className} strokeWidth={strokeWidth} />;
    case 'broom':
      return <Sun className={className} strokeWidth={strokeWidth} />;
    case 'shirt':
      return <Shirt className={className} strokeWidth={strokeWidth} />;
    case 'utensils':
      return <Utensils className={className} strokeWidth={strokeWidth} />;
    case 'bed':
      return <BedDouble className={className} strokeWidth={strokeWidth} />;
    case 'moon':
      return <Moon className={className} strokeWidth={strokeWidth} />;
    case 'dice':
      return <Dices className={className} strokeWidth={strokeWidth} />;
    case 'tent':
      return <Tent className={className} strokeWidth={strokeWidth} />;
    case 'jar':
      return <Sparkles className={className} strokeWidth={strokeWidth} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} strokeWidth={strokeWidth} />;
  }
};
