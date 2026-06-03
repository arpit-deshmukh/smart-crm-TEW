import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser as loginApi,
  logoutUser as logoutApi,
} from "../services/authService";
import { getProfile } from "../services/profileService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const authData = await getCurrentUser();

      if (!authData?.user) {
        setUser(null);
        return;
      }

      try {
        const profileData = await getProfile();

        setUser({
          ...authData.user,
          phone: profileData.user?.phone || "",
          profileImage:
            profileData.user?.profileImage ||
            "https://i.pravatar.cc/150?img=12",
          bio: profileData.user?.bio || "",
        });
      } catch (profileError) {
        setUser({
          ...authData.user,
          phone: "",
          profileImage: "https://i.pravatar.cc/150?img=12",
          bio: "",
        });
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (formData) => {
    const data = await loginApi(formData);

    try {
      const profileData = await getProfile();

      setUser({
        ...data.user,
        phone: profileData.user?.phone || "",
        profileImage:
          profileData.user?.profileImage ||
          "https://i.pravatar.cc/150?img=12",
        bio: profileData.user?.bio || "",
      });
    } catch (error) {
      setUser({
        ...data.user,
        phone: "",
        profileImage: "https://i.pravatar.cc/150?img=12",
        bio: "",
      });
    }

    return data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);