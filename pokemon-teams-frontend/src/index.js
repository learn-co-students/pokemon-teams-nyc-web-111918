const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

let pokemonArray = []
let allTrainers = []

document.addEventListener("DOMContentLoaded", ()=>{
  // const pokemonTeamsDiv = document.querySelector("#pokemon-teams")
  const mainContainer = document.querySelector("main")
  // const pokemonList = mainContainer.querySelector("")

// Get and Show All Trainers
function renderTrainerCards() {
  fetch(TRAINERS_URL, {
    method: "GET"
  })// end of fetch get trainers
  .then(res=>res.json()
  )
  .then((trainers)=>{
    allTrainers = trainers
    mainContainer.innerHTML = ''
    // const unorderedList = document.querySelector("li")
    trainers.map((trainer)=>{
      // debugger
      mainContainer.innerHTML+= `
      <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
        <button data-trainer-id=${trainer.id}>Add Pokemon</button>
        <ul data-id-pokemon-list=${trainer.id}>
        ${trainer.pokemons.map((pokemon)=>{
          return `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
        }).join('')}
        </ul>
      </div>`
      })
    }) //end of fetch
  }
  renderTrainerCards();


  // Get All Pokemon
  fetch(POKEMONS_URL)
    .then( resp => resp.json())
    .then( pokemons => {
      allPokemon = pokemons
      console.log(allPokemon);
    })

  mainContainer.addEventListener("click", e => {
    if (e.target.dataset.trainerId) {
      const foundTrainer = allTrainers.find((trainer) => {
        return trainer.id == e.target.dataset.trainerId
      })
      if (foundTrainer.pokemons.length < 6) {
        addPokemon(foundTrainer)
      }
    }// end of if
    else if(e.target.dataset.pokemonId){
      // console.log(e.target.parentElement);

      // console.log(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`);
      fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
        method: "DELETE",
        headers:{
          "Content-Type": "application/json"
        }//end of headers
      })// end of fetch
      .then(()=>{
      })
      //*********************FROM LECTURE REVIEW***********
      e.target.parentElement.remove()
    // but the placement of this else if breaks the add pokemon button...
      //********************************************************
      // renderTrainerCards()


      // //delete
      // const foundTrainer = allTrainers.find((trainer) => {
      //   return trainer.id == e.target.dataset.trainerId
      // })
      // const foundPokemon = foundTrainer.pokemons.find((pokemon)=>{
      //   return pokemon.id == e.target.dataset.pokemonId
      // })
      // console.log(foundPokemon);
    }//end of else if

  })// end of main container event listener

  function addPokemon(trainer) {
    fetch(POKEMONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "trainer_id": trainer.id
      })
    })
    .then( resp => resp.json())
    .then( pokemon => {
      renderTrainerCards();
    }) // comment this out because it no longer works due to our nested event listener
    // we should make the renderTrainerCards function only wrap the part where we change the HTML
  }



})// end of DOMContentLoaded

// document.querySelector("[data-id]")
// <div class=​"card" data-id=​"1">​…​</div>​
// .remove()
