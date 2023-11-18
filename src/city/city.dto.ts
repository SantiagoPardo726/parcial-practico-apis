import {IsNotEmpty,IsNumber, IsString } from 'class-validator';

export class CityDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    country:string;

    @IsNumber()
    @IsNotEmpty()
    population:number;
}
