document.addEventListener('DOMContentLoaded', function() {

  const BASE_URL = "http://localhost:3000"
  const TRAINERS_URL = `${BASE_URL}/trainers`
  const POKEMONS_URL = `${BASE_URL}/pokemons`
  const main = document.querySelector('main')
  let allTrainers = []

  function appendingOneTrainer(trainer) { // this should be changed at some point
    let trainerCard = `<div class="card" id="trainer-${trainer.id}" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button class="add-pokemon" data-id="${trainer.id}">Add Pokemon</button>
      <ul></ul>
    </div>`

    return trainerCard
  }

  function appendingOnePokemon(pokemon) {
    let pokemonCard = `
    <li id="pokemon-card-${pokemon.id}">
      ${pokemon.nickname} (${pokemon.species})
      <button class="release" id="pokemon-${pokemon.id}" data-id=${pokemon.id}>Release</button>
    </li>`

    return pokemonCard
  }


  fetch(TRAINERS_URL)
    .then( response => response.json())
    .then( trainerData => {
      trainerData.forEach( function(trainer) {
        allTrainers.push(trainer)
        main.innerHTML += appendingOneTrainer(trainer)

        let trainerDiv = main.querySelector(`#trainer-${trainer.id}`)
        // console.log(trainer.pokemons.length)
        trainer.pokemons.forEach( function(pokemon) {
          trainerDiv.innerHTML += appendingOnePokemon(pokemon)

        }) // end of appendingOnePokemon
      }) // end of appendingOneTrainer
    })// end of the fetch(TRAINERS_URL)


    main.addEventListener("click", function(event){
      console.log(event.target.className)
      if (event.target.className === "add-pokemon") {
        console.log(event.target)
        //event.target gives us the trainer id through data-trainer-1
        const selectedTrainer = allTrainers.find( trainer => trainer.id == event.target.dataset.id )

        console.log(selectedTrainer.id)

        if (selectedTrainer.pokemons.length === 6) {
          alert("fuck no")
        } else {
          fetch(POKEMONS_URL, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              trainer_id: selectedTrainer.id
            })
          })

          .then( response => response.json())
          .then( addedPokemon => {
            let trainerDiv = main.querySelector(`#trainer-${selectedTrainer.id}`)
            trainerDiv.innerHTML += appendingOnePokemon(addedPokemon)
            const trainerIndex = allTrainers.indexOf(selectedTrainer)
            allTrainers[trainerIndex].pokemons.push(addedPokemon)
          })

        } // end of if (selectedTrainer.pokemons.length === 6)

      } else if (event.target.className === "release") {

        fetch(`${POKEMONS_URL}/${event.target.dataset.id}`, {
          method: "DELETE"
        }).then( response => {
          if (response.ok) {
            let trainerDiv = event.target.parentElement.parentElement
            let deletedPokemon = trainerDiv.querySelector(`#pokemon-card-${event.target.dataset.id}`)

            deletedPokemon.remove()
          }
        })

      } // end of if (event.target.className === "release")
    }) // end of addEventListener("click")




}) // end of DOMContentLoaded
