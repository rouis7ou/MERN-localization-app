import { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room, Star} from '@material-ui/icons';
import './app.css'
import axios from 'axios'
import {format} from 'timeago.js'

function App() {
  const currentUser = "user"
  const [pins, setPins] =useState([])
  const [currentPlaceId, setCurrentPlaceId]= useState(null)
  const [newPlace, setNewPlace]= useState(null)
  const [title,setTitle]= useState(null)
  const [desc,setDesc]= useState(null)
  const [rating,setRating]= useState(0)


  const [viewport, setViewport] = useState({
    width: "100vw" ,
    height: "100vh" ,
    latitude: 35.834267,
    longitude: 10.593395,
    zoom: 8
  });

  useEffect(()=>{
    const getPins = async ()=>{
      try {
        const res=await axios.get('/pin')
        setPins(res.data)
      } catch (err) {
        console.log(err)
      }
    } 
    getPins()
  },[])

  const handleMarkerClick= (id,lat,long )=> {
    setCurrentPlaceId(id)
    setViewport({...viewport , latitude:lat,longitude:long})
  };
  const handleAddClick =(e)=>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating ,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pin", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="App">
        <ReactMapGL
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      {...viewport}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/houssemrouis/ckrxmnkhp10yz17o5yjtbk15h"
      onDblClick = {handleAddClick}
    > 
    {pins.map((p)=>(
      <div>
     <Marker latitude={p.lat} longitude={p.long} offsetLeft={-viewport.zoom * 1.5} offsetTop={-viewport.zoom * 3}>
      <Room 
      style={{fontSize:viewport.zoom * 3, color: p.username=== currentUser?"tomato" :'slateblue',cursor:"pointer"}}
      onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
      />
      </Marker>
      {p._id === currentPlaceId && (
      
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          
          anchor="left" 
          onClose={()=> setCurrentPlaceId(null)}>
          <div className="card">
            <label>place</label>
            <h4>{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div className="stars">
            {Array(p.rating).fill(<Star className="star" />)}
            </div>
            <label>Information</label>
            <span className="name">Created By <b>{p.username}</b></span>
            <span className="date">{format(p.createdAt)}</span>

          </div>
        </Popup>
      )}
        </div>
        ))}
        {newPlace && 
         <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={()=> setNewPlace(null)}>
            <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>

          </Popup>
}
    </ReactMapGL>
    </div>
  );
}

export default App;
