# Stream movies (back-end)

This is only the back-end and is written in NodeJS. Can be used to create a VOD service.

Currently only https://yts.mx is implemented. This is enough for the majority of movies out there currently.

## How does it work?

It works by searching for torrents via the https://yts.mx API based on a IMDb ID.

It will search for available torrents, parse the torrents and search for playable media, eg: .mp4 or .mkv files.

If it successfully fetched torrents, it will parse all the playable media files to find out if it can be played in the browser. If so, a flag on each `StreamObject` will be set.

All methods to do so are exposed via the API.

## Installation

Make sure NodeJS v16+ is installed. Versions lower than that might work but is not tested.

clone the project

```
git clone https://github.com/codeit-ninja/stream-movies.git
```

Install dependecies 
```
npm install
```

Then serve the project locally

```
node ace serve --watch
```

Redis is used as caching layer by this project.

You can create a free *Redis* instance here https://redis.com/try-free/
Or run a *Redis server* locally https://redis.io/download/

Create a `.env` file and fill the necessary variables.

```
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=2sGAAbgFQ3Cp5EzUj5MVaWZFz_OhGBG9
DRIVE_DISK=local                // https://docs.adonisjs.com/guides/drive
S3_SECRET=dummySecret           // Only required if you have 'DRIVE_DISK' set to 's3'
S3_KEY=dummyKey                 // Only required if you have 'DRIVE_DISK' set to 's3'
S3_BUCKET=dummyBucket           // Only required if you have 'DRIVE_DISK' set to 's3'
S3_REGION=dummyRegion           // Only required if you have 'DRIVE_DISK' set to 's3'
S3_ENDPOINT=dummyEndpoint       // Only required if you have 'DRIVE_DISK' set to 's3'
SESSION_DRIVER=cookie
REDIS_CONNECTION=local          // required
REDIS_HOST=127.0.0.1            // required
REDIS_PORT=6379                 // required
REDIS_PASSWORD=                 // Optional (depends what you configured in redis)
```

*This project was created in a WSL 2 Linux envoirment, you might run into problems when running it on windows. The problem might come from the `FFprobe` binaries.

## Api endpoints

| Route | Description | Note |
| ----------- | ----------- | ----------- |
| `/stream/{imdb_id}` | Prepares the given IMDB ID to make it streamable. | Best to run this first before you run `/stream/watch/{imdb_id}`
| `/stream/watch/{imdb_id}` | Creates a stream response. |
| `/movies/popular` | Returns a list of popular movies | Source TMDb
| `/movies/top-rated` | Returns a list of top rated movies | Source TMDb
| `/movies/now-playing` | Returns a list of movies currently playing in theaters | Source TMDb