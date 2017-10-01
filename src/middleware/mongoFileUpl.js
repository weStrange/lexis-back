/* @flow */

import { Image } from '~/models/'

export default async (ctx: any, next: Function) => {
  if (ctx.request.is('multipart/form-data')) {
    const operations = JSON.parse(ctx.req.body.operations)
    const { imageId } = operations.variables

    const imageMutation = {
      img: ctx.req.file.buffer,
      mimetype: ctx.req.file.mimetype
    }

    console.log(imageMutation)

    const foundImage = await Image.findById(imageId)

    if (foundImage) {
      await Image.findByIdAndUpdate(imageId, imageMutation)
      operations.variables.imageUrl = 'img/' + imageId
    } else {
      let newImage = await Image.create(imageMutation)
      operations.variables.imageUrl = 'img/' + newImage._id
    }

    ctx.request.body = operations
  }

  await next()
}
