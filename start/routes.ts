/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/users/:id', 'UsersController.show');
Route.group(() => {
    Route.get(':imdbId', 'StreamController.init');
    Route.get('/watch/:imdbId', 'StreamController.stream');
}).prefix('stream')
Route.group(() => {
    Route.get('/latest', 'MoviesController.latest');
    Route.get('/popular', 'MoviesController.popular');
    Route.get('/now-playing', 'MoviesController.nowPlaying');
    Route.get('/top-rated', 'MoviesController.topRated');
    Route.get('/watch/:imdbId', 'StreamController.stream');
    Route.get('/test', 'MoviesController.test');
}).prefix('movies')
Route.group(() => {
    Route.get('/latest', 'SeriesController.latest');
    Route.get('/popular', 'SeriesController.popular');
    Route.get('/now-playing', 'SeriesController.nowPlaying');
    Route.get('/top-rated', 'SeriesController.topRated');
    Route.get('/hype/', 'SeriesController.hype');
    Route.get('/watch/:imdbId', 'SeriesController.stream');
}).prefix('series')
Route.get('import', 'ImportersController.start')
Route.get('import/ratings', 'ImportersController.ratings')
