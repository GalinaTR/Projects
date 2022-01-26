var domNode_playPauseButton = document.getElementById('startPauseButton');
var domNode_muteUnmuteButton = document.getElementById('muteButton');
var domNode_songName = document.querySelector('.songName');
var domNode_audioTag = document.getElementById('audioTag');
var domNode_timingBar = document.querySelector('.timingBar');
var domNode_playList = document.getElementById('playList');
var currentAudioTime = 0 ;
var singerName;
var songTitle;
var audioList= [{name: 'Neil degrasse tyson', song: 'UFO sightings not higher.mp3'},
                {name: 'National Geographic', song: 'Earth 101.mp3'}];


loadSongsInPlayList();

function loadSongsInPlayList(){
    //create div in the play list for each song in the array
    for (let i = 0; i < audioList.length; i++){
            let list = document.createElement('div');
            list.classList.add('song');
            list.setAttribute('id', i);
            list.innerHTML= (i+1)
                            +'. <span class="listSingerName" style="font-weight: bold;">'+ audioList[i].name+'</span> - '
                            + '<span class="listSongName">' +audioList[i].song+'</span>';
            list.setAttribute('onclick','playClickedSong(event)');
            domNode_playList.appendChild(list);
    }
}

function playClickedSong(event){
    
    //remove styles for previous clicked songs in the list
    if(document.querySelector('.clickedSong')){
        if(document.querySelector('.clickedSong').getAttribute('id') != event.currentTarget.getAttribute('id')){
            document.querySelector('.clickedSong').classList.remove('clickedSong');
            styleNewClickedSong(event);
            pauseAudio();
            domNode_timingBar.setAttribute('style','width: 0;');
            domNode_playPauseButton.classList.add('playButton');
            domNode_playPauseButton.classList.remove('pauseButton');
        }
    } else {
        styleNewClickedSong(event);
    }
}

function styleNewClickedSong(event){
    let songNumberArray;  //number of the clicked song in the array

    //set the styles for new clicked song
    if(event.target.className == 'song'){
        event.target.classList.add('clickedSong');
        songNumberArray = event.target.id;
    } else {
        event.currentTarget.classList.add('clickedSong');
        songNumberArray = event.currentTarget.id;
    }

    singerName = audioList[songNumberArray].name;
    songTitle = audioList[songNumberArray].song;
    setCurrentSongName(singerName,songTitle,'autoplay');
}

function setCurrentSongName(singerName,songTitle, autoplaySong){
    //set the song in the currentPlayedSongBox - the white box
    document.getElementById('singer').innerText = singerName;
    document.getElementById('songTitle').innerText = songTitle;

    //set the song in the audio tag
    domNode_audioTag.setAttribute('src', 'audio/' + songTitle); 
    domNode_audioTag.setAttribute(autoplaySong,'');
}

function startPauseSong(){
        domNode_playPauseButton.classList.toggle('playButton');
        domNode_playPauseButton.classList.toggle('pauseButton');

    if(document.querySelector('.pauseButton')){
        playAudio();
        domNode_timingBar.setAttribute('style', 'transition: width '+ (Math.trunc(domNode_audioTag.duration) - currentAudioTime)+ 's linear;')
        domNode_timingBar.classList.add('movingBar');

    } else {
        pauseAudio();
        currentAudioTime = Math.trunc(domNode_audioTag.currentTime);
        let currentWidth = Math.trunc((currentAudioTime / domNode_audioTag.duration )*100);
        domNode_timingBar.classList.remove('movingBar');
        domNode_timingBar.setAttribute('style','width:' + currentWidth + '%;');
    }
}

function playAudio() {
    domNode_audioTag.play();
  }
  
function pauseAudio() {
    domNode_audioTag.pause();
  }

function muteUnmute(){
    let flagMuteUnmute;

    if(document.querySelector('.muteUnpressed')){
        flagMuteUnmute = true; 
    } else {
        flagMuteUnmute = false;
    }    
    
    muteAudio(flagMuteUnmute);
    domNode_muteUnmuteButton.classList.toggle('muteUnpressed');
    domNode_muteUnmuteButton.classList.toggle('mutePressed');
}

function muteAudio(mute) {
    domNode_audioTag.muted= mute;
  }


domNode_playPauseButton.addEventListener('click', startPauseSong);
domNode_muteUnmuteButton.addEventListener('click', muteUnmute);