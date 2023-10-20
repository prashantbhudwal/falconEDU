import axios from "axios";
//TODO Fix any type
export const fetchUserData = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
};

export const updateUser = async (url: string, data: any): Promise<any> => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
