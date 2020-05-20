const animeContainer = document.getElementById('anime-data');
const animeDetailContainer = document.getElementById('anime-info');

const animeData = () => {
  const value = document.getElementById('search-box').value
  fetch(`https://kitsu.io/api/edge/anime?filter[text]=${value}`)
    .then(response => {
      return response.json();
    })
    .then((data) => {
      let anime = data.data;
      console.log(anime);
      
      let output = '';
      anime.forEach((stuff) => {                
        output += `
        <div class="col-md-3">
          <div class="well text-center">
            <img class="img-fluid" src=${stuff.attributes.posterImage.original} />
            <h5 class="animeTitle font-weight-bold">${stuff.attributes.slug}</h5>
            <a target="_blank" onclick="animeSelected('${stuff.id}')" class="btn btn-info" href="anime.html">More Detail</a>
          </div>
        </div>
        `;
      });
      animeContainer.innerHTML = output;
    });

}

const animeSelected = (id) => {
  sessionStorage.setItem('animeId', id)
  window.location = 'anime.html';
};

const getAnime = () => {

  const animeID = sessionStorage.getItem('animeId');
  fetch(`https://kitsu.io/api/edge/anime?filter[id]=${animeID}`)
    .then(response => {
      return response.json();
    })
    .then((animeData) => {
      const detail = animeData.data;
    
      let output = `
      <div class="container">
        <h1 class="slug-title">${detail[0].attributes.slug}</h1>
        <img src='${detail[0].attributes.coverImage.original}' class="img-fluid" />
        <div class="rating">
          <p class="lead"><span>Average Rating</span> - ${detail[0].attributes.averageRating}</p>
          <p class="lead"><span>Episode Count</span> - ${detail[0].attributes.episodeCount}</p>
        </div>
        <p class="lead text-center">${detail[0].attributes.synopsis}</p>
        <div class=" btn-div text-center">
          <button onclick="streamLinks()" type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">Stream Now</button>
        </div>
        <div class="modal fade" id="myModal">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h4 class="modal-title">Streaming Links</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div id="modal-body" class="modal-body">
              Fetchning Links...
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
      </div>
      `
      animeDetailContainer.innerHTML = output;
    });
};

  const streamLinks = () => {
    const animeID = sessionStorage.getItem('animeId');
    fetch(`https://kitsu.io/api/edge/anime/${animeID}/streaming-links`)
    .then(response => {
      return response.json();
    })
    .then((data) => {
      const streamData = data.data;
      let output = '';
      streamData.forEach((link) => {
        console.log(link);
        
        if (link === '') {
          output += `
          <p>No streaming links found! Sorry..</p>
        `;
        } else {
          output += `
          <ul>
          <li><a target="_blank" href="${link.attributes.url}"> Stream Here</a>
          </li>
        </ul>
          `;
        }
        
        const modalContainer = document.getElementById('modal-body');
        modalContainer.innerHTML = output;
      })
    })
    
  }



  //81d4fd