import { providers } from '../app/app'

export default class Serie {
    public static async create(id: number) {
        // @ts-ignore 'include_video_language' and 'include_image_language' not implemented but do exist
        return await providers.tmdb.tvInfo({ id: id, language: 'nl', append_to_response: 'videos,images,external_ids,season', include_video_language: 'en', include_image_language: 'en' });
    }
}