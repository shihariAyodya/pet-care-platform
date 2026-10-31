import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const DEMO_USER_KEY = "petzy_current_user";
const REGISTERED_USERS_KEY = "petzy_registered_users";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load user session", e);
      return null;
    }
  });

  // Save session when currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
    }
  }, [currentUser]);

  // Helper to fetch registered users list
  const getRegisteredUsers = () => {
    try {
      const users = localStorage.getItem(REGISTERED_USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const signup = async ({ fullName, email, password, phone, petParentOf, address }) => {
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: "usr_" + Date.now(),
      fullName,
      email: email.trim(),
      password, // In a client demo store simple hash or raw
      phone: phone || "",
      address: address || "Colombo, Sri Lanka",
      petParentOf: petParentOf || "Dog Parent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      myPets: [
        {
          id: 1,
          name: "Milo",
          type: "Dog",
          breed: "Golden Retriever",
          age: "2 yrs",
          gender: "Male",
          weight: "24 kg",
          photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80"
        }
      ],
      favorites: [1, 2],
      orders: [
        {
          id: "ORD-9482",
          date: "Yesterday",
          item: "Royal Canin Golden Retriever Adult (12kg)",
          amount: "LKR 18,500.00",
          status: "Processing"
        }
      ]
    };

    users.push(newUser);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

    // Auto login
    setCurrentUser(newUser);
    return newUser;
  };

  const login = async ({ email, password }) => {
    const users = getRegisteredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    // Also support default demo account if no users created yet
    if (!found) {
      if (email.toLowerCase().trim() === "demo@petzy.com" && password === "demo123") {
        const demoUser = {
          id: "usr_demo",
          fullName: "Emily Carter",
          email: "demo@petzy.com",
          phone: "+94 77 123 4567",
          address: "142 Palm Grove Ave, Colombo 03",
          petParentOf: "Dog & Cat Parent",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
          joinedDate: "Jan 2024",
          myPets: [
            {
              id: 1,
              name: "Milo",
              type: "Dog",
              breed: "Golden Retriever",
              age: "2 yrs",
              gender: "Male",
              weight: "24 kg",
              photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80"
            },
            {
              id: 2,
              name: "Luna",
              type: "Cat",
              breed: "British Shorthair",
              age: "1 yr",
              gender: "Female",
              weight: "4.2 kg",
              photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
            }
          ],
          favorites: [1, 3],
          orders: [
            {
              id: "ORD-7291",
              date: "15 Oct 2026",
              item: "Premium Salmon Dry Cat Food (3kg)",
              amount: "LKR 5,800.00",
              status: "Delivered"
            },
            {
              id: "ORD-8114",
              date: "28 Oct 2026",
              item: "Orthopedic Memory Foam Pet Bed",
              amount: "LKR 9,450.00",
              status: "Shipped"
            }
          ]
        };
        setCurrentUser(demoUser);
        return demoUser;
      }
      throw new Error("Invalid email or password. Please try again.");
    }

    setCurrentUser(found);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      // Also update in registered list
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.id === updated.id);
      if (idx !== -1) {
        users[idx] = updated;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      }
      return updated;
    });
  };

  const addPet = (newPet) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const petWithId = { ...newPet, id: Date.now() };
      const updated = { ...prev, myPets: [...(prev.myPets || []), petWithId] };
      
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.id === updated.id);
      if (idx !== -1) {
        users[idx] = updated;
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        updateProfile,
        addPet
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
