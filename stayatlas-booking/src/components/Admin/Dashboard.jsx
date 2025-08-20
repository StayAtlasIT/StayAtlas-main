import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import { HomeModernIcon, CalendarDaysIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import Chart from "./Chart.jsx";
// import Noti from "./AdminNotification.jsx";
import DashHeader from "./AdminHead.jsx";
import { toast } from "react-toastify";
import axios from "@/utils/axios.js";
import { Loader } from "lucide-react";

const Dashboard = () => {

  const [stats, setStats] = React.useState({
    totalVillas: 0,
    totalUsers: 0,
    monthlyUsersStats: null,
    monthlyVillaStats: null,
    expectedPrice: 0,
    confirmedPrice: 0
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [monthlyUserStats, monthlyVillaStats, revenueStats] = await Promise.all([
          axios.get("/v1/admin/stats/monthly-users"),
          axios.get("/v1/admin/stats/monthly-villas"),
          axios.get("/v1/admin/booking-revenue-stats"),
        ]);
        if(monthlyUserStats.data?.statusCode!=200 || monthlyVillaStats.data?.statusCode!=200 || revenueStats.data?.statusCode!=200) {
          // throw new Error("Incomplete data received from API")
          setError(`Error in fetching data from the server`);
          toast.error("Error in fetching stats. Please try again later.");
          return;
        }
        // console.log("Monthly User Stats:", monthlyUserStats.data.data);
        // console.log("Monthly Villa Stats:", monthlyVillaStats.data.data);

        const revenue = revenueStats.data.data.filter((item) => item.year === 'Total')

        setStats((prev) => ({
          ...prev,
            totalVillas: monthlyVillaStats.data.data.totalCount,
            totalUsers: monthlyUserStats.data.data.totalCount,
            monthlyUsersStats: monthlyUserStats.data.data.monthlyStats,
            monthlyVillaStats: monthlyVillaStats.data.data.monthlyStats,
            expectedPrice: revenue[0].expectedRevenue || 0,
            confirmedPrice: revenue[0].confirmedRevenue || 0
        }));
      } catch (error) {
        setError("We currently are unable to fetch data from the backend")
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard stats. Please try again later.");
        setStats({
          totalVillas: 0,
          totalBookings: 0,
          currentMonthUsers: 0,
          currentMonthVillas: 0,
        });
      }finally{
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // console.log(stats)

  if(loading){
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="animate-spin"/>
      </div>
    )
  }

  if(error){
    return (
      <div className="h-full flex justify-center items-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <>
    <div><DashHeader></DashHeader></div>
    <Box sx={{ flex: 1, p: 4, position: "relative", height: "100vh", overflowY: "auto", backgroundColor: "#f9fafb" }}>
      <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
        <Card sx={{ width: 206, height: 180, borderRadius: 2, border: "1px solid #e5e7eb" }}>
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <HomeModernIcon className="h-5 w-5 text-gray-500" />
              <Typography variant="body2" color="text.secondary">Total Villas</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: "auto", fontWeight: 700 }}>{stats.totalVillas}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 206, height: 180, borderRadius: 2, border: "1px solid #e5e7eb" }}>
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
              <Typography variant="body2" color="text.secondary">Total Users</Typography>
            </Stack>
            <Typography variant="h4" sx={{ mt: "auto", fontWeight: 700 }}>{stats.totalUsers}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 206, height: 180, borderRadius: 2,overflow:"auto", border: "1px solid #e5e7eb" }}>
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <Typography variant="body2" color="text.secondary">Expected Revenue</Typography>
            </Stack>
            <Typography variant="h5" sx={{ mt: "auto", fontWeight: 700 }}>Rs. {stats.expectedPrice.toFixed(2)}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ width: 206, height: 180, borderRadius: 2,overflow:"auto", border: "1px solid #e5e7eb" }}>
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <UserGroupIcon className="h-5 w-5 text-gray-500" />
              <Typography variant="body2" color="text.secondary">Confirmed Revenue</Typography>
            </Stack>
            <Typography variant="h5" sx={{ mt: "auto", fontWeight: 700 }}>Rs. {stats.confirmedPrice.toFixed(2)}</Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Chart 
          monthlyUsersStats={stats.monthlyUsersStats} 
          monthlyVillaStats={stats.monthlyVillaStats}
        />
      </Box>
      {/* 
      <Box sx={{ mt: 4 }}>
        <Noti />
      </Box> */}
    </Box>
    </>
  );
};

export default Dashboard;