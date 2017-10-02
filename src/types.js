/* @flow */
"use strict";

// import { List } from 'immutable'

export type Gender = "Male" | "Female" | "Other";

export type Role = "Teacher" | "Student";

export type CollectionName = "User";

export type User = {
  email: string,
  firstName: string,
  lastName: string,
  registrationDate: string,
  birthday: ?string,
  gender: ?Gender,
  role: Role,
  courses: Array<string>,
  avatarUrl: ?string,
  setPassword: () => void,
  verifyPassword: (password: string) => boolean,
  generateJwt: () => any
};

export type UserWithPassword = User & {
  password: string
};

export type Credentials = {
  email: string,
  hash: string,
  salt: string
};

export type InputCreds = {
  email: string,
  password: string
};

export type UserWithCreds = User & {
  hash: string,
  salt: string
};

export type Exercise = {
  id: string,
  name: string,
  data: string
};

export type Lesson = {
  id: string,
  name: string,
  exercises: Array<Exercise>
};

export type Level = {
  id: string,
  name: string,
  description: string,
  lessons: Array<Lesson>
};

export type Achievement = {
  id: string,
  name: string,
  type: "GENERAL" | "COURSE",
  condition: string
};

export type CourseDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Upper-intermediate"
  | "Advanced"
  | "Proficient";

export type CourseInsertPayload = {
  name: string,
  description: string,
  students?: Array<string>,
  levels: Array<Level>,
  achievements?: Array<Achievement>,
  difficulty: CourseDifficulty
};

export type Course = {
  id: string,
  creatorEmail: string,
  name: string,
  description: string,
  students: Array<string>,
  levels: Array<Level>,
  achievements: Array<Achievement>,
  difficulty: CourseDifficulty
};

export type CourseQueryPayload = {
  id?: string,
  name?: string,
  description?: string,
  creatorEmail?: string,
  difficulty?: string
};

export type Avatar = {
  email: string,
  img: ?Buffer,
  mimetype: ?string
};

export type CollectionDataType = User | Course;

export type CollectionData =
  | { type: "user", payload: UserWithCreds }
  | { type: "course", payload: Course }
  | { type: "avatar", payload: Avatar };
