
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { ActivityIndicator } from 'react-native';

// type User = {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
// } | null;

// type AuthContextType = {
//   user: User;
//   login: (userData: User) => void;
//   logout: () => void;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   login: () => {},
//   logout: () => {},
//   loading: true,
// });

// export function useAuth() {
//   return useContext(AuthContext);
// }

// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User>(null);
//   const [loading, setLoading] = useState(true);
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     fetch('http://localhost:5000/auth/current_user', {
//       credentials: 'include',
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.user) setUser(data.user);
//       })
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     const [segment] = segments;
//     // @ts-ignore
//     const inTabs = segment === '(tabs)'

//     if (!loading && !user && inTabs) {
//       router.replace('/');
//     }
//   }, [user, loading, segments]);

//   const login = (userData: User) => setUser(userData);

//   const logout = async () => {
//     await fetch('http://localhost:5000/auth/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
//     setUser(null);
//     router.replace('/');
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack screenOptions={{ headerShown: false }} />
//     </AuthProvider>
//   );
// }

//////////////////////////////////////////////////////////////////////////////////////
import { Stack, useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    /*
    fetch('http://localhost:5000/auth/current_user', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    */

    const dummyUser = {
      id: 123,
      email: "example@example.com",
      firstName: "Jack",
      lastName: "Reacher",
    };

    // Simulate network delay
    setTimeout(() => {
      setUser(dummyUser); // Set null if you want unauthenticated
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const [segment] = segments;
    // @ts-ignore
    const inTabs = segment === "(tabs)";

    if (!loading && !user && inTabs) {
      router.replace("/");
    }
  }, [user, loading, segments]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    // await fetch('http://localhost:5000/auth/logout', {
    //   method: 'POST',
    //   credentials: 'include',
    // });
    setUser(null);
    router.replace("/");
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
