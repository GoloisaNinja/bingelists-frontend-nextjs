import React, {useState} from 'react';
import {useRouter} from "next/router";
import {IListQueryData, IListTitle} from "@/utils/sharedInterfaces";
import styles from "@/styles/Selectors.module.scss";

interface SelectorsProps {
    titles: IListTitle[]
    basePath: string
    pathParams: string
    setTitles: (titles: IListTitle[]) => void
    listData: IListQueryData
}

const Selectors: React.FC<SelectorsProps> = (props) => {
    const router = useRouter();
    const page = router.query.page as string;

    const { skip, limit, typeFilter, genreFilter } = props.listData

    const [filterByType, setFilterByType] = useState<string>(typeFilter ? typeFilter : "");
    const [filterByGenreId, setFilterByGenreId] = useState<number>(genreFilter ? parseInt(genreFilter) : 0);

    let mTypes: string[] = [];
    let gTypes: Map<string, [number, string][]> = new Map();

    const applyFilters = () => {
        let filterUrl = props.basePath + `?page=${page}&typeFilter=${filterByType}`
        if (filterByGenreId !== 0) {
            filterUrl = filterUrl + `&genreFilter=${filterByGenreId}`
        }
        router.push(filterUrl, undefined, {scroll: false}).then();
    }
    const resetFilters = () => {
        setFilterByType("");
        setFilterByGenreId(0);
        router.push(props.basePath + `?page=${page}`, undefined, {scroll: false}).then();
    }
    const applySearchTerm = (query: string) => {
        let normalizedQ = query.toLowerCase();
        router.replace(props.basePath + "?page=1" + props.pathParams, undefined, {scroll: false}).then(() => {
            let validTitles = props.titles.filter((title) => title.title.toLowerCase().includes(normalizedQ));
            props.setTitles(validTitles.slice(skip, skip + limit))
        });
    }
    const populateFilters = (titles: IListTitle[]) => {
        for (let title of titles) {
            if (mTypes.length !== 2) {
                if (!mTypes.includes(title.type)) {
                    mTypes.push(title.type)
                }
            }
            let temp: [number, string] = [title.primaryGenreId, title.primaryGenreName];
            if (gTypes.get(title.type) === undefined) {
                gTypes.set(title.type, [temp]);
            } else {
                if (gTypes.get(title.type)!.findIndex((genre) => genre[0] === title.primaryGenreId) === -1) {
                    gTypes.get(title.type)!.push(temp)
                }
            }
        }
    }
    populateFilters(props.titles)
    return (
        <div className={styles.selectors_container}>
            <input
                className={styles.searchbar}
                type={"text"}
                autoFocus={true}
                placeholder={"search titles"}
                onChange={(e) => applySearchTerm(e.target.value)}
            ></input>
            <div className={styles.filters_container}>
                <div className={styles.select_wrap}>
                <select
                    value={filterByType}
                    onChange={(e) => setFilterByType(e.target.value)}>
                    <option value={""}>filter by type</option>
                    {mTypes.map((type, index) => <option key={index.toString() + type}>{type}</option>)}
                </select>
                </div>
                {filterByType !== "" && (
                    <div className={styles.select_wrap}>
                    <select
                        value={filterByGenreId}
                        onChange={(e) => setFilterByGenreId(parseInt(e.target.value))}>
                        <option value={0}>filter by genre</option>
                        {gTypes.get(filterByType)!.map((genre) => <option key={genre[0].toString() + genre[1]}
                                                                          value={genre[0]}>{genre[1]}</option>)}
                    </select>
                    </div>
                )}
            </div>
            <div className={styles.filters_btn_group}>
                {filterByType !== "" && (
                    <button onClick={() => applyFilters()}>apply</button>
                )}
                {filterByType !== "" && (
                    <button onClick={() => resetFilters()}>reset</button>
                )}
            </div>
        </div>
    );
}
export default Selectors