import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios, { AxiosResponse } from 'axios';
import { authSelector, logout, authenticate } from '@/features/auth/authSlice';
import { useMinifiedListLoaders } from '@/utils/initialListLoaders';
import { useDispatchAlert } from '@/utils/alertFactory';
import useSWR from 'swr';
import { BINGE_BASE_URL } from '@/constants';

export interface ServerAuthProps {
	method: string;
	url: string;
	body: Object;
}

const useAuthRouteForResponseOrRedirect: React.FC<ServerAuthProps> = (
	props,
): any => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { dispatchAlert } = useDispatchAlert();
	const { token, isAuthenticated } = useSelector(authSelector);
	const {
		dispatchLoadingMinifiedBingeLists,
		dispatchLoadingMinifiedFavorites,
	} = useMinifiedListLoaders();
	let tokenToUse: string = '';
	let lsToken: any = '';
	if (typeof window !== 'undefined') {
		lsToken = localStorage.getItem('bingeToken');
	}
	lsToken !== '' ? (tokenToUse = lsToken) : (tokenToUse = token.token);
	useEffect(() => {
		const handleUserRefresh = async (t: string) => {
			if (!t) return;

			const config = {
				headers: {
					'Content-type': 'application/json',
					Authorization: 'Bearer ' + t,
				},
			};
			try {
				const userResp: AxiosResponse = await axios.get(
					BINGE_BASE_URL + '/user/refresh',
					config,
				);
				if (userResp.status === 200) {
					let user = userResp.data.data;
					dispatch(authenticate(user));
					dispatchLoadingMinifiedBingeLists(t);
					dispatchLoadingMinifiedFavorites(t);
				}
			} catch (e: any) {
				let alertMessage = e.message;
				if (e.hasOwnProperty('response')) {
					if (e.response.data) {
						alertMessage = e.response.data.message;
					}
				}
				dispatchAlert('danger', alertMessage);
			}
		};

		handleUserRefresh(tokenToUse);
	}, [tokenToUse]);
	const fetcher = (url: string) =>
		axios({
			method: props.method,
			url,
			headers: {
				'Content-type': 'application/json',
				Authorization: 'Bearer ' + tokenToUse,
			},
		}).then((res) => res.data);
	const { data, error, isLoading, mutate } = useSWR(
		BINGE_BASE_URL + props.url,
		fetcher,
	);
	if (error) {
		if (error.hasOwnProperty('response')) {
			let location = window.location;
			if (
				error.response.status === 403 &&
				location.href !== 'https://bingelists.app/login'
			) {
				router.push('/login').then(() => {
					if (isAuthenticated) {
						dispatch(logout());
					}
					dispatchAlert('danger', 'please authenticate');
				});
			}
		}
		return {
			data: null,
			isLoading: false,
			mutate,
		};
	}

	return {
		data,
		isLoading,
		mutate,
	};
};
export default useAuthRouteForResponseOrRedirect;
