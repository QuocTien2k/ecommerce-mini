import axios from "axios";

export const vietnamLabsClient = axios.create({
  baseURL: "https://vietnamlabs.com/api",
  timeout: 10000,
});
