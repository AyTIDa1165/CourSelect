import { atom } from "recoil";

export const userStateAtom = atom({
    key : "userState", // unique
    default : {
        email : null,
        username : null,
        batch : null,
        role : null, // "STUDENT", "ADMIN"
        isAuthenticated : false, // true after login
    }
});