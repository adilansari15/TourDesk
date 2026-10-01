import jwt from 'jsonwebtoken';

/**
 * Generate a signed JSON Web Token (JWT)
 * @param {string} userId - The MongoDB User ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
    process.exit(1);
  }

  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

export default generateToken;

