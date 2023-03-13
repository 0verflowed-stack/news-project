import { useState, useRef, useContext } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Comment from './comment';
import { AuthContext } from '../context/authContext';
import { Alert } from '@mui/material';

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

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const textareaRef = useRef(null);
    const { user } = useContext(AuthContext);
    const [error, setError] = useState('');

    const sendCommentHandle = () => {
        const text = textareaRef.current.value;
        if (text) {
            console.log({ body: text, email: user.email, username: user.username});
            setComments(prev => [...prev, { body: text, email: user.email, username: user.username}]);
            setError('');
            textareaRef.current.value = '';
        } else {
            setError('Cannot send comment. Comment is empty!');
        }
    };

    const commentsToggleHandle = () => {
        setIsCommentsOpen(prev => !prev);
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
                        comments.map((comment, idx) => <Comment key={idx} comment={comment} />)
                    }
                </>
            ) : null}
        </div>
    );
};

export default Comments;