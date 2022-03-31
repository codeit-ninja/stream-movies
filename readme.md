# 🍭 Stream movies (v2 development) 

This is the development branch of version 2. Alot of things will change.

**Some of the key features which will be implemented in v2**

&nbsp;&nbsp;&nbsp;&nbsp;👉 &nbsp;Support for TV shows    
&nbsp;&nbsp;&nbsp;&nbsp;👉 &nbsp;MySQL database with IMDb data (so we dont have to rely on 3rd party API's)    
&nbsp;&nbsp;&nbsp;&nbsp;👉 &nbsp;Redis caching layer    
&nbsp;&nbsp;&nbsp;&nbsp;👉 &nbsp;Thepiratebay integration    
&nbsp;&nbsp;&nbsp;&nbsp;👉 &nbsp;Subtitles integration (opensubtitles.org)    

## ⚡How does it work?

It works by searching for torrents via the https://yts.mx API based on a IMDb ID.

It will search for available torrents, parse the torrents and search for playable media, eg: .mp4 or .mkv files.

If it successfully fetched torrents, it will parse all the playable media files to find out if it can be played in the browser. If so, a flag on each `StreamObject` will be set.

All methods to do so are exposed via the API.

## ⚡ Development

*This project was created in a WSL 2 Linux envoirment, you might run into problems when running it on windows. The problem might come from the `FFprobe` binaries.

###### Status development
&nbsp;&nbsp;&nbsp;&nbsp;✅ TV show endpoints implemented    
&nbsp;&nbsp;&nbsp;&nbsp;✅ IMDb data implemented

## ⚡Api endpoints

| Route                     | Description                                                                                    | Note                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `/stream/{imdb_id}`       | Prepares the given IMDB ID to make it streamable.                                              | Best to run this first before you run `/stream/watch/{imdb_id}`                                  |
| `/stream/watch/{imdb_id}` | Creates a stream response.                                                                     |
| `/movies/popular`         | Returns a list of popular movies                                                               |                                                                                                  |
| `/movies/top-rated`       | Returns a list of top rated movies                                                             |                                                                                                  |
| `/movies/now-playing`     | Returns a list of movies currently playing in theaters                                         |                                                                                                  |
| ...                       |                                                                                                |                                                                                                  |
| `/series/{imdb_id}`       | IN DEVELOPMENT                                                                                 |                                                                                                  |
| `/series/watch/{imdb}`    | IN DEVELOPMENT                                                                                 |                                                                                                  |
| `/series/popular`         | Returns a list of popular TV shows                                                             |                                                                                                  |
| `/series/top-rated`       | Returns a list of top rated TV shows, this now returns based on *IMDb* instead of *Themoviedb* | Uses local MySQL database for data, dumps are provided by *IMDb* on https://datasets.imdbws.com/ |
| `/series/now-playing`     | TV shows live airing                                                                           |                                                                                                  |
| `/series/hype`            | Current most popular TV show                                                                   |                                                                                                  |