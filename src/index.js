let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(toy => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
      card.querySelector(".like-btn").addEventListener("click", () => {
        const newLikes = toy.likes + 1;
        fetch(`http://localhost:3000/toys/${toy.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
          .then(res => res.json())
          .then(updatedToy => {
            toy.likes = updatedToy.likes;
            card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
          });
      });
      toyCollection.appendChild(card);
    });

  addToyForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        image: formData.get("image"),
        likes: 0
      })
    })
    .then(res => res.json())
    .then(newToy => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${newToy.name}</h2>
        <img src="${newToy.image}" class="toy-avatar" />
        <p>${newToy.likes} Likes</p>
        <button class="like-btn" id="${newToy.id}">Like ❤️</button>
      `;
      card.querySelector(".like-btn").addEventListener("click", () => {
        const newLikes = newToy.likes + 1;
        fetch(`http://localhost:3000/toys/${newToy.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
        })
        .then(res => res.json())
        .then(updatedToy => {
          newToy.likes = updatedToy.likes;
          card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        });
      });
      toyCollection.appendChild(card);
      e.target.reset();
    });
  });
});
