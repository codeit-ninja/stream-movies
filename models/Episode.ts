import { providers } from '../app/app'

export default class Episode {
    public static async create(showId: number, seasonNumber: number, episodeNumber: number) {
        // @ts-ignore 'include_video_language' and 'include_image_language' not implemented but do exist
        return await providers.tmdb.episodeInfo({ id: showId, season_number: seasonNumber, episode_number: episodeNumber, language: 'nl', append_to_response: 'external_ids' });
    }
}