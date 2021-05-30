const url_address ="https://accounts.spotify.com/authorize"
const redirectUri = "http://127.0.0.1:5500/index.html"
const tokenUrl = "https://accounts.spotify.com/api/token"
const playlistUrl = "https://api.spotify.com/v1/me/playlists"


var client_id =""
var client_secret =""
var access_token = null
var refresh_token= null

function requestAuth(){
 
    client_id =document.getElementById('clientId').value
    client_secret =document.getElementById('clientKey').value
    localStorage.setItem("client_id" ,client_id )
    localStorage.setItem("client_secret",client_secret )
    let urls = url_address + "?client_id=" + client_id + "&response_type=code" + "&redirect_uri=" + encodeURI(redirectUri) +
    "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"
                  + "&show_dialog=true"
    window.location.href =urls;
}

function pageLoad(){
    
    client_id = localStorage.getItem("client_id")
    client_secret = localStorage.getItem("client_secret")
    if(window.location.search.length>0){
        generateCode();
    }
    else{
        access_token = localStorage.getItem("access_token")
        if(access_token!=null)
        {
            document.getElementById('margin').style.display='block'
            document.getElementById('cred').style.display='none'
        }
    }
}
function generateCode(){
   
    let code = getCode()
    generateAccessToken(code)
    console.log('refersh')
   window.history.pushState("", "",redirectUri)
}

function  generateAccessToken(code){
        console.log(client_id)
        let bodyParams = "grant_type=authorization_code" + "&code="+code + "&redirect_uri=" + encodeURI(redirectUri) + "&client_id=" + client_id + "&client_secret="+client_secret 
        authorization(bodyParams)
}

function authorization(body){
 
    let res = new XMLHttpRequest()
    res.open("POST" , tokenUrl , true)
    res.setRequestHeader('Content-type','application/x-www-form-urlencoded')
    res.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":"+ client_secret))
    res.send(body)
    res.onload = fetchAccessToken
}

function fetchAccessToken(){
   
    if(this.status==200){
    var data = JSON.parse(this.responseText)
    console.log(data.access_token)
    access_token = data.access_token
    refresh_token = data.refresh_token
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    document.getElementById('cred').style.display='none'
    document.getElementById('margin').style.display='block'
    pageLoad()
    }

}


function getCode(){
    
    let code = null
    const queryS = window.location.search
    const urlParams = new URLSearchParams(queryS)
    code = urlParams.get('code')
    console.log(code)
    return code;
}
function showPlaylist() {

    let res = new XMLHttpRequest()
    res.open("GET" , playlistUrl , true)
    res.setRequestHeader('Content-type','application/json')
    res.setRequestHeader('Authorization', 'Bearer ' + access_token)
    res.send(null)
    res.onload = playListresponse
}

function showTracks(id ,){

}

function playListresponse (){
    if(this.status==200){
        var data = JSON.parse(this.responseText)
        console.log(data)
    
        data.items.forEach(item => {
            console.log(item.images[0].url, item.name ,item.tracks.total )
           createCards(item.images[0].url, item.name ,item.tracks.total)
        
        });
    }

}

function createCards(imgs,h1Value,tracksInfo){

 var row = document.createElement('div')
 row.setAttribute('class', 'row no-gutters' )
 var div = document.createElement('div')
 div.setAttribute('class', 'col-md-4' )
 var img = document.createElement('img')
 img.setAttribute('src',imgs)
 img.setAttribute('class','card-img')
 div.append(img)//image
 var div2 = document.createElement('div')
 div2.setAttribute('class', 'col-md-8' )
 var cardBody = document.createElement('div')
 cardBody.setAttribute('class', 'card-body' )
 var h1 = document.createElement('h1')
 h1.innerHTML=h1Value
 var p = document.createElement('p')
 p.innerHTML="Total tracks " +tracksInfo
 cardBody.append(h1,p)
 div2.append(div,cardBody)
 row.append(div2)

 return document.getElementById('card').append(row)



}











