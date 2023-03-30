import styled from "styled-components/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import IComment from '../interfaces/comment';
import { View, StyleSheet, Text, Button, Pressable } from 'react-native';

const WrapperComment = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 10px;
    width: 100%;
    padding: 0 5px;
    margin: 5px;
`;

const CommentBody = styled.View`
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
            <View>
                <Text
                //style={{fontSize: "17px"}}
                >{comment.username} {new Date(Number(comment.date)).toLocaleString()}</Text>
                <CommentBody><Text>{comment.body}</Text></CommentBody>
            </View>
            {comment.username === username ? (
                <Pressable onPress={deleteCommentHandle}>
                    <FontAwesomeIcon icon={faTrash} style={{color: "red"}} />
                </Pressable>
            ) : null}
        </WrapperComment>
    );
};

export default Comment;