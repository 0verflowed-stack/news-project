import IComment from "./comment"

export default interface INews {
    category: string
    comments: IComment[]
    dislikes: number
    disliked: boolean
    likes: number
    liked: boolean
    
    time: string
    title: string
    id: string
}