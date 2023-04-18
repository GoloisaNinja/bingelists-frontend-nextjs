import React, { useState } from 'react';
import {ISimilar} from "@/utils/mediaPageInterface";
import {IMediaCard} from "@/utils/mediaCardInterface";
import MediaCard from "@/components/mediaCard";
import MediaGrid from "@/components/mediaGrid";
import styles from "@/styles/MediaSimilars.module.scss";


interface MediaSimilarsProps {
    data: ISimilar,
    type: string,
}

const MediaSimilars:React.FC<MediaSimilarsProps> = (props) => {
    const [minSimilarCount, setMinSimilarCount] = useState(5);
    const { results } = props.data
    results.forEach((similar) => similar.media_type = props.type);
    let similarsToDisplay: IMediaCard[] = results.slice(0, minSimilarCount);
    return (
        <div className={styles.similars_container}>
            <h2 className={styles[`similars_header_${props.type}`]}>Similar Finds</h2>
            <MediaGrid>
                {similarsToDisplay.map((media) => <MediaCard key={media.id} details={media} />)}
            </MediaGrid>
            {minSimilarCount === 5 && (
                <div className={styles.show_more_container}>
                    <button className={styles.btn_show_more} onClick={() => setMinSimilarCount(20)}>see more</button>
                </div>
            )}
        </div>
    );
}
export default MediaSimilars