/* @flow */
'use strict'

import configureApiController from './ApiController'
import Avatar from '../models/Avatar'

export default function configureUserApiController (router: any) {
  configureApiController(router)

  router.get('/img/:email', async ctx => {
    let foundAvatar = (await Avatar.findOne({ email: ctx.params.email }))

    if (foundAvatar) {
      console.log(foundAvatar)
      ctx.type = foundAvatar.type
      ctx.body = foundAvatar.img
    }
    //
    // console.log(foundAvatar)
    // ctx.body = foundAvatar.img
  })
}
