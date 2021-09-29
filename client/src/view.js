import { html, render } from "lit";
import { matchmakingBalanced, currentMatch } from "./matchmaking.js";
import { currentPlayers, addGame } from "./firebase.js";

const playerList = document.querySelector("#playerList");
const matchForm = document.querySelector("#matchForm");

const team1VictoryButton = document.querySelector("#team1Victory");

render("loading...", playerList);

export function renderPlayerList() {
  render(
    [...currentPlayers.entries()].map(([id, player]) => {
      return html`
        <label class="player">
          <input type="checkbox" name="players" checked value="${id}" />
          <span>${player.name}</span>
          <span>${player.rating}</span>
        </label>
      `;
    }),
    playerList
  );
}

matchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(matchForm);

  const players = formData
    .getAll("players")
    .map((id) => ({ ...currentPlayers.get(id), _id: id }));

  const teamSize = formData.get("teamSize");

  try {
    matchmakingBalanced(players, teamSize);
  } catch (error) {
    console.error(error);
    alert(error);
  }
});

for (const button of document.querySelectorAll(".victoryButton")) {
  button.addEventListener("click", () => {
    const winningTeamNumber = parseInt(event.target.name);
    const losingTeamNumber = winningTeamNumber ^ 1; // XOR with 1 | (1 -> 0, 0 -> 1)
    const data = {
      winners: currentMatch[winningTeamNumber].slice(
        0,
        currentMatch[winningTeamNumber].length - 1
      ),
      losers: currentMatch[losingTeamNumber].slice(
        0,
        currentMatch[losingTeamNumber].length - 1
      ),
    };
    console.log(data);
    addGame(data);
  });
}
