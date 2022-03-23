import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { supportedCodecs } from '../config/streaming';
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'
import Torrents, { TorrentType } from './torrents';
import Stream, { StreamTypeRequired } from './stream';
import { TorrentFile } from 'webtorrent'

export async function hasSupportedCodecs(file: string): Promise<boolean> {
    return new Promise(resolve => {
        ffprobe(file, { path: ffprobeStatic.path }, (err, info) => {

            if(err) {
                return resolve(false);
            }

            const videoStream = info.streams.find(stream => stream.codec_type === 'video');
            const audioStream = info.streams.find(stream => stream.codec_type === 'audio');

            if( ! videoStream || ! audioStream || ! videoStream.codec_name || ! audioStream.codec_name ) {
                return resolve(false)
            }

            if(supportedCodecs.video.includes(videoStream.codec_name) && supportedCodecs.audio.includes(audioStream.codec_name) ) {                            
                return resolve(true)
            }

            return resolve(false); 
        })
    })
}

export async function generateMeta(imdbId: string, torrent: TorrentType) {
    const torrentMeta = await Stream.getTorrentMeta(torrent.magnet);

    return {
        order: torrent.quality === 'Full HD' ? 1 : torrent.quality === 'HD' ? 2 : 3,
        quality: torrent.quality,
        magnet: torrent.magnet,
        stream: {
            isStreamable: !!torrentMeta,    // When no torrent meta it can't be streamed
            size: torrentMeta?.length,
            name: torrentMeta?.name,
            url: ! torrentMeta ? undefined : Env.get('HOSTNAME') + Route.makeUrl('/stream/watch/:imdbId', { imdbId: imdbId })
        }
    }
}

export async function createStreamResponse(stream: StreamTypeRequired, { response, request }: HttpContextContract) {
    response.status(206);

    const torrent = await Torrents.download(stream.magnet);
    const video = torrent.files.find(file => supportedCodecs.extionsions.includes(file.name.split('.').pop() as string)) as TorrentFile;

    return new Promise(resolve => {
        let range = request.header('range') || 'bytes=0-';

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ? parseInt(parts[1], 10) : stream.stream.size-1
            const chunksize = (end-start)+1
            const file = video.createReadStream({start, end})
            
            response.header('Content-Range', `bytes ${start}-${end}/${video.length}`)
            response.header('Accept-Ranges', 'bytes')
            response.header('Content-Length', chunksize)
            response.header('Content-Type', 'video/mp4; charset=UTF-8')

            response.stream(file);

            resolve(true);
        }
    })
}