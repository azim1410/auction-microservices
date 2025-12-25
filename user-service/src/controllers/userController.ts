import { Request, Response } from "express";
import { createUser, findAllUsersData, findUserByUsername } from "../services/userService";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password is required" });
    }
    const existingUser = await findUserByUsername(username);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const user = await createUser({ username, password, role });
    return res
      .status(200)
      .json({ id: user.id, username: user.username, role: user.role });
  } catch (err: any) {
    return res.status(500).json({
      message: "somethnig went wrong creating user",
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // @ts-ignore type-error
    const valid = comparePassword(password, user?.password);

    if (!valid) {
      return res
        .status(401)
        .json({ message: "Incorrect Username or Password" });
    }
 // @ts-ignore type-error
    console.log("login data ----- ", user.id, user.username, user.role);
    // @ts-ignore type-error
    const userToken = generateToken({
      // @ts-expect-error
      id: user.id,
      // @ts-expect-error
      username: user.username,
      // @ts-expect-error
      role: user.role,
    });

    console.log("userToken", userToken);

    return res.status(200).json({ userToken });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {

    const data = await findAllUsersData();
    console.log("Data ---- ", data);

    return res.status(200).json({message: 'All user data', data: data});

  } catch(err: any) {
    return res.status(500).json({message: 'Something went wrong when getting all users data'});
  }
}