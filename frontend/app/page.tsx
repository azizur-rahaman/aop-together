'use client';

import { SocialButton } from "@/components/base/buttons/social-button";
import { LandingHeroSkeleton } from "@/components/skeletons/LandingHeroSkeleton";
import { Merriweather } from "next/font/google";
import dynamic from "next/dynamic";
import { LearningLottie } from "@/components/FloatingLottie";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { auth, googleAuthProvider } from "@/lib/firebase/client";
import { api } from "@/lib/api";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      // Verify with backend
      await api.post('/auth/google', { idToken });
      
      toast.success("Signed in successfully!");
      router.push('/groups');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Error during sign-in. Please try again.");
    }
  }

  useEffect(() => {
    if (user) {
      router.push('/groups');
    }
  }, [user, router]);

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
