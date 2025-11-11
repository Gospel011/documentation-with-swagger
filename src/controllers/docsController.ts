import type { NextFunction, Request, Response } from "express";

function signup() {}

function forgotPassword() {}

function resetPassword() {}

function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.query;
  if (!email || !password)
    return res.render("login", {
      status: "failed",
      message: "Please provide your email and password to continue",
    });
  //todo: validate password
  //todo: set token
  console.log("Setting cookie");

  res.cookie(
    "token",
    Buffer.from(`${email}:${password}`).toString("base64url"),
    {
      maxAge: 10 * 60 * 1000,
      sameSite: "strict",
      secure: false,
      httpOnly: true,
    }
  );

  res.redirect(`/api/docs`);
}

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token)
    return res.redirect(
      `/api/docs/login?${new URLSearchParams({
        status: "failed",
        message: "Your session has expired, please login to continue",
      })}`
    );

  next();
}

const docsController = { login, isLoggedIn };

export default docsController;
