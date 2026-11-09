const authUrl = "http://127.0.0.1:8000/api/v1/auth/";

function clearTokens() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
}

function requestProfile(access) {
    return fetch(`${authUrl}me/`, {
        headers: { Authorization: `Bearer ${access}` },
    });
}

async function getProfile() {
    const access = sessionStorage.getItem("access_token");
    const refresh = sessionStorage.getItem("refresh_token");

    if (access) {
        const response = await requestProfile(access);

        if (response.ok) return response.json();
        if (response.status !== 401) throw new Error("Помилка запиту профілю");
    }

    if (!refresh) {
        clearTokens();
        return null;
    }

    const response = await fetch(`${authUrl}refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    if (response.status === 401) {
        clearTokens();
        return null;
    }
    if (!response.ok) throw new Error("Не вдалося оновити токен");

    const tokens = await response.json();
    sessionStorage.setItem("access_token", tokens.access);

    const profile = await requestProfile(tokens.access);
    if (profile.status === 401) {
        clearTokens();
        return null;
    }
    if (!profile.ok) throw new Error("Помилка запиту профілю");

    return profile.json();
}

async function showAccountNav() {
    const nav = document.getElementById("account-nav");
    if (!nav) return;

    try {
        const user = await getProfile();

        if (!user) {
            const link = document.createElement("a");
            link.href = "login.html";
            link.textContent = "Увійти";
            nav.replaceChildren(link);
            return;
        }

        const name = document.createElement("a");
        name.href = "profile.html";
        name.textContent = user.first_name || user.username;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Вийти";
        button.addEventListener("click", () => {
            clearTokens();
            showAccountNav();
        });

        nav.replaceChildren(name, " ", button);
    } catch {
        nav.textContent = "Не вдалося завантажити дані облікового запису.";
    }
}

showAccountNav();