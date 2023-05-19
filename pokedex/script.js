let allPokemon = []; //tableau qui contiendra tous les pokemons
let tableauFin = []; //tableau qui contiendra tous les pokemons en francais et la bonne image 
const searchInput = document.querySelector('.recherche-poke input'); //input de recherche
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');
const types = { //objet qui contiendra les types de pokemons
    grass: '#78c850',
    ground: '#E2BF65',
    dragon: '#6F35FC',
    fire: '#F58271',
    electric: '#F7D02C',
    fairy: '#D685AD',
    poison: '#966DA3',
    bug: '#B3F594',
    water: '#6390F0',
    normal: '#D9D5D8',
    psychic: '#F95587',
    flying: '#A98FF3',
    fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'

}

//Animation Input
searchInput.addEventListener('input', function (e){
    if (e.target.value !== "") { //si l'input est vide
        e.target.parentNode.classList.add('active-input'); //on ajoute la classe active-input
         } else if (e.target.value === ""){
             e.target.parentNode.classList.remove('active-input'); //sinon on enleve la classe active-input
         }
})
//Fonction qui va chercher les pokemons de base
function fetchPokemonBase() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151") //on demande les 151 pokemons de l'api
    .then(reponse => reponse.json()) //on transforme la reponse en json
    .then((allPoke) => {
        //on recupere le tableau de tous les pokemons
        //console.log(allPoke);
        allPoke.results.forEach((pokemon) => { // on parcourt le tableau de tous les pokemons
                fetchPokemonComplet(pokemon); // on appelle la fonction fetchPokemonComplet pour chaque pokemon
        })
    })
}
fetchPokemonBase();

//Fonction qui va chercher les infos des pokemons
function fetchPokemonComplet(pokemon) {
    let objPokemonFull = {}; //objet qui contiendra toutes les infos des pokemons en francais, type et image
    let url = pokemon.url; //url du pokemon
    let nameP = pokemon.name; //nom du pokemon

    fetch(url) //on demande les infos du pokemon
    .then(reponse => reponse.json()) //on transforme la reponse en json
    .then((pokeData) => { //on recupere le tableau de toutes les infos du pokemon

        objPokemonFull.pic = pokeData.sprites.front_default; //on recupere l'url de l'image du pokemon de face 
        objPokemonFull.type = pokeData.types[0].type.name; //on recupere le type du pokemon
        objPokemonFull.id = pokeData.id; // on recupere l'id du pokemon

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`) //on demande les infos de la specie du pokemon
        .then(reponse => reponse.json()) //on transforme la reponse en json
        .then((pokeData) =>{ //on recupere le tableau de toutes les infos de la specie du pokemon

            objPokemonFull.name = pokeData.names[4].name; //on recupere le nom de la specie du pokemon 
            allPokemon.push(objPokemonFull); //on rajoute l'objet au tableau de tous les pokemons

            if(allPokemon.length === 151) {
                //si le tableau de tous les pokemons est plein
                tableauFin = allPokemon.sort((a, b) => {
                    //on trie le tableau de tous les pokemons
                    return a.id - b.id; //on trie par id 3 retour possibes : 1, -1, 0
                }).slice(0, 21); // on recupere les 21 premiers pokemons

                createCard(tableauFin); //on ajoute les 21 premiers pokemons dans la liste 
                chargement.style.display = "none";            }

        })

    })
}

//Création des cartes 
function createCard (arr) { //fonction qui va créer  les carte

    for (let i = 0; i < arr.length; i++) { //on parcours le tableau de tous les pokemons
        const carte = document.createElement('li'); //on cree une carte 
        let couleur = types[arr[i].type]; //on recupere la couleur du type du pokemon
        carte.style.background = couleur; //on ajoute la couleur du type du pokemon
        const txtCarte = document.createElement('h5'); //on crée un titre
        txtCarte.innerText = arr[i].name; //on ajoute le nom du pokemon
        const idCarte = document.createElement('p'); //on crée un id
        idCarte.innerText = `ID# ${arr[i].id}`; //on ajoute l'id du pokemon
        const imgCarte = document.createElement('img'); //on ajoute l'url de l'image du pokemon 
        imgCarte.src = arr[i].pic; //on ajoute l'url de l'image  du pokemon

        carte.appendChild(imgCarte); //on ajoute l'image dans la carte
        carte.appendChild(txtCarte); //on ajoute le titre dans la carte
        carte.appendChild(idCarte); // on ajoute l'id dans la carte 

        listePoke.appendChild(carte); // on ajoute la carte dans la liste 
    }

}

//csroll infini
window.addEventListener('scroll', () =>{
     //on ecoute le scroll
     const { scrollTop, scrollHeight, clientHeight } =document.documentElement; // on recupere les infos du scroll 
     //scrolltop = scroll depuis le top 
     // scrollHeihgt = scroll toral de la page 
     // clientHeight = hauteur de la fenetre, partie visible 

     if(clientHeight + scrollTop >= scrollHeight - 20) {
         //si on est a la fin du scroll 
         addPoke(6); // on ajoute les 6 derniers pokemon
     }
})

let index = 21; //index de la liste des pokemons 

function addPoke(nb) {
    //la fonction qui vas ajouter les 6 derniers pokemons
        if (index > 151) {
            //si on est a la fin du tableau 
            return; 
        }
 const arrToAdd = allPokemon.slice(index, index + nb); //on recupere les 6 derniers pokemon
 console.log(index,index + nb ); // on affiche les index de la liste 
 createCard(arrToAdd); //on ajouter les 6 derniers pokemon 
 index += nb; // on incremente l'index  
        
}

//barre de recherche 
searchInput.addEventListener('keyup', recherche); // on ecoute le clavier ù

function recherche(){
    if (index < 151) { // si on est pas a la fin du tableau
    addPoke(130);
    }

    let filter, allLi, titleValue, allTitles; // on declare les variables
    filter = searchInput.value.toUpperCase(); // on recupere le resultat de la recherche en majuscule 
    allLi = document.querySelectorAll('li'); //on recupere toutes les cartes 
    allTitles = document.querySelectorAll('li > h5'); // on recupere tout les titres h5 

        for (i=0; i < allLi.length; i++){ //on recupere toutes le cartes 
            titleValue = allTitles[i].innerText; // on recupere les titres de la carte (nom d'un pokemon )

            if (titleValue.toUpperCase().indexOf(filter) > -1) { // si le titre contient la recherche
                allLi[i].style.display = "flex"; // on affiche la carte 
            
    }else {
        allLi[i].style.display = "none"; // on cache la carte 
    }

}

}