// @flow

import { Avatar } from '~/models/'

export default async (ctx: any, next: Function) => {
  if (ctx.request.is('multipart/form-data')) {
    const operations = JSON.parse(ctx.req.body.operations)
    const { email } = operations.variables

    const avatarMutation = {
      email,
      img: ctx.req.file.buffer,
      mimetype: ctx.req.file.mimetype
    }

    console.log(avatarMutation)

    const foundAvatar = await Avatar.findOne({ email })

    if (foundAvatar) {
      await Avatar.update({ email }, avatarMutation)
    } else {
      await Avatar.create(avatarMutation)
    }

    operations.variables.avatarUrl = 'img/' + email

    ctx.request.body = operations
  }

  await next()
}
