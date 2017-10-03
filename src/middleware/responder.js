/* @flow */
'use strict'

import logger from 'winston'

const RESPONSE_DEFAULT_TYPE = 'RT_DEFAULT'
const RESPONSE_TYPE_HTML = 'RT_HTML'
const RESPONSE_TYPE_JSON = 'RT_JSON'
const RESPONSE_TYPE_ERROR = 'RT_ERROR'
const RESPONSE_TYPE_GRAPHQL = 'RT_GRAPHQL'

// irrelevant right now
// const RESPONSE_TYPE_WS =     'RT_WEBSOCKET';
// const RESPONSE_TYPE_BINARY = 'RT_BINARY';

// Renders responses using settings provided
class Renderer {
  data: any
  type: string
  view: any

  static APP_ROOT: string

  constructor (
    data: any = {},
    type: string = RESPONSE_DEFAULT_TYPE,
    view: any = null
  ) {
    this.data = data
    this.type = type
    // this.view = view || 'views/notfound.pug';
    if (!Renderer.APP_ROOT) {
      Renderer.APP_ROOT = '../'
    }
    /*
    if(!Renderer.PUG_CONFIG){
      Renderer.PUG_CONFIG = {
        basedir: path.join(Renderer.APP_ROOT, 'views'),
        //cache: true //you want to turn this on for production
      }
    }
*/
  }

  render (ctx: any) {
    if (ctx.renderd === true) {
      logger.warn(`ctx.rendered flag is set to true, renderer will skip`)
      return ctx
    }

    switch (this.type) {
      case RESPONSE_DEFAULT_TYPE:
        try {
          this.data = JSON.stringify(ctx.body)
          this.type = RESPONSE_TYPE_JSON
        } catch (error) {
          logger.error(error)
        }
      // falls through
      case RESPONSE_TYPE_HTML:
      // TODO: handle HTML responses here
      // falls through
      case RESPONSE_TYPE_GRAPHQL:
        break
      case RESPONSE_TYPE_JSON:
        ctx.body = JSON.stringify(this.data)
        break
      case RESPONSE_TYPE_ERROR:
      default:
        ctx.status = ctx.status > 400 ? ctx.status : 500
        if (!this.data) {
          this.data = {
            message: `Response type invalid or not supported: ${this
              .type}. This could mean that an unexpected error has occurred`
          }
        }
        if (ctx.wantsJSON) {
          // if any of the previous middleware set this flag, use it
          ctx.body = JSON.stringify(this.data, null, 2)
        } else {
          // TODO: handle html requests here
          // const locals = Renderer.merge(Renderer.PUG_CONFIG, this.data);
          // ctx.body = pug.renderFile(path.join(Renderer.APP_ROOT, 'views', 'error.pug'), locals);
        }
        break
    }
    ctx.rendered = true
    return ctx
  }

  static setAppRoot (appRoot: string) {
    Renderer.APP_ROOT = appRoot
  }

  static merge (object, other) {
    const keys = Object.keys(object)
    const otherKeys = Object.keys(other)
    let collision = keys.find(k => otherKeys.includes(k))
    if (collision) {
      throw new Error(
        `Collision detected in locals object at key ${collision}. Please check your locals objects`
      )
    }
    return Object.assign({}, other, object)
  }
}

type ResponderOptions = {
  appRoot: string,
  app: any
}

export default function responder (options: ResponderOptions) {
  const appRoot = options.appRoot
  if (!appRoot) throw new Error(`Please provide appRoot to the responder!`)
  const app = options.app
  if (!app) {
    throw new Error(
      `Please give the app reference so we can bootstrap helper methods!`
    )
  }
  Renderer.setAppRoot(appRoot)

  app.context.view = function ctxView (view, locals) {
    console.log('HTML is set')
    this.renderer = new Renderer(locals, RESPONSE_TYPE_HTML, view)
  }

  app.context.json = function ctxJson (data) {
    JSON.stringify(data) // test that this is valid JSON - will throw otherwise
    console.log('JSON is set')
    this.renderer = new Renderer(data, RESPONSE_TYPE_JSON)
  }

  app.context.graphql = function ctxGraphql () {
    console.log('Graphql is set')
    this.renderer = new Renderer({}, RESPONSE_TYPE_GRAPHQL)
  }

  app.context.error = function ctxError (data) {
    // only set the error if it wasn't set previously by something else
    if (!this.renderer || this.renderer.type !== RESPONSE_TYPE_ERROR) {
      if (!data.message && !(data instanceof Error)) {
        data.message = 'Unspecified error has occurred'
        logger.warn(
          `Error locals do not include any message and is not an instance of Error object. Please try to be specific with the error messages!`
        )
      }
      this.renderer = new Renderer(data, RESPONSE_TYPE_ERROR)
    }
  }

  app.context.log = logger

  return async function responder (ctx: any, next: () => void) {
    try {
      ctx.renderer = new Renderer()
      // aaaand we are off
      await next()
      ctx.renderer.render(ctx)
    } catch (error) {
      logger.error(error)
      ctx.error({
        message: `An error has occurred during processing of your request: \n ${error.message}`
      })
    } finally {
      // produce output for user no matter what
      ctx.renderer.render(ctx)
    }
  }
}
