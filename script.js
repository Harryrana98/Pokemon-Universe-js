const results = document.querySelector("#results");
const loadBtn = document.querySelector("#loadBtn");
const loading = document.querySelector(".loader");
const select = document.querySelector("select");
const searchInput = document.querySelector("input");

const API_KEY = "https://pokeapi.co/api/v2/pokemon";
const API_TYPE = "https://pokeapi.co/api/v2/type/?limit=21";

let offset = 0;
const limit = 20;
let allPokemon = [];

loading.style.display = "block";
loadBtn.style.display = "none";

async function getData() {
  const response = await fetch(`${API_KEY}?limit=${limit}&offset=${offset}`);
  const result = await response.json();

  await displayData(result.results);

  loading.style.display = "none";
  loadBtn.style.display = "block";
  loadBtn.disabled = false;
}
getData();

async function displayData(obj) {
  const promises = obj.map((item) => fetch(item.url).then((res) => res.json()));
  const results = await Promise.all(promises);
  allPokemon.push(...results);

  const shuffled = [...results].sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, 20);
  selected.forEach((pokemon) => createCard(pokemon));
}

function createCard(reslt) {
  const imgDiv = document.createElement("img");
  imgDiv.src = reslt.sprites.other.dream_world.front_default;

  const flip_card_front = document.createElement("div");
  flip_card_front.className = "flip-card-front";

  const flip_card_back = document.createElement("div");
  flip_card_back.className = "flip-card-back";

  const flip_card_inner = document.createElement("div");
  flip_card_inner.className = "flip-card-inner";

  const flip_card = document.createElement("div");
  flip_card.className = "flip-card";

  const name = document.createElement("p");
  name.innerText = reslt.name;
  const type = document.createElement("p");

  let types = reslt.types.map((twoType) => twoType.type.name);
  type.innerHTML = `<b>Type:</b> ${types.join(" , ")}`;

  const height = document.createElement("p");
  height.innerHTML = `Height : ${reslt.height}`;

  const weight = document.createElement("p");
  weight.innerHTML = `Weight : ${reslt.weight}`;

  const hp = document.createElement("p");
  hp.innerHTML = `Hp : ${reslt.stats[0].base_stat}`;

  const attack = document.createElement("p");
  attack.innerHTML = `Attack : ${reslt.stats[1].base_stat}`;

  const defense = document.createElement("p");
  defense.innerHTML = `Defense : ${reslt.stats[2].base_stat}`;

  const special_attack = document.createElement("p");
  special_attack.innerHTML = `Special_Attack : ${reslt.stats[3].base_stat}`;

  const special_defense = document.createElement("p");
  special_defense.innerHTML = `Special_Defense : ${reslt.stats[4].base_stat}`;

  const speed = document.createElement("p");
  speed.innerHTML = `Speed : ${reslt.stats[5].base_stat}`;

  flip_card_back.append(
    height,
    weight,
    hp,
    attack,
    defense,
    special_attack,
    special_defense,
    speed
  );

  flip_card_front.append(imgDiv, name, type);
  flip_card_inner.append(flip_card_front, flip_card_back);
  flip_card.append(flip_card_inner);

  results.appendChild(flip_card);
}

loadBtn.addEventListener("click", moreLoadPokemon);

async function moreLoadPokemon() {
  loading.style.display = "block";
  offset += limit;
  const response = await fetch(`${API_KEY}?limit=${limit}&offset=${offset}`);
  const result = await response.json();

  displayData(result.results);
  loading.style.display = "none";
}

async function getTypes() {
  const response = await fetch(API_TYPE);
  const result = await response.json();

  result.results.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.name;
    option.innerText = type.name;
    option.style.textTransform = "capitalize";
    select.append(option);
  });
}
getTypes();

select.addEventListener("change", async function (e) {
  const selectedType = e.target.value;
  results.innerHTML = "";

  if (selectedType === "") {
    allPokemon.forEach((pokemon) => {
      createCard(pokemon);
    });
    return;
  }

  const filteredPokemons = allPokemon.filter((pokemon) =>
    pokemon.types.some((t) => t.type.name === selectedType)
  );

  if (filteredPokemons.length === 0) {
    const heading = document.createElement("h1");
    heading.innerHTML =
      "This type does not exist or no Pokémon found for this type!";
    results.append(heading);
    loadBtn.style.display = "none";
  } else {
    filteredPokemons.forEach((pokemon) => {
      createCard(pokemon);
    });
  }
});

searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  results.innerHTML = "";
  let searchPoke = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchValue)
  );
  if (searchPoke.length === 0) {
    const heading = document.createElement("h1");
    heading.innerText = "No Pokémon found!";
    results.appendChild(heading);
  } else {
    searchPoke.forEach((pokemon) => {
      createCard(pokemon);
    });
  }
  loadBtn.style.display =
    searchPoke.length === 0 || searchValue ? "none" : "block";
});
