import React from 'react';
import {IVideo} from "@/utils/mediaPageInterface";
import {YTEMBED_BASE_URL} from "@/constants";
import styles from "@/styles/MediaTrailer.module.scss";

interface MediaTrailerProps {
    data: IVideo | null
    type: string,
}
const MediaTrailer:React.FC<MediaTrailerProps> = (props) => {
    return (
        <div className={styles.trailer_container}>
            <h2 className={styles[`header_${props.type}`]}>Trailer</h2>
            {props.data !== null ? (
                <div className={styles.trailer_iframe_container}>
                    <iframe
                        className={styles.ytIframe}
                        title={props.data.id}
                        src={`${YTEMBED_BASE_URL}${props.data.key}`}
                    ></iframe>
                </div>
            ) : (
                <h3 className={styles.no_trailers_text}>No official trailers found...</h3>
            )}

        </div>
    );
}
export default MediaTrailer