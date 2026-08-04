import { useEffect, useState } from "react";
import { getUsers } from "../api";
import type { User } from "../types";

interface UseUsersResult {
  data: User[];
  loading: boolean;
  error: string | null;
}

export function useUsers(): UseUsersResult {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        const users = await getUsers();

        if (isMounted) {
          setData(users);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch users. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
  };
}
