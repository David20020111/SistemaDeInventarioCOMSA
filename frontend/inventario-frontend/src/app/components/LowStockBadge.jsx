"use client";
import { useEffect, useState } from "react";

export default function LowStockBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let mounted = true;
    fetch(`http://localhost:3000/inventario/bajo/count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) return Promise.resolve({ total: 0 });
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setCount(data.total || 0);
      })
      .catch(() => {
        if (mounted) setCount(0);
      });

    return () => { mounted = false; };
  }, []);

  if (!count) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">
      {count}
    </span>
  );
}
