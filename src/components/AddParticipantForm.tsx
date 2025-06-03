
import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddParticipantFormProps {
  onAdd: (name: string, email?: string) => void;
}

const AddParticipantForm = ({ onAdd }: AddParticipantFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), email.trim() || undefined);
      setName('');
      setEmail('');
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-2 border-green-200 gift-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-green-700">
          <Users className="w-5 h-5" />
          <span>Add Participants</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Participant name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-red-200 focus:border-red-400"
            required
          />
          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-red-200 focus:border-red-400"
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white font-semibold"
            disabled={!name.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Secret Santa
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddParticipantForm;
