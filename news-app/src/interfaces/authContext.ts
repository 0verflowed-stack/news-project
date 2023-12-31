import IUser from "./user";
import IUserData from "./userData";

export default interface IAuthContext {
    user: IUser | null
    login: (user: IUserData | null) => void
    logout: () => void
}