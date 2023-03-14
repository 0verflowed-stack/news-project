import { useState, useRef, useContext } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Comment from './comment';
import { AuthContext } from '../context/authContext';
import { Alert } from '@mui/material';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

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

const Comments = ({ postId, comments: commentsProp}) => {
    const [comments, setComments] = useState(commentsProp);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const textareaRef = useRef(null);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [setCommentMutation, { data, loading }] = useMutation(SET_COMMENT);
    const [commentsQueue, setCommentsQueue] = useState([]);

    if (data && commentsQueue.length) {
        setComments(prev => [...prev, { ...commentsQueue.shift(), id: data.updateComment }]);
    }

    const sendCommentHandle = () => {
        const text = textareaRef.current.value;
        if (text) {
            console.log({ body: text, email: user.email, username: user.username});
            setCommentMutation({ variables: { commentInput: { action: true, postId, commentId: null, body: text, date: Date.now().toString() }} });
            // setComments(prev => [...prev, { body: text, email: user.email, username: user.username}]);
            setCommentsQueue(prev => [ ...prev, { body: text, email: user.email, username: user.username, date: Date.now().toString()}]);
            setError('');
            textareaRef.current.value = '';
        } else {
            setError('Cannot send comment. Comment is empty!');
        }
    };

    const commentsToggleHandle = () => {
        setIsCommentsOpen(prev => !prev);
    };

    const deleteComment = (commentToDeleteId) => {
        console.log('commentToDelete', commentToDeleteId);
        setCommentMutation({ variables: { commentInput: { action: false, postId, commentId: commentToDeleteId }} });
        setComments(prev => {
            console.log('Prev: ',prev);
            console.log(prev.indexOf(prev.find(x => x.id === commentToDeleteId)));
            prev = prev.filter(x => x.id !== commentToDeleteId);
            console.log(prev);
            return prev;
        });
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <TextArea ref={textareaRef} id="story" name="story" rows="5" cols="33" placeholder="Write what you this about this news"></TextArea>
            <Button style={{alignSelf: "end", backgroundColor: "#1976d2", color: "white"}} onClick={sendCommentHandle}>Send</Button>
            {error ? (
            <Alert severity="error">
                {error}
            </Alert>
            ): null}
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