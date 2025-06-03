
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Participant {
  id: string;
  name: string;
  email: string;
}

export interface Assignment {
  giver: Participant;
  receiver: Participant;
  isRevealed: boolean;
}

export const useSecretSanta = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addParticipant = async (name: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .insert({ name, email })
        .select()
        .single();

      if (error) throw error;

      const participant: Participant = {
        id: data.id,
        name: data.name,
        email: data.email,
      };

      setParticipants(prev => [...prev, participant]);
      toast({
        title: "Participant ajouté! 🎄",
        description: `${name} a rejoint le Secret Santa!`,
      });
    } catch (error) {
      console.error('Error adding participant:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le participant",
        variant: "destructive",
      });
    }
  };

  const removeParticipant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setParticipants(prev => prev.filter(p => p.id !== id));
      setIsGenerated(false);
      setAssignments([]);
    } catch (error) {
      console.error('Error removing participant:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le participant",
        variant: "destructive",
      });
    }
  };

  const generateAssignments = async () => {
    if (participants.length < 2) {
      toast({
        title: "Pas assez de participants",
        description: "Il faut au moins 2 personnes pour le Secret Santa!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create event
      const { data: eventData, error: eventError } = await supabase
        .from('secret_santa_events')
        .insert({ name: 'Secret Santa', is_generated: true })
        .select()
        .single();

      if (eventError) throw eventError;

      // Generate assignments using Fisher-Yates algorithm
      const receivers = [...participants];
      for (let i = receivers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
      }

      // Ensure no one gets themselves
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].id === receivers[i].id) {
          const nextIndex = (i + 1) % participants.length;
          [receivers[i], receivers[nextIndex]] = [receivers[nextIndex], receivers[i]];
        }
      }

      // Save assignments to database
      const assignmentData = participants.map((giver, index) => ({
        event_id: eventData.id,
        giver_id: giver.id,
        receiver_id: receivers[index].id,
      }));

      const { error: assignmentError } = await supabase
        .from('assignments')
        .insert(assignmentData);

      if (assignmentError) throw assignmentError;

      // Send emails
      const { error: emailError } = await supabase.functions.invoke('send-secret-santa-emails', {
        body: {
          eventId: eventData.id,
          assignments: participants.map((giver, index) => ({
            giver: giver,
            receiver: receivers[index],
          })),
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        toast({
          title: "Assignments générés!",
          description: "Les assignments ont été créés mais il y a eu un problème avec l'envoi des emails.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Secret Santa généré! 🎁",
          description: "Tous les participants ont reçu leur assignment par email!",
        });
      }

      // Create assignments for display
      const newAssignments: Assignment[] = participants.map((giver, index) => ({
        giver,
        receiver: receivers[index],
        isRevealed: false,
      }));

      setAssignments(newAssignments);
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating assignments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const revealAssignment = (index: number) => {
    setAssignments(prev => 
      prev.map((assignment, i) => 
        i === index ? { ...assignment, isRevealed: true } : assignment
      )
    );
  };

  const resetAll = async () => {
    try {
      // Delete all participants (this will cascade delete assignments due to foreign key)
      const { error } = await supabase
        .from('participants')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      setParticipants([]);
      setAssignments([]);
      setIsGenerated(false);
      toast({
        title: "Remise à zéro complète",
        description: "Prêt pour un nouveau Secret Santa!",
      });
    } catch (error) {
      console.error('Error resetting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de remettre à zéro",
        variant: "destructive",
      });
    }
  };

  return {
    participants,
    assignments,
    isGenerated,
    isLoading,
    addParticipant,
    removeParticipant,
    generateAssignments,
    revealAssignment,
    resetAll,
  };
};
