const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
let allTrainers = []

document.addEventListener('DOMContentLoaded', () => {

  const trainerContainer = document.querySelector('main')

  fetch(`${TRAINERS_URL}`)
  .then(r => r.json())
  .then((loadedTrainerData) => {
    allTrainers = loadedTrainerData
    trainerContainer.innerHTML = renderAllTrainers()
  })

  /*****************************************************************************
    * Event Listeners
  *****************************************************************************/

  trainerContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-pokemon')) {
      let trainerID=e.target.dataset.trainerId
      addPokemon(trainerID)
    }
    else if (e.target.classList.contains('release')) {
      console.log('released')
      let pokemonID=e.target.dataset.pokemonId
      deletePokemon(pokemonID)

    }
  })

})


/*******************************************************************************
  * Helper Functions
*******************************************************************************/

const renderAllTrainers = () => {
  return allTrainers.map((trainer) => trainerCardHTML(trainer)).join('')
}

const trainerCardHTML = (trainer) => {
  let returnHTML="";
  let pokemon=trainer.pokemons;
  returnHTML+=`
    <div class="card" data-id="${trainer.id}">
      <p>${trainer.name}</p>
      <button class="add-pokemon" data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
  `
  pokemon.forEach((pokemon)=>{
    returnHTML+=`
      <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>
    `
  })
  returnHTML+=`
    </ul>
  </div>
  `
  return returnHTML
}

const addPokemon = (id) => {
  let data={"trainer_id": id}
  console.log(data);
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(r => r.json())
  .then(addedPokemon => addPokemonToTrainer(addedPokemon))
}

const addPokemonToTrainer = (addedPokemon) => {
  const trainerContainer = document.querySelector('main')
  //Find that trainer in the allTrainers array, from addedPokemon.trainer_id

  //the trainer we want is allTrainers.search(where trainer.id===addedPokemon.trainer_id)
  let trainer=allTrainers.find(function(trainer){
    return trainer.id===addedPokemon.trainer_id
  })

  trainer.pokemons.push(addedPokemon);
  trainerContainer.innerHTML = renderAllTrainers()

  //Push addedPokemon into trainer.pokemons

  //Rerender all the trainers


}
const deletePokemon = (pokemonId) => {
  const trainerContainer = document.querySelector('main')

  fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: 'DELETE',
  })

  //Find the trainer that owns pokemon with given ID pokemonId
  let myTrainer = allTrainers.find(function(trainer) {
    //return true if trainer.pokemons has a pokemon with pokemonId;
    return trainer.pokemons.find(function(pokemon){
      return pokemon.id==pokemonId;
    })
  })

  console.log(myTrainer)


  myTrainer.pokemons=myTrainer.pokemons.filter(function(pokemon){
    return pokemon.id!=pokemonId
  })

  trainerContainer.innerHTML = renderAllTrainers()

}
