import {useDispatch} from "react-redux";
import {API_HEADER, BINGE_DEVAPI_BASE_URL} from "@/constants";
import axios from "axios";
import {loadMinifiedBingeLists} from "@/features/binge/bingeSlice";
import {useDispatchAlert} from "@/utils/alertFactory";
import {loadMinifiedFavorites} from "@/features/favorite/favoriteSlice";

export function useMinifiedListLoaders() {
    const dispatch = useDispatch();
    const {dispatchAlert} = useDispatchAlert();
    const bingeUrl:string = BINGE_DEVAPI_BASE_URL + "/bingelist/lists/minified";
    const favUrl:string = BINGE_DEVAPI_BASE_URL + "/favorite/favorites/minified";
    const dispatchLoadingMinifiedBingeLists = async (token: string) => {
        API_HEADER.headers.Authorization = "Bearer " + token;
        try {
            const res = await axios.get(bingeUrl, API_HEADER);
            if (res.status === 200) {
                dispatch(loadMinifiedBingeLists(res.data));
            } else {
                dispatchAlert("danger", "bingelists failed to fetch!");
            }
        } catch(e: any) {
            dispatchAlert("danger", "bingelists failed to fetch!");
        }
    }

    const dispatchLoadingMinifiedFavorites = async (token: string) => {
        API_HEADER.headers.Authorization = "Bearer " + token;
        try {
            const res = await axios.get(favUrl, API_HEADER);
            if (res.status === 200) {
                dispatch(loadMinifiedFavorites(res.data));
            } else {
                dispatchAlert("danger", "favorites failed to fetch!");
            }
        } catch(e: any) {
            dispatchAlert("danger", "favorites failed to fetch!");
        }
    }

    return { dispatchLoadingMinifiedBingeLists, dispatchLoadingMinifiedFavorites }
}
