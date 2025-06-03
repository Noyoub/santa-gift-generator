
import { Gift, Shuffle, Users, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SnowEffect from '@/components/SnowEffect';
import ParticipantCard from '@/components/ParticipantCard';
import AddParticipantForm from '@/components/AddParticipantForm';
import AssignmentCard from '@/components/AssignmentCard';
import { useSecretSanta } from '@/hooks/useSecretSanta';

const Index = () => {
  const {
    participants,
    assignments,
    isGenerated,
    isLoading,
    addParticipant,
    removeParticipant,
    generateAssignments,
    revealAssignment,
    resetAll,
  } = useSecretSanta();

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
            Créez des moments magiques de fête! Ajoutez des participants et laissez l'esprit de Noël décider qui donne à qui. 🎄✨
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
                        disabled={isLoading}
                        className="bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Shuffle className="w-4 h-4 mr-2" />
                            Générer Secret Santa
                          </>
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun participant encore. Ajoutez des personnes pour commencer!</p>
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
                    Assignments Secret Santa prêts!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Cliquez sur chaque cadeau pour révéler les assignments ou vérifiez vos emails
                  </p>
                  <Button
                    onClick={resetAll}
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Recommencer
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
