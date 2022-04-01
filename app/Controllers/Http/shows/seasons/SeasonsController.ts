import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { providers } from "App/app";
import Episode from 'Models/Episode';
// import Serie from "../../../models/Serie";
// import { TvResult } from "moviedb-promise/dist/request-types";
// import Rating from "App/Models/Rating";

export default class SeasonsController {
    public async getSeason({ request }: HttpContextContract) {
        const season = await providers.tmdb.seasonInfo({ id: request.param('showId'), season_number: request.param('seasonId') });
        
        if(season.episodes) {
            season.episodes = await Promise.all(season.episodes.map(async episode => await Episode.create(request.param('showId'), request.param('seasonId'), episode.episode_number as number)));
        }

        if ( ! season ) {
            return null;
        }
        
        return season;
    }
}
