import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";

module {
  type Note = {
    id : Nat;
    title : Text;
    description : Text;
    content : Text;
    createdAt : Int;
    updatedAt : ?Int;
  };

  type Syllabus = {
    id : Nat;
    semester : Nat;
    subject : Text;
    topics : [Text];
    courseDetails : Text;
  };

  type Question = {
    id : Nat;
    year : Nat;
    semester : Nat;
    subject : Text;
    questionContent : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type PDF = {
    id : Nat;
    subject : Text;
    title : Text;
    description : Text;
    fileData : Blob;
  };

  // Old actor type without PDFs
  type OldActor = {
    notes : Map.Map<Nat, Note>;
    syllabuses : Map.Map<Nat, Syllabus>;
    questions : Map.Map<Nat, Question>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextNoteId : Nat;
    nextSyllabusId : Nat;
    nextQuestionId : Nat;
  };

  // New actor type with PDF support.
  type NewActor = {
    notes : Map.Map<Nat, Note>;
    syllabuses : Map.Map<Nat, Syllabus>;
    questions : Map.Map<Nat, Question>;
    pdfs : Map.Map<Nat, PDF>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextNoteId : Nat;
    nextSyllabusId : Nat;
    nextQuestionId : Nat;
    nextPDFId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      pdfs = Map.empty<Nat, PDF>();
      nextPDFId = 1;
    };
  };
};
