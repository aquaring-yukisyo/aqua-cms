"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, AuthUser } from "aws-amplify/auth";

/**
 * 認証状態を管理するカスタムフック
 */
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { user, loading, refetch: checkAuth };
};

