interface ResponseBody<T = undefined> {
  status: "success" | "failed";
  message?: string;
  data?: T;
}
