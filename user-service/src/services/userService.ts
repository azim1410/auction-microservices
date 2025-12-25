import User from "../models/User";
import { hashPassword } from "../utils/hash";

export const createUser = async ({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: "admin" | "seller" | "bidder" | "moderator" | "guest";
}) => {
  const hashedData = await hashPassword(password);
  return User.create({ username, password: hashedData, role });
};

export const findUserByUsername = async (username: string) => {
  return User.findOne({ where: { username } });
};

export const findAllUsersData = async () => {
  return User.findAll({
    order: [["createdAt", "DESC"]],
  });
};
