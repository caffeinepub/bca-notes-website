import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note, Syllabus, Question, UserProfile, PDF } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Notes Queries
export function useGetAllNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, content }: { title: string; description: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNote(title, description, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useUpdateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, description, content }: { id: bigint; title: string; description: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNote(id, title, description, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// Syllabus Queries
export function useGetAllSyllabuses() {
  const { actor, isFetching } = useActor();

  return useQuery<Syllabus[]>({
    queryKey: ['syllabuses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSyllabuses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSyllabus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ semester, subject, topics, courseDetails }: { semester: bigint; subject: string; topics: string[]; courseDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSyllabus(semester, subject, topics, courseDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabuses'] });
    },
  });
}

export function useUpdateSyllabus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, semester, subject, topics, courseDetails }: { id: bigint; semester: bigint; subject: string; topics: string[]; courseDetails: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSyllabus(id, semester, subject, topics, courseDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabuses'] });
    },
  });
}

export function useDeleteSyllabus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSyllabus(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabuses'] });
    },
  });
}

// Questions (PYQ) Queries
export function useGetAllQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ year, semester, subject, questionContent }: { year: bigint; semester: bigint; subject: string; questionContent: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createQuestion(year, semester, subject, questionContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, year, semester, subject, questionContent }: { id: bigint; year: bigint; semester: bigint; subject: string; questionContent: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateQuestion(id, year, semester, subject, questionContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

// PDF Queries
export function useGetAllPDFs() {
  const { actor, isFetching } = useActor();

  return useQuery<PDF[]>({
    queryKey: ['pdfs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPDFs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPDF() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPDF(id);
    },
  });
}

export function useCreatePDF() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, title, description, file }: { subject: string; title: string; description: string; file: File }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Convert File to Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(arrayBuffer);
      
      return actor.createPDF(subject, title, description, fileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    },
  });
}

export function useUpdatePDF() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, subject, title, description }: { id: bigint; subject: string; title: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePDF(id, subject, title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    },
  });
}

export function useDeletePDF() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePDF(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    },
  });
}
