import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to sync state with URL parameters
 * @param {string} state - The current state value
 * @param {function} setState - The state setter function
 * @param {string} paramName - The URL parameter name (default: 'search')
 */
const useUrlFilters = (state, setState, paramName = 'search') => {
    const [searchParams, setSearchParams] = useSearchParams();
    const lastSyncedValue = useRef(state);

    // Sync from URL to state (handles mount and back/forward navigation)
    useEffect(() => {
        const urlValue = searchParams.get(paramName);
        const normalizedUrlValue = urlValue === null ? '' : urlValue;

        // Only update local state if the URL value has changed and is different from what we last synced
        if (normalizedUrlValue !== state && normalizedUrlValue !== lastSyncedValue.current) {
            setState(normalizedUrlValue);
            lastSyncedValue.current = normalizedUrlValue;
        }
    }, [paramName, searchParams, setState, state]);

    // Sync from state to URL (with debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            const urlValue = searchParams.get(paramName) || '';

            // Only update URL if the local state is different from current URL
            if (state !== urlValue) {
                const currentParams = Object.fromEntries(searchParams.entries());
                if (state) {
                    setSearchParams({ ...currentParams, [paramName]: state });
                } else {
                    const { [paramName]: removed, ...rest } = currentParams;
                    setSearchParams(rest);
                }
                lastSyncedValue.current = state;
            }
        }, 500); // Debounce URL updates

        return () => clearTimeout(timer);
    }, [state, paramName, setSearchParams, searchParams]);
};

export default useUrlFilters;
