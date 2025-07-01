import { createContext, useContext, useState } from "react"

export const AuthContext = createContext({
    user: {},
    setUser: (newUser) => { }
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        return storedUser ? JSON.parse(storedUser) : null;
    })

    const updateUser = (newUser) => {
        setUser(newUser);
        localStorage.setItem('authUser', JSON.stringify(newUser))
    }


    return (
        <AuthContext.Provider value={{ user, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}
