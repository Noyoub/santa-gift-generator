
import { useState } from 'react';
import { Gift, Shuffle, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SnowEffect from '@/components/SnowEffect';
import ParticipantCard from '@/components/ParticipantCard';
import AddParticipantForm from '@/components/AddParticipantForm';
import AssignmentCard from '@/components/AssignmentCard';
import { Participant, Assignment, generateSecretSantaAssignments, createParticipant } from '@/utils/secretSanta';

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();

  const addParticipant = (name: string, email?: string) => {
    const participant = createParticipant(name, email);
    setParticipants(prev => [...prev, participant]);
    toast({
      title: "Participant Added! 🎄",
      description: `${name} has joined the Secret Santa!`,
    });
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    setIsGenerated(false);
    setAssignments([]);
  };

  const generateAssignments = () => {
    if (participants.length < 2) {
      toast({
        title: "Not enough participants",
        description: "You need at least 2 people for Secret Santa!",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAssignments = generateSecretSantaAssignments(participants);
      setAssignments(newAssignments);
      setIsGenerated(true);
      toast({
        title: "Secret Santa Generated! 🎁",
        description: "Everyone has been assigned their Secret Santa!",
      });
    } catch (error) {
      toast({
        title: "Error generating assignments",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const revealAssignment = (index: number) => {
    setAssignments(prev => 
      prev.map((assignment, i) => 
        i === index ? { ...assignment, isRevealed: true } : assignment
      )
    );
  };

  const resetAll = () => {
    setParticipants([]);
    setAssignments([]);
    setIsGenerated(false);
    toast({
      title: "Reset Complete",
      description: "Ready for a new Secret Santa!",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowEffect />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-green-600 rounded-full mb-6 floating">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-4">
            Secret Santa Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create magical holiday moments! Add participants and let the Christmas spirit decide who gives to whom. 🎄✨
          </p>
        </div>

        {!isGenerated ? (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Add Participants Form */}
            <div>
              <AddParticipantForm onAdd={addParticipant} />
            </div>

            {/* Participants List */}
            <div>
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-green-200 gift-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-green-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Participants ({participants.length})</span>
                    </div>
                    {participants.length >= 2 && (
                      <Button
                        onClick={generateAssignments}
                        className="bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white"
                      >
                        <Shuffle className="w-4 h-4 mr-2" />
                        Generate Secret Santa
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No participants yet. Add some people to get started!</p>
                    </div>
                  ) : (
                    participants.map((participant) => (
                      <ParticipantCard
                        key={participant.id}
                        name={participant.name}
                        email={participant.email}
                        onRemove={() => removeParticipant(participant.id)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8">
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-yellow-300 gift-shadow max-w-md mx-auto">
                <CardContent className="p-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-yellow-500 floating" />
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    Secret Santa Assignments Ready!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Click on each gift to reveal assignments
                  </p>
                  <Button
                    onClick={resetAll}
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Start Over
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Assignments Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment, index) => (
                <AssignmentCard
                  key={`${assignment.giver.id}-${assignment.receiver.id}`}
                  giver={assignment.giver.name}
                  receiver={assignment.receiver.name}
                  isRevealed={assignment.isRevealed}
                  onReveal={() => revealAssignment(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
