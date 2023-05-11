const pokemonContainer = document.querySelector(".pokemon-container")

const prevButton = document.querySelector(".prev")
const nextvButton = document.querySelector(".next")
const pageSpan = document.querySelector(".page-index")

const spinner = document.querySelector(".spinner")

const ITEMS_PER_PAGE = 24
let page = 0
let max

async function getPokemons(offset, limit){
    pageSpan.innerHTML = page + 1
    spinner.classList.remove("hidden")
    pageSpan.classList.add("hidden")
    nextvButton.disable = true
    prevButton.disable = true

    const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`
    )
    const json = await res.json()

    max = json.count

    const pokemons = await Promise.all(
        json.results.map(async ({url}) =>{
            const pokemonRes = await fetch(url)
            return pokemonRes.json()
        })
    )
    
    pageSpan.classList.remove("hidden")
    spinner.classList.add("hidden")
    nextvButton.disable = false
    prevButton.disable = false

    render(pokemons)
}

function render(pokemons){
    pokemonContainer.innerHTML = null
    pokemons.forEach((pokemon) => {
        const card = `
            <li class="card" onClick="this.classList.toggle('flipped')">
                <img
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}"
                    loading="lazy"
                    class="sprite"

                />
                <p class="name">${pokemon.name}</p>
                </li>
                    `   
                    
                    pokemonContainer.innerHTML += card
    }
    )
}

prevButton.addEventListener("click", () => {
    if (page - 1 < 0) return
    page--
    getPokemons(ITEMS_PER_PAGE * page, ITEMS_PER_PAGE)
})

nextvButton.addEventListener("click", () => {
    if(page + 1 > Math.floor(max / ITEMS_PER_PAGE)) return
    page++
    getPokemons(ITEMS_PER_PAGE * page, ITEMS_PER_PAGE)
})
getPokemons(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE)