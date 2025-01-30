'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the desired page, e.g., /dashboard
    router.push("/auth");
  }, [router]);

  return null; // Optionally, you can return a loading spinner or a blank page
}
