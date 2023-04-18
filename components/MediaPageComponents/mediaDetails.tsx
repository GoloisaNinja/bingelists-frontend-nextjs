import React from 'react';
import { DetailProps } from "@/utils/mediaPageDetails";
import styles from "@/styles/MediaDetails.module.scss";

interface IDetailsProps {
    data: DetailProps,
}
const MediaDetails: React.FC<IDetailsProps> = (props) => {
    let {
        media_type,
        media_status,
        media_released,
        media_title,
        media_length,
        media_overview,
        media_genres,
        media_num_episodes,
        media_num_seasons,
        media_vote_count,
        media_vote_average,
    } = props.data;
    if (media_length === 0) {
        media_length = "n/a";
    }
    return (
        <div className={styles[`details_grid_${media_type}`]}>
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>Title: </span><p>{media_title}</p>
            </div>
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>Status: </span><p>{media_status}</p>
            </div>
            <div className={styles.detail_section}>
                <span className={styles[`label_${props.data.media_type}`]}>{media_type === "movie" ? "Released: " : "First aired: "}</span><p>{media_released}</p>
            </div>
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>{media_type === "movie" ? "Runtime: " : "Avg Runtime: "}</span><p>{media_length} mins</p>
            </div>
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>Rating: </span><p>{Math.round(media_vote_average!)} | {media_vote_count} votes</p>
            </div>
            {media_type === "tv" && (
                <div className={styles.detail_section}>
                    <span className={styles[`label_${media_type}`]}>Seasons: </span><p>{media_num_seasons}</p>
                </div>
            )}
            {media_type === "tv" && (
                <div className={styles.detail_section}>
                    <span className={styles[`label_${media_type}`]}>Episodes: </span><p>{media_num_episodes}</p>
                </div>
            )}
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>Genres: </span>{media_genres.map((genre) => <p key={genre.id}>{genre.name}</p>)}
            </div>
            <div className={styles.detail_section}>
                <span className={styles[`label_${media_type}`]}>Overview: </span><p>{media_overview}</p>
            </div>
        </div>
    );
}
export default MediaDetails