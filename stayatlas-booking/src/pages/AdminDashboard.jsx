import React, { Suspense, useEffect, useState } from "react";
import Sidebar from "../components/Admin/Sidebar.jsx"
// import { Loader } from "lucide-react";
// import Dashboard from "@/components/Admin/Dashboard.jsx";
// import VillaManagement from "@/components/Admin/VillaManagement.jsx";
// import BookingManagement from "@/components/Admin/BookingManagement.jsx";
// import UserManagement from "@/components/Admin/UserManagement.jsx";
// import ExperienceManagement from "@/components/Admin/ExperienceManagement.jsx";

const Dashboard = React.lazy(() => import("../components/Admin/Dashboard.jsx"))
const VillaManagement = React.lazy(() => import("../components/Admin/VillaManagement.jsx"));
const BookingManagement = React.lazy(() => import("../components/Admin/BookingManagement.jsx"));
const UserManagement = React.lazy(() => import("../components/Admin/UserManagement.jsx"));
const ExperienceManagement = React.lazy(() => import("../components/Admin/ExperienceManagement.jsx"));
const OfferManagement = React.lazy(() => import("../components/Admin/OfferManagement.jsx"));
  

const AdminDashboard = () => {

  let currentTab = localStorage.getItem("adminTab");
  if(!currentTab){
    localStorage.setItem("adminTab","Dashboard");
    currentTab = localStorage.getItem("adminTab")
  }
  const [selectedPage, setSelectedPage] = useState(currentTab);
  

  useEffect(() => {
    localStorage.setItem("adminTab",selectedPage)
  },[selectedPage])

  

    const renderContent = () => {
      switch (selectedPage) {
        case "Dashboard":
          return <Dashboard />
        case "VillaManagement":
          return <VillaManagement />;
        case "BookingManagement":
          return <BookingManagement />;
        case "UserManagement":
          return <UserManagement />;
        // case "ContentManagement":
          // return <ContentManagement></ContentManagement>;
        case "ExperienceManagement":
          return <ExperienceManagement />;
           case "OfferManagement":
          return <OfferManagement />;
        default:
          return <p>Select a page</p>;
    }
  }

    return (
      <>
        <div className="flex">
          <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage}></Sidebar>
          <div  className="flex-1 p-6 overflow-y-auto h-screen">
            <Suspense fallback={<div className="">Loading...</div>}>
              {renderContent()}
            </Suspense>
            {/* {renderContent()} */}
          </div>
        </div>
      </>
    );
  };
  
export default AdminDashboard;
  