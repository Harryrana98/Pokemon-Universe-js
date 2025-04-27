const results = document.querySelector("#results");
const loadBtn=document.querySelector("#loadBtn")

const API_KEY = "https://pokeapi.co/api/v2/pokemon";
const API_TYPE = " https://pokeapi.co/api/v2/type/?limit=21";

let offset=0
const limit=20

async function getData() {
  const response = await fetch(`${API_KEY}?limit=${limit}&offset=${offset}`);
  const result = await response.json();
  // console.log(result.results);
  displayData(result.results);
}
getData();

async function displayData(obj) {
  // results.innerHTML=""
  for (const item of obj) {
    const res = await fetch(item.url);
    const reslt = await res.json();

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


    // console.log(reslt);
    //   console.log(item.url);

    // front content
    const name = document.createElement("p");
    name.innerText = reslt.name;
    const type = document.createElement("p");
    type.innerHTML = `<b>Type:</b> ${reslt.types[0].type.name}`;

    // back side content
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
}

loadBtn.addEventListener("click",moreLoadPokemon)


async function moreLoadPokemon(){
  offset+=limit
  const response=await fetch(`${API_KEY}?limit=${limit}&offset=${offset}`)
  const result=await response.json()
  // console.log(result.results);
  displayData(result.results)

}

