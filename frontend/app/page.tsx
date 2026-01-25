'use client';

import { SocialButton } from "@/components/base/buttons/social-button";
import { Skeleton } from "@/components/ui/skeleton";
import { LandingHeroSkeleton } from "@/components/skeletons/LandingHeroSkeleton";
import Image from "next/image";
import { Merriweather } from "next/font/google";
import ScrollVelocity from "@/components/ScrollVelocity";
import dynamic from "next/dynamic";
import { LearningLottie } from "@/components/FloatingLottie";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const merriweather = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  weight: ["800"]
})

// Dynamic import to prevent hydration issues with Math.random()
const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // Mock login - in real app this would authenticate
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      toast.success("Signed in successfully!");
      router.push('/groups');
    }, 1000);
  }

  if (isLoading) {
    return (
      <main className="bg-grid w-full h-screen">
        <Navbar />
        <LandingHeroSkeleton />
      </main>
    )
  }

  return (
    <main className="bg-grid bg-[#FAF9FE] w-full h-screen ">
      <Navbar />
      <div><Toaster /></div>

      <section className="flex items-center justify-center mt-20">
        <div className="relative z-10 text-center w-full h-full flex flex-col items-center justify-center pointer-events-none">

          <LearningLottie
            className="h-60"
          />
          <h1 className={`text-5xl font-bold ${merriweather.className}`}>
            Study Together in Real Time.
          </h1>
          <br />

          <h2 className="text-large font-medium">
            Connect with others in virtual study rooms.
            Learn, share, and collaborate in real time.
          </h2>

          <br />
          <div className="pointer-events-auto">
            <SocialButton
              onClick={handleLogin}
              social="google" theme="brand">
              Sign in with Google
            </SocialButton>
          </div>
        </div>
      </section>
    </main>
  );
}
