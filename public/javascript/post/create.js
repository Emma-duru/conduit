const form = document.querySelector("#create-form");
const titleError = document.querySelector(".title-error");
const descError = document.querySelector(".description-error");
const bodyError = document.querySelector(".body-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  titleError.textContent = "";
  descError.textContent = "";
  bodyError.textContent = "";

  const title = form.title.value;
  const description = form.description.value;
  const body = form.body.value;
  const user = form.user.value;

  try {
    const res = await fetch("/create", {
      method: "POST",
      body: JSON.stringify({ title, description, body }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.post) {
      location.assign(`/${user}`);
    }
    if (data.errors) {
      titleError.textContent = data.errors.title;
      descError.textContent = data.errors.description;
      bodyError.textContent = data.errors.body;
    }
  } catch (err) {
    console.log(err);
  }
});
