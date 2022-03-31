// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { providers } from "App/app";
import Serie from "../../../models/Serie";
import { TvResult } from "moviedb-promise/dist/request-types";
import Rating from "App/Models/Rating";

export default class SeriesController {
    /**
     * Returns latest added TV show
     * 
     * Returns only one result
     * 
     * @returns ShowResponse
     */
    public async latest() {
        const serie = await providers.tmdb.tvLatest();
        
        if ( ! serie ) {
            return null;
        }
        
        return await Serie.create(serie.id as number);
    }

    /**
     * Returns a list of popular TV shows
     * 
     * Result is limited to 20
     * 
     * @returns ShowResponse
     */
     public async popular() {
        const series = await providers.tmdb.tvPopular();

        if ( ! series.results ) {
            return [];
        }
        
        return await Promise.all(series.results.map( async (serie: Required<TvResult>) => await Serie.create(serie.id)));
    }

    /**
     * Returns a list of TV shows currently on air
     * 
     * Result is limited to 20
     * 
     * @returns ShowResponse
     */
     public async nowPlaying() {
        const series = await providers.tmdb.tvOnTheAir();

        if ( ! series.results ) {
            return [];
        }
        
        return Promise.all(series.results.map( async (serie: Required<TvResult>) => await Serie.create(serie.id)));
    }

    /**
     * Returns a list of top rated TV shows
     * 
     * Result is limited to 20
     * 
     * @returns ShowResponse
     */
     public async topRated() {
        let ratings = await Rating.query().orderBy('votes', 'desc').preload('details').limit(400);
        ratings = ratings.filter(rating => rating.details.type === 'tvSeries');

        /** sort by rating and returns first 20 results */
        return ratings.sort((a, b) => b.rating - a.rating).slice(0, 20)
    }

    /**
     * Get currently most hyped TV show
     * 
     * @returns ShowResponse
     */
    public async hype() {
        const popular = await this.popular()
        // @ts-ignore its never undefined but returns 0 instead which is valid
        return popular.sort((a, b) => b.vote_count - a.vote_count).slice(6, 7)[0];
    }
}
