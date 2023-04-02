import { memo, useState } from 'react';
import styled from "styled-components/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThumbsUp as faThumbsUpSolid, faThumbsDown as faThumbsDownSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';
import Comments from './comments';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import INews from '../interfaces/news';
import Category from './category';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useAppDispatch } from '../hooks/redux';
import { decrementDislikes, decrementLikes, incrementDislikes, incrementLikes } from '../features/news/newsSlice';

const StyledButton = styled.View`
  background-color: white;
  font-size: 24px;
  color: black;
  border-radius: 10px;
  border: 1px solid black;
  padding: 10px;
  margin: 15px;
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

const NewsItem = (
    { item, categories, categoryChangeHandler } : INewsItemProps,
) : JSX.Element => {
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
        <StyledButton>
            <View><Text>{item.title}</Text></View>
            <View style={{display: "flex", justifyContent: "space-between"}}>
                <View style={{ display: "flex" }}>
                    <View style={styles.buttons}>
                        <Pressable onPress={handleLikeClick}>
                            <View style={styles.like}>
                                <Text style={styles.text}>{likes}</Text>
                                <FontAwesomeIcon
                                    icon={isLiked ? faThumbsUpSolid : faThumbsUpRegular}
                                    style={{ ...styles.icon, color: isLiked ? 'green' : 'black' }}
                                    size={30}
                                />
                            </View>
                        </Pressable>
                        <Pressable onPress={handleDislikeClick}>
                            <View style={styles.like}>
                                <Text style={styles.text}>{dislikes}</Text>
                                <FontAwesomeIcon
                                    icon={isDisliked ? faThumbsDownSolid : faThumbsDownRegular}
                                    style={{ ...styles.icon, color: isDisliked ? 'red' : 'black'}}
                                    size={30}
                                />
                            </View>
                        </Pressable>
                    </View>
                    <Category postId={item.id} category={item.category} categories={categories} categoryChangeHandler={categoryChangeHandler} />
                </View>
                <View>
                    <Text>{new Date(Number(item.time)).toLocaleString()}</Text>
                </View>
            </View>
            <Comments postId={item.id} comments={item.comments} />
        </StyledButton>
    );
};

const styles = StyleSheet.create({
    like: {
        backgroundColor: 'white',
        borderRadius: 10,
        fontSize: 30,
        borderColor: 'black',
        marginRight: 10,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'flex-start'
    },
    text: {
        fontSize: 20
    },
    icon: {
        marginLeft: 10
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row'
    }
});

export default memo(NewsItem);