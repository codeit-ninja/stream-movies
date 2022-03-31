import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Basic extends BaseModel {
    @column({ isPrimary: true, serializeAs: null })
    public readonly imdbId: string;

    @column()
    public readonly type: 'short'|'tvSeries'|'tvEpisode'|'movie';

    @column()
    public readonly title: string;

    @column()
    public readonly originalTitle: string;

    @column()
    public readonly adult: boolean;

    @column()
    public readonly start_year: string;

    @column()
    public readonly end_year: string;

    @column()
    public readonly runtime: number;

    @column()
    public readonly genres: string;
}
