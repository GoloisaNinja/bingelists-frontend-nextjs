import React from "react";
import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import { IMediaCard } from "@/utils/mediaCardInterface";
import { TMDBIMAGE_URL } from "@/constants";
import NoImage from "@/public/images/bl_noimage.webp"
import styles from "../styles/MediaCard.module.scss";

interface MediaCardProps {
    details: IMediaCard,
}
const MediaCard: React.FC<MediaCardProps> = (props)  => {
    let mediaTitle: String | undefined = props.details.media_type === "movie" ? props.details.title : props.details.name;
    let colorClass = props.details.media_type === "movie" ? styles.movie : styles.tv;
    let textOffset: string | undefined = props.details.media_type === "tv" ? styles.yellow_offset : undefined;
    let imageSrc: string | StaticImageData = TMDBIMAGE_URL + props.details.poster_path;
    if (props.details.poster_path === null) {
        imageSrc = NoImage;
    }
    return (
        <Link href={`/media/${props.details.media_type}?media_id=${props.details.id}`}>
        <div className={`${styles.card_container} ${colorClass}`}>
            <div className={styles.card_grid}>
                <div className={styles.media_poster}>
                    <Image src={imageSrc} alt={`box art for ${mediaTitle}`} fill={true} sizes={"(max-width: 499px) 100vw," +
                        "(max-width: 749px) 50vw," +
                        "(max-width: 979px) 25vw," +
                        "20vw"}/>
                </div>
                <div className={styles.rating}>
                    <p>Rating: </p>
                    <p className={`${styles.ratingvalue} ${textOffset}`}>{Math.round(props.details.vote_average)}</p>
                </div>
                <div className={styles.popularity}>
                    <p>Popularity: </p>
                    <p className={`${styles.popvalue} ${textOffset}`}>{Math.round(props.details.popularity)}</p>
                </div>
                <div className={styles.card_info_container}>
                    <p>{mediaTitle}</p>
                </div>
                <div className={styles.overview}>
                    <p>{props.details.overview}</p>
                </div>
            </div>
        </div>
        </Link>
    );
}
export default MediaCard;