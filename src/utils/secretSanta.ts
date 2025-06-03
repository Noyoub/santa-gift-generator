
export interface Participant {
  id: string;
  name: string;
  email?: string;
}

export interface Assignment {
  giver: Participant;
  receiver: Participant;
  isRevealed: boolean;
}

export const generateSecretSantaAssignments = (participants: Participant[]): Assignment[] => {
  if (participants.length < 2) {
    throw new Error('Need at least 2 participants for Secret Santa');
  }

  // Create a copy of participants for shuffling
  const receivers = [...participants];
  const assignments: Assignment[] = [];

  // Shuffle the receivers array using Fisher-Yates algorithm
  for (let i = receivers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
  }

  // Ensure no one gets themselves
  for (let i = 0; i < participants.length; i++) {
    let receiverIndex = i;
    
    // If someone got themselves, swap with the next person
    if (participants[i].id === receivers[receiverIndex].id) {
      const nextIndex = (i + 1) % participants.length;
      [receivers[receiverIndex], receivers[nextIndex]] = [receivers[nextIndex], receivers[receiverIndex]];
    }

    assignments.push({
      giver: participants[i],
      receiver: receivers[receiverIndex],
      isRevealed: false,
    });
  }

  return assignments;
};

export const createParticipant = (name: string, email?: string): Participant => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  email,
});
