
import { Gift, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AssignmentCardProps {
  giver: string;
  receiver: string;
  isRevealed: boolean;
  onReveal: () => void;
}

const AssignmentCard = ({ giver, receiver, isRevealed, onReveal }: AssignmentCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-500 hover:scale-105 gift-shadow ${
        isRevealed 
          ? 'bg-gradient-to-br from-red-50 to-green-50 border-2 border-green-300' 
          : 'bg-gradient-to-br from-red-500 to-green-600 border-2 border-red-400 hover:from-red-400 hover:to-green-500'
      }`}
      onClick={onReveal}
    >
      <CardContent className="p-6 text-center">
        {!isRevealed ? (
          <div className="text-white">
            <Gift className="w-12 h-12 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold mb-2">{giver}</h3>
            <p className="text-red-100">Click to reveal your Secret Santa assignment! 🎁</p>
          </div>
        ) : (
          <div className="text-gray-800">
            <Heart className="w-12 h-12 mx-auto mb-3 text-red-500 floating" />
            <h3 className="text-xl font-bold mb-2 text-green-700">{giver}</h3>
            <p className="text-gray-600 mb-2">You are Secret Santa for:</p>
            <p className="text-2xl font-bold text-red-600">{receiver}</p>
            <div className="mt-3 text-lg">🎄✨🎁✨🎄</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;
