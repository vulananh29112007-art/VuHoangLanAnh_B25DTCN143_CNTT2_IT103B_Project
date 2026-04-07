document.addEventListener("DOMContentLoaded", () => {

    const article = JSON.parse(localStorage.getItem("selectedArticle"));

    if (!article) return;

    const title = document.querySelector(".post-box h2");
    const content = document.querySelector(".post-box p");

    title.textContent = article.title;
    content.textContent = article.content;

});