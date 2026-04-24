import axios from 'axios';
import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateToken } from '../../../redux/slice/AuthSlice';

const AutoRefreshToken = () => {
	const dispatch = useDispatch();
	const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;
	const token = useSelector((state) => state.auth.token);
	const refreshToken = useSelector((state) => state.auth.refreshToken);
	const expiryTime = useSelector((state) => state.auth.time);
	const refreshScheduled = useRef(false);
	const timerRef = useRef(null);

	const refreshAuthToken = useCallback(async () => {
		try {
		  const response = await axios.post(
		    `${BASE_URL}/auth/refresh`,
		    {
		      refreshToken: refreshToken,
		    },
		    {
		      headers: {
		        Authorization: `Bearer ${token}`,
		      },
		    }
		  );

		  const newToken = response.data?.data?.accessToken || response.data?.accessToken;
		  if (!newToken) throw new Error("No access token returned");

		  function parseJwt (token) {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              return JSON.parse(jsonPayload);
          }

		  const decoded = parseJwt(newToken);
		  const newTime = decoded?.exp ? decoded.exp * 1000 : 0;

		  dispatch(
		    updateToken({
		      token: newToken,
		      time: newTime,
		    })
		  );
		  refreshScheduled.current = false;
		} catch (error) {
		  console.error("Token refresh failed", error);
		  // dispatch(logout());
		}
	}, [BASE_URL, dispatch, refreshToken, token]);

	useEffect(() => {
		if (!token || !expiryTime) return;

		const delay = Math.max(0, expiryTime - Date.now() - 2 * 60 * 1000); // refresh 2 mins before expiry

		if (delay > 0) {
			refreshScheduled.current = true;

			timerRef.current = setTimeout(() => {
				refreshAuthToken();
			}, delay);
		} else if (!refreshScheduled.current) {
			// If already expired
			refreshAuthToken();
		}

		return () => clearTimeout(timerRef.current);
	}, [token, expiryTime, refreshAuthToken]);

	return null;
};

export default AutoRefreshToken;
