import { useState, useEffect, useRef } from 'react';
import NewsItem from "./news";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { GraphQLErrors } from '@apollo/client/errors';
import INews from '../interfaces/news';
import { View, StyleSheet, Text, ActivityIndicator, Platform, SafeAreaView, FlatList, Pressable, KeyboardAvoidingView } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Subscription } from 'expo-notifications';

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

const NewsFeed = () => {
  const [errors, setErrors] = useState<GraphQLErrors>([]);
  const [news, setNews] = useState<INews[]>([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

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
          setNews(data.news);
      },
      onError({ graphQLErrors }) {
          setErrors(graphQLErrors);
      }
  });

  useQuery(GET_CATEGORIES, {
      onCompleted(data) {
          setCategories(data.categories);
      },
      onError({ graphQLErrors }) {
          setErrors(graphQLErrors);
      }
  });
  
  const filteredNews = news.filter(x => {
      if (currentCategory === '') {
          return true;
      }
      return x.category === currentCategory;
  });

  let notificationNewsItem : INews | undefined;

  const readLaterArticle = news.find(x => x.category === READ_LATER);

  let notificationTitle = '';

  if (readLaterArticle) {
      notificationNewsItem = readLaterArticle;
      notificationTitle = "Don't forget to view your 'Read later' article";
  } else {
      notificationNewsItem = news[0];
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
            //         notification.addEventListener('click', () => {
            //             if (readLaterArticle) {
            //                 setCurrentCategory(READ_LATER);
            //             } else {
            //                 setCurrentCategory('');
            //             }
            //             // @ts-ignore
            //             itemsRef.current[notificationNewsItem.id]?.scrollIntoView();
            //             // @ts-ignore
            //             itemsRef.current[notificationNewsItem.id]?.classList.add('bgGray');
            //         });
        }, 1 * 60 * 1000);

        return () => {
            clearInterval(seed);
        };
    }, [notificationNewsItem, notificationTitle]);

    const categoryChangeHandler = (id: string, newCategory: string) => {
        setNews(prev => {
            const idx = prev.findIndex(x => x.id === id);
            const tempArray = [...prev];
            const tempNews = { ...tempArray[idx] };
            tempNews.category = newCategory;
            tempArray[idx] = tempNews;
            return tempArray;
        });
    };

    return (
        <>
            <View>
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
                  news.length !== 0 ? (
                    <FlatList
                      data={filteredNews}
                      keyExtractor={(item: INews) => item.id}
                      renderItem={({ item } : { item: INews }) => (
                        <NewsItem
                          item={item}
                          categories={categories}
                          categoryChangeHandler={categoryChangeHandler}
                          />
                      )}
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
