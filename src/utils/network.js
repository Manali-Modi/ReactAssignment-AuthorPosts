import NetInfo from "@react-native-community/netinfo";

export const hasInternetConnection = () => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      return true;
    }
    return false;
  })
}