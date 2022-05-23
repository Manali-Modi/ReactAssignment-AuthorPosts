import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList, TouchableWithoutFeedback, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import { styles } from "../utils/styles";
import { colors } from "../utils/colors";
import { strings } from "../utils/strings";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";

const AuthorPosts = ({ navigation }) => {

  const [allPosts, setAllPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  let [tempArr, setTempArr] = useState([]);
  const [dummy, setDummy] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [hasConnetion, setConnection] = useState(false);

  const getData = async () => {
    const allData = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + currentPage);
    const jsonData = await allData.json();
    if (totalPages == null) {
      setTotalPages(jsonData.nbPages);
    }
    const postData = jsonData.hits;

    if (allPosts == null) {
      setAllPosts(postData);
    } else {
      setAllPosts([...allPosts, ...postData]);
    }
    setLoading(false);
  }

  const fetchData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        setConnection(true);
        getData();
      } else {
        setConnection(false);
        Alert.alert(strings.no_connection_title,
          strings.no_connection_msg,
          [
            {
              text: 'Try Again',
              onPress: () => {
                fetchData();
              }
            }
          ])
      }
    })
  }

  useEffect(() => {
    fetchData();
  }, [currentPage])

  const rowPostItem = ({ item, index }) => {

    const handleClick = () => {
      let count = 0;
      if (tempArr.includes(index)) {
        setTempArr(tempArr.filter(value => value != index));
        count = tempArr.length - 1;
      } else {
        tempArr.push(index);
        count = tempArr.length;
      }
      setDummy(!dummy);

      if (count == 0) {
        navigation.setOptions({ title: strings.app_name });
      } else {
        navigation.setOptions({ title: `${count}` });
      }
    }

    return (
      <TouchableWithoutFeedback
        onPress={handleClick}>
        <View style={[styles.card,
        { backgroundColor: tempArr.includes(index) ? colors.accent : colors.white }
        ]}>
          <View style={[styles.horizontal_view, { justifyContent: 'space-between' }]}>
            <Text
              numberOfLines={3}
              style={styles.title_text}>
              {item.title}
            </Text>
            <Switch
              thumbColor={tempArr.includes(index) ? colors.primary_light : colors.accent} //
              trackColor={{ false: colors.track_light_color, true: colors.track_dark_color }}
              style={styles.toggle}
              value={tempArr.includes(index)}
              onValueChange={handleClick} />
          </View>

          <View style={styles.horizontal_view}>
            <Text style={styles.author_text}>
              {strings.author}
            </Text>
            <Text style={styles.author_text}>
              {item.author}
            </Text>
          </View>

          <Text style={styles.date_text}>
            {moment(item.created_at).utc().format('MMM DD, yyyy')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  return allPosts !== null ? (
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={isFetching}
        onRefresh={() => {
          setFetching(true);
          setTempArr([]);
          navigation.setOptions({ title: strings.app_name });
          setFetching(false);
        }} />
    }>
      <FlatList
        data={allPosts}
        //extraData={dummy}
        renderItem={rowPostItem}
        onEndReached={() => {
          if (currentPage < totalPages - 1) {
            setLoading(true)
            setCurrentPage(currentPage + 1)
          }
        }}
        style={{ paddingVertical: 8, marginBottom: 4 }} />
      {isLoading && <ActivityIndicator color={colors.primary_dark} style={styles.loading} />}
    </ScrollView>
  ) : <View>
    {
      hasConnetion &&
      <ActivityIndicator color={colors.primary_dark} style={{ marginTop: 8 }} />
    }
  </View>
}

export default AuthorPosts;	