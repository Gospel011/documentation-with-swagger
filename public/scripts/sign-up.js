import { toast } from "./utils/toast.js";
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  const formData = new FormData(event.currentTarget);
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (password !== confirmPassword) {
    event.preventDefault();
    toast("Your password and confirm passwords don't match", {
      status: "failed",
    });
  }
});
