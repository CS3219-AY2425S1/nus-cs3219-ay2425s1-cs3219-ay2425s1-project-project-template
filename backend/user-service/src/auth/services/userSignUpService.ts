import User from '../../models/user';
import { hashPassword } from '../utils/passwordHasher';

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export const registerUser = async ({ name, email, password }: RegisterInput) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    return newUser;
};
