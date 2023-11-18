import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
export class SupermarketDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsNumber()
    @IsNotEmpty()
    longitude:number;

    @IsNumber()
    @IsNotEmpty()
    latitude:number;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    website:string;
}
