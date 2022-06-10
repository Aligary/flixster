//Global Constants
const API_KEY = '3d4e2c988b89f0e2c2b68176b5347afa';

//Query Selectors
const moviesGrid = document.querySelector("#movies-grid");
const showMoreBtn = document.querySelector("#load-more-movies-btn");
const movieSearch = document.querySelector("#search-input");
const currentBtn = document.querySelector("#close-search-btn");
const nowPlaying = document.querySelector("#nowPlaying");
const cardBtn = document.getElementById("cardBtn");
const popupContent = document.querySelector(".popup-content");
const popup = document.querySelector(".popup")


let pageNum = 1;

/**
 * Gets results form API
 * @param {String} request - HTTP request
 */
 async function getResults(request){
    const result = await fetch(request);
    const data = await result.json();
    displayResults(data);
}

/**
 *  displays movies.
 * @param {String} res - json response
 */
 async function displayResults(res){
     if(res.results.length == 0)
        return;
    for(let i = 0; i < res.results.length; i++)
    {
        var movieId = res.results[i].id;
        var movieImg = 'https://api.themoviedb.org/3/movie/' + movieId + '/images?api_key=' + API_KEY;
        const result = await fetch(movieImg);
        const data = await result.json();
        var imageSource = "https://image.tmdb.org/t/p/w185" + data.posters[0].file_path;
        moviesGrid.innerHTML += `
        <div class="movie-card" onclick="openPopup(${movieId})">
            <img class="movie-poster" src="${imageSource}" alt="${res.results[i].title} poster"></img>
            <p class="movie-title">${res.results[i].title}</p>
            <p class="movie-votes">Rating: ${res.results[i].vote_average}/10 </p>
        </div>
        `
    }
    pageNum++;
}

showMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    var newRequest = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY + '&language=en-US&page=' + pageNum;
    getResults(newRequest);
    
})

currentBtn.addEventListener("click", (e) => {
    moviesGrid.innerHTML = ``;
    movieSearch.value = ``;
    window.onload();
})

movieSearch.addEventListener("keyup", (e) => {
    pageNum=1;
    if(e.keyCode === 13){
        moviesGrid.innerHTML = ``;
        var request = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY +'&language=en-US&query=' + movieSearch.value;
        getResults(request);   
    }
    
})

async function openPopup(movieId){
    let movie = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + API_KEY;
    const result = await fetch(movie);
    const data = await result.json();
    let runTime = data.runtime;
    let backdrop_path = "https://image.tmdb.org/t/p/w185" + data.backdrop_path;
    let releaseDate = data.release_date;
    let genre = data.genres[0].name;
    let overview = data.overview;
    let movieLink = 'https://api.themoviedb.org/3/movie/' + movieId + '/videos?api_key=' + API_KEY;
    const result1 = await fetch(movieLink);
    const data1 = await result1.json();
    let trailer = data1.results[0].key;``

    popup.style.display = "flex";

    popupContent.innerHTML += `
        <div class="details">
            <p id="detailsTitle">${data.title}</p>
            <img class="backdrop" src="${backdrop_path}" alt="${data.title} poster"></img>
            <p class="runTime">Run Time: ${runTime} minutes</p>
            <p class="releaseDate">Release Date: ${releaseDate}</p>
            <p class="genre">Genre: ${genre}</p>
            <p class="overviewHeader">Overview</p>
            <p class="overview">${overview}</p>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        `
    
}

window.onclick = function(event) {

    if (event.target == popup) {
        popup.style.display = "none";
    }
    popupContent.innerHTML = ``
  }

window.onload = function () {
    console.log("onload function");
    pageNum = 1;
    var request = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY + '&language=en-US&page=' + pageNum;
    getResults(request);
}
