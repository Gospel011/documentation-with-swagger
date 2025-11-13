import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserDb, saveUsers } from "db/users/users_db.js";
const __dirname = import.meta.dirname;
const userDbPath = path.join(__dirname, "../db/users.json");

// const users: User[] = [];

// async function wait(time_in_milliseconds: number) {
//   return await new Promise((resolve) =>
//     setTimeout(resolve, time_in_milliseconds)
//   );
// }

export function verifyJwt(token: string) {
  const jwtKid = jwt.decode(token, { complete: true })?.header.kid;
  if (!jwtKid) {
    return;
  }

  const KEYS_FILE: KeysFileType = getKeyStore();

  const verifiedPayload = jwt.verify(
    token,
    KEYS_FILE[jwtKid as KeysFileTypeKeyName]
  ) as JwtPayload;

  return verifiedPayload;
}

async function isLoggedIn(
  req: Request,
  res: Response<ResponseBody>,
  next: NextFunction
) {
  const authorization = req.headers.authorization;
  const cookieAuthToken = req.cookies.token;
  const ssr = req.ssr;

  if (!authorization && !cookieAuthToken) {
    return ssr
      ? res.redirect(
          `/api/docs/login?${new URLSearchParams({
            status: "failed",
            message: "Please login to continue",
          })}`
        )
      : res.status(401).json({
          status: "failed",
          message: "Please login to continue",
        });
  }
  const splitAuth: string[] = `${
    cookieAuthToken ? `Bearer ${cookieAuthToken}` : authorization
  }`!
    .split("Bearer")
    .map((el) => el.trim());
  if (splitAuth.length != 2) {
    return ssr
      ? res.redirect(
          `/api/docs/login?${new URLSearchParams({
            status: "failed",
            message: "Invalid auth",
          })}`
        )
      : res.status(401).json({
          status: "failed",
          message: "Invalid auth",
        });
  }
  const token: string = splitAuth[1]!;

  try {
    const verifiedPayload = verifyJwt(token);

    const users = await getUserDb();
    const user = users.find((el) => el.id == verifiedPayload?.id);

    if (!user) {
      return ssr
        ? res.redirect(
            `/api/docs/login?${new URLSearchParams({
              status: "failed",
              message:
                "You are not allowed to access this documentation. Please create a developer account to continue",
            })}`
          )
        : res.status(404).json({
            status: "failed",
            message: "This user does not exist",
          });
    }

    req.user = user;
    next();
  } catch (error: any) {
    ssr
      ? res.redirect(
          `/api/docs/login?${new URLSearchParams({
            status: "failed",
            message:
              error.name == "TokenExpiredError"
                ? "Please login to continue"
                : "Invalid auth...",
          })}`
        )
      : res.status(403).json({
          status: "failed",
          message:
            error.name == "TokenExpiredError"
              ? "Please login to continue"
              : "Invalid auth...",
        });
  }
}

function getKeyStore() {
  const KEYS_FILE: KeysFileType = JSON.parse(
    Buffer.from(process.env.KEYS_FILE, "base64").toString("utf8")
  );

  return KEYS_FILE;
}

export function signJwt(user: Partial<User>): string {
  if (!user.id) throw new Error("Invalid user data.");
  const KEYS_FILE: KeysFileType = getKeyStore();
  const token = jwt.sign(user, KEYS_FILE.key_1, {
    algorithm: "HS256",
    expiresIn: "30m",
    keyid: "key_1",
    subject: user.id.toString(),
  });

  return token;
}

function ensureRequestBodyHasFields(fieldsToAllow: string[]) {
  return (
    req: Request<any, any, { [key: string]: any }>,
    res: Response<ResponseBody>,
    next: NextFunction
  ) => {
    const requestBodyKeys = Object.keys(req.body ?? {});

    for (const key of fieldsToAllow) {
      if (!requestBodyKeys.includes(key))
        return res.status(400).json({
          status: "failed",
          message: `${key} is required, please provide it to continue.`,
        });
    }

    next();
  };
}

async function createUser(
  req: Request<any, ResponseBody, Omit<User, "id">>,
  res: Response<ResponseBody>
) {
  const users = await getUserDb();
  const user = req.body;
  const hasCreatedAccountBefore = !!users.find((el) => el.email == user.email);

  if (hasCreatedAccountBefore) {
    return res.status(400).json({
      status: "failed",
      message: "You already have an account, please login with your details.",
    });
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser: User = {
    ...user,
    email: user?.email.trim().toLowerCase(),
    id: users.length + 1,
    password: hashedPassword,
    role: "user",
    status: "approved",
  };
  users.push(newUser);
  await saveUsers(users);

  res.status(200).json({
    status: "success",
    message: "User created successfully",
  });
}

async function login(
  req: Request<any, any, Pick<User, "email" | "password">>,
  res: Response<ResponseBody<{ user: Partial<User> }>>
) {
  const users = await getUserDb();
  const { email, password } = req.body;
  let user = users.find((el) => el.email == email);
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "Email or password incorrect" });
  }
  const hasValidPassword = await bcrypt.compare(password, user.password);
  if (!hasValidPassword) {
    return res
      .status(404)
      .json({ status: "failed", message: "Email or password incorrect." });
  }

  let newUser: Partial<User> = user;
  delete newUser.password;

  const jwt = signJwt(newUser);

  res.set("token", jwt);

  res.status(200).json({ status: "success", data: { user: newUser } });
}

async function getProfile(
  req: Request<{ id: string }>,
  res: Response<ResponseBody<{ user: Partial<Omit<User, "password">> }>>
) {
  const users = await getUserDb();
  const user: Partial<User> | undefined = users.find(
    (el) => el.id == Number(req.params.id)
  );
  if (!user) {
    return res
      .status(404)
      .json({ status: "failed", message: "This user does not exist" });
  }

  delete user.password;

  res.status(200).json({
    status: "success",
    data: {
      user: user,
    },
  });
}

function getLoggedInUserProfile(
  req: Request,
  res: Response<ResponseBody<{ user: Partial<User> }>>
) {
  delete req.user?.password;
  res.status(200).json({ status: "success", data: { user: req.user! } });
}

async function updateUser(
  req: Request<any, any, Partial<User>>,
  res: Response<ResponseBody<{ user: Partial<User> }>>
) {
  const users = (await getUserDb()).map((el) => {
    if (el.id == req.user?.id) {
      const newUser = {
        ...el,
        ...{
          firstName: req.body.firstName ?? el.firstName,
          lastName: req.body.lastName ?? el.lastName,
        },
      };

      req.user = newUser;
      return newUser;
    } else {
      return el;
    }
  });

  await saveUsers(users);

  delete req.user?.password;

  res.status(200).json({
    status: "success",
    message: "User profile updated successfully",
    data: {
      user: req.user!,
    },
  });
}

async function deleteUserAccount(req: Request, res: Response<ResponseBody>) {
  const user = req.user!;
  const updatedUsers = (await getUserDb()).filter((el) => el.id != user.id);
  saveUsers(updatedUsers);
  res.status(200).json({
    status: "success",
    message: "Your account has been deleted successfully",
  });
}

export default {
  ensureRequestBodyHasFields,
  isLoggedIn,
  createUser,
  login,
  getProfile,
  getLoggedInUserProfile,
  updateUser,
  deleteUserAccount,
};
