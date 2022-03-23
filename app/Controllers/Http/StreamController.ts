import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Stream from '../../../lib/stream'

export default class StreamsController {
    public async stream( ctx: HttpContextContract) {
        return await Stream.start(ctx.request.param('imdbId'), [], ctx);
    }

    public async init( { request }: HttpContextContract) {
        return await Stream.prepare(request.param('imdbId'));
    }
}
