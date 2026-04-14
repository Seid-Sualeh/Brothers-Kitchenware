import axios from 'axios'
const axiosInstance = axios.create({
  //local firebase api
  // baseURL: "http://127.0.0.1:5001/clone-675f2/us-central1/api",
  // deployed version of backend on render
   baseURL:'https://amazone-backend-816l.onrender.com'
});
export default axiosInstance;