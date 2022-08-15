import React from "react"
import {useEffect, useState} from "react"
import axios from "axios"
import "./App.css"



function App() {
    const CLIENT_ID = "e95799c6439c4de2a80e3580006eaf56"
    const REDIRECT_URI = "https://spotify.aniketsingh.net/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const [userPlaylists, setUserPlaylists] = useState([])


    const loadUserPlatlists = async (e) => {
        e.preventDefault()
        const {data} =  await axios.get("https://api.spotify.com/v1/me/playlists?limit=50", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        setUserPlaylists(data.items)
    }

    const renderUserPlaylist= () => {
        return      <select class="select select-primary w-full max-w-xs" onChange={e => userSelect(e.target.value)}>
                        <option disabled selected>Choose your playlist</option>
                        {userPlaylists.map(item =>(
                            <option value={item.id}>{item.name}</option>
                        ))}
                    </select>
    }


    const [userSongs, setUserSongs] = useState([])
    const userSelect = async (e) => {
        const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${e}/tracks`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        console.log(data)
        setUserSongs(data.items)
    }

    var getCountryNames = new Intl.DisplayNames(['en'], {type: 'region'})
    const renderUserSongInfo =() => {

        return <div class="overflow-x-auto">

            <table class="table table-compact w-full">
                <tbody>
                  {userSongs.map((item, index) => (
                      <tr>
                      <td><img src={item.track.album.images[2]["url"]}/></td>
                      <td>
                        <div class="font-bold">{item.track.name}</div>
                        <div class="text-sm opacity-60">by {
                            item.track.artists.map((artist)=>(`${artist.name}`)).join(', ')
                        } </div>
                      </td>
                      <td class="hidden md:table-cell">{item.track.album.name}</td>

                      <td>
                        <label for={item.track.id} class="btn btn-xs btn-outline btn-info modal-button">Click Here</label>

                        <input type="checkbox" id={item.track.id} class="modal-toggle" />
                        <label for={item.track.id} class="modal cursor-pointer">
                        <label class="modal-box w-11/12 max-w-5xl" for="">
                        <h3 class="text-lg font-bold">Markets {item.track.name} is available in</h3>
                        {item.track.album.available_markets ?

                        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {item.track.album.available_markets.sort().map((ite) =>{return<div>{getCountryNames.of(ite)}</div>} )}
                            </div>
                        : <div>Not Available Anywhere</div>
                        }
                        </label>
                        </label>
                    </td>
                    </tr>
                  ))}
                </tbody>
            </table>
            </div>
    }


    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ?
                    <a class="btn btn-primary" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=playlist-read-private`}>Login
                        to Spotify</a>
                    : <button class="btn btn-error" onClick={logout}>Logout</button>}

                {token ?
                    <button class="btn btn-accent" onClick={loadUserPlatlists}>Load Playlists</button>
                    : <br/>
                }
                <br/>
              {token ? renderUserPlaylist()
               :
              <br/>}
            </header>
        {token? renderUserSongInfo():<br/>}
        </div>
    )
}

export default App
