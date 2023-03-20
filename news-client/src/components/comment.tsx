import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import IComment from '../interfaces/comment';

const WrapperComment = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 10px;
    width: calc(100% - 20px);
    padding: 0 5px;
    margin: 5px;
`;

const CommentBody = styled.div`
    font-size: 20px;
`;

interface ICommentProps {
    comment: IComment
    username: string
    deleteComment: (id: string) => void
};

const Comment = ({ comment, username, deleteComment }: ICommentProps): JSX.Element => {
    const deleteCommentHandle = () => {
        deleteComment(comment.id);
    };
    return (
        <WrapperComment>
            <div>
                <span style={{fontSize: "17px"}}>{comment.username} {new Date(Number(comment.date)).toLocaleString()}</span>
                <CommentBody>{comment.body}</CommentBody>
            </div>
            {comment.username === username ? (
                <FontAwesomeIcon icon={faTrash} style={{color: "red"}} onClick={deleteCommentHandle} />
            ) : null}
        </WrapperComment>
    );
};

export default Comment;