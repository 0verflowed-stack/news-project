import { useState, forwardRef } from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import Comments from './comments';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import INews from '../interfaces/news';
import Category from './category';
import { decrementLikes, incrementLikes, decrementDislikes, incrementDislikes } from '../features/news/newsSlice';
import { useAppDispatch } from '../hooks/redux';

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

interface INewsItemProps {
    item: INews,
    categories: string[],
    categoryChangeHandler: (id: string, newCategory: string) => void
}

const NewsItem = ({ item, categories, categoryChangeHandler } : INewsItemProps, ref: React.ForwardedRef<HTMLDivElement>) : JSX.Element => {
    const [likes, setLikes] = useState(item.likes);
    const [dislikes, setDislikes] = useState(item.dislikes);

    const [isLiked, setIsLiked] = useState(item.liked);
    const [isDisliked, setIsDisliked] = useState(item.disliked);

    const [setLikesMutation] = useMutation(SET_LIKE);

    const [setDislikesMutation] = useMutation(SET_DISLIKE);

    const dispatch = useAppDispatch();

    const handleLikeClick = () => {
        if (isLiked) {
            setLikes(prev => prev - 1);
            dispatch(decrementLikes(item.id));
            setLikesMutation({ variables: { likeInput: { action: false, post: item.id }} });
        } else {
            setLikes(prev => prev + 1);
            dispatch(incrementLikes(item.id));
            if (isDisliked) {
                setDislikes(prev => prev - 1);
                dispatch(decrementDislikes(item.id));
                setIsDisliked(prev => !prev)
            }
            setLikesMutation({ variables: { likeInput: { action: true, post: item.id }} });
        }
        setIsLiked(prev => !prev);
    };

    const handleDislikeClick = () => {
        if (isDisliked) {
            setDislikes(prev => prev - 1);
            dispatch(decrementDislikes(item.id));
            setDislikesMutation({ variables: { dislikeInput: { action: false, post: item.id }} });
        } else {
            setDislikes(prev => prev + 1);
            dispatch(incrementDislikes(item.id));
            if (isLiked) {
                setLikes(prev => prev - 1);
                dispatch(decrementLikes(item.id));
                setIsLiked(prev => !prev)
            }
            setDislikesMutation({ variables: { dislikeInput: { action: true, post: item.id }} });
        }
        setIsDisliked(prev => !prev);
    };

    return (
        <StyledButton ref={ref}>
            <div>{item.title}</div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{ display: "flex" }}>
                    <LikeBtn onClick={handleLikeClick}>{likes} <FontAwesomeIcon icon={isLiked ? faThumbsUpSolid : faThumbsUpRegular} style={{color: isLiked ? 'green' : 'black'}} /></LikeBtn>
                    <LikeBtn onClick={handleDislikeClick}>{dislikes} <FontAwesomeIcon icon={isDisliked ? faThumbsDownSolid : faThumbsDownRegular} style={{color: isDisliked ? 'red' : 'black'}} /></LikeBtn>
                    <Category postId={item.id} category={item.category} categories={categories} categoryChangeHandler={categoryChangeHandler} />
                </div>
                <div style={{ fontSize: "18px" }}>{new Date(Number(item.time)).toLocaleString()}</div>
            </div>
            <Comments postId={item.id} comments={item.comments} />
        </StyledButton>
    );
};

export default forwardRef(NewsItem);