import {IMediaCard} from "@/utils/mediaCardInterface";

// Media Items
interface ICollection {
    id: number,
    name: string,
    poster_path: string,
    backdrop_path: string,
}
export interface IGenre {
    id: number,
    name: string,
}
interface IProductionCompany {
    id: number,
    logo_path: string,
    name: string,
    origin_country: string,
}
interface IProductionCountry {
    iso_3166_1: string,
    name: string,
}
interface ISpokenLanguage {
    english_name: string,
    iso_639_1: string,
    name: string,
}
export interface IVideo {
    iso_639_1: string,
    iso_3166_1: string,
    name: string,
    key: string,
    site: string,
    size: number,
    type: string,
    official: boolean,
    published_at: string,
    id: string,
}
interface IYouTubeVideos {
    results: IVideo[]
}
interface ICreator {
    id: number,
    credit_id: string,
    name: string,
    gender: number,
    profile_path: string,
}
interface IAiredEpisode {
    id: number,
    name: string,
    overview: string,
    vote_average: number,
    vote_count: number,
    air_date: string,
    episode_number: number,
    production_code: string,
    runtime: number,
    season_number: number,
    show_id: number,
    still_path: string,
}
interface INetwork {
    id: number,
    logo_path: string,
    name: string,
    origin_country: string,
}
interface ISeason {
    air_date: string,
    episode_count: number,
    id: number,
    name: string,
    overview: string,
    poster_path: string,
    season_number: number,
}
interface IMedia {
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection?: ICollection,
    budget?: number,
    created_by?: ICreator[],
    episode_run_time?: number[],
    first_air_date?: string,
    genres: IGenre[],
    homepage: string,
    id: number,
    imdb_id?: string,
    in_production?: boolean,
    languages?: string[],
    last_air_date?: string,
    last_episode_to_air?: IAiredEpisode,
    name?: string,
    next_episode_to_air?: IAiredEpisode,
    networks?: INetwork[],
    number_of_episodes?: number,
    number_of_seasons?: number,
    origin_country?: string[],
    original_language: string,
    original_name?: string,
    original_title?: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: IProductionCompany[],
    production_countries: IProductionCountry[],
    release_date?: string,
    revenue?: number,
    runtime?: number,
    seasons?: ISeason[],
    spoken_languages: ISpokenLanguage[],
    status: string,
    tagline: string,
    title?: string,
    type?: string,
    video?: boolean,
    vote_average: number,
    vote_count: number,
    videos: IYouTubeVideos,
}
// Credits
export interface ICast {
    adult: string,
    gender: number,
    id: number,
    job: string,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string,
    character: string,
    credit_id: string,
    order: number,
}
export interface ICrew {
    adult: string,
    character: string,
    gender: number,
    id: number,
    known_for_department: string,
    name: string,
    original_name: string,
    popularity: number,
    profile_path: string,
    credit_id: string,
    department: string,
    job: string,
}
export interface ICredits {
    cast: ICast[],
    crew: ICrew[],
    id: number,
}
// Providers
export interface IProvider {
    logo_path: string,
    provider_id: number,
    provider_name: string,
    display_priority: number,
}
export interface ILocationResult {
    link: string,
    flatrate?: IProvider[],
    buy?: IProvider[],
    ads?: IProvider[],
    free?: IProvider[],
}

export interface IProviders {
    id: number,
    results: Map<string, ILocationResult>,
}
// Similars
export interface ISimilar {
    page: number,
    results: IMediaCard[],
    total_pages: number,
    total_results: number,
}


// API Media Response that contains all four major interfaces above
export interface IMediaResponse {
    media: IMedia,
    credits: ICredits,
    providers: IProviders,
    similars: ISimilar,
}