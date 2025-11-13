import fs from "node:fs/promises";
import path from "node:path";
const __dirname = import.meta.dirname;
const userDbPath = path.join(__dirname, "./users.json");

export async function getUserDb() {
  const users: User[] = JSON.parse(await fs.readFile(userDbPath, "utf-8"));
  return users;
}

export async function saveUsers(users: User[]) {
  await fs.writeFile(userDbPath, JSON.stringify(users, null, 2));
}
