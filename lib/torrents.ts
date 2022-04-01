import { search } from 'yify-promise'
import NoTorrentsFoundException from 'App/Exceptions/NoTorrentsFoundException'
import WebTorrent from 'webtorrent'

export type TorrentProviders = 'rarbg'|'yify'
export type TorrentQualityTypes = {
    hd?: string;
    fullhd?: string;
    uhd?: string;
}
export type TorrentType = {
    quality: 'Full HD'|'HD'|'4k'|string;
    magnet: string;
}

export default class Torrents {
    
    /**
     * Torrents constructor
     * 
     * @param imdb  - IMDb ID
     */
    constructor(public imdb: string) {}

    /**
     * Search for available torrents
     * 
     * Returns a list of torrents
     * 
     * @param imdbId 
     * @returns object
     * 
     * TODO: Implement https://apibay.org and maybe other providers. YTS has limited or no results in some cases
     */
    public static async search( imdbId: string ) {
        const result = await search({ query_term: imdbId }, { createMagnets: true });
        
        if( ! result.movies || result.movies.length === 0) {
            throw new NoTorrentsFoundException();
        }

        const torrents = result.movies.flatMap(movie => movie.torrents.map(torrent => {
            return {
                quality: torrent.quality === '720p' ? 'HD' : torrent.quality === '1080p' ? 'Full HD' : torrent.quality === '2160p' ? '4K' : '',
                magnet: torrent.magnet as string,
            }
        }))

        return torrents;
    }

    /**
     * Start a download
     * 
     * Starts downloading torrent contents
     * 
     * @param magnetUri     - string
     * @param opts          - { destroyStoreOnDestroy: boolean; }
     * @returns `WebTorrent.Torrent`
     */
    public static async download(magnetUri: string, opts?: { destroyStoreOnDestroy: true }): Promise<WebTorrent.Torrent> {
        return new Promise((resolve, reject) => {
            const webtorrent = new WebTorrent({
                maxConns: 10
            });
            webtorrent.add(magnetUri, opts, torrent => {
                torrent.on('error', (err) => {
                    reject(err)
                    webtorrent.destroy();
                });
                torrent.once('download', () => resolve(torrent));
            })
        })
    }
}