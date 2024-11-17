import { useState, useEffect } from 'react';

// custom hooks in react need to start with "use"
const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    // Runs first part on render. Then watches "name" and only runs the function if it's changed
    useEffect(() => {

        const abortCont = new AbortController();

        setTimeout(() => {
            // We fetch the data
            fetch(url, { signal: abortCont.signal })
                .then(res => {
                    //Response object
                    if (!res.ok) {
                        throw Error('could not fetch the data')
                    }
                    return res.json()
                })
                .then(data => {
                    // getting the data
                    setData(data)
                    setIsPending(false);
                    setError(null);
                })
                // this catches any network error and fires a function
                .catch(err => {
                    if (err.main === 'AbortError') {
                        console.log("Fetch aborted")
                    } else {
                        setIsPending(false)
                        setError(err.message);
                    }
                })
        }, 1000);

        return () => abortCont.abort();

    }, [url]);

    return { data, isPending, error }
}

export default useFetch;