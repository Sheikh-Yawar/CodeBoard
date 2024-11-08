import { io } from "socket.io-client";
const serverURL = import.meta.env.VITE_SERVER_URL;
const serverURLMOBILE = import.meta.env.VITE_SERVER_URL_MOBILE;

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const getServerUrl = () => {
  return isMobileDevice() ? serverURLMOBILE : serverURL;
};

export const initSocket = async () => {
  const options = {
    transports: ["websocket"], //This option forces the connection to use WebSocket transport only. Other possible values could be ["polling"] or an array including multiple transports like ["polling", "websocket"]
    jsonp: false, //JSONP is an older technique for making cross-domain requests. Setting this to false disables JSONP and uses modern CORS for cross-domain requests.
    forceNew: true, //If set to true, it ensures that a new connection is established every time a socket is created, instead of reusing an existing connection
    reconnection: true, // Enable reconnection
    reconnectionAttempts: Infinity, // Keep trying indefinitely
    reconnectionDelay: 1000, // Initial delay before reconnecting (in milliseconds)
    reconnectionDelayMax: 5000, // Maximum delay between reconnections (in milliseconds)
    randomizationFactor: 0.5, // Randomization factor for reconnection delay
  };

  return io(getServerUrl(), options);
};
