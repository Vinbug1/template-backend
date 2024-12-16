import * as express from "express";
import {
    registerUser,
    loginUser,
    recoverPassword,
    getUserProfile,
    editUserProfile,
    getAllUsers,
} from "../services/UserService";

// Create a new router
const router = express.Router();

// Define types for request and response
interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    image: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

interface RecoverPasswordRequestBody {
    email: string;
}

interface UpdateUserProfile {
    name?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    image?: string;
}

// User Registration
router.post("/register", async (req: express.Request<{}, {}, RegisterRequestBody>, res: express.Response) => {
    try {
        const { name, email, password, phoneNumber, address, image } = req.body;
        const result = await registerUser(name, email, password, phoneNumber, address, image);
        res.status(201).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// User Login
router.post("/login", async (req: express.Request<{}, {}, LoginRequestBody>, res: express.Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Password Recovery
router.post("/recover-password", async (req: express.Request<{}, {}, RecoverPasswordRequestBody>, res: express.Response) => {
    try {
        const { email } = req.body;
        const result = await recoverPassword(email);
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get User Profile
router.get("/profile/:id", async (req: express.Request<{ id: string }>, res: express.Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const profile = await getUserProfile(userId);
        res.status(200).json(profile);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Edit User Profile
router.put("/profile/:id", async (req: express.Request<{ id: string }, {}, UpdateUserProfile>, res: express.Response) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const updates = req.body;
        const result = await editUserProfile(userId, updates);
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get All Users
router.get("/users", async (req: express.Request, res: express.Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

export default router;
