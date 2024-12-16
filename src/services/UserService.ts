import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AppDataSource } from "../config/database";
import nodemailer from "nodemailer";
import validator from 'validator';
import Joi from 'joi';

const userRepository = AppDataSource.getRepository(User);

const registerUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string().optional(),
    address: Joi.string().optional(),
    image: Joi.string().optional()
});


export async function registerUser(
    name: string,
    email: string,
    password: string,
    phoneNumber?: string,
    address?: string,
    image?: string
) {
    // Validate the input data
    const { error } = registerUserSchema.validate({ name, email, password, phoneNumber, address, image });

    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }

    // Check if the email already exists
    const existingUser = await userRepository.findOne({
        where: { email }
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user entity
    const newUser = userRepository.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        image,
    });

    try {
        // Save the user to the database
        await userRepository.save(newUser);
    } catch (error) {
        console.error("Error saving user:", error);
        throw new Error("Registration failed. Please try again.");
    }

    // Create a JWT token for the user
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });

    // Return user data and token
    return {
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token,
    };
}

export async function loginUser(email: string, password: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return { user, token };
}

export async function recoverPassword(email: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
        throw new Error("User with this email does not exist");
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

    // Configure nodemailer for sending the reset email
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const resetLink = `https://yourapp.com/reset-password?token=${resetToken}`;
    const mailOptions = {
        from: "Your App <noreply@yourapp.com>",
        to: email,
        subject: "Password Recovery",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    return { message: "Password recovery email sent" };
}

export async function getUserProfile(userId: number) {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new Error("User not found");
    }

    // Return only the profile details without sensitive information
    const { id, name, email, phoneNumber, address, image } = user;
    return { id, name, email, phoneNumber, address, image };
}

export async function editUserProfile(userId: number, updates: { name?: string; email?: string; phoneNumber?: string; address?: string; image?: string; }) {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
        throw new Error("User not found");
    }

    Object.assign(user, updates);
    await userRepository.save(user);
    return { message: "Profile updated successfully", user };
}

export async function getAllUsers() {
    const users = await userRepository.find();
    return users.map(user => {
        const { id, name, email, phoneNumber, address, image } = user;
        return { id, name, email, phoneNumber, address, image };
    });
}
