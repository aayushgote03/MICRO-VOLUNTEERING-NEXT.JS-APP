"use client";
import React, { useEffect, useState } from "react";
import { gettasks } from "./datafetch";
const page = () => {
  
  const [tasks, settasks] = useState([]);
  useEffect(() => {
    const gettit = async () => {
      try {
        const clientUrl = window.location.origin;
        console.log(clientUrl);
        const data = await gettasks(clientUrl);
        console.log(data);
        settasks(data);
      } catch (error) {
        console.log(error);
      }
    }; gettit();
  }, []);

  return <div>
    page1
  </div>;
};

export default page;
