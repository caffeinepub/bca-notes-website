import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    description: string;
    updatedAt?: bigint;
}
export interface PDF {
    id: bigint;
    title: string;
    subject: string;
    fileData: Uint8Array;
    description: string;
}
export interface Question {
    id: bigint;
    semester: bigint;
    subject: string;
    year: bigint;
    questionContent: string;
}
export interface Syllabus {
    id: bigint;
    semester: bigint;
    subject: string;
    topics: Array<string>;
    courseDetails: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNote(title: string, description: string, content: string): Promise<Note>;
    createPDF(subject: string, title: string, description: string, fileData: Uint8Array): Promise<PDF>;
    createQuestion(year: bigint, semester: bigint, subject: string, questionContent: string): Promise<Question>;
    createSyllabus(semester: bigint, subject: string, topics: Array<string>, courseDetails: string): Promise<Syllabus>;
    deleteNote(id: bigint): Promise<void>;
    deletePDF(id: bigint): Promise<void>;
    deleteQuestion(id: bigint): Promise<void>;
    deleteSyllabus(id: bigint): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    getAllPDFs(): Promise<Array<PDF>>;
    getAllQuestions(): Promise<Array<Question>>;
    getAllSyllabuses(): Promise<Array<Syllabus>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNote(id: bigint): Promise<Note | null>;
    getPDF(id: bigint): Promise<PDF | null>;
    getQuestion(id: bigint): Promise<Question | null>;
    getSyllabus(id: bigint): Promise<Syllabus | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateNote(id: bigint, title: string, description: string, content: string): Promise<Note>;
    updatePDF(id: bigint, subject: string, title: string, description: string): Promise<PDF>;
    updateQuestion(id: bigint, year: bigint, semester: bigint, subject: string, questionContent: string): Promise<Question>;
    updateSyllabus(id: bigint, semester: bigint, subject: string, topics: Array<string>, courseDetails: string): Promise<Syllabus>;
}
