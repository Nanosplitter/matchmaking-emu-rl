import { matchmakingBalanced } from "./matchmaking.js";
import { currentPlayers } from "./firebase.js";

const playerList = document.querySelector("#playerList");
const matchForm = document.querySelector("#matchForm");

export function renderPlayerList() {
  playerList.innerHTML = [...currentPlayers.entries()]
    .map(([id, player]) => {
      return /*html*/ `
        <label class="player">
          <input type="checkbox" name="players" checked value="${id}"/>
          <span>${player.name}</span>
          <span>${player.rating}</span>
        </label>
      `;
    })
    .join("");
}

matchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(matchForm);

  const players = formData
    .getAll("players")
    .map((id) => currentPlayers.get(id));

  const teamSize = formData.get("teamSize");

  try {
    matchmakingBalanced(players, teamSize);
  } catch (error) {
    console.error(error);
    alert(error);
  }
});
