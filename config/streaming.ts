import EztvProvider from "Lib/providers/EztvProvider";

/*
|--------------------------------------------------------------------------
| Supported codecs for streaming
|--------------------------------------------------------------------------
|
| Codec configuration, codecs depends on browser support
| Don't add codecs that are not supported by major browsers
|
| If you add codecs that are not supported by browsers
| make sure you transcode these with for example FFmpeg
*/
export const supportedCodecs = {
    /*
    | List of supported audio codecs by all major browsers
    | 
    | IE 11+
    | Edge
    | Chrome
    | FireFox
    | 
    | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
    */
    audio: ['aac', 'mp3', 'vorbis', 'opus', 'flac', 'alac'],
    /**
    | List of supported video codecs by all major browsers
    | 
    | IE 11+
    | Edge
    | Chrome
    | FireFox
    | 
    | https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
    */
    video: ['h264', 'av1', 'mpeg-2', 'mpeg-4', 'vp8', 'vp9',],
    /**
    | Codecs must be in the following formats in order to be playable by browsers
    | 
    | https://en.wikipedia.org/wiki/Comparison_of_video_container_formats
    */
    extionsions: ['mp4', 'mkv', 'webm'],
}
/**
| Register new torrent providers here
| 
| Torrent providers must extend Provider instance
*/
export const torrentProviders = {
    eztv: EztvProvider
}