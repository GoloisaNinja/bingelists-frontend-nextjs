import React, {useState} from 'react';
import {ICredits, ICrew} from "@/utils/mediaPageInterface";
import CastCrewCard from "@/components/MediaPageComponents/castCrewCard";
import styles from "@/styles/MediaCastCrew.module.scss";

interface CastCrewProps {
    data: ICredits
    type: string,
}
const CastCrew: React.FC<CastCrewProps> = (props) => {
    const { cast, crew } = props.data;
    const media_type = props.type;
    const [minCast, setMinCast] = useState(5);
    let castToDisplay = cast.length > minCast ? cast.slice(0, minCast) : cast;
    let crewToDisplay: ICrew[];
    // remove possible dupes from crew list
    let initialCrew: ICrew[] = [];
    let cleanCrew: ICrew[] = [];
    if (crew.length > 0) {
        initialCrew = crew.slice(0, 20);
        let crewIds: number[] = [];
        for (const crewPerson of initialCrew) {
            if (!crewIds.includes(crewPerson.id)) {
                crewIds.push(crewPerson.id);
                cleanCrew.push(crewPerson);
            }
        }
    }
    crewToDisplay = cleanCrew.slice(0, 5);
    const increaseMinCast = () => {
        setMinCast(20);
    }
    return (
        <div className={styles.cast_container}>
            <h2 className={styles[`cast_${media_type}`]}>Cast</h2>
            {cast.length > 0 ? (
                <div className={styles.cc_grid}>
                    {castToDisplay.map((person) => <CastCrewCard key={person.id} data={person} type={media_type} />)}
                </div>
            ) : (<h3 className={styles.no_cc_header}>No cast available...</h3>)}
            {minCast !== 20 && minCast < cast.length && (
                <>
                    <div className={styles.show_more_container}>
                        <button className={styles.show_more} onClick={() => increaseMinCast()}>show more</button>
                    </div>
                </>
            )}
            <h2 className={styles[`cast_${media_type}`]}>Crew</h2>
            {crew.length > 0 ? (
                <div className={styles.cc_grid}>
                    {crewToDisplay.map((person) => <CastCrewCard key={person.id} data={person} type={media_type} />)}
                </div>
            ) : (<h3 className={styles.no_cc_header}>No crew available...</h3>)}
        </div>
    );
}
export default CastCrew;