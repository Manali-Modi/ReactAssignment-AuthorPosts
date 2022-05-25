import NetInfo from "@react-native-community/netinfo";

export const hasInternetConnection = async () => {
  const connection = await NetInfo.fetch()
  if (connection.isConnected) {
    return true;
  }
  return false;
}