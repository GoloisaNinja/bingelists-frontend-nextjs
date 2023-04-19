import React from "react";
import Head from 'next/head';
import Link from "next/link";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";
import Spinner from "@/components/spinner";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {IMediaCard} from "@/utils/mediaCardInterface";
import styles from "../../styles/Landing.module.scss";

export default function Landing(): JSX.Element {
    const s: ServerAuthProps = {
        method: "GET",
        url: "/trending/landing",
        body: {},
    }
    const data: any = useAuthRouteForResponseOrRedirect(s);

    let tvData: IMediaCard[] = [];
    let movieData: IMediaCard[] = [];
    if (data) {
        tvData = data.tv.results;
        movieData = data.movie.results;
    }

    return !data ? (
        <Spinner />
    ) : (
        <>
        <Head>
            <title>Binge Lists | Trending Movies and Tv</title>
            <meta name={"description"} content={"Browse Trending movies and tv on the Binge List app"} />
        </Head>
            <div className={styles.landing_container}>
                <div className={styles.landing_hero}>
                    <div className={styles.landing_hero_bgimg}></div>
                    <h1 className={styles.grid_intro}>Trending <span className={styles.blue_span}>Movies</span>.</h1>
                </div>
                <MediaGrid>
                    {movieData.map((media) => <MediaCard key={media.id} details={media} />)}
                </MediaGrid>
                <div className={styles.see_more}>
                    <Link href={"/trending/movie?page=2"}><span className={styles.blue_span}>Explore</span> Movies.</Link>
                </div>
                <h1 className={styles.grid_intro}>Trending <span className={styles.yellow_span}>Tv</span>.</h1>
                <MediaGrid>
                    {tvData.map((media) => <MediaCard key={media.id} details={media}/>)}
                </MediaGrid>
                <div className={styles.see_more}>
                    <Link href={"/trending/tv?page=2"}><span className={styles.yellow_span}>Explore</span> Tv.</Link>
                </div>
            </div>
        </>
    )
}

