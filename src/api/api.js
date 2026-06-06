import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: 'http://192.168.1.15:4000',
});

API.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
