"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Hide the footer completely if the user is logged in OR on an app route
  const isAppPage = pathname.startsWith("/search") || pathname.startsWith("/dashboard") || pathname.startsWith("/quiz") || pathname.startsWith("/session");
  
  if (user || isAppPage) {
    return null;
  }

  const goHome = (e) => {
    e.preventDefault();
    router.push("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 pt-16 pb-12 text-zinc-600">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="text-xl font-semibold text-secondary">
            PeerLink<span className="text-primary">AI</span>
          </Link>
          <p className="text-sm text-zinc-500">
            AI-powered tutor matching platform designed to connect you with peers based on how you learn.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wider">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/search" className="hover:text-primary transition-colors">Find a Tutor</Link></li>
            <li><Link href="/become-tutor" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
            <li><Link href="/quiz" className="hover:text-primary transition-colors">Matching Quiz</Link></li>
          </ul>
        </div>

        {/* Company / Info */}
        <div>
          <h4 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/#why-choose-us" className="hover:text-primary transition-colors">Why Choose Us</a></li>
            <li><a href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-secondary mb-4 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">Log In</Link></li>
            <li><Link href="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar with Copyright & Back to Top */}
      <div className="mx-auto max-w-6xl px-6 border-t border-zinc-200 pt-6 flex items-center justify-between">
        <p className="text-sm text-zinc-500">© 2026 PeerLinkAI. All rights reserved.</p>
        
        <button
          onClick={goHome}
          className="flex h-10 w-10 items-center justify-center rounded-default border border-zinc-300 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
          title="Back to Top / Home"
        >
          <span className="text-lg">↑</span>
        </button>
      </div>
    </footer>
  );
}