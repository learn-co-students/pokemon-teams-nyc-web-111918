document.addEventListener("DOMContentLoaded", function(){
  const BASE_URL = "http://localhost:3000"
  const TRAINERS_URL = `${BASE_URL}/trainers`
  const POKEMONS_URL = `${BASE_URL}/pokemons`
  const trainerContainer = document.querySelector("#trainer-container")


  //Initial Fetch
  renderTrainers()

  //LISTENERS
  trainerContainer.addEventListener("click", function(e){
    if (e.target.dataset.id === "add-btn") {
      if (e.target.nextElementSibling.getElementsByTagName("li").length < 6) {
        const trainerID = e.target.dataset.trainerid
        fetch(POKEMONS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "trainer_id": trainerID
          })
        })
          .then(res => res.json())
          .then(pokemon => {
            e.target.nextElementSibling.innerHTML += `
              <li>${pokemon.nickname} (${pokemon.species}) <button id="release-btn"
              class = "release" data-pokemon-id=${pokemon.id}>Release</button></li>
            `
          })
      }
    }
  })  // End of AddPokemon Listener

  trainerContainer.addEventListener("click", function(e){
    if(e.target.className === "release"){
      const pokemonID = e.target.dataset.pokemonId
      fetch(POKEMONS_URL+`/${pokemonID}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(pokemon => {
        renderTrainers()
        })
    }

  }) // End of Remove Pokemon Listener

  //HELPERS
  function renderTrainers(){
    fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainers => {
      const trainersHTML = trainers.map(function(trainer){
        const pokemonHTML = trainer.pokemons.map(function(pokemon){
          return (`
            <li>${pokemon.nickname} (${pokemon.species}) <button id="release-btn"
            class="release" data-pokemon-id=${pokemon.id}>Release</button></li>
          `)
        }).join("")
          return (`
          <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
            <button data-id="add-btn" data-trainerid=${trainer.id}>Add Pokemon</button>
            <ul>
              ${pokemonHTML}
            </ul>
          </div>
          `)
        }).join("")
    trainerContainer.innerHTML = trainersHTML
    })
  } // End of renderTrainers Helper

})  // End of DOMContentLoaded
