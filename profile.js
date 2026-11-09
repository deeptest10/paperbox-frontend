async function loadProfile() {
    const status = document.getElementById("profile-status");

    try {
        const user = await getProfile();

        if (!user) {
            window.location.replace("login.html?next=profile");
            return;
        }

        document.getElementById("profile-username").textContent = user.username;
        document.getElementById("profile-email").textContent = user.email;
        document.getElementById("profile").hidden = false;
        status.textContent = "";
    } catch {
        status.textContent = "Не вдалося завантажити профіль. Оновіть сторінку.";
    }
}

document.getElementById("logout").addEventListener("click", () => {
    clearTokens();
    window.location.replace("index.html");
});

loadProfile();