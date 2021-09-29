import { html, render } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { matchmakingBalanced } from "./matchmaking.js";
import { currentPlayers, addGame } from "./firebase.js";

const playerList = document.querySelector("#playerList");
const matchForm = document.querySelector("#matchForm");

const team1Container = document.getElementById("team1");
const team2Container = document.getElementById("team2");

render("loading...", playerList);

export function renderPlayerList() {
  render(
    repeat(
      [...currentPlayers.entries()],
      ([id, player]) => id,
      ([id, player]) => {
        return html`
          <label class="player">
            <input type="checkbox" name="players" checked value="${id}" />
            <span>${player.name}</span>
            <span>${player.rating}</span>
          </label>
        `;
      }
    ),
    playerList
  );
}

const teamResultTemplate = (players, totalMMR) => {
  return html`
    ${players.map((player) => html` <span>${player.name} - ${player.rating}</span><br />`)}
    <span>Total team MMR: ${totalMMR}</span>
  `;
};

let currentMatch;

matchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(matchForm);

  const players = formData.getAll("players").map((id) => ({ ...currentPlayers.get(id), _id: id }));

  const teamSize = formData.get("teamSize");

  try {
    currentMatch = matchmakingBalanced(players, teamSize);

    render(teamResultTemplate(currentMatch[0].slice(0, teamSize), currentMatch[0].at(-1)), team1Container);

    render(teamResultTemplate(currentMatch[1].slice(0, teamSize), currentMatch[1].at(-1)), team2Container);

    document.querySelectorAll(".victoryButton").forEach((button) => {
      button.classList.remove("hidden");
    });
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
