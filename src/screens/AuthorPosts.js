import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList, TouchableWithoutFeedback, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { styles } from "../utils/styles";
import { colors } from "../utils/colors";
import { strings } from "../utils/strings";
import moment from "moment";
import { getPostsData } from "../api";
import { showAlertDialog } from "../components/AlertDialog";
import { hasInternetConnection } from "../utils/network";

const AuthorPosts = ({ navigation }) => {

  const [allPosts, setAllPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [tempArr, setTempArr] = useState([]);
  const [dummy, setDummy] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isLoaderVisible, setLoaderVisible] = useState(false);

  const getData = async () => {
    const allData = await getPostsData(currentPage);
    if (allData != null) {
      if (totalPages == null) {
        setTotalPages(allData.nbPages);
      }
  
      const postData = allData.hits;
      if (allPosts == null) {
        setAllPosts(postData);
      } else {
        setAllPosts([...allPosts, ...postData]);
      }
      setLoading(false);
    } else {
      setLoaderVisible(false);
      showAlertDialog(
        strings.api_err_title,
        strings.api_err_msg,
        strings.try_again,
        () => {
          fetchData();
        }
      )
    }
  }

  const fetchData = async () => {
    const hasConnection = await hasInternetConnection();
    if (hasConnection) {
      setLoaderVisible(true);
      getData();
    } else {
      setLoaderVisible(false);
      showAlertDialog(
        strings.no_connection_title,
        strings.no_connection_msg,
        strings.try_again,
        () => {
          fetchData();
        }
      )
    }
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
      isLoaderVisible &&
      <ActivityIndicator color={colors.primary_dark} style={{ marginTop: 8 }} />
    }
  </View>
}

export default AuthorPosts;	