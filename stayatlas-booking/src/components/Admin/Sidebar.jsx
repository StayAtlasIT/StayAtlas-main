// import React from "react";
// // import logo from "../../assets/stay.jpg";
// import { useNavigate } from 'react-router-dom';

// import {
//   Card, 
//   Typography,
//   List,
//   ListItem,
//   ListItemPrefix,
//   ListItemSuffix,
//   Chip,
//   Accordion,
//   AccordionHeader,
//   AccordionBody,
//   Alert,
// } from "@material-tailwind/react"

// import {
//   PresentationChartBarIcon,
//   UserCircleIcon,
//   HomeModernIcon,
//   IdentificationIcon,
//   CurrencyRupeeIcon,
//   VideoCameraIcon,
// } from "@heroicons/react/24/solid"

// import {
//   ChevronRightIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline"

// export default function Sidebar({selectedPage,setSelectedPage}) {
//     const [open, setOpen] = React.useState(0);
//     const [openAlert, setOpenAlert] = React.useState(true);

//     const navigate = useNavigate();
//     const handleOpen = (value) => {
//         setOpen(open === value ? 0 : value);
//     };

//     return (
//         <Card className="h-[calc(100vh-2rem)] w-full max-w-[30rem] p-4 shadow-xl shadow-blue-gray-900/5">
//             <div className="mb-2 flex items-centre gap-4 p-4" onClick={() => navigate('/')}>
//                 <img src={"https://res.cloudinary.com/dccqaw5pu/image/upload/v1749914379/StayAtlasVillaImages/ur4ipdfm6c1twmwkytrc.jpg"} alt="logo stay atlas" className="h-12 w-12"/> 
//                 <Typography variant="h4" color="green">
//                     Admin Stay Atlas
//                 </Typography>
//             </div>

//             <List className="cursor-pointer">
//                 <Accordion
//                    open = {open === 1}
//                    icon={
//                     <ChevronDownIcon
//                     strokeWidth={2.5}
//                     className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
//                     />
//                    }
//                 >
//                     <ListItem className={`p-5 hover:bg-green-300 transition-all rounded-md ${selectedPage==="Dashboard" ? "bg-green-300" : ""}`} onClick={() => setSelectedPage("Dashboard")}>
//                         <ListItemPrefix>
//                             <PresentationChartBarIcon className="h-6 w-6" />
//                         </ListItemPrefix>
//                         <Typography variant="h5" color="green" className="mr-auto font-normal">
//                             Dashboard
//                         </Typography>
//                     </ListItem>
//                     <ListItem className={`p-5 hover:bg-green-300 transition-all rounded-md ${selectedPage==="VillaManagement" ? "bg-green-300" : ""}`} onClick={() => setSelectedPage("VillaManagement")}>
//                         <ListItemPrefix>
//                             <HomeModernIcon className="h-6 w-6" />
//                         </ListItemPrefix>
//                         <Typography variant="h5" color="green" className="mr-auto font-normal">
//                             Villa Management
//                         </Typography>
//                     </ListItem>
//                     <ListItem className={`p-5 hover:bg-green-300 transition-all rounded-md ${selectedPage==="BookingManagement" ? "bg-green-300" : ""}`} onClick={() => setSelectedPage("BookingManagement")}>
//                         <ListItemPrefix>
//                             <IdentificationIcon className="h-6 w-6" />
//                         </ListItemPrefix>
//                         <Typography variant="h5" color="green" className="mr-auto font-normal">
//                             Booking Management
//                         </Typography>
//                     </ListItem>
//                     <ListItem className={`p-5 hover:bg-green-300 transition-all rounded-md ${selectedPage==="UserManagement" ? "bg-green-300" : ""}`} onClick={() => setSelectedPage("UserManagement")}>
//                         <ListItemPrefix>
//                             <UserCircleIcon className="h-6 w-6" />
//                         </ListItemPrefix>
//                         <Typography variant="h5" color="green" className="mr-auto font-normal">
//                             User Management
//                         </Typography>
//                     </ListItem>
//                     <ListItem className={`p-5 hover:bg-green-300 transition-all rounded-md ${selectedPage==="ExperienceManagement" ? "bg-green-300" : ""}`} onClick={() => setSelectedPage("ExperienceManagement")}>
//                         <ListItemPrefix>
//                             <VideoCameraIcon className="h-6 w-6" />
//                         </ListItemPrefix>
//                         <Typography variant="h5" color="green" className="mr-auto font-normal">
//                             Experience Management
//                         </Typography>
//                     </ListItem>
                    

