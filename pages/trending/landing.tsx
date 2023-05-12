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
    const {data, isLoading}: any = useAuthRouteForResponseOrRedirect(s);

    let tvData: IMediaCard[] = [];
    let movieData: IMediaCard[] = [];
    if (data) {
        tvData = data.data.tv.results;
        movieData = data.data.movie.results;
    }

    return isLoading ? (
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
                    <h1>Everything</h1>
                    <h1>Trendy.</h1>
                </div>
                <h2 className={styles.grid_intro}>The Biggest <span className={styles.blue_span}>Movies</span>.</h2>
                <MediaGrid>
                    {movieData.map((media) => <MediaCard key={media.id} details={media} />)}
                </MediaGrid>
                <div className={styles.see_more}>
                    <Link href={"/trending/movie?page=2"}><span className={styles.blue_span}>Explore</span> Movies.</Link>
                </div>
                <h2 className={styles.grid_intro}>The Hottest <span className={styles.yellow_span}>Tv</span>.</h2>
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

