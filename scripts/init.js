const h2 = document.createElement("h2");
h2.textContent = "Esse texto está sendo renderizado pelo init JavaScript.";

const h2Styled = document.createElement("h2");
h2Styled.textContent = "E sendo estilizado pelo CSS.";
h2Styled.classList.add("styled-text");

document.body.appendChild(h2);
document.body.appendChild(h2Styled);
