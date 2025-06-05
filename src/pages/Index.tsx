
import { Mail, Shuffle, Users, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-lg mb-6 floating">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Générateur de Paires Email
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Créez des paires aléatoires pour vos participants. Ajoutez des participants et générez les associations automatiquement.
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
              <Card className="bg-white border border-slate-200 neutral-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-700">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Participants ({participants.length})</span>
                    </div>
                    {participants.length >= 2 && (
                      <Button
                        onClick={generateAssignments}
                        disabled={isLoading}
                        className="bg-slate-700 hover:bg-slate-800 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <Shuffle className="w-4 h-4 mr-2" />
                            Générer les Paires
                          </>
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
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
              <Card className="bg-white border border-slate-200 neutral-shadow max-w-md mx-auto">
                <CardContent className="p-6">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-slate-600 floating" />
                  <h2 className="text-2xl font-bold text-slate-700 mb-2">
                    Paires générées avec succès!
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Cliquez sur chaque carte pour révéler les associations ou vérifiez vos emails
                  </p>
                  <Button
                    onClick={resetAll}
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
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
