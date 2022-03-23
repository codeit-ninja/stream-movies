import Env from '@ioc:Adonis/Core/Env'
import { MovieDb } from "moviedb-promise"
import { Client } from "imdb-api"
import RARBG from 'rarbg'
import WebTorrent from 'webtorrent'

export const providers = {
    get tmdb() { return new MovieDb(Env.get('TMDB_API_KEY')) },
    get omdb() { return new Client({ apiKey: Env.get('OMDB_API_KEY') }) },
    get rarbg() { return new RARBG({
        app_id: 'flick-v1',
        host: 'torrentapi.org',
        path: '/pubapi_v2.php?',
        user_agent: 'Flick 1.0.0'
    }) },
    get webtorrent() { return new WebTorrent() }
}