"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const ReferralRedirect = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    if (pathname.startsWith("/referral/")) {
      const referralAddressfromURL = pathname.split("/")[2]; // Extract referral address
      router.push(
        `/auth/register?referralAddress=${encodeURIComponent(referralAddressfromURL)}`
      );
    }
  }, [pathname, router]);

  return null;
};

export default ReferralRedirect;
