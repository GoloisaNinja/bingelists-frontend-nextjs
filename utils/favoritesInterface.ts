import {IListTitle} from "@/utils/sharedInterfaces";

export interface IFavorites {
    _id: string,
    owner: string,
    favorites: IListTitle[],
}