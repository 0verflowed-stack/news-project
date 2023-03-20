import IUser from "./user";

export default interface IAuthContext {
    user: IUser | null
    login: (user: IUser) => void
    logout: () => void
}