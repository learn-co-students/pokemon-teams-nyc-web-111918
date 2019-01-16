// GLOBAL VARIABLES

const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainerContainer = document.querySelector("#trainer-container")
// END OF GLOBAL VARIABLES

/***********************EVENT LISTENERS**********************/
document.addEventListener("DOMContentLoaded", event => {
  fetch(TRAINERS_URL)
  .then(r => r.json())
  .then(trainerJson => {
    trainerContainer.innerHTML = formatTrainers(trainerJson)})

})

trainerContainer.addEventListener('click', event => {
const addButton = event.target.dataset.action;
// Current event target is the button that's been clicked.
// To enable us to edit the specific pokemon, when a release button is clicked.
// We need to have dataset attriabutes that match on the ul tag, and the release button

const pokeUl = document.querySelector(`[data-poke-list="${event.target.dataset.trainerId}"]`)

// console.log(event.target.dataset.trainerId)
// If we click the add button the trainer card should render a new pokemon.
// WHERE ARE ALL THE POKEMON!?!!!
// Do a post request when we hit the add button.

if(addButton === 'add') {
  fetch(POKEMONS_URL, {
    method: 'POST',
    headers:
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      trainer_id: event.target.dataset.trainerId
    })
  })
  .then(r => r.json())
  .then(pokeJson => {
    if (pokeJson.error) {
      window.alert('STOP THE MADNESS! YOU CAN ONLY HAVE 6 POKEMANS ON YOUR TEAM')
    } else {
        pokeUl.innerHTML += formatOnePokemon(pokeJson)
    }
    }) // end of Fetch

}

  if (event.target.className === 'release') {
    const pokeId = event.target.id
    const pokeLi = document.getElementById(`${pokeId}`)
    fetch(`${POKEMONS_URL}/${pokeId}`, {
      method: "DELETE"
    }) // end of fetch delete
    pokeLi.remove()
  }
}); //END OF CLICK EVENT LISTENER


/******************************************************************/


/***********************HELPER FUNCTION*******************************/

// FORMATS ALL TRAINERS (ARRAY OF TRAINER OBJECTS) -- USE FOR MULTIPLE TRAINERS/POKEMONS
function formatTrainers(trainers) {
  return trainers.map(trainer => {
    return `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
              <button data-action="add" data-trainer-id="${trainer.id}">Add Pokemon</button>
              <ul data-poke-list="${trainer.id}">
                  ${trainer.pokemons.map(pokemon => {
                    return `<li id="${pokemon.id}">  ${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.trainer_id}" id="${pokemon.id}">Release</button></li>`}
                  ).join('')}
              </ul>
            </div>`
  }).join('')
}

// FORMATS ONE POKEMON (USED FOR ADD/DELETE BUTTON)
function formatOnePokemon(pokemon) {
    return `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.trainer_id}" id="${pokemon.id}">Release</button></li>`
}
 // end of formatTrainers
