import { CityEntity } from 'src/city/city.entity';
import{Entity, Column, PrimaryGeneratedColumn, ManyToMany} from 'typeorm';

@Entity()
export class SupermarketEntity {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    longitude:number;

    @Column()
    latitude:number;

    @Column()
    website:string;

    @ManyToMany(()=>CityEntity,city => city.supermarkets)
    cities:CityEntity[];
}
