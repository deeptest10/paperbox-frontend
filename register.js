const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#register-message");
const loginLink = document.querySelector("#login-link");

const nextPage = new URLSearchParams(window.location.search).get("next");
if (nextPage === "profile") {
    loginLink.href = "login.html?next=profile";
}

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    registerMessage.textContent = "";
    for (const error of registerForm.querySelectorAll("small")) {
        error.textContent = "";
    }

    const data = Object.fromEntries(new FormData(registerForm));
    const button = registerForm.querySelector("button");
    button.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            window.location.replace(loginLink.href);
            return;
        }

        const result = await response.json();
        registerMessage.textContent =
            result.error?.message || "Не вдалося зареєструватися.";

        for (const [field, messages] of Object.entries(result.error?.details || {})) {
            const fieldError = document.getElementById(`error-${field}`);
            if (fieldError) {
                fieldError.textContent = Array.isArray(messages)
                    ? messages.join(" ")
                    : messages;
            }
        }
    } catch {
        registerMessage.textContent =
            "Не вдалося отримати відповідь сервера. Спробуйте ще раз.";
    } finally {
        button.disabled = false;
    }
});