import { desc, eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { usertable } from "../db/schema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await db
      .select({
        user_id: usertable.user_id,
        email: usertable.email,
        name: usertable.name,
        first_name: usertable.first_name,
        is_admin: usertable.is_admin,
        created_at: usertable.created_at,
      })
      .from(usertable)
      .orderBy(desc(usertable.created_at));

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db
      .select({
        user_id: usertable.user_id,
        email: usertable.email,
        name: usertable.name,
        first_name: usertable.first_name,
        is_admin: usertable.is_admin,
        created_at: usertable.created_at,
      })
      .from(usertable)
      .where(eq(usertable.user_id, id))
      .get();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db
      .select()
      .from(usertable)
      .where(eq(usertable.user_id, id))
      .get();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_admin) {
      return res.status(403).json({ error: "Cannot delete an admin user" });
    }

    await db.delete(usertable).where(eq(usertable.user_id, id));

    return res
      .status(200)
      .json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
