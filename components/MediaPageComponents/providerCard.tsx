import React from 'react';
import Image from "next/image";
import {IProvider} from "@/utils/mediaPageInterface";
import {TMDBIMAGE_URL} from "@/constants";
import styles from "@/styles/ProviderCard.module.scss";

interface ProviderCardProps {
    data: IProvider,
}

const ProviderCard:React.FC<ProviderCardProps> = (props) => {
    const { logo_path, provider_name} = props.data;
    return (
        <div className={styles.provider_card_container}>
            <div className={styles.provider_logo}>
                <Image className={styles.provider_image} src={`${TMDBIMAGE_URL}${logo_path}`} alt={`logo for ${provider_name}`} width={150} height={150} />
            </div>
            <div className={styles.provider_name}>
                <p>{provider_name}</p>
            </div>
        </div>
    );
}
export default ProviderCard