//                 </Accordion>
//             </List>
//         </Card>
//     )
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  IconButton,
  Drawer,
} from "@material-tailwind/react";

import {
  PresentationChartBarIcon,
  UserCircleIcon,
  HomeModernIcon,
  IdentificationIcon,
  VideoCameraIcon,
  Bars3Icon,
  XMarkIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar({ selectedPage, setSelectedPage }) {
  const [collapsed, setCollapsed] = useState(false); // desktop toggle
  const [openDrawer, setOpenDrawer] = useState(false); // mobile drawer
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <PresentationChartBarIcon className="h-7 w-7" /> },
    { name: "VillaManagement", icon: <HomeModernIcon className="h-7 w-7" /> },
    { name: "BookingManagement", icon: <IdentificationIcon className="h-7 w-7" /> },
    { name: "UserManagement", icon: <UserCircleIcon className="h-7 w-7" /> },
    { name: "ExperienceManagement", icon: <VideoCameraIcon className="h-7 w-7" /> },
    { name: "OfferManagement", icon: <TagIcon className="h-7 w-7" /> },
  ];

  const SidebarContent = (
    <div
  className={`h-full ${
    collapsed ? "w-16" : "w-68"
  } transition-all duration-300 bg-white shadow-xl shadow-blue-gray-900/5 flex flex-col relative`}
>

      <div className="flex items-center justify-between p-4 border-b">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => {
            navigate("/");
            setOpenDrawer(false);
          }}
        >
          <img
            src="https://res.cloudinary.com/dccqaw5pu/image/upload/v1749914379/StayAtlasVillaImages/ur4ipdfm6c1twmwkytrc.jpg"
            alt="Stay Atlas Logo"
            className="h-8 w-8 rounded"
          />
          {!collapsed && (
            <Typography variant="h5" color="green">
              Admin StayAtlas
            </Typography>
          )}
        </div>
        {!collapsed && (
          <IconButton variant="text" className="md:hidden" onClick={() => setOpenDrawer(false)}>
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        )}
      </div>

      <List>
  {menuItems.map((item) => (
    <ListItem
  key={item.name}
  className={`transition-all font-bold rounded-md
    ${selectedPage === item.name ? "bg-green-300" : ""}
    hover:bg-green-300
    ${collapsed ? "w-12 h-12 justify-center items-center flex" : ""}
  `}
  onClick={() => {
    setSelectedPage(item.name);
    setOpenDrawer(false);
  }}
>

      <ListItemPrefix
  className={`relative group ${
    collapsed ? "flex justify-center items-center w-full h-full ml-4" : ""
  }`}
>
  {item.icon}
  {collapsed && (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:block whitespace-nowrap text-white text-xs px-2 py-1 rounded shadow">
      {/* {item.name.replace(/([A-Z])/g, " $1").trim()} */}
    </div>
  )}
</ListItemPrefix>

      {!collapsed && item.name.replace(/([A-Z])/g, " $1").trim()}
    </ListItem>
  ))}
</List>




      {/* Collapse Button (Bottom Right Always Visible) */}
<div className="absolute bottom-4 right-3">
  <IconButton
    variant="text"
    onClick={() => setCollapsed(!collapsed)}
    className="text-green-700"
  >
    {collapsed ? <Bars3Icon className="h-7 w-7" /> : <XMarkIcon className="h-7 w-7" />}
  </IconButton>
</div>

    </div>
  );

  return (
    <div className="flex">
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-2">
        <IconButton variant="text" onClick={() => setOpenDrawer(true)}>
          <Bars3Icon className="h-7 w-7 text-green-800" />
        </IconButton>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} className="md:hidden">
        {SidebarContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen">
        <Card className="h-full transition-all duration-300">
          {SidebarContent}
        </Card>
      </div>
    </div>
  );
}
