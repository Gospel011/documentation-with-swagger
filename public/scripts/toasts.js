function checkForMessage() {
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const toastContainer = document.getElementById("toast-container");
  const toast = document.getElementById("toast");
  let timeout;
  let fadeInTimeout;

  if (!!message) {
    toast.textContent = message;
    fadeInTimeout = setTimeout(() => {
      toastContainer.classList.toggle("fade-in-toast-container");
      toastContainer.classList.toggle(
        status == "failed" ? "toast-error" : "toast-success"
      );
    }, 0.5 & 1000);
    timeout = setTimeout(() => {
      toastContainer.classList.toggle("fade-in-toast-container");
      toastContainer.classList.toggle(
        status == "failed" ? "toast-error" : "toast-success"
      );
      // toastContainer.classList.toggle("toast-error");
    }, 5 * 1000);
  }

  window.addEventListener("beforeunload", () => {
    if (!!timeout) clearTimeout(timeout);
    if (!!fadeInTimeout) clearTimeout(fadeInTimeout);
  });
}

checkForMessage();
