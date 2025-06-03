
import { Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ParticipantCardProps {
  name: string;
  email?: string;
  onRemove: () => void;
}

const ParticipantCard = ({ name, email, onRemove }: ParticipantCardProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200 hover:border-red-300 transition-all duration-300 hover:scale-105 gift-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-green-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{name}</h3>
              {email && <p className="text-sm text-gray-600">{email}</p>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantCard;
