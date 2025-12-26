const users = [{
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com'
},
{
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com'
}];

export const getAllUsers = () => {
    return users;
}

export const getUserById = (id) => {
    return users.find(user => user.id === id);
}

export const deleteUserById = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        return deletedUser[0];
    }
    return null;
}

export const createUser = (user) => {
    const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: user.name,
        email: `${user.name.toLowerCase().replace(' ', '.')}@example.com`,
    };
    users.push(newUser);
    return newUser;
}

export const updateUserById = (id, updatedInfo) => {
    const user = users.find(user => user.id === id);
    if (user) {
        user.name = updatedInfo.name || user.name;
        user.email = updatedInfo.email || user.email;
        return user;
    } 
} 

export const patchUserById = (id, updatedInfo) => {
    const user = users.find(user => user.id === id);
    if (user) {
        user.name = updatedInfo.name || user.name;
        user.email = updatedInfo.email || user.email;
        return user;
    }
}