import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new NoTorrentsFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NoTorrentsFoundException extends Exception {
    constructor(
        message = 'No torrents found',
        status = 404,
        code = 'E_NOT_FOUND',
    ) {
        super(message, status, code)
    }
}
