const loginUrl = "http://127.0.0.1:8000/api/v1/auth/login/";
const form = document.getElementById("login-form");
const statusText = document.getElementById("status");
const nextPage = new URLSearchParams(window.location.search).get("next");
if (nextPage === "profile") {
    document.querySelector("#register-link").href = "register.html?next=profile";
}
const destination = nextPage === "profile" ? "profile.html" : "index.html";

async function redirectIfLoggedIn() {
    try {
        const user = await getProfile();

        if (user) {
            window.location.replace(destination);
        }
    } catch {
        statusText.textContent = "Не вдалося перевірити стан входу.";
    }
}

redirectIfLoggedIn();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = {
        username: form.elements.username.value.trim(),
        password: form.elements.password.value,
    };

    statusText.textContent = "Виконується вхід...";

    try {
        const response = await fetch(loginUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            statusText.textContent = "Неправильне ім’я користувача або пароль.";
            return;
        }

        if (!response.ok) {
            statusText.textContent = "Не вдалося увійти. Спробуйте ще раз.";
            return;
        }

        const tokens = await response.json();
        sessionStorage.setItem("access_token", tokens.access);
        sessionStorage.setItem("refresh_token", tokens.refresh);

        window.location.replace(destination);
    } catch {
        statusText.textContent = "Не вдалося з’єднатися із сервером.";
    }
});