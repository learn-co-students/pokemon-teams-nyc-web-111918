const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

  const pokemonContainer = document.getElementsByTagName('ul')
  const pokeMain = document.querySelector('main')
  console.log(pokemonContainer)
  let all_trainers = []
  let all_pokemon;

  function renderSinglePokemon(pokemon){
      return`<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-id="${pokemon.id}">Release</button></li>`
  }
  function renderAllPokemon(collection){
      return  collection.map(renderSinglePokemon)
  }

  fetch('http://localhost:3000/trainers', {method: 'GET'})
  .then(res => (res.json()))
  .then(test => {
    all_trainers = test
    pokeMain.innerHTML = all_trainers.map(trainer =>{
      const pokemon = renderAllPokemon(trainer.pokemons).join("")
      return `
      <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
        <button data-id='${trainer.id}'>Add Pokemon</button>
        <ul>
          ${pokemon}
        </ul>
      </div>`
    }).join('')
  })

pokeMain.addEventListener('click',function(e){
  if (e.target.innerText === 'Release'){
    event.target.parentNode.remove()
    fetch(`http://localhost:3000/pokemons/${e.target.dataset.id}`, {method: 'DELETE'})
  } else if (e.target.innerText === 'Add Pokemon'){
    fetch('http://localhost:3000/pokemons/', {
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trainer_id: e.target.dataset.id
      })
    })
    .then(r => r.json())
      .then(pokemon =>{
      if(!pokemon.error){
        trainerContainer = pokemonContainer[e.target.dataset.id - 1]
        trainerContainer.innerHTML += `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-id="${pokemon.id}">Release</button></li>`
      }
    })
  }
})
