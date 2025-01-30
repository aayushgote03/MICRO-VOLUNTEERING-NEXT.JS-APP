'use client'
import { useEffect, useState } from 'react';

const Home = () => {
  const [data, setData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  useEffect(() => {
    // API call to fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch('api/getorganizerdata', {
          method: 'POST', // POST request
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizer_email: 'ashni@gmail.com' }), // Sending the body
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        let result = await response.json();
        console.log(result.appplicants_data);
        const mydata = result.appplicants_data

        // Ensure the result is an array before setting the state
        setData(mydata);

        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError(err.message); // Handle errors
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>
              {/* Render the properties of each object from the array */}
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </li>
          ))
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
