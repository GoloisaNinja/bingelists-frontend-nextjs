import React from "react";
import Image, {StaticImageData} from "next/image";
import Link from "next/link";
import {TMDBIMAGE_URL} from "@/constants";
import NoImage from "@/public/images/bl_noimage.webp"
import styles from "@/styles/MediaCard.module.scss";
import {IListTitle} from "@/utils/sharedInterfaces";

interface ListCardProps {
    details: IListTitle,
}

const ListCard: React.FC<ListCardProps> = (props) => {
    let colorClass = props.details.type === "movie" ? styles.movie : styles.tv;
    let textOffset: string | undefined = props.details.type === "tv" ? styles.yellow_offset : undefined;
    let imageSrc: string | StaticImageData = TMDBIMAGE_URL + props.details.posterPath;
    if (props.details.posterPath === null) {
        imageSrc = NoImage;
    }
    return (
        <Link href={`/media/${props.details.type}?media_id=${props.details.mediaId}`}>
            <div className={`${styles.card_container} ${colorClass}`}>
                <div className={styles.binge_card_grid}>
                    <div className={styles.media_poster}>
                        <Image src={imageSrc} alt={`box art for ${props.details.title}`} fill={true}
                               sizes={"(max-width: 499px) 100vw," +
                                   "(max-width: 749px) 50vw," +
                                   "(max-width: 979px) 25vw," +
                                   "20vw"}/>
                    </div>
                    <div className={styles.item_type}>
                        <p>Type: </p>
                        <p className={`${styles.ratingvalue} ${textOffset}`}>{props.details.type}</p>
                    </div>
                    <div className={styles.primary_genre}>
                        <p>Genre: </p>
                        <p className={`${styles.popvalue} ${textOffset}`}>{props.details.primaryGenreName}</p>
                    </div>
                    <div className={styles.card_title_container}>
                        <p>{props.details.title}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
export default ListCard;