import { redirect } from "next/navigation";

export default function protectedPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role == "Admin") {
    return redirect("/admin");
  }
}
