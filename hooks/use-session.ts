"use client";

import { createClient } from "@/lib/supabase";
import { useEffect, useState, useMemo } from "react";

export function useSession() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.username || "User",
          email: session.user.email || "",
          avatar: session.user.user_metadata.avatar_url,
        });
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.username || "User",
          email: session.user.email || "",
          avatar: session.user.user_metadata.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return user;
}
