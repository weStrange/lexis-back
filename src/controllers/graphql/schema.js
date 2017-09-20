/* @flow */
'use strict'

import * as Graphql from 'graphql'

import UserModel from '../../models/User'
import CourseModel from '../../models/Course'

import Utils from '../../utils'

import { getHashAndSalt } from '../../auth/oauth'

const Gender = new Graphql.GraphQLEnumType({
  name: 'Gender',
  values: {
    MALE: { value: 'Male' },
    FEMALE: { value: 'Female' },
    OTHER: { value: 'Other' }
  }
})

const Role = new Graphql.GraphQLEnumType({
  name: 'Role',
  values: {
    STUDENT: { value: 'Student' },
    TEACHER: { value: 'Teacher' }
  }
})

const userType = new Graphql.GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.email
    },
    firstName: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.firstName
    },
    lastName: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (user) => user.lastName
    },
    registrationDate: {
      type: Graphql.GraphQLString,
      resolve: (user) => user.registrationDate
    },
    birthday: {
      type: Graphql.GraphQLString,
      resolve: (user) => user.birthday
    },
    gender: {
      type: Gender,
      resolve: (user) => user.gender
    },
    achievements: {
      type: AchievementTypeEnum,
      resolve: (user) => user.achievements
    },
    role: {
      type: Role,
      resolve: (user) => user.role
    },
    courses: {
      type: new Graphql.GraphQLList(Graphql.GraphQLString),
      resolve: (user) => user.courses
    }
  })
})

const exerciseType = new Graphql.GraphQLObjectType({
  name: 'Exercise',
  fields: {
    id: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (exercise) => exercise.id
    },
    name: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (exercise) => exercise.name
    },
    data: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (exercise) => exercise.data
    }
  }
})

const lessonType = new Graphql.GraphQLObjectType({
  name: 'Lesson',
  fields: {
    id: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (lesson) => lesson.id
    },
    name: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (lesson) => lesson.name
    },
    exercises: {
      type: new Graphql.GraphQLList(exerciseType),
      resolve: (lesson) => lesson.exercises
    }
  }
})

const levelType = new Graphql.GraphQLObjectType({
  name: 'Level',
  fields: {
    id: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (level) => level.id
    },
    name: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (level) => level.name
    },
    lessons: {
      type: new Graphql.GraphQLList(lessonType),
      resolve: (level) => level.lessons
    }
  }
})

const AchievementTypeEnum = new Graphql.GraphQLEnumType({
  name: 'AchievementType',
  values: {
    GENERAL: { value: 'General' },
    COURSE: { value: 'Course' }
  }
})

const achievementType = new Graphql.GraphQLObjectType({
  name: 'Achievement',
  fields: {
    id: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (achievement) => achievement.id
    },
    name: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (achievement) => achievement.name
    },
    type: {
      type: AchievementTypeEnum,
      resolve: (achievement) => achievement.type
    },
    condition: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (achievement) => achievement.condition
    }
  }
})

const courseType = new Graphql.GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (course) => course.id
    },
    creatorEmail: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (course) => course.creatorEmail
    },
    name: {
      type: new Graphql.GraphQLNonNull(Graphql.GraphQLString),
      resolve: (course) => course.name
    },
    students: {
      type: new Graphql.GraphQLList(Graphql.GraphQLString),
      resolve: (course) => course.students
    },
    levels: {
      type: new Graphql.GraphQLList(levelType),
      resolve: (course) => course.levels
    },
    achievements: {
      type: new Graphql.GraphQLList(achievementType),
      resolve: (course) => course.achievements
    }
  })
})

const queryType = new Graphql.GraphQLObjectType({
  name: 'Query',
  description: 'All queries',
  fields: {
    user: {
      type: userType,
      args: {
        email: {type: Graphql.GraphQLString}
      },
      resolve: async (source, args) => {
        let foundUser = (await UserModel.findOne({ email: args.email }))

        return foundUser
      }
    },
    course: {
      type: courseType,
      args: {
        name: {type: Graphql.GraphQLString}
      },
      resolve: async (source, args) => {
        let foundCourse = (await CourseModel.findOne({ name: args.name }))

        if (foundCourse) {
          return (await foundCourse).serialize()
        }

        return null
      }
    }
  }
})

const mutationType = new Graphql.GraphQLObjectType({
  name: 'Mutation',
  description: 'All mutations',
  fields: {
    addUser: {
      type: userType,
      args: {
        email: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        firstName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        lastName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        birthday: {type: Graphql.GraphQLString},
        password: {type: Graphql.GraphQLString},
        gender: {type: Gender},
        role: {type: Role}
      },
      resolve: async (source, args) => {
        let newUser = {
          ...Utils.stripCreds(args),
          registrationDate: (new Date()).toISOString()
        }
        let creds = {
          email: args.email,
          ...getHashAndSalt(args.password)
        }

        return UserModel.insert(newUser, creds)
      }
    },
    deleteUser: {
      type: userType,
      args: {
        email: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)}
      },
      resolve: async (source, args) => {
        let theUser = await UserModel.findOne(args)

        UserModel.delete(args)

        return theUser
      }
    },
    addCourse: {
      type: courseType,
      args: {
        name: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)}
      },
      resolve: async (source, args) => {
        return (await CourseModel.insert(args)).serialize()
      }
    },
    addStudentToCourse: {
      type: Graphql.GraphQLBoolean,
      args: {
        courseName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        studentEmail: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)}
      },
      resolve: async (source, args) => {
        return (await CourseModel.addStudent(args.courseName, args.studentEmail))
      }
    },
    removeStudentFromCourse: {
      type: Graphql.GraphQLBoolean,
      args: {
        courseName: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)},
        studentEmail: {type: new Graphql.GraphQLNonNull(Graphql.GraphQLString)}
      },
      resolve: async (source, args) => {
        return (await CourseModel.removeStudent(args.courseName, args.studentEmail))
      }
    }
  }
})

export default new Graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
})
