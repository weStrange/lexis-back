/* @flow */
'use strict'

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInputObjectType
} from 'graphql'

const exerciseInputType = new GraphQLInputObjectType({
  name: 'ExerciseInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(GraphQLString) }
  }
})

const exerciseType = new GraphQLObjectType({
  name: 'Exercise',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    data: { type: new GraphQLNonNull(GraphQLString) }
  }
})

const lessonInputType = new GraphQLInputObjectType({
  name: 'LessonInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    exercises: { type: new GraphQLList(exerciseInputType) }
  }
})

const lessonType = new GraphQLObjectType({
  name: 'Lesson',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    exercises: { type: new GraphQLList(exerciseType) }
  }
})

export const levelInputType = new GraphQLInputObjectType({
  name: 'LevelInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    lessons: { type: new GraphQLList(lessonInputType) }
  }
})

export const levelType = new GraphQLObjectType({
  name: 'Level',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    lessons: { type: new GraphQLList(lessonType) }
  }
})

export const AchievementTypeEnum = new GraphQLEnumType({
  name: 'AchievementType',
  values: {
    GENERAL: { value: 'General' },
    COURSE: { value: 'Course' }
  }
})

const achievementType = new GraphQLObjectType({
  name: 'Achievement',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: AchievementTypeEnum },
    condition: { type: new GraphQLNonNull(GraphQLString) }
  }
})

export const Difficulty = new GraphQLEnumType({
  name: 'Difficulty',
  values: {
    BEGINNER: { value: 'Beginner' },
    INTERMEDIATE: { value: 'Intermediate' },
    UPPERINTERMEDIATE: { value: 'Upper-intermediate' },
    ADVANCED: { value: 'Advanced' },
    PROFICIENT: { value: 'PROFICIENT' }
  }
})

export const courseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    creatorEmail: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    students: { type: new GraphQLList(GraphQLString) },
    levels: { type: new GraphQLList(levelType) },
    achievements: { type: new GraphQLList(achievementType) },
    difficulty: { type: new GraphQLNonNull(Difficulty) }
  })
})
