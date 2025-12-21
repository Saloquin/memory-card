import checkToken from "./checkToken.js";

export default function checkAdmin(req, res, next) {
  checkToken(req, res, () => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
}
