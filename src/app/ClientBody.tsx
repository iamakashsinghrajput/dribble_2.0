"use client";

import { useEffect } from "react";

export default function ClientBody() {
  useEffect(() => {
    const onResize = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight}px`,
      );
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return null;
}
