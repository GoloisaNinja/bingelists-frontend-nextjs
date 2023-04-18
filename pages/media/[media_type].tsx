import {useRouter} from "next/router";
import Image, {StaticImageData} from "next/image";
import {useSelector, useDispatch } from "react-redux";
import {authSelector} from "@/features/auth/authSlice";
import { setAlert, removeAlert } from "@/features/alert/alertSlice";
import axios from "axios";
import useSWR from "swr";
import {IMediaResponse, IVideo} from "@/utils/mediaPageInterface";
import {DetailProps} from "@/utils/mediaPageDetails";
import styles from '../../styles/Media.module.scss';
import {CreateAlert} from "@/utils/alertFactory";
import {TMDBIMAGE_URL} from "@/constants";
import Spinner from "@/components/spinner";
import MediaDetails from "@/components/MediaPageComponents/mediaDetails";
import CastCrew from "@/components/MediaPageComponents/mediaCastCrew";
import MediaProviders from "@/components/MediaPageComponents/mediaProviders";
import MediaTrailer from "@/components/MediaPageComponents/mediaTrailer";
import MediaSimilars from "@/components/MediaPageComponents/mediaSimilars";
import NoBackDrop from "@/public/images/bl_noimage_backdrop.webp"
export default function MediaPage(): JSX.Element {
    const dispatch = useDispatch();
    const router = useRouter();
    const q = router.query;
    const media_type: string = q.media_type as string;
    const media_id: string = q.media_id as string;
    const { token } = useSelector(authSelector);
    const config = {
        headers: {
            "Authorization": "Bearer " + token,
        }
    }
    const fetcher = (url: string) => axios.get(url, config).then(res => res.data);
    const {data, error} = useSWR(`http://localhost:8080/api/v1/media?media_type=${media_type}&media_id=${media_id}`, fetcher);
    if (error) {
        console.log(error)
        if (error.hasOwnProperty("response")) {
            if (error.response.status === 403) {
                router.push("/login").then(() => {
                    const alert = CreateAlert("danger", "please authenticate");
                    dispatch(setAlert(alert));
                    setTimeout(() => {dispatch(removeAlert(alert.id))})
                });
            }
        } else {
            router.push("/trending/landing").then(() => {
                const alert = CreateAlert("danger", `problem fetching media id ${media_id}!`);
                dispatch(setAlert(alert));
                setTimeout(() => {dispatch(removeAlert(alert.id))});
            })
        }
    }
    let resp: IMediaResponse = {} as IMediaResponse;

    let detailProps: DetailProps;
    let media_title: string | undefined;
    let media_released: string | undefined;
    let media_length: number | undefined;
    let media_num_seasons: number | undefined;
    let media_num_episodes: number | undefined;

    let trailer: IVideo | null = null;

    const getAverageEpisodeRuntime = (lengths: number[]):number => {
        if (lengths.length === 0) {
            return 0;
        }
        const sum: number = lengths.reduce((prev: number, curr: number) => prev + curr);
        return Math.round(sum / lengths.length);
    }
    const setMediaDetailValuesBasedOnMediaType = ():void => {
        if (media_type === "movie") {
            media_title = resp.media.title;
            media_released = resp.media.release_date;
            media_length = resp.media.runtime;
        } else {
            media_title = resp.media.name;
            media_released = resp.media.first_air_date;
            media_length = getAverageEpisodeRuntime(resp.media.episode_run_time!);
            media_num_seasons = resp.media.number_of_seasons;
            media_num_episodes = resp.media.number_of_episodes;
        }
        detailProps = {
            media_type,
            media_title,
            media_status: resp.media.status,
            media_released,
            media_length,
            media_num_seasons,
            media_num_episodes,
            media_overview: resp.media.overview,
            media_genres: resp.media.genres,
            media_vote_count: resp.media.vote_count,
            media_vote_average: resp.media.vote_average,
        }
    }
    const getOfficialYouTubeTrailerFromVideos = (): IVideo | null => {
        if (resp.media.videos !== null) {
            for (const video of resp.media.videos.results) {
                if (video.type.toLowerCase() === "trailer" && video.official) {
                    return video;
                }
            }
        }
        return null;
    }
    let backdropImgSrc: string | StaticImageData = "";
    if (data) {
        resp = data;
        if (resp.media.backdrop_path === null) {
            backdropImgSrc = NoBackDrop;
        } else {
            backdropImgSrc = TMDBIMAGE_URL + resp.media.backdrop_path;
        }
        setMediaDetailValuesBasedOnMediaType();
        trailer = getOfficialYouTubeTrailerFromVideos();
    }
    return Object.keys(resp).length ? (
        <div className={styles.page_container}>
            <div className={styles.bg_container}>
                <Image src={backdropImgSrc} alt={`backdrop image for ${media_title}`} fill={true} sizes={"100vw"}/>
                <div className={styles.go_back}>
                    <button onClick={() => router.back()}>{`<`}</button>
                </div>
            </div>
            <div className={styles.content_container}>
                <div className={styles.tagline}>
                    <h1>{resp.media.tagline}</h1>
                </div>
                <MediaDetails data={detailProps!} />
                <CastCrew data={resp.credits} type={media_type}/>
                <MediaProviders data={resp.providers} type={media_type}/>
                <MediaTrailer data={trailer} type={media_type} />
                <MediaSimilars data={resp.similars} type={media_type} />
            </div>
        </div>
    ) : (
        <Spinner />
    )
}