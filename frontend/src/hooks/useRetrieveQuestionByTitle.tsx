import { useState, useEffect } from 'react';

interface YourHookProps {
    // Define your hook's props here
}

interface YourHookData {
    // Define the data structure returned by your hook here
}

const useYourHook = (props: YourHookProps): YourHookData => {
    const [data, setData] = useState<YourHookData | null>(null);

    useEffect(() => {
        // Add your hook's logic here
        // This will be executed when the component using the hook mounts or when the props change

        // Example: Fetch data from an API
        const fetchData = async () => {
            try {
                const response = await fetch('your-api-endpoint');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Clean up any resources (e.g., subscriptions) here
        return () => {
            // Example: Cancel any pending API requests
            // cleanup();
        };
    }, [props]); // Add any dependencies that should trigger a re-run of the effect here

    return data;
};

export default useYourHook;