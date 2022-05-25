import { BASE_API_URL } from "../utils/constants";

export const getPostsData = async (pageNo) => {
  try {
    const response = await fetch(`${BASE_API_URL}/v1/search_by_date?tags=story&page=${pageNo}`);
    if (response.status >= 200 && response.status < 300) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } 
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}