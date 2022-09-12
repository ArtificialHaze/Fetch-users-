const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
document.addEventListener("DOMContentLoaded", () => {
  search.focus();
});

async function getUsers(username) {
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();

  createCard(respData);

  getRepositories(username);
}

async function getRepositories(username) {
  const resp = await fetch(APIURL + username + "/repos");
  const respData = await resp.json();

  addRepositoriesToCard(respData);
}

function createCard(user) {
  const { avatar_url, name, bio, followers, following, public_repos } = user;

  const cardInnerHtml = `
        <div class="card">
            <div>
                <img class="avatar" src="${avatar_url}" alt="${name}" />
            </div>
            <div class="user__info">
                <h2>${name === null ? "" : name}</h2>
                <p>${bio === null ? "" : bio}</p>
                <ul class="info">
                    <li>${followers}<strong>Followers</strong></li>
                    <li>${following}<strong>Following</strong></li>
                    <li>${public_repos}<strong>Repository</strong></li>
                </ul>
                <div id="repositories"></div>
            </div>
        </div>
    `;

  main.innerHTML = cardInnerHtml;
}

function addRepositoriesToCard(repositories) {
  const repoElements = document.getElementById("repositories");

  repositories
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((repo) => {
      const repoElement = document.createElement("a");
      repoElement.classList.add("repository");

      repoElement.href = repo.html_url;
      repoElement.target = "_blank";
      repoElement.innerText = repo.name;

      repoElements.appendChild(repoElement);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUsers(user);

    search.value = "";
  }
});
