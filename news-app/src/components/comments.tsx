import { useState, useContext, memo } from 'react';
import styled from "styled-components/native";
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Comment from './comment';
import { AuthContext } from '../context/authContext';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import IComment from '../interfaces/comment';
import IAuthContext from '../interfaces/authContext';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useAppDispatch } from '../hooks/redux';
import { addComment, removeComment } from '../features/news/newsSlice';

const TextArea = styled.TextInput`
    border-radius: 10px;
    width: 100%;
    margin: 10px 0;
    padding: 5px;
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

    if (data && commentsQueue.length > 0) {
        const newComment = { ...commentsQueue.shift()!, id: data.updateComment };
        dispatch(addComment({ postId, comment: newComment }));
    }

    const sendCommentHandle = () => {
        const text = textAreaValue;
        if (text) {
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

    const textAreaValueChangeHandler = (value: string) => {
        setTextAreaValue(value);
    };

    return (
        <View>
            <TextArea
                style={styles.textArea}
                value={textAreaValue}
                onChangeText={textAreaValueChangeHandler}
                multiline={true}
                numberOfLines={5}
                placeholder="Write what you this about this news"
            />
            <Pressable
                style={styles.customButton}
                onPress={sendCommentHandle}
            >
                <Text style={styles.customButton}>Send</Text>
            </Pressable>
            {
                error ? (
                    <View>
                        <Text style={styles.error}>{error}</Text>
                    </View>
                ): null
            }
            <Pressable
                style={styles.comments}
                onPress={commentsToggleHandle}
            > 
                <FontAwesomeIcon
                    icon={isCommentsOpen ? faCaretDown : faCaretRight}
                    style={styles.icon}
                    size={20}
                />
                <Text>{`Comments (${comments.length})`}</Text>
            </Pressable>
            {isCommentsOpen ? (
                <>
                    {
                        comments.map((comment, idx) => <Comment key={idx} comment={comment} username={user.username} deleteComment={deleteComment} />)
                    }
                </>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    error: {
        color: 'red'
    },
    customButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#1976d2',
        color: 'white',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10
    },
    textArea: {
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1
    },
    comments: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 10
    }
});

export default memo(Comments);