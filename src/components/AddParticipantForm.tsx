
import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddParticipantFormProps {
  onAdd: (name: string, email: string) => void;
}

const AddParticipantForm = ({ onAdd }: AddParticipantFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onAdd(name.trim(), email.trim());
      setName('');
      setEmail('');
    }
  };

  return (
    <Card className="bg-white border border-slate-200 neutral-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-700">
          <Users className="w-5 h-5" />
          <span>Ajouter des Participants</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Nom du participant *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-slate-300 focus:border-slate-500"
            required
          />
          <Input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-slate-300 focus:border-slate-500"
            required
          />
          <Button
            type="submit"
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold"
            disabled={!name.trim() || !email.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter au Tirage
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddParticipantForm;
