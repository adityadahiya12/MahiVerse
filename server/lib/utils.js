import jwt from "jsonwebtoken";

// function to generate a JWT token
export const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};
