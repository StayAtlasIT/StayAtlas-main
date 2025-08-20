import React from 'react';
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/footer'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1 h-full'>
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        {/* The footer is now a full-width component with its internal content centered. */}
        <Footer />
      </div>
    </div>
  )
}
export default MainLayout;

// if needed

// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from '../components/Header';
// import Footer from '../components/footer';

// const MainLayout = () => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-1 h-full">
//         <div className="mx-auto w-full max-w-screen-2xl">
//           <Header />
//         </div>
//         <main className="flex-grow mx-auto w-full max-w-screen-2xl">
//           <Outlet />
//         </main>
//         <div className="mx-auto w-full max-w-screen-2xl">
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
