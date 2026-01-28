import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws"],
});

window.Echo = echo;
/*
echo.connector.pusher.connection.bind('connected', () => {
  console.log('✅ WebSocket conectado');
});

echo.connector.pusher.connection.bind('error', (err) => {
  console.error('❌ Error de conexión WebSocket:', err);
});

window.Echo.channel('eventos')
  .listen('.NuevaPregunta', (e) => {
  });
*/
export default echo;
