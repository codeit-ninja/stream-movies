import Provider from "./Provider";
import { getTorrentsByImdbId, ImdbEpisodeType, search } from 'eztv-crawler';

export type SearchParamsType = {
    name: string;
    season: number;
    episode: number;
    imdbId: string;
}

export default class EztvProvider extends Provider {
    public async search({ name, imdbId, season, episode }: SearchParamsType) {
        const regex = `([Ss][0]?${season})([Ee][0]?${episode})|([0]?${season}[xX][0]?${episode})`;
        const nameRegex = `^${decodeURI(name)} ${regex}`;
        /*
        | Build a search query which is likely to return results
        |
        | Sometimes (especially older TV shows) dont return results
        | when you search episodes as "S01E01" but searching for "1x01" 
        | instead will return desired resuls
        */
        const buildSearchQuery = (alternative?: boolean) => {
            if ( alternative ) {
                return `${decodeURI(name)} ${season}x${episode < 10 ? '0' + episode : episode}`;
            }

            return `${decodeURI(name)} S${season < 10 ? '0' + season : season}E${episode < 10 ? '0' + episode : episode}`;
        }
        const validateResults = (torrents: Partial<ImdbEpisodeType>[]) => {
            return torrents.filter(torrent =>
                   !!torrent.magnet_url?.match(new RegExp(regex))
                && !!torrent.title?.match(new RegExp(regex))
                && !!torrent.title?.match(new RegExp(nameRegex))
            );
        }
        /*
        | First try based on IMDb ID
        |
        | Note that EZTV api does not always return results
        | even if there are torrents available for the one
        | we are searching for.
        */
        let result = await getTorrentsByImdbId(imdbId, 100);
        let torrents = validateResults(result.torrents);
        /*
        | Try to get based on search query
        |
        | If we dont have results based on IMDb Id
        | lets try to find torrents based on torrent title
        */
        if ( ! torrents || torrents.length < 1 ) {
            /*
            | First we try to find based on S{season}E{episode} eg: S02E04
            */
            let result = await search(buildSearchQuery());
            let torrents = validateResults(this.convert(result));
            /**
            | If no results try to find based on {season}x{episode} eg: 2x04
            |
            | This is how release groups named their torrents prior to 2012+-
            */
            if ( ! torrents || torrents.length < 1 ) {
                result = await search(buildSearchQuery(true));
                torrents = validateResults(this.convert(result));
            }

            return this.transform(torrents as Required<ImdbEpisodeType>[]);
        }

        return this.transform(torrents as Required<ImdbEpisodeType>[]);
    }

    /**
     * Convert to required search return type
     * 
     * @param torrents 
     * @returns 
     */
    protected convert(torrents: Awaited<ReturnType<typeof search>>) {
        return torrents.map(torrent => {
            return {
                size_bytes: torrent.size.toString(),
                title: torrent.title,
                magnet_url: torrent.magnet,
                filename: torrent.title
            }
        })
    }

    /**
     * Transform to required search return type
     * 
     * @param torrent 
     * @returns 
     */
    protected transform(torrents: ImdbEpisodeType[]) {
        return torrents.map(torrent => {
            return {
                magnet: torrent.magnet_url,
                title: torrent.title,
                size: torrent.size_bytes
            }
        })
    }
}