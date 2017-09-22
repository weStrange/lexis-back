/* @flow */
'use strict'

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType
} from 'graphql'

const exerciseType = new GraphQLObjectType({
  name: 'Exercise',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.id
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.name
    },
    data: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (exercise) => exercise.data
    }
  }
})

const lessonType = new GraphQLObjectType({
  name: 'Lesson',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (lesson) => lesson.id
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (lesson) => lesson.name
    },
    exercises: {
      type: new GraphQLList(exerciseType),
      resolve: (lesson) => lesson.exercises
    }
  }
})

const levelType = new GraphQLObjectType({
  name: 'Level',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (level) => level.id
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (level) => level.name
    },
    lessons: {
      type: new GraphQLList(lessonType),
      resolve: (level) => level.lessons
    }
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
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (achievement) => achievement.id
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (achievement) => achievement.name
    },
    type: {
      type: AchievementTypeEnum,
      resolve: (achievement) => achievement.type
    },
    condition: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (achievement) => achievement.condition
    }
  }
})

export const courseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (course) => course.id
    },
    creatorEmail: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (course) => course.creatorEmail
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (course) => course.name
    },
    students: {
      type: new GraphQLList(GraphQLString),
      resolve: (course) => course.students
    },
    levels: {
      type: new GraphQLList(levelType),
      resolve: (course) => course.levels
    },
    achievements: {
      type: new GraphQLList(achievementType),
      resolve: (course) => course.achievements
    }
  })
})
