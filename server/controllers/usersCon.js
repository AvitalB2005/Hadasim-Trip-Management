import usersMod from '../models/usersMod.js';
export async function getUserById(req, res) {
  const userId = req.user.id;
  try {
    const user = await usersMod.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
}