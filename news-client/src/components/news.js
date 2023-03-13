import { useState } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import Comments from './comments';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const StyledButton = styled.div`
  background-color: white;
  font-size: 24px;
  color: black;
  border-radius: 10px;
  border: 1px solid black;
  padding: 10px;
  margin: 15px;
`;

const LikeBtn = styled.button`
    background-color: white;
    border-radius: 10px;
    font-size: 20px;
    border: 1px solid black;
    margin-right: 10px;
    &:hover {
        background-color: #d2d1d1;
    }
`;

const SET_LIKE = gql`
    mutation Mutation(
        $likeInput: LikeInput
    ) {
        updateLike(
            likeInput: $likeInput
        )
    }
`;

const SET_DISLIKE = gql`
    mutation Mutation(
        $dislikeInput: DislikeInput
    ) {
        updateDislike(
            dislikeInput: $dislikeInput
        )
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



const NewsItem = ({item}) => {
    const [likes, setLikes] = useState(item.likes);
    const [dislikes, setDislikes] = useState(item.dislikes);

    const [isLiked, setIsLiked] = useState(item.liked);
    const [isDisliked, setIsDisliked] = useState(item.disliked);

    const [setLikesMutation] = useMutation(SET_LIKE);

    const [setDislikesMutation] = useMutation(SET_DISLIKE);
    
    const [setCommentsMutation] = useMutation(SET_COMMENT);

    const handleLikeClick = () => {
        if (isLiked) {
            setLikes(prev => prev - 1);
            setLikesMutation({ variables: { likeInput: { action: false, post: item.id }} });
        } else {
            setLikes(prev => prev + 1);
            if (isDisliked) {
                setDislikes(prev => prev - 1);
                setIsDisliked(prev => !prev)
            }
            setLikesMutation({ variables: { likeInput: { action: true, post: item.id }} });
        }
        setIsLiked(prev => !prev);
    };

    const handleDislikeClick = () => {
        if (isDisliked) {
            setDislikes(prev => prev - 1);
            setDislikesMutation({ variables: { dislikeInput: { action: false, post: item.id }} });
        } else {
            setDislikes(prev => prev + 1);
            if (isLiked) {
                setLikes(prev => prev - 1);
                setIsLiked(prev => !prev)
            }
            setDislikesMutation({ variables: { dislikeInput: { action: true, post: item.id }} });
        }
        setIsDisliked(prev => !prev);
    };

    return (
        <StyledButton>
            <div>{item.title}</div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <LikeBtn onClick={handleLikeClick}>{likes} <FontAwesomeIcon icon={isLiked ? faThumbsUpSolid : faThumbsUpRegular} /></LikeBtn>
                    <LikeBtn onClick={handleDislikeClick}>{dislikes} <FontAwesomeIcon icon={isDisliked ? faThumbsDownSolid : faThumbsDownRegular} /></LikeBtn>
                </div>
                <div>{new Date(Number(item.time)).toLocaleString()}</div>
            </div>
            <Comments />
        </StyledButton>
    );
};

export default NewsItem;