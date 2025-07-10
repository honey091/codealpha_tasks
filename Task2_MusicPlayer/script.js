// ========== Song List ==========
const songs = [
  {
    title: "abnormal-for-you",
    artist: "Lil Slushie",
    src: "assets/music/abnormal-for-you-255737.mp3",
    cover: "assets/images/abnormal.jpg"
  },
  {
    title: "bring-me-back",
    artist: "Miles Away",
    src: "assets/music/bring-me-back-283196.mp3",
    cover: "assets/images/bring me back.jpg"
    },
  {
    title: "go down deh",
    artist: "Spice, Sped Up Dancehall",
    src: "assets/music/Go Down Deh Spice 320 Kbps.mp3",
    cover: "assets/images/go down deh.jpg"
    },
  {
    title: "hold me tight",
    artist: "John Lennon and Paul McCartney",
    src: "assets/music/hold-me-tight-278286.mp3",
    cover: "assets/images/hold me tight.jpg"
    },
  {
    title: "love-at-first-sight",
    artist: "Kylie Minogue",
    src: "assets/music/love-at-first-sight-no-copyright-music-372160.mp3",
    cover: "assets/images/love at first sight.jpg"
    },
  {
    title: "song-english-edm",
    artist: "Calvin Harris, David Guetta, Marshmello, and The Chainsmokers",
    src: "assets/music/song-english-edm-296526.mp3",
    cover: "assets/images/me.jpg"
  },
];

let songIndex = 0;
let isShuffle = false;
let isRepeat = false;
let originalSongsOrder = [...songs]; // Store original order

// ========== DOM Elements ==========
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const bgBlur = document.getElementById("bg-blur");
const progress = document.getElementById("progress");
const progressContainer = document.querySelector(".progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const volumeIcon = document.querySelector(".volume-icon");
// Add these to your existing script.js

// Tab switching
const songTab = document.getElementById('song-tab');
const playlistTab = document.getElementById('playlist-tab');
const songView = document.getElementById('song-view');
const playlistView = document.getElementById('playlist-view');

songTab.addEventListener('click', () => {
    songTab.classList.add('active');
    playlistTab.classList.remove('active');
    songView.classList.add('active');
    playlistView.classList.remove('active');
});

playlistTab.addEventListener('click', () => {
    playlistTab.classList.add('active');
    songTab.classList.remove('active');
    playlistView.classList.add('active');
    songView.classList.remove('active');
});

// Playlist functionality
function populatePlaylist() {
    const playlistElement = document.getElementById('playlist');
    playlistElement.innerHTML = '';
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas fa-play play-icon"></i>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <span class="song-duration">2:45</span>
        `;
        
        if (index === songIndex) {
            li.classList.add('active');
        }
        
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
            updatePlaylistActiveItem();
            // Switch back to song view
            songTab.click();
        });
        
        playlistElement.appendChild(li);
    });
}

function updatePlaylistActiveItem() {
    const items = document.querySelectorAll('.playlist li');
    items.forEach((item, index) => {
        item.classList.toggle('active', index === songIndex);
    });
}

// Update the loadSong function to maintain playlist highlighting
const originalLoadSong = loadSong;
loadSong = function(song) {
    originalLoadSong(song);
    updatePlaylistActiveItem();
};

// Initialize the playlist when starting the player
populatePlaylist();

// ========== Load Song ==========
function loadSong(song) {
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    bgBlur.style.backgroundImage = `url('${song.cover}')`;

    // Reset progress bar
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';

    // Load metadata for duration
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    document.body.classList.add('playing');
}

// ========== Play / Pause ==========
function playSong() {
    audio.play()
        .then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            document.body.classList.add('playing');
        })
        .catch(error => {
            console.error("Playback failed:", error);
        });
}

function pauseSong() {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.body.classList.remove('playing');
}

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

// ========== Shuffle Functionality ==========
function toggleShuffle() {
    isShuffle = !isShuffle;

    if (isShuffle) {
        shuffleBtn.classList.add('active');
        // Create a shuffled copy excluding current song
        const shuffledSongs = [...songs];
        const currentSong = shuffledSongs.splice(songIndex, 1)[0];

        // Fisher-Yates shuffle algorithm
        for (let i = shuffledSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
        }

        // Put current song back at the beginning
        shuffledSongs.unshift(currentSong);

        // Update the songs array
        songs.splice(0, songs.length, ...shuffledSongs);
        songIndex = 0;
    } else {
        shuffleBtn.classList.remove('active');
        // Restore original order
        songs.splice(0, songs.length, ...originalSongsOrder);
        // Find current song in original order
        songIndex = originalSongsOrder.findIndex(song => song.title === title.textContent);
    }

    // Update UI to reflect changes
    updateUI();
}



shuffleBtn.addEventListener("click", toggleShuffle);

// ========== Repeat Functionality ==========
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

repeatBtn.addEventListener("click", toggleRepeat);

// ========== Progress Bar ==========
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// ========== Volume Control ==========
function updateVolume() {
    audio.volume = volumeSlider.value;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute volume-icon';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down volume-icon';
    } else {
        volumeIcon.className = 'fas fa-volume-up volume-icon';
    }
}

volumeSlider.addEventListener('input', updateVolume);
volumeIcon.addEventListener('click', toggleMute);

function toggleMute() {
    if (audio.volume > 0) {
        volumeSlider.value = 0;
    } else {
        volumeSlider.value = 0.8;
    }
    updateVolume();
}

// ========== Auto Play Next Song ==========
audio.addEventListener('ended', handleSongEnd);

function handleSongEnd() {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
}

function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

function prevSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// ========== Update UI ==========
function updateUI() {
    // Update any UI elements that need refreshing
    shuffleBtn.classList.toggle('active', isShuffle);
    repeatBtn.classList.toggle('active', isRepeat);
}

// ========== Initialize Player ==========
function initPlayer() {
    // Load first song
    loadSong(songs[songIndex]);

    // Set initial volume
    audio.volume = volumeSlider.value;
    updateVolumeIcon();

    // Update UI
    updateUI();
}

// Start the player
initPlayer();