interface IBingeListTitle {
    mediaId: number,
    title: string,
    type: string,
    posterPath: string,
    primaryGenreId: number,
}
export interface IBingeList {
    id: string,
    name: string,
    owner: string,
    listUsers: string[],
    titles: IBingeListTitle[],
    mediaCount: number,
    totalPages: number,
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