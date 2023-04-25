import React from "react";
import Head from 'next/head';
import Link from "next/link";
import {useRouter} from "next/router";
import Spinner from "@/components/spinner";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {IMediaCard} from "@/utils/mediaCardInterface";
import styles from "../../styles/Landing.module.scss";
import useAuthRouteForResponseOrRedirect, {ServerAuthProps} from "@/utils/useAuthRouteForResponseOrRedirect";

export default function TrendingPage(): JSX.Element {
    const router = useRouter();
    const q = router.query;
    const media_type: string = q.media_type as string;
    const page: string = q.page as string;
    const s:ServerAuthProps = {
        method: "GET",
        url: `/trending?media_type=${media_type}&page=${page}`,
        body: {},
    }
    const {data, isLoading}:any = useAuthRouteForResponseOrRedirect(s);
    let respData: IMediaCard[] = [];
    let total_pages: number = 0;
    if (data) {
        respData = data.results;
        total_pages = data.total_pages
    }
    let currentPage = parseInt(page);
    let prevPage = currentPage - 1 < 1 ? 1 : currentPage - 1;
    let nextPage = currentPage + 1 > total_pages ? total_pages : currentPage + 1;
    let headerText = "";
    let headerStyle = styles.blue_span;
    if (media_type !== undefined) {
        headerText = media_type.split("").map((letter: string, index: number) => index === 0 ? letter.toUpperCase() : letter).join("");
        if (media_type === "tv") {
            headerStyle = styles.yellow_span;
        }
    }

    return isLoading ? (
        <Spinner />
    ) : (
        <>
            <Head>
                <title>{`Binge Lists | Trending ${media_type} results page ${page}`}</title>
                <meta name={"description"} content={"Browse Trending movies and tv on the Binge List app"} />
            </Head>
            <div className={styles.landing_container}>
                <div className={styles.hero_intro_container}>
                    <h1>{`${headerText}`}</h1>
                    <h1><span className={headerStyle}>{`Page ${page}`}</span>.</h1>
                    <Link href={"/trending/landing"}>
                        <button className={styles.btn_trending_clean}>Back To Trending</button>
                    </Link>
                </div>
                <MediaGrid>
                    {respData.map((media) => <MediaCard key={media.id} details={media} />)}
                </MediaGrid>
                <div className={styles.see_more}>
                    {currentPage <= 1 ? null : (
                        <Link href={`/trending/${media_type}?page=${prevPage}`}><span className={styles.blue_span}>{`< Prev`}</span> Page</Link>
                    )}
                    {currentPage >= total_pages ? null : (
                        <Link href={`/trending/${media_type}?page=${nextPage}`}><span className={styles.yellow_span}>Next</span> {`Page >`}</Link>
                    )}
                </div>
            </div>
        </>
    )
}

