import React from 'react'
import Image from "next/image";
import {ICast, ICrew} from "@/utils/mediaPageInterface";
import {TMDBIMAGE_URL} from "@/constants";
import NoImage from "@/public/images/bl_noimage.webp";
import styles from "@/styles/CastCrewCard.module.scss";

interface CardProps {
    data: ICast | ICrew
    type: string,
}
const isCastType = (x: any):boolean => {
    return x.hasOwnProperty("character");
}
const CastCrewCard: React.FC<CardProps> = (props) => {
    const { name, profile_path } = props.data;
    const media_type = props.type;
    const img_path = TMDBIMAGE_URL + profile_path;
    let title:string;
    if (isCastType(props.data)) {
        title = props.data.character;
    } else {
        title = props.data.job;
    }
    return (
        <div className={styles[`card_container_${media_type}`]}>
            <div className={styles.card_image}>
                <Image src={!profile_path ? NoImage : img_path} alt={`a headshot of ${name}`} fill={true} sizes={"(max-width: 450px), 45vw, (max-width: 650px), 33vw, 25vw"}/>
            </div>
            <div className={styles.card_details}>
                <p>{name}</p>
                <p>{title}</p>
            </div>
        </div>
    );
}
export default CastCrewCard