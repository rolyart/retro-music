var skipPrev = document.getElementById('skipPrev');
var playPause = document.getElementById('playPause');
var skipNext = document.getElementById('skipNext');
var toggleMute = document.getElementById('toggleMute');
var duration = document.getElementById('duration');

var showCurrentFile = document.getElementById('showCurrentFile');
var playList = document.getElementById('playList');
var togglePlayList = document.getElementById('togglePlayList');
var bar = document.getElementsByClassName('bar');

var filamentHub = document.getElementsByClassName('hub');

var files  = [];

var currentFile = null
currentIndex = 0;
var audio = new Audio();

var http = new XMLHttpRequest();
var url = "http://apps.rolyart.ro/api/retro-music/data.json";

http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        files = JSON.parse(this.responseText);
        currentFile = files[currentIndex];
        audio.src= currentFile.url;
        audio.load();
        audio.addEventListener('loadeddata', ()=>{
            duration.innerHTML = formatTime(audio.currentTime)+' / '+formatTime(audio.duration);
        })
        playPause.innerHTML = '<i class="material-icons">play_arrow<i>';
        showCurrentTrack();
        disablePrevNext();
        renderPlayList(files);
        
    }
};
http.open("GET", url, true);
http.send();

//Play
playPause.addEventListener('click',()=>{
    if(audio.paused){
        play();
    }else{
        pause()
    }
})

//Skip Prev
skipPrev.addEventListener('click', ()=>{
    currentIndex--;
    this.currentFile = files[currentIndex];
    audio.src = currentFile.url;
    play();
   
})

//Skip Next
skipNext.addEventListener('click', ()=>{
    currentIndex++;
    this.currentFile = files[currentIndex];
    audio.src = currentFile.url;
    play();
})


function play(){
    audio.play();
    playPause.innerHTML = '<i class="material-icons">pause<i>';
    disablePrevNext();
    startHubAnimation();
    audio.addEventListener('timeupdate', ()=>{
        duration.innerHTML = formatTime(audio.currentTime)+' / '+formatTime(audio.duration);
        if(audio.currentTime == audio.duration && currentIndex<files.length){
            skipNext.click();
            if(currentIndex+1 == files.length && audio.currentTime == audio.duration){
                pause();
                audio.currentTime   = 0;
            }
        }
        
        
    })
    showCurrentTrack();
    renderPlayList(files);
}

function pause(){
    audio.pause();
    playPause.innerHTML = '<i class="material-icons">play_arrow<i>';
    stopHubAnimation();
}

function startHubAnimation(){
    playPause.classList.add('active');
    for(let i = 0;i<filamentHub.length;i++){
        filamentHub[i].classList.add('playing', true);
    }

    for(let i = 0;i<bar.length;i++){
        bar[i].classList.add('playing-bar', true);
    }
}

function stopHubAnimation(){
    playPause.classList.remove('active');
    for(let i = 0;i<filamentHub.length;i++){
        filamentHub[i].classList.remove('playing', true);
    }
    for(let i = 0;i<bar.length;i++){
        bar[i].classList.remove('playing-bar', true);
    }
}

function showCurrentTrack(){
    let index = currentIndex+1;
    showCurrentFile.innerHTML = '<h4>'+index+'. '+currentFile.title+'</h4>';
    showCurrentFile.innerHTML += '<h5>'+currentFile.author+'</h5>';
}


function disablePrevNext(){
    if(currentIndex===0) {
        skipPrev.setAttribute('disabled', '');
    }
    if(currentIndex>0){
        skipPrev.removeAttribute('disabled');
        skipNext.removeAttribute('disabled');
    }
    if(currentIndex === files.length - 1){
        skipNext.setAttribute('disabled', '');
    }

   
}


togglePlayList.addEventListener('click', ()=>{
    playList.classList.toggle('show');
})


toggleMute.addEventListener('click', ()=>{
    audio.muted = !audio.muted;
    if(audio.muted) {
        toggleMute.innerHTML =    '<i class="material-icons">volume_off</i>';
        toggleMute.classList.add('active');
    }
    else {
        toggleMute.innerHTML =    '<i class="material-icons">volume_up</i>';
        toggleMute.classList.remove('active');
    }
} )

function formatTime(seconds) {
    minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}


function renderPlayList(files){
    let count= 1;
    var A = document.createElement('div');

    var B = document.createElement('div');
    files.forEach(el => {
        let item = document.createElement('div');
        let title = document.createElement('h3');
        let author = document.createElement('h4');
        title.innerHTML = count+ ' '+el.title;
        author.innerHTML = el.author;
        item.appendChild(title);
        item.appendChild(author);
        item.classList.add('item');
        item.setAttribute('data-index', count)

   
        if(currentIndex == count-1) {
            item.classList.add('selected-file');
        }

        item.addEventListener('click', ()=>{
            audio.src = el.url;
            audio.load();
            currentIndex = item.getAttribute('data-index')-1;
            this.currentFile = el;

            let cf= document.getElementsByClassName('selected-file');
            cf[0].classList.remove('selected-file');
            if(currentIndex == item.getAttribute('data-index')-1) item.classList.add('selected-file');
            play();
            showCurrentTrack()
            playList.classList.toggle('show');
        })
        if(count<=5){
            A.appendChild(item);
        }else{
            B.appendChild(item);
        }
        count++;
    });
    A.classList.add('side');
    B.classList.add('side');
    playList.innerHTML = '';
    playList.appendChild(A);
    playList.appendChild(B);
}



