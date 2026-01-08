import axios from 'axios';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateToken } from '../../../redux/slice/AuthSlice';

const AutoRefreshToken = () => {
	const dispatch = useDispatch();
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
	const token = useSelector((state) => state.auth.token);
	const refreshToken = useSelector((state) => state.auth.refreshToken);
	const expiryTime = useSelector((state) => state.auth.userData?.time);
	const refreshScheduled = useRef(false);
	const timerRef = useRef(null);

	const refreshAuthToken = async () => {
		// try {
		//   const response = await axios.post(
		//     `${BASE_URL}/auth/refresh-token`,
		//     {
		//       refreshToken: refreshToken,
		//     },
		//     {
		//       headers: {
		//         Authorization: `Bearer ${token}`,
		//       },
		//     }
		//   );
		//   dispatch(
		//     updateToken({
		//       token: response.data.data.refresh_token,
		//       expires_at: response.data.data.expires_at,
		//     })
		//   );
		//   refreshScheduled.current = false;
		// } catch (error) {
		//   dispatch(logout());
		// }
	};

	// useEffect(() => {
	// 	if (!token || !expiryTime) return;

	// 	const delay = Math.max(0, expiryTime - Date.now() - 2 * 60 * 1000);

	// 	if (delay > 0) {
	// 		refreshScheduled.current = true;

	// 		timerRef.current = setTimeout(() => {
	// 			refreshAuthToken();
	// 		}, delay);
	// 	}

	// 	return () => clearTimeout(timerRef.current);
	// }, [token, expiryTime]);

	return null;
};

export default AutoRefreshToken;
