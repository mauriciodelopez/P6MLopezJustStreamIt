const mainUrl = "http://localhost:8000/api/v1/titles/";


// Best movie
function fetchBestMovie() {
  let bestTitle = document.getElementById('top-title');
  let bestImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
  let bestDesc = document.getElementsByClassName('best-desc')[0];
  let bestButton = document.getElementsByClassName('button')[1];

  // Faites une requête GET pour obtenir des informations sur le meilleur film
  fetch(mainUrl + "?sort_by=-imdb_score")
      .then(response => response.json()) // Convertir la réponse au format JSON
      .then(data => {
          const bestMovie = data.results[0]; // Extraire le meilleur film
          bestTitle.textContent = bestMovie.title;
          bestImg.src = bestMovie.image_url;
          bestButton.setAttribute("onclick", `openModal22("${bestMovie.id}")`);
          fetch(data["results"][0]["url"])
                .then(response => response.json())
                .then(data => {
                    bestDesc.innerHTML = data["description"];
                })
      });
}

function openModal22(id) {

  let modal = document.getElementById("modal");
  let span = document.getElementsByClassName("close")[0];

  fetchModalData(id)

  modal.style.display = "block";

  span.onclick = function () {
      modal.style.display = "none";
  }

  window.onclick = function (event) {
      if (event.target === modal)
          modal.style.display = "none";
  }
}

  

// Carrousel controls

function moveCarrouselLeft(category) {

  const carrouselContent = document.querySelector("#" + category + "-movies");
  const carrouselLeftBtn = document.querySelector("#" + category + "-left");
  const carrouselRightBtn = document.querySelector("#" + category + "-right");
    
  carrouselContent.style.left = "-680px";
  carrouselRightBtn.classList.remove("show");
  carrouselLeftBtn.classList.add("show");
}

function moveCarrouselRight(category) {

  const carrouselContent = document.querySelector("#" + category + "-movies");
  const carrouselLeftBtn = document.querySelector("#" + category + "-left");
  const carrouselRightBtn = document.querySelector("#" + category + "-right");

  carrouselContent.style.left = "0px";
  carrouselRightBtn.classList.add("show");
  carrouselLeftBtn.classList.remove("show");
}



function fetchCategories(category) {

  const urlPage1 = mainUrl + "?sort_by=-imdb_score&genre=" + category;
  const urlPage2 = mainUrl + "?sort_by=-imdb_score&genre=" + category + "&page=2";

  fetch(urlPage1)
  .then(response => response.json())
  .then(data => {
    const dataPage1 = data["results"];

    fetch(urlPage2)
    .then(response => response.json())
    .then(data => {
      const dataPage2 = data["results"];
      const dataAll = dataPage1.concat(dataPage2);

      if (category == '')
        dataAll.shift();   //sautez le premier film de la catégorie la mieux noté

      for (i=0; i<7; i++) {
        const movieCover = dataAll[i]["image_url"];
        const movieTitle = dataAll[i]["title"];
        const movieId = dataAll[i]["id"];
        const currentMovieTitle = document.getElementById(category + (i+1).toString()).getElementsByTagName("p")[0];
        const currentMovieCover = document.getElementById(category + (i+1).toString()).getElementsByTagName("img")[0];
            
        currentMovieCover.src = movieCover;
        currentMovieCover.id = movieId;
        currentMovieTitle.innerHTML = movieTitle;
      }
    })
  })
}


// Contrôle modal et récupération de données (fetch data)

function openModal(category, num) {
  
  const modal = document.getElementById("modal");
  const span = document.getElementsByClassName("close")[0];

  const modalId = document.getElementById(category + num.toString()).getElementsByTagName("img")[0].id;

  fetchModalData(modalId)

  modal.style.display = "block";

  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal)
      modal.style.display = "none";
  }
}

function fetchModalData(id) {

	fetch(mainUrl + id)
	.then(response => response.json())
	.then(data => {

    document.getElementById('modal-cover').src = data["image_url"];
		document.getElementById('modal-title').innerHTML = data["title"];

    document.getElementById('modal-year').innerHTML = data["year"];
    document.getElementById('modal-duration').innerHTML = data["duration"] + " min";
    document.getElementById('modal-genres').innerHTML = data["genres"];
    document.getElementById('modal-imdb').innerHTML = data["imdb_score"] + " / 10";

    document.getElementById('modal-directors').innerHTML = data["directors"];
    document.getElementById('modal-cast').innerHTML = data["actors"] + "...";
    document.getElementById('modal-country').innerHTML = data["countries"];


    if (typeof data["rated"] === 'string' || data["rated"] instanceof String)
      document.getElementById('modal-rating').innerHTML = data["rated"];
    else
      document.getElementById('modal-rating').innerHTML = data["rated"] + "+";  // add "+" if age rating is a number

    const modalBoxOffice = document.getElementById('modal-box-office');
    if (data["worldwide_gross_income"] == null)
      modalBoxOffice.innerHTML = "N/A";  // placeholder for unspecified box-office   
    else 
      modalBoxOffice.innerHTML = data["worldwide_gross_income"] + " " + data["budget_currency"];

    const regExp = /[a-zA-Z]/g;
    if (regExp.test(data["long_description"]))
      document.getElementById('modal-desc').innerHTML = data["long_description"]; 
    else
      document.getElementById('modal-desc').innerHTML = "N/A";  // placeholder for missing description
    
	})
}



fetchBestMovie()
fetchCategories('')
fetchCategories('horror')
fetchCategories('biography')
fetchCategories('music')


