import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import NewsItem from "./news";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { GraphQLErrors } from '@apollo/client/errors';
import INews from '../interfaces/news';
import { View, StyleSheet, Text, ActivityIndicator, Platform, SafeAreaView, FlatList, Pressable, KeyboardAvoidingView, RefreshControl } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Subscription } from 'expo-notifications';
import { AuthContext } from '../context/authContext';
import IAuthContext from '../interfaces/authContext';
import { changeCategory, receiveNews, selectNews } from '../features/news/newsSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { shallowEqual } from 'react-redux';

const GET_NEWS = gql`
    query News {
        news {
            category
            comments {
                id
                username
                body
                date
            }
            dislikes
            disliked
            likes
            liked
            time
            title
            id
        }
    }
`;

const GET_CATEGORIES = gql`
    query Categories {
        categories
    }
`;

const READ_LATER = 'Read later';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface INewsFeedProps {
  navigation: any
}

const NewsFeed = ({ navigation } : INewsFeedProps) : JSX.Element => {
  const [errors, setErrors] = useState<GraphQLErrors>([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();
  const context = useContext<IAuthContext>(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const { news } = useAppSelector(selectNews, shallowEqual);

  const dispatch = useAppDispatch();

  const schedulePushNotification = async (
    title: string,
    body: string,
  ) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body
      },
      trigger: {
        seconds: 5
      },
    });
    console.log("notif id on scheduling", id)
    return id;
  }

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }
  
    return token;
  }

  const { refetch: refetchNews } = useQuery(GET_NEWS, {
      onCompleted(data) {
        dispatch(receiveNews(data.news));
      },
      onError({ graphQLErrors }) {
          setErrors(graphQLErrors);
      },
      fetchPolicy: 'no-cache'
  });

  useQuery(GET_CATEGORIES, {
      onCompleted(data) {
          setCategories(data.categories);
      },
      onError({ graphQLErrors }) {
          setErrors(graphQLErrors);
      }
  });

  const onRefresh = useCallback(() => {
    refetchNews();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  
  const filteredNews = Object.values(news).filter(x => {
      if (currentCategory === '') {
          return true;
      }
      return x.category === currentCategory;
  });

  let notificationNewsItem : INews | undefined;

  const readLaterArticle = Object.values(news).find(x => x.category === READ_LATER);

  let notificationTitle = '';

  if (readLaterArticle) {
      notificationNewsItem = readLaterArticle;
      notificationTitle = "Don't forget to view your 'Read later' article";
  } else {
      notificationNewsItem = news[Object.keys(news)[0]];
      notificationTitle = "Don't forget to view the latest news";
  }

  useEffect(() => {
      registerForPushNotificationsAsync().then((token) =>
          token ? setExpoPushToken(token) : null
      );
  
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(Boolean(notification!));
        });
  
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
  
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current!
        );
        Notifications.removeNotificationSubscription(responseListener.current!);
      };
    }, []);

    useEffect(() => {
        const seed = setInterval(() => {
            if (notificationNewsItem) {
                Notifications.removeNotificationSubscription(responseListener.current!);
                responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                    setCurrentCategory('Read later');
                  });
                
                schedulePushNotification(notificationTitle, notificationNewsItem.title);
            }
        }, 20 * 60 * 1000);

        return () => {
            clearInterval(seed);
        };
    }, [notificationNewsItem, notificationTitle]);

    const categoryChangeHandler = (id: string, newCategory: string) => {
        dispatch(changeCategory({ id, category: newCategory }));
    };

    if (errors.length > 0) {
      context.logout();
    }

    const onLogout = () => {
      context.logout();
      navigation.navigate('Home');
  };

    return (
        <>
            <View>
              <Pressable
                onPress={onLogout}
                style={{ ...styles.button, backgroundColor: 'red' }}
              >
                <Text>Logout</Text>
                </Pressable>
                {categories.map(x => {
                    const text = x === '' ? 'All' : x;
                    return (
                        <Pressable 
                            style={{ ...styles.button, backgroundColor: x === currentCategory ? 'black' : '#353dab' }}
                            key={x}
                            onPress={() => setCurrentCategory(x)}
                        >
                          <Text style={styles.text}>{text}</Text>
                        </Pressable>
                    );
                })}
            </View>
            <KeyboardAvoidingView behavior="height" enabled>
              <SafeAreaView>
                {
                  Object.keys(news).length !== 0 ? (
                    <FlatList
                      data={Object.values(filteredNews)}
                      keyExtractor={(item: INews) => item.id}
                      renderItem={({ item } : { item: INews }) => (
                        <NewsItem
                          item={item}
                          categories={categories}
                          categoryChangeHandler={categoryChangeHandler}
                          />
                      )}
                      refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                      }
                    />
                  ) : (
                  <ActivityIndicator size="large" color="#00ff00"/>
                  )
                }
              </SafeAreaView>
            </KeyboardAvoidingView>
            {errors.map((error, idx) => (
                <View key={idx}>
                    <Text style={styles.error}>{error.message}</Text>
                </View>
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    error: {
        color: 'red'
    },
    button: {
      margin: 5,
      backgroundColor: 'white',
      border: '1px solid black',
      borderRadius: 10,
      padding: 5,
      color: 'white'
    },
    text: {
      color: 'white'
    }
});

export default NewsFeed;
