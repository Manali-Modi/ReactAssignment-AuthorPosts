import React, { useState, useEffect } from "react";
import { View, Text, Switch, FlatList, TouchableWithoutFeedback } from 'react-native';
import { styles } from "../utils/styles";
import { colors } from "../utils/colors";
import { strings } from "../utils/strings";
import moment from "moment";

const AuthorPosts = () => {

  const [allPosts, setAllPosts] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const getData = async () => {
    const allData = await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=story&page=' + currentPage);
    const jsonData = await allData.json();

    const postData = jsonData.hits;
    setAllPosts(postData);
  }

  useEffect(() => {
    getData();
  }, [])

  const rowPostItem = ({ item, index }) => {

    console.warn(item.isSeleted);
    return (
      <View style={styles.card}>
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
            value={item.isSeleted}
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
    )
  }

  return allPosts !== null ? (
    <FlatList
      data={allPosts}
      renderItem={rowPostItem}
      style={{ marginVertical: 8 }} />
  ) : <></>
}

export default AuthorPosts;