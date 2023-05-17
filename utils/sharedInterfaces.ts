export interface IListTitle {
    mediaId: number,
    title: string,
    type: string,
    posterPath: string,
    primaryGenreId: number,
    primaryGenreName: string,
}

export interface IListQueryData {
    skip: number
    limit: number
    typeFilter: string | undefined
    genreFilter: string | undefined
}