import { toast } from "./utils/toast.js";

function checkForMessage() {
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const d = searchParams.get("d");

  console.log({ status, message, d, isNaN: !!d && isNaN(d) });
  toast(message, { status, duration: !(d * 1) ? 5 * 1000 : d * 1 });
}

checkForMessage();
