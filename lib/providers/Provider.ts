import WebTorrent from "webtorrent";

export type SearchReturnType = {
    magnet: string;
    title: string;
    size: string;
}

export default abstract class Provider {
    public name: string;

    public abstract search(...args): Promise<SearchReturnType[]>;

    /**
     * Start a download
     * 
     * Starts downloading torrent contents
     * 
     * @param magnetUri     - string
     * @param opts          - { destroyStoreOnDestroy: boolean; }
     * @returns `WebTorrent.Torrent`
     */
     public static async download(magnetUri: string, opts?: { destroyStoreOnDestroy: true }): Promise<WebTorrent.Torrent> {
        return new Promise((resolve, reject) => {
            const webtorrent = new WebTorrent({
                maxConns: 10
            });
            webtorrent.add(magnetUri, opts, torrent => {
                torrent.on('error', err => {
                    reject(err);
                    webtorrent.destroy();
                });
                torrent.once('download', () => resolve(torrent));
            })

            webtorrent.on('error', err => { 
                reject(err);
                webtorrent.destroy();
            })
        })
    }
}