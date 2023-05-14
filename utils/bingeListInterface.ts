import {IListTitle} from "@/utils/sharedInterfaces";
export interface IBingeList {
    _id: string,
    name: string,
    owner: string,
    users: string[],
    titles: IListTitle[],
    mediaCount: number,
    createdAt: string,
}
export interface IBingeListCard {
    createdAt: string,
    _id: string,
    users: string[],
    mediaCount: number,
    name: string,
    owner: string,
}