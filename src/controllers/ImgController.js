/* @flow */
'use strict'

import configureApiController from './ApiController'
import { Image } from '~/models/'

export default function configureUserApiController (router: any) {
  configureApiController(router)

  router.get('/img/:imgId', async ctx => {
    let foundImage = (await Image.findById(ctx.params.imgId))

    if (foundImage) {
      console.log(foundImage)
      ctx.type = foundImage.mimetype
      ctx.body = foundImage.img
    }
    //
    // console.log(foundAvatar)
    // ctx.body = foundAvatar.img
  })
}
