import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook to sync state with URL parameters
 * @param {string} state - The current state value
 * @param {function} setState - The state setter function
 * @param {string} paramName - The URL parameter name (default: 'search')
 */
const useUrlFilters = (state, setState, paramName = 'search') => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL on mount
    useEffect(() => {
        const urlValue = searchParams.get(paramName);
        if (urlValue !== null && urlValue !== state) {
            setState(urlValue);
        }
    }, []);

    // Sync URL when state changes
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentParams = Object.fromEntries(searchParams.entries());
            if (state) {
                setSearchParams({ ...currentParams, [paramName]: state });
            } else {
                const { [paramName]: removed, ...rest } = currentParams;
                setSearchParams(rest);
            }
        }, 500); // Debounce URL updates

        return () => clearTimeout(timer);
    }, [state, paramName, setSearchParams, searchParams]);
};

export default useUrlFilters;
