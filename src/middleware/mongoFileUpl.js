// @flow

import Avatar from '../models/Avatar'

export default async (ctx: any, next: Function) => {
  if (ctx.request.is('multipart/form-data')) {
    const operations = JSON.parse(ctx.req.body.operations)
    const { email } = operations.variables

    const avatarMutation = {
      email,
      img: ctx.req.file.buffer,
      type: ctx.req.file.mimetype
    }

    const foundAvatar = await Avatar.findOne({ email })

    if (foundAvatar) {
      await Avatar.update({ email }, avatarMutation)
    } else {
      await Avatar.insert(avatarMutation)
    }

    operations.variables.avatarUrl = 'img/' + email

    ctx.request.body = operations
  }

  await next()
}
