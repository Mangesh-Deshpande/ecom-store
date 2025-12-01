import { Request, Response } from "express";
import UserService from "../services/user.service";

export class UserController {
  static getAllUsers = async (req: Request, res: Response) => {
    const users = UserService.getAllUsers();
    res.json({ message: "Get all users", users });
  };

  static getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", id });
    }

    res.json({ message: "Get user by id", id, user });
  };
}
