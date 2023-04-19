import {IGenre} from "@/utils/mediaPageInterface";

export interface ICategories {
    genres: IGenre[],
}

export interface ICategoriesResponse {
    movie: ICategories,
    tv: ICategories,
}