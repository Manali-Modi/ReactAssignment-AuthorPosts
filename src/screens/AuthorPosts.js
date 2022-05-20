import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList, TouchableWithoutFeedback } from 'react-native';
import { styles } from "../utils/styles";
import { colors } from "../utils/colors";
import { strings } from "../utils/strings";
import moment from "moment";

const AuthorPosts = () => {

  const [allPosts, setAllPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

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
  }

  useEffect(() => {
    getData();
  }, [currentPage])

  const rowPostItem = ({ item, index }) => {

    return (
      <View style={[styles.card,
      { backgroundColor: colors.white }
      ]}>
        <View style={[styles.horizontal_view, { justifyContent: 'space-between' }]}>
          <Text
            numberOfLines={3}
            style={styles.title_text}>
            {item.title}
          </Text>
          <Switch
            thumbColor={colors.accent} //
            trackColor={{ false: colors.track_light_color, true: colors.track_dark_color }}
            style={styles.toggle}
            value={false} />
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
    )
  }

  return allPosts !== null ? (
    <FlatList
      data={allPosts}
      renderItem={rowPostItem}
      onEndReached={() => {
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1)
        }
      }}
      style={{ marginVertical: 8 }} />
  ) : <></>
}

export default AuthorPosts;	