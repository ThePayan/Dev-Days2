import { getAllUsers, getUserById, createUser, deleteUserById, updateUserById, patchUserById} from '../services/user.service.js';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('user-controller-tracer');

export const getUsers = async (req, res) => {
    const span = tracer.startSpan('getUsers');
    try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simula una operación asincrónica
    const users = getAllUsers();
    span.setAttribute('user.count', users.length);
    res.status(200).json(users);  
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        span.end();
    }
}

export const getUser = (req, res) => {
    try {
        const { id } = req.params;
        const user = getUserById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addUser = (req, res) => {
    try {
        const newUser = createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = updateUserById(id, req.body);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const removeUser = (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = deleteUserById(id);
        if (deletedUser) {
            res.status(200).json(deletedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const patchUser = (req, res) => {
        try {
            const { id } = req.params;
        const updatedUser = patchUserById(id, req.body);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

