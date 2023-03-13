import styled from "styled-components";

const WrapperComment = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 10px;
    width: calc(100% - 20px);
    padding: 0 5px;
    margin: 5px;
`;

const CommentBody = styled.div`
    font-size: 20px;
`;

const Comment = ({comment}) => {
    return (
        <WrapperComment>
            <span style={{fontSize: "17px"}}>{comment.username}</span>
            <CommentBody>{comment.body}</CommentBody>
        </WrapperComment>
    );
};

export default Comment;