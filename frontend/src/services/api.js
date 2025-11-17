import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000
});

export async function getLiveData(){
  const r = await api.get("/live_data");
  return r.data;
}
export async function getHistory(limit=100){
  const r = await api.get(`/history?limit=${limit}`);
  return r.data;
}
export async function getTrends(q="industry 4.0", limit=12){
  const r = await api.get(`/trends?q=${encodeURIComponent(q)}&limit=${limit}`);
  return r.data;
}
