import Redis from '@ioc:Adonis/Addons/Redis'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TorrentFile } from 'webtorrent';
import Torrents from './torrents';
import { createStreamResponse, generateMeta, hasSupportedCodecs } from './helpers';
import { supportedCodecs } from '../config/streaming';
import StreamStartException from 'App/Exceptions/StreamStartException';

export type StreamType = {
    order: number;
    quality: string;
    magnet: string;
    stream: {
        isStreamable: boolean;
        size?: number;
        name?: string;
        url?: string;
    }
}

export type StreamTypeRequired = StreamType & {
    stream: Required<StreamType['stream']>
}

export default class Stream {

    /**
     * Stream constructor
     * 
     * @param imdbId 
     * @param availableStreams 
     */
    protected constructor(
        public readonly imdbId: string,
        public readonly availableStreams: StreamType[],
        public current = availableStreams.find(stream => 
            stream.stream.isStreamable && stream.order === 1
            || stream.stream.isStreamable && stream.order === 2
            || stream.stream.isStreamable && stream.order === 3
        )
    ) {}

    public static async start(imdbId: string, streams: StreamType[] = [], ctx: HttpContextContract) {
        const stream = await Stream.getAvailableStreams(imdbId);
        
        if ( ! stream.current ) {
            throw new StreamStartException(`cannot create stream from ${imdbId}`);
        }
        
        return createStreamResponse(stream.current as StreamTypeRequired, ctx);
    }

    /**
     * Get a list of available streams
     * 
     * @param imdbId 
     * @returns `Stream`
     */
    public static async getAvailableStreams(imdbId: string) {
        if( ! await Redis.exists(imdbId) ) {
            return await Stream.prepare(imdbId);
        }

        return new Stream(imdbId, JSON.parse(await Redis.get(imdbId) as unknown as string) as StreamType[]);
    }

    /**
     * Prepare a new stream
     * 
     * Will try to create a stream from any vaild IMDb ID
     * 
     * @param imdbId    - IMDb ID
     * @returns Stream
     */
    public static async prepare(imdbId: string) {
        if( await Redis.exists(imdbId) ) {
            return new Stream(imdbId, JSON.parse(await Redis.get(imdbId) as string));
        }
        
        const torrents = await Torrents.search(imdbId);
        const streams = await Promise.all(torrents.map(async torrent => await generateMeta(imdbId, torrent)));


        return;
        /** Cache result for future use */
        await Redis.set(imdbId, JSON.stringify(streams));

        return new Stream(imdbId, streams);
    }

    /**
     * Generate metadata from which we can construct a valid stream
     * 
     * Will try to generate necessary metadata to create a `Stream` object from
     * 
     * @param magnetUri     - A torrent magnet URI
     * @returns TorrentFile|null
     */
    public static async getTorrentMeta(magnetUri: string): Promise<TorrentFile|null> {
        return new Promise(async resolve => {
            const torrent = await Torrents.download(magnetUri)
            const videoFile = torrent.files.find(file => supportedCodecs.extionsions.includes(file.name.split('.').pop() as string));
    
            if ( ! videoFile ) {
                return resolve(null)
            }

            /** Prioritize video file over other files */
            videoFile.createReadStream({ start: 0, end: 32428800 });

            /**
             * Resolve after X seconds to prevent user 
             * browser not responding
             */
            setTimeout( () => {
                torrent.destroy();

                clearInterval(validationInterval);
                resolve(null);
            }, 30000)

            const validationInterval = setInterval( async () => {
                console.log('Is downloading', torrent.downloaded);

                /**
                 * Only start validating when we downloaded 30MB
                 * This to make sure the file can be parsed by FFProbe
                 */
                if( torrent.downloaded > 15428800 ) {
                    clearInterval(validationInterval);

                    if( await hasSupportedCodecs( videoFile.path ) ) {
                        /**
                         * Removes torrent and stops the download
                         * 
                         * This is very important, we don't want the server
                         * to bleed memory and bandwith
                         */
                        torrent.destroy();
                        
                        return resolve(videoFile);
                    }

                    /**
                     * Removes torrent and stops the download
                     * 
                     * This is very important, we don't want the server
                     * to bleed memory and bandwith
                     */
                    torrent.destroy();
                    
                    return resolve(null);
                }
            }, 1000)
        })
    }
}