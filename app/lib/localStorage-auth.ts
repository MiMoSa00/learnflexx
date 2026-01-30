// localStorage Authentication Utility
// This is a temporary solution until your database is working

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  createdAt: string;
  image?: string;
}

const USERS_KEY = 'learnflex_users';
const CURRENT_USER_KEY = 'learnflex_current_user';

// Get all users from localStorage
export function getAllUsers(): LocalUser[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

// Save users to localStorage
function saveUsers(users: LocalUser[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

// Find user by email
export function findUserByEmail(email: string): LocalUser | null {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

// Find user by ID
export function findUserById(id: string): LocalUser | null {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
}

// Create a new user
export function createUser(email: string, name: string, hashedPassword: string): LocalUser {
  const users = getAllUsers();
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User already exists');
  }
  
  const newUser: LocalUser = {
    id: generateId(),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return newUser;
}

// Generate a simple unique ID
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get current logged-in user
export function getCurrentUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  } catch (error) {
    console.error('Error reading current user from localStorage:', error);
    return null;
  }
}

// Set current logged-in user
export function setCurrentUser(user: LocalUser | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      // Don't store password in current user
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (error) {
    console.error('Error setting current user in localStorage:', error);
  }
}

// Log out current user
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Verify password (for login)
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // Import bcryptjs dynamically to avoid SSR issues
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Update user information
export function updateUser(userId: string, updates: Partial<LocalUser>): LocalUser | null {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    id: users[userIndex].id, // Don't allow ID updates
    password: updates.password || users[userIndex].password, // Keep existing password if not updating
  };
  
  users[userIndex] = updatedUser;
  saveUsers(users);
  
  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(updatedUser);
  }
  
  return updatedUser;
}

// Delete user
export function deleteUser(userId: string): boolean {
  const users = getAllUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  
  if (filteredUsers.length === users.length) return false;
  
  saveUsers(filteredUsers);
  
  // Logout if deleting current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    logoutUser();
  }
  
  return true;
}