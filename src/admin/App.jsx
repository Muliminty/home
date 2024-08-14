import React, { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 调用后端接口
        fetch('http://localhost:3001/api')
            .then(response => {
                console.log('response',response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Admin</h1>
            <p>Message from backend: {data.message}</p>
            <p>Timestamp: {data.timestamp}</p>
        </div>
    );
}

export default App;
