import { useEffect, useState } from "react";
import { getOrders } from "../api";
import type { Order } from "../types";

interface UseOrdersResult {
  data: Order[];
  loading: boolean;
  error: string | null;
}

export function useOrders(): UseOrdersResult {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        const orders = await getOrders();

        if (isMounted) {
          setData(orders);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch orders. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

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
