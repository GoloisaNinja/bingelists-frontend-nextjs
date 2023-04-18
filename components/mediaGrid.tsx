import React from "react";
import styles from "../styles/MediaGrid.module.scss";
type MediaGridProps = {
    children: React.ReactNode[]
}
const MediaGrid: React.FC<MediaGridProps> = (props: MediaGridProps) => {
    return (
        <div className={styles.media_grid}>{[...props.children]}</div>
    );
}
export default MediaGrid;