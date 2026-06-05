document.addEventListener("DOMContentLoaded", function() {
    
    // helper function to remove redundant code
    function animate_button(button){
        button.style.transition = "transform 0.2s ease-in-out";
        button.addEventListener("mouseover", function() {
            button.style.transform = "scale(1.1)";
        });
        button.addEventListener("mouseout", function() {
            button.style.transform = "scale(1)";
        });
    }
    
    const modal_template = `
        <div id="details-modal" style="display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000;">
            <div id="modal-content" style="background-color: rgba(26, 23, 23, 0.7); display: block; position: fixed; top: 50%; left: 50%; width: 450px; height: auto; transform: translate(-50%, -50%); padding: 20px; border-radius: 10px;">
                <button id="close-btn" style="margin-top: 10px; padding: 8px 12px; background-color: #ff4d4d; color: white; border: none; border-radius: 5px; cursor: pointer; width: 15%; height: 15%;">X</button>
                <h2 id="pokemon-name" style="text-align: center; color: white;"></h2>
                <img id="pokemon-image" src="" alt="Pokemon Image" style="display: block; margin: 0 auto; width: 50%; height: auto;">
                <p id="pokemon-types" style="text-align: center; color: white;"></p>
                <p style="text-align: center; color: white;">Abilities:</p>
                <div id="pokemon-abilities-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; text-align: center;"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modal_template);

    let current_model = null;

    function create_Card(pokemonData){

        const pokemonItem = document.createElement("li");
        pokemonItem.classList.add("pokemon-item");
        pokemonItem.textContent = pokemonData.name;
        pokemonItem.style.listStyle = "none";
        const pokemonItemDev = document.createElement("div");
        pokemonItem.appendChild(pokemonItemDev);

        const button = document.createElement("button");
        button.textContent = "Show Details";
        button.classList.add("details-button");
        animate_button(button);

        pokemonItemDev.appendChild(button);

        // handles creating the modal
        button.addEventListener("click", function() {
            const modal = document.getElementById("details-modal");

            modal.style.display = "block";
            modal.style.opacity = 0;
            modal.style.transition = "opacity 0.3s ease-in-out";
            
            setTimeout(() => {
                modal.style.opacity = 1;
            }, 10);
            document.getElementById("pokemon-name").textContent = pokemonData.name;
            document.getElementById("pokemon-image").src = pokemonData.sprites.front_default;
            document.getElementById("pokemon-types").textContent = "Types: " + pokemonData.types.map(type => type.type.name).join(", ");
            const abilitiesGrid = document.getElementById("pokemon-abilities-grid");
            pokemonData.abilities.forEach(ability => {
                const abilityDiv = document.createElement("div");
                abilityDiv.textContent = ability.ability.name;
                abilityDiv.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                abilityDiv.style.padding = "8px";
                abilityDiv.style.borderRadius = "5px";
                abilityDiv.style.color = "white";
                abilitiesGrid.appendChild(abilityDiv);
            });
            current_model = modal;

            const closeBtn = document.getElementById("close-btn");
            
            animate_button(closeBtn);
            
            closeBtn.onclick = function() {
                
                modal.style.transition = "opacity 0.3s ease-in-out";
                modal.style.opacity = 0;

                modal.addEventListener("transitionend", function handleClose() {
                    modal.style.display = "none";
                    modal.removeEventListener("transitionend", handleClose);
                });

                current_model = null;

                while (abilitiesGrid.firstChild) {
                    abilitiesGrid.removeChild(abilitiesGrid.firstChild);
                }

            }

        });

        const img = document.createElement("img");
        img.src = pokemonData.sprites.front_default;
        img.style.height = "128px";
        pokemonItemDev.appendChild(img);

        return pokemonItem;
    }

    const pokemonNames = `bulbasaur
ivysaur
venusaur
charmander
charmeleon
charizard
squirtle
wartortle
blastoise
caterpie
metapod
butterfree
weedle
kakuna
beedrill
pidgey
pidgeotto
pidgeot
rattata
raticate
spearow
fearow
ekans
arbok
pikachu
raichu
sandshrew
sandslash
nidoran♀
nidorina
nidoqueen
nidoran♂
nidorino
nidoking
clefairy
clefable
vulpix
ninetales
jigglypuff
wigglytuff
zubat
golbat
oddish
gloom
vileplume
paras
parasect
venonat
venomoth
diglett`;


    const pokemonList = document.getElementById("pokemon-list");
    const pokemonArray = pokemonNames.split("\n");
    let delay = 0;

    for (const name of pokemonArray){
        setTimeout(() => {
            fetch("https://pokeapi.co/api/v2/pokemon/" + name).then(response => response.json()).then(data => {
                const pokemonItem = create_Card(data);
                pokemonList.appendChild(pokemonItem);

                // animate spawning of the pokemon card fading
                pokemonItem.style.opacity = 0;
                pokemonItem.style.transform = "scale(1.1)";
                setTimeout(() => {
                    pokemonItem.style.transition = "opacity 0.5s ease-in-out transform 0.2s ease-in-out";
                    pokemonItem.style.opacity = 1;
                    pokemonItem.style.transform = "scale(1)";
                }, 100);

            }).catch(error => {
                console.error("Error fetching data for " + name, error);
            });
        }, delay);
        delay += 200; // increase delay for the next pokemon
    }

});
