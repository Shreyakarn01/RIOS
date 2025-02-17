import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { backendURL } from '../../utils/backendURL';

const CO2 = () => {
  const [chartData, setChartData] = useState(null);

const fetchData = async () => {
    try {
      const response = await axios.get(`${backendURL}/readings/`);
      const data = response.data;
  
      // Use only the last 10 items
      const last10Data = data.slice(-10);
  
      // Prepare data for the chart
      const labels = last10Data.map(item => new Date(item.created_at).toLocaleTimeString());
      const CO2 = last10Data.map(item => item.carbon_dioxide);
  
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'CO2',
            data: CO2,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(() => {
      fetchData();
    }, 10000); 

    return () => clearInterval(intervalId); 
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Carbon Dioxide</h2>
      <div className="w-full max-w-4xl overflow-x-auto">
        <div className="min-w-[600px] h-[400px]">
          <Line 
            data={chartData} 
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'CO2'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CO2;