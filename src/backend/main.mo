import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

import Migration "migration";
(with migration = Migration.run)
actor {
  // Initialize the user system state (from authorization component)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Include the blob storage mixin
  include MixinStorage();

  // User Profile type and storage
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Note = {
    id : Nat;
    title : Text;
    description : Text;
    content : Text;
    createdAt : Int;
    updatedAt : ?Int;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.id, note2.id);
    };
  };

  public type Syllabus = {
    id : Nat;
    semester : Nat;
    subject : Text;
    topics : [Text];
    courseDetails : Text;
  };

  module Syllabus {
    public func compare(syllabus1 : Syllabus, syllabus2 : Syllabus) : Order.Order {
      Nat.compare(syllabus1.id, syllabus2.id);
    };
  };

  public type Question = {
    id : Nat;
    year : Nat;
    semester : Nat;
    subject : Text;
    questionContent : Text;
  };

  module Question {
    public func compare(question1 : Question, question2 : Question) : Order.Order {
      Nat.compare(question1.id, question2.id);
    };
  };

  public type PDF = {
    id : Nat;
    subject : Text;
    title : Text;
    description : Text;
    fileData : Blob;
  };

  module PDF {
    public func compare(pdf1 : PDF, pdf2 : PDF) : Order.Order {
      Nat.compare(pdf1.id, pdf2.id);
    };
  };

  let notes = Map.empty<Nat, Note>();
  let syllabuses = Map.empty<Nat, Syllabus>();
  let questions = Map.empty<Nat, Question>();
  let pdfs = Map.empty<Nat, PDF>();

  var nextNoteId = 1;
  var nextSyllabusId = 1;
  var nextQuestionId = 1;
  var nextPDFId = 1;

  // Notes CRUD operations
  public shared ({ caller }) func createNote(title : Text, description : Text, content : Text) : async Note {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create notes");
    };

    let note : Note = {
      id = nextNoteId;
      title;
      description;
      content;
      createdAt = Time.now();
      updatedAt = null;
    };
    notes.add(nextNoteId, note);
    nextNoteId += 1;
    note;
  };

  public shared ({ caller }) func updateNote(id : Nat, title : Text, description : Text, content : Text) : async Note {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update notes");
    };

    switch (notes.get(id)) {
      case (null) { Runtime.trap("Note not found") };
      case (?existingNote) {
        let updatedNote : Note = {
          id;
          title;
          description;
          content;
          createdAt = existingNote.createdAt;
          updatedAt = ?Time.now();
        };
        notes.add(id, updatedNote);
        updatedNote;
      };
    };
  };

  public shared ({ caller }) func deleteNote(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete notes");
    };

    if (not notes.containsKey(id)) {
      Runtime.trap("Note not found");
    };
    notes.remove(id);
  };

  public query ({ caller }) func getNote(id : Nat) : async ?Note {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view notes");
    };
    notes.get(id);
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view notes");
    };
    notes.values().toArray().sort();
  };

  // Syllabus CRUD operations
  public shared ({ caller }) func createSyllabus(semester : Nat, subject : Text, topics : [Text], courseDetails : Text) : async Syllabus {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create syllabus");
    };

    let syllabus : Syllabus = {
      id = nextSyllabusId;
      semester;
      subject;
      topics;
      courseDetails;
    };
    syllabuses.add(nextSyllabusId, syllabus);
    nextSyllabusId += 1;
    syllabus;
  };

  public shared ({ caller }) func updateSyllabus(id : Nat, semester : Nat, subject : Text, topics : [Text], courseDetails : Text) : async Syllabus {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update syllabus");
    };

    switch (syllabuses.get(id)) {
      case (null) { Runtime.trap("Syllabus not found") };
      case (_) {
        let updatedSyllabus : Syllabus = {
          id;
          semester;
          subject;
          topics;
          courseDetails;
        };
        syllabuses.add(id, updatedSyllabus);
        updatedSyllabus;
      };
    };
  };

  public shared ({ caller }) func deleteSyllabus(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete syllabus");
    };

    if (not syllabuses.containsKey(id)) {
      Runtime.trap("Syllabus not found");
    };
    syllabuses.remove(id);
  };

  public query ({ caller }) func getSyllabus(id : Nat) : async ?Syllabus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view syllabus");
    };
    syllabuses.get(id);
  };

  public query ({ caller }) func getAllSyllabuses() : async [Syllabus] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view syllabus");
    };
    syllabuses.values().toArray().sort();
  };

  // Question CRUD operations
  public shared ({ caller }) func createQuestion(year : Nat, semester : Nat, subject : Text, questionContent : Text) : async Question {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create questions");
    };

    let question : Question = {
      id = nextQuestionId;
      year;
      semester;
      subject;
      questionContent;
    };
    questions.add(nextQuestionId, question);
    nextQuestionId += 1;
    question;
  };

  public shared ({ caller }) func updateQuestion(id : Nat, year : Nat, semester : Nat, subject : Text, questionContent : Text) : async Question {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update questions");
    };

    switch (questions.get(id)) {
      case (null) { Runtime.trap("Question not found") };
      case (_) {
        let updatedQuestion : Question = {
          id;
          year;
          semester;
          subject;
          questionContent;
        };
        questions.add(id, updatedQuestion);
        updatedQuestion;
      };
    };
  };

  public shared ({ caller }) func deleteQuestion(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete questions");
    };

    if (not questions.containsKey(id)) {
      Runtime.trap("Question not found");
    };
    questions.remove(id);
  };

  public query ({ caller }) func getQuestion(id : Nat) : async ?Question {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view questions");
    };
    questions.get(id);
  };

  public query ({ caller }) func getAllQuestions() : async [Question] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view questions");
    };
    questions.values().toArray().sort();
  };

  // PDF CRUD operations
  public shared ({ caller }) func createPDF(subject : Text, title : Text, description : Text, fileData : Blob) : async PDF {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can create PDFs");
    };

    let pdf : PDF = {
      id = nextPDFId;
      subject;
      title;
      description;
      fileData;
    };
    pdfs.add(nextPDFId, pdf);
    nextPDFId += 1;
    pdf;
  };

  public shared ({ caller }) func updatePDF(id : Nat, subject : Text, title : Text, description : Text) : async PDF {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update PDFs");
    };

    switch (pdfs.get(id)) {
      case (null) { Runtime.trap("PDF not found") };
      case (?existingPDF) {
        let updatedPDF : PDF = {
          id;
          subject;
          title;
          description;
          fileData = existingPDF.fileData;
        };
        pdfs.add(id, updatedPDF);
        updatedPDF;
      };
    };
  };

  public shared ({ caller }) func deletePDF(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete PDFs");
    };

    if (not pdfs.containsKey(id)) {
      Runtime.trap("PDF not found");
    };
    pdfs.remove(id);
  };

  public query ({ caller }) func getPDF(id : Nat) : async ?PDF {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view PDFs");
    };
    pdfs.get(id);
  };

  public query ({ caller }) func getAllPDFs() : async [PDF] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view PDFs");
    };
    pdfs.values().toArray().sort();
  };
};
