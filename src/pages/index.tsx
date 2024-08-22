"use client";
import RootLayout from "../component/layout/Layout";
import Sidebar from "../component/layout/Sidebar";
import { Inter } from "next/font/google";
import  Login from './login'
import Button from "../extra/Button";

const inter = Inter({ subsets: ["latin"] });
const Home = () => {
  return (
    // <main>
    //   <h1 className="text-5xl font-bold text-gray-900 leading-[1.4] mb-5">
    //     Demo project
    //   </h1>
    //   <p className="text-2xl text-gray-700">Nested layouts in Next.js</p>
    // </main>
    <Login/>
  );
};

// Home.getLayout = (page) => {
//   return (
//     <RootLayout>
//       <Sidebar>{page} </Sidebar>
//     </RootLayout>
//   );
// };

export default Home;
