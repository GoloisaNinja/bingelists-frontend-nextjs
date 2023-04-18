import {IGenre } from "@/utils/mediaPageInterface";

export type DetailProps = {
    media_type: string | undefined,
    media_title: string | undefined,
    media_status: string | undefined,
    media_released: string | undefined,
    media_length: number | undefined | string,
    media_num_seasons: number | undefined,
    media_num_episodes: number | undefined,
    media_overview: string | undefined,
    media_genres: IGenre[],
    media_vote_count: number | undefined,
    media_vote_average: number | undefined,
}