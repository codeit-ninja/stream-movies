// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Movie from '../../../models/Movie';
import { providers } from '../../../app/app';
import { MovieResult } from 'moviedb-promise/dist/request-types';

export default class MoviesController {
    /**
     * Returns latest added movie
     * 
     * Returns only one result
     * 
     * @returns MovieResponse
     */
    public async latest() {
        const movie = await providers.tmdb.movieLatest();
        
        if ( ! movie ) {
            return null;
        }
        
        return await Movie.create(movie.id as number);
    }

    /**
     * Returns a list of popular movies
     * 
     * Result is limited to 20
     * 
     * @returns MoviesResponse
     */
     public async popular() {
        const movies = await providers.tmdb.moviePopular();

        if ( ! movies.results ) {
            return [];
        }
        
        return await Promise.all(movies.results.map( async (movie: Required<MovieResult>) => await Movie.create(movie.id)));
    }

    /**
     * Returns a list of movies currently playing in theaters
     * 
     * Result is limited to 20
     * 
     * @returns MoviesResponse
     */
     public async nowPlaying() {
        const movies = await providers.tmdb.movieNowPlaying();

        if ( ! movies.results ) {
            return [];
        }
        
        return Promise.all(movies.results.map( async (movie: Required<MovieResult>) => await Movie.create(movie.id)));
    }

    /**
     * Returns a list of top rated movies
     * 
     * Result is limited to 20
     * 
     * @returns MoviesResponse
     */
     public async topRated() {
        const movies = await providers.tmdb.movieTopRated( { region: 'nl', language: 'nl-NL' } );

        if ( ! movies.results ) {
            return [];
        }
        
        return Promise.all(movies.results.map( async (movie: Required<MovieResult>) => await Movie.create(movie.id)));
    }
}
