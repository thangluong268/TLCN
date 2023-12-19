import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // Check if localStorage is available (e.g., when running on the client side)
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "Admin") {
      // Redirect to the "/admin" page
      return redirect("/admin");
    }
  }

  // If the user is not an admin or if localStorage is not available, you can render the protected content here
  return (
    <div>
      <h1>Protected Page</h1>
      {/* Add your protected content here */}
    </div>
  );
}
