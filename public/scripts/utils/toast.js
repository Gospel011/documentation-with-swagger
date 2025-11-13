function removeToastSearchParams() {
  const url = new URL(window.location.href);
  ["status", "message"].forEach((el) => url.searchParams.delete(el));

  console.log({ newUrl: url });

  window.history.replaceState({}, "", url);
}

export function toast(message, { status = "success", duration = 5 * 1000 }) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.getElementById("toast");

  let timeout;
  let fadeInTimeout;

  console.log({ duration });

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
      removeToastSearchParams();
      //   toastContainer.classList.toggle("toast-error");
    }, duration);
  }

  window.addEventListener("beforeunload", () => {
    if (!!timeout) clearTimeout(timeout);
    if (!!fadeInTimeout) clearTimeout(fadeInTimeout);
  });
}
