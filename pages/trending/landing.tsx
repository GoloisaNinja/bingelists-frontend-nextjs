import React from "react";
import Head from 'next/head';
import Link from "next/link";
import {useRouter} from "next/router";
import useSWR from 'swr';
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import {setAlert, removeAlert} from "@/features/alert/alertSlice";
import { CreateAlert } from "@/utils/alertFactory";
import Spinner from "@/components/spinner";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {IMediaCard} from "@/utils/mediaCardInterface";
import styles from "../../styles/Landing.module.scss";
import {API_HEADER} from "@/constants";


export default function Landing(): JSX.Element {
    const router = useRouter();
    const dispatch = useDispatch();
    const { token } = useSelector(authSelector);
    API_HEADER.headers.Authorization = "Bearer " + token;
    const config = API_HEADER;
    const fetcher = (url: string) => axios.get(url, config).then(res => res.data);
    const {data, error} = useSWR('http://localhost:8080/api/v1/trending/landing', fetcher);
    if (error) {
        if (error.hasOwnProperty("response")) {
            if (error.response.status === 403) {
                router.push("/login").then(() => {
                    const alert = CreateAlert("danger", "please authenticate");
                    dispatch(setAlert(alert));
                    setTimeout(() => {dispatch(removeAlert(alert.id))},5000)
                });
            }
        }  else {
            router.push("/login").then(() => {
                const alert = CreateAlert("danger", "problem loading landing");
                dispatch(setAlert(alert));
                setTimeout(() => {dispatch(removeAlert(alert.id))},5000)
            });
        }
    }
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
                <h1 className={styles.grid_intro}>Trending <span className={styles.blue_span}>Movies</span>.</h1>
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

