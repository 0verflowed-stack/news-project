import { useState, useContext } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Comment from './comment';
import { AuthContext } from '../context/authContext';
import { Alert } from '@mui/material';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import IComment from '../interfaces/comment';
import IAuthContext from '../interfaces/authContext';
import { useAppDispatch } from '../hooks/redux';
import { addComment, removeComment } from '../features/news/newsSlice';

const TextArea = styled.textarea`
    border-radius: 10px;
    width: calc(100% - 10px);
    margin: 10px 0;
    padding: 5px;
`;
const Button = styled.button`
    font-size: 24px;
    background-color: white;
    border: 0px solid black;
    border-radius: 10px;
    &:hover {
        background-color: #d2d1d1;
    }
`;

const SET_COMMENT = gql`
    mutation Mutation(
        $commentInput: CommentInput
    ) {
        updateComment(
            commentInput: $commentInput
        )
    }
`;

interface ICommentsProps {
    postId: string
    comments: IComment[]
}

const Comments = ({ postId, comments }: ICommentsProps): JSX.Element | null => {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState<string>('');
    const { user } = useContext<IAuthContext>(AuthContext);
    const [error, setError] = useState('');
    const [setCommentMutation, { data }] = useMutation<{ updateComment: string }>(SET_COMMENT);
    const [commentsQueue, setCommentsQueue] = useState<IComment[]>([]);

    const dispatch = useAppDispatch();
    
    if (!user) {
        return null;
    }

    if (data && commentsQueue.length) {
        const newComment = { ...commentsQueue.shift()!, id: data.updateComment };
        dispatch(addComment({ postId, comment: newComment }));
    }

    const sendCommentHandle = () => {
        const text = textAreaValue;
        if (text) {
            console.log({ body: text, username: user.username});
            setCommentMutation({ variables: { commentInput: { action: true, postId, commentId: null, body: text, date: Date.now().toString() }} });
            setCommentsQueue(prev => [ ...prev, { id: '', body: text, username: user.username, date: Date.now().toString()}]);
            setError('');
            setTextAreaValue('');
        } else {
            setError('Cannot send comment. Comment is empty!');
        }
    };

    const commentsToggleHandle = () => {
        setIsCommentsOpen(prev => !prev);
    };

    const deleteComment = (commentToDeleteId: string) => {
        setCommentMutation({ variables: { commentInput: { action: false, postId, commentId: commentToDeleteId }} });
        dispatch(removeComment({ postId, commentId: commentToDeleteId }));
    };

    const textAreaValueChangeHandler = (e: any) => {
        setTextAreaValue(e.target.value);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <TextArea
                value={textAreaValue}
                onInput={textAreaValueChangeHandler}
                id="story"
                name="story"
                rows={5}
                cols={33}
                placeholder="Write what you this about this news"
            />
            <Button style={{alignSelf: "end", backgroundColor: "#1976d2", color: "white"}} onClick={sendCommentHandle}>Send</Button>
            {
                error ? (
                    <Alert severity="error">
                        {error}
                    </Alert>
                ): null
            }
            <Button onClick={commentsToggleHandle}> 
                <FontAwesomeIcon icon={isCommentsOpen ? faCaretDown : faCaretRight} style={{marginRight: "10px"}} />
                {`Comments (${comments.length})`}
            </Button>
            {isCommentsOpen ? (
                <>
                    {
                        comments.map((comment, idx) => <Comment key={idx} comment={comment} username={user.username} deleteComment={deleteComment} />)
                    }
                </>
            ) : null}
        </div>
    );
};

export default Comments;