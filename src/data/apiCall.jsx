// dependencies
import { useState, useEffect } from 'react';
import axios from 'axios';



// static API Call for Seatgeek

const endpoint = 'events?geoip=true&range=30mi&per_page=5000'

const Data = () => {
  const [apiResponse, setApiResponse] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.seatgeek.com/2/${endpoint}`, {
          params: {
            client_id: import.meta.env.VITE_SEATGEEK_CLIENT_ID
          }
        });
        setApiResponse(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiResponse({ error: 'Failed to load data' });
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    </div>
  );
};

export default Data;