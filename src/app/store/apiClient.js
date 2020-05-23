import axios from "axios";

export function ApiClient(backendUrl) {
  function post(path, data) {
    return axios.post(`${backendUrl}${path}`, data);
  }
  return {
    post,
  };
}
