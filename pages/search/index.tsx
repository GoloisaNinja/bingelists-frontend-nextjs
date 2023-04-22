import {FormEvent, useState, useEffect} from 'react';
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {removeAlert, setAlert} from "@/features/alert/alertSlice";
import {authSelector} from "@/features/auth/authSlice";
import {IMediaCard} from "@/utils/mediaCardInterface";
import {CreateAlert} from "@/utils/alertFactory";
import axios from "axios";
import {API_HEADER, BINGE_DEVAPI_BASE_URL} from "@/constants";
import styles from "@/styles/Search.module.scss";
import MediaGrid from "@/components/mediaGrid";
import MediaCard from "@/components/mediaCard";
import {nanoid} from "nanoid";
import Spinner from "@/components/spinner";

export default function SearchPage(): JSX.Element {
    const router = useRouter();
    const {query} = router.query
    let querystring: string = "";
    if (typeof query === "string") {
        querystring = query;
    }
    const dispatch = useDispatch();
    const {token} = useSelector(authSelector);
    const [titleSearch, setTitleSearch] = useState<string>(querystring);
    const [movieSearchResults, setMovieSearchResults] = useState<IMediaCard[]>([]);
    const [tvSearchResults, setTvSearchResults] = useState<IMediaCard[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const handleQueryParam = (e: FormEvent) => {
        e.preventDefault();
        const ts = titleSearch as string;
        const encoded = encodeURI(ts);
        setLoading(true);
        router.replace(`/search?query=${encoded}`).then();
    }
    const handleSearch = async () => {
        const url = BINGE_DEVAPI_BASE_URL + `/search?query=${titleSearch}`;
        API_HEADER.headers.Authorization = "Bearer " + token;
        try {
            const res = await axios.get(url, API_HEADER);
            setMovieSearchResults(res.data.movie.results)
            setTvSearchResults(res.data.tv.results);
            setTitleSearch("");
        } catch (e: any) {
            const alert = CreateAlert("danger", "something went wrong");
            dispatch(setAlert(alert));
            setTimeout(() => {
                dispatch(removeAlert(alert.id))
            }, 5000)
        }
        setLoading(false);
    }
    useEffect(() => {
        if (query) {
            handleSearch().then();
        }
    }, [query])
    return loading ? (<Spinner />) : (
        <div className={styles.search_page_container}>
            <div className={styles.search_hero}>
                <div className={styles.search_bgimg}></div>
                <h1>Search</h1>
                <h1><span className={styles.yellow_span}>Titles</span>.</h1>
            </div>
            <div className={styles.form_container}>
                <form onSubmit={(e) => handleQueryParam(e)}>
                    <input
                        type={"text"}
                        name={"title"}
                        placeholder={"enter title to search for..."}
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleQueryParam(e)}/>
                    <button type={"submit"}>search</button>
                </form>
            </div>
            {!movieSearchResults.length && !tvSearchResults.length && (
                <div className={styles.search_noresult_container}>
                    <h2>No results to display...</h2>
                </div>
            )}
            {movieSearchResults.length ? (
                <>
                    <div className={styles.search_grid_container}>
                        <h2 className={styles.searchresult_header}><span
                            className={styles.blue_span}>Movie</span> Results</h2>
                        <MediaGrid>
                            {movieSearchResults.map((media) => {
                                media.media_type = "movie";
                                return <MediaCard key={nanoid(5)} details={media}/>
                            })}
                        </MediaGrid>
                    </div>
                </>
            ) : null}
            {tvSearchResults.length ? (
                <>
                    <div className={styles.search_grid_container}>
                        <h2 className={styles.searchresult_header}><span
                            className={styles.yellow_span}>Tv</span> Results</h2>
                        <MediaGrid>
                            {tvSearchResults.map((media) => {
                                media.media_type = "tv";
                                return <MediaCard key={nanoid(5)} details={media}/>
                            })}
                        </MediaGrid>
                    </div>
                </>
            ) : null}
        </div>
    );
}