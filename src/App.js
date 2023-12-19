import { useEffect } from 'react';
import './App.css';
import Login from "./Login.js"
import { getTokenFromUrl } from './spotify.js';
import SpotifyWebApi from "spotify-web-api-js";
import Player from "./Player.js";
import { useDataLayerValue } from './DataLayer.js';
//import { useDataLayerValue } from './DataLayer.js';
const spotify=new SpotifyWebApi();


function App() {
  //const [token,setToken]=useState(null);
  const [{token}, dispatch]=useDataLayerValue();

  useEffect(()=>{
    const hash=getTokenFromUrl();
    window.location.hash="";
    const _token=hash.access_token;
    if(_token){

      dispatch({
        type:"SET_TOKEN",
        token: _token
      })
     // setToken(_token);
      spotify.setAccessToken(_token);

      spotify.getMe().then((user)=>{
       
        dispatch({
          type:"SET_USER",
          user: user,
        })
      });

      spotify.getPlaylist("37i9dQZEVXcNQjcmixap9E").then((response) =>
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response,
        })
      );

      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });



      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists,
        });
      });
      
    }
  },[token,dispatch])



  return (
    <div className="App">
    {!token && <Login />}
      {token && <Player spotify={spotify} />}
    
    </div>
  );
}

export default App;
