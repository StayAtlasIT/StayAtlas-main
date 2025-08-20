import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Custom tooltip to show formatted date and values
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black border border-gray-700 p-4 rounded shadow-lg">
        <p className="font-bold text-white">{data.fullMonth}</p>
        <p className="text-[#8884d8]">Users: {data.users}</p>
        <p className="text-[#82ca9d]">Villas: {data.villas}</p>
      </div>
    );
  }
  return null;
};

const Chart = ({ monthlyUsersStats, monthlyVillaStats }) => {
  if (!monthlyUsersStats || !monthlyVillaStats) {
    return (
      <div className='flex justify-center items-center h-[90%] text-gray-400'>
        No Data To Display Chart
      </div>
    );
  }

  // Generate last 12 months array in chronological order
  const last12Months = useMemo(() => {
    const months = [];
    const date = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Start from current month and go back 11 months
    for (let i = 11; i >= 0; i--) {
      const tempDate = new Date(date);
      tempDate.setMonth(date.getMonth() - i);
      
      const year = tempDate.getFullYear();
      const monthNum = tempDate.getMonth();
      const monthKey = `${year}-${(monthNum + 1).toString().padStart(2, '0')}`;
      
      months.push({
        key: monthKey,
        name: monthNames[monthNum],
        fullMonth: tempDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
    
    return months;
  }, []);

  // Merge stats into predefined month structure
  const data = useMemo(() => {
    return last12Months.map(month => {
      const userEntry = monthlyUsersStats.find(entry => entry.month === month.key);
      const villaEntry = monthlyVillaStats.find(entry => entry.month === month.key);
      
      return {
        name: month.name,
        fullMonth: month.fullMonth,
        users: userEntry ? userEntry.count : 0,
        villas: villaEntry ? villaEntry.count : 0
      };
    });
  }, [monthlyUsersStats, monthlyVillaStats, last12Months]);

  return (
    <div className="w-full max-w-3xl p-6 bg-black" style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorVillas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="#ffffff" 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#ffffff" 
            tickLine={false}
            axisLine={false}
          />
          <CartesianGrid 
            stroke="#444" 
            horizontal={true} 
            vertical={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="users" 
            name="Users"
            stroke="#8884d8" 
            fill="url(#colorUsers)" 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="villas" 
            name="Villas"
            stroke="#82ca9d" 
            fill="url(#colorVillas)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;