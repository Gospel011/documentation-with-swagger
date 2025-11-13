import { getUserDb, saveUsers } from "db/users/users_db.js";
import type { NextFunction, Request, Response } from "express";
import isValidName from "utils/name_validator.js";
import bcrypt from "bcrypt";
import { signJwt, verifyJwt } from "./userController.js";

async function signup(req: Request, res: Response) {
  const { firstName, lastName, email, password, confirmPassword } = req.query;

  console.log({ firstName, lastName, email, password, confirmPassword });
  if (!firstName || !lastName || !email || !password) {
    res.render("sign-up");
    return;
  }

  if (!isValidName(firstName as string) || !isValidName(lastName as string)) {
    res.render("sign-up", {
      status: "failed",
      message: "Your name must contain valid characters",
    });
    return;
  }

  const users = await getUserDb();

  const previousAccount = users.find((user) => user.email == email);

  if (previousAccount?.role == "developer") {
    res.redirect(
      `/api/docs/sign-up?${new URLSearchParams({
        status: "failed",
        message:
          previousAccount.status == "pending"
            ? "Your developer account is still pending approval. You will be notified via email when it is approved"
            : previousAccount.status == "approved"
            ? "You are already a developer. Please login with your credentials"
            : "You have been removed from being a developer. Please contact your HR or Manager.",
        d: `${10 * 1000}`,
      })}`
    );
    return;
  }
  let newDeveloper: User;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  if (!previousAccount) {
    newDeveloper = {
      id: users.length + 1,
      firstName: firstName as string,
      lastName: lastName as string,
      email: (email as string).trim().toLowerCase(),
      password: hashedPassword,
      role: "developer",
      status: "pending",
    };
  } else {
    newDeveloper = {
      ...previousAccount,
      status: "pending",
      password: hashedPassword,
    };
  }

  users.push(newDeveloper);
  await saveUsers(users);

  res.redirect(
    `/api/docs/login?${new URLSearchParams({
      status: "success",
      message:
        "Your developer account has been created and is pending approval. You will be notified via email when it is approved",
      d: `${10 * 1000}`,
    })}`
  );
}

function forgotPassword() {}

function resetPassword() {}

async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.query;
  if (!email || !password) return res.render("login");
  /**
   * {
      status: "failed",
      message: "Please provide your email and password to continue",
    }
   */
  //todo: validate password
  const users = await getUserDb();
  const user = users.find(
    (el) => el.email == email.toString().trim().toLowerCase()
  );
  if (!user) {
    res.render("login", {
      status: "failed",
      message: "Email or password is incorrect",
      email: email as string,
    });
    return;
  }

  const isValidPassword = await bcrypt.compare(
    password as string,
    user.password
  );
  if (!isValidPassword) {
    res.render("login", {
      status: "failed",
      message: "Email or password is incorrect",
      email: email as string,
    });
    return;
  }

  const token = signJwt(user);

  //todo: set token
  console.log("Setting cookie");

  res.cookie("token", token, {
    maxAge: 10 * 60 * 1000,
    sameSite: "strict",
    secure: false,
    httpOnly: true,
  });

  res.redirect(`/api/docs`);
}

async function allowDevelopers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const token = req.cookies?.token;
  // if (!token)
  //   return res.redirect(
  //     `/api/docs/login?${new URLSearchParams({
  //       status: "failed",
  //       message: "Your session has expired, please login to continue",
  //     })}`
  //   );

  const user = req.user;

  if (user?.role !== "developer")
    return res.redirect(
      `/api/docs/login?${new URLSearchParams({
        status: "failed",
        message:
          "You are not allowed to access this documentation. Please create a developer account to continue",
      })}`
    );
  if (user?.status !== "approved")
    return res.redirect(
      `/api/docs/login?${new URLSearchParams({
        status: "failed",
        message:
          user?.status == "pending"
            ? "Your developer account is in review and pending approval. You will be notified via email when it is approved."
            : "You have been removed from being a developer. Please contact your HR or Manager.",
      })}`
    );

  next();
}

const docsController = {
  login,
  allowDevelopers,
  signup,
  forgotPassword,
  resetPassword,
};

export default docsController;
