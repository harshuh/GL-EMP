const HARDCODED_USERS = [
  {
    id: 1,
    username: "admin",
    password: "harsh1010",
    name: "Admin User",
    role: "Admin",
  },
  {
    id: 2,
    username: "hr",
    password: "hr123",
    name: "HR Manager",
    role: "HR",
  },
];

export const authService = {

  login: async (username, password) => {
    // Simulate small delay like a real API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = HARDCODED_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Save user to localStorage (no token needed)
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    return { user: userData };
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem("user") !== null;
  },
};