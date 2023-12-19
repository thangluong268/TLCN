"use client";
import { redirect } from "next/navigation";
import React from "react";

export default function protectedPage() {
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role == "Admin") {
      return redirect("/admin");
    }
  }, []);
}
