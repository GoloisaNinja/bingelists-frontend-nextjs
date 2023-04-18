import React from 'react';
import { nanoid } from "nanoid";
import {IProviders, IProvider, ILocationResult} from "@/utils/mediaPageInterface";
import ProviderCard from "@/components/MediaPageComponents/providerCard";
import styles from "@/styles/MediaProviders.module.scss";
interface MediaProvidersProps {
    data: IProviders,
    type: string,
}

const MediaProviders:React.FC<MediaProvidersProps> = (props) => {
    const media_type = props.type;
    const providerReMap = new Map(Object.entries(props.data.results))
    const usProviders: ILocationResult = providerReMap.get("US");
    return (
        <div className={styles.providers_container}>
            <h2 className={styles[`watch_header_${media_type}`]}>Where To Watch</h2>
            {!usProviders && <h3>Currently no providers for this title...</h3>}
            {usProviders && usProviders.buy &&(
                <div className={styles.provider_container}>
                    <h3>Buy or Rent</h3>
                    <div className={styles.provider_grid}>
                        {usProviders.buy.map((provider: IProvider) => <ProviderCard key={nanoid(5)} data={provider} />)}
                    </div>
                </div>
            )}
            {usProviders && usProviders.flatrate && (
                <div className={styles.provider_container}>
                    <h3>Stream</h3>
                    <div className={styles.provider_grid}>
                        {usProviders.flatrate.map((provider: IProvider) => <ProviderCard key={nanoid(5)} data={provider} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
export default MediaProviders