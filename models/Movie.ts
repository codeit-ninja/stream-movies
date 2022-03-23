import { providers } from '../app/app'
import { MovieResponse } from 'moviedb-promise/dist/request-types'

export default class Movie {
    public static async create(id: number) {
        // @ts-ignore 'include_video_language' and 'include_image_language' not implemented but do exist
        return await providers.tmdb.movieInfo({ id: id, language: 'nl', append_to_response: 'videos,images', include_video_language: 'en', include_image_language: 'en' });
    }
}