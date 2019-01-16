const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main')
  function addPokemon(trainer){
    let pokemons = trainer.pokemons
    let liTags = ''
    pokemons.forEach(function(pokemon){
      liTags += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button> </li>`
    })
    return liTags
  }

  function addTrainer(trainer){
    return `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
      ${addPokemon(trainer)}
      </ul>
    </div>`
  }

  fetch(TRAINERS_URL)
  .then(rev => rev.json())
  .then(trainers => trainers.forEach(function(trainer){
    main.innerHTML += addTrainer(trainer)
  }))

  main.addEventListener('click', () => {
    if(event.target.className === 'release'){
      const trainerID = event.path[3].dataset.id
      const pokemonID = event.target.dataset.pokemonId

      event.target.parentElement.remove()
      console.log(typeof(event.target.parentElement));


      fetch(`${POKEMONS_URL}/${pokemonID}`,{
        method: "DELETE"
      })
    }

    if (event.target.innerHTML === 'Add Pokemon' && event.target.nextElementSibling.children.length < 6) {
      console.log(event.target.nextElementSibling.children.length);
      const trainerId = +event.target.dataset.trainerId
      const trainerUl = event.target.nextElementSibling
      fetch('http://localhost:3000/pokemons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({
            trainer_id: trainerId
          })
      }).then(r => r.json())
      .then(pokemon => trainerUl.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id=${pokemon.id}>Release</button> </li>`)
    }
  })
})
