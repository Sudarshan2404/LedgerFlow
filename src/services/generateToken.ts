import jwt from "jsonwebtoken";

export const genreatetoken = (userId: object) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!userId) {
    return "Cannot genreate a token";
  }
  // @ts-ignore
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
