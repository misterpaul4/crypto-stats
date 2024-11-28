import { LOCAL_URL, LIVE_URL } from "../../settings";

export const getBasePath = () =>
  window.location.href.startsWith("https") ? LIVE_URL : LOCAL_URL;
