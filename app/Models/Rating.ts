import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Basic from './Basic';

export default class Rating extends BaseModel {
    @column({ isPrimary: true })
    public readonly imdbId: string;

    @column()
    public readonly rating: number;

    @column()
    public readonly votes: number;

    @hasOne(() => Basic, {
        foreignKey: 'imdbId'
    })
    public readonly details: HasOne<typeof Basic>
}
