/* @flow */

import { Image } from '~/models/'

export default async (ctx: any, next: Function) => {
  if (ctx.request.is('multipart/form-data')) {
    const operations = JSON.parse(ctx.req.body.operations)
    const { imageId } = operations.variables

    const imageMutation = {
      imageId,
      img: ctx.req.file.buffer,
      mimetype: ctx.req.file.mimetype
    }

    console.log(imageMutation)

    const foundImage = await Image.findById(imageId)

    if (foundImage) {
      await Image.findByIdAndUpdate(imageId, imageMutation)
    } else {
      await Image.create(imageMutation)
    }

    operations.variables.imageUrl = 'img/' + imageId

    ctx.request.body = operations
  }

  await next()
}
