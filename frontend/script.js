document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const API_URL = "http://localhost:5000/api/usuarios";

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const errorElement = document.getElementById("register-error");

    try {
      const response = await fetch(`${API_URL}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, role: "user" }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.mensaje);
        registerForm.reset();
      } else {
        errorElement.textContent = data.mensaje || "Error en el registro";
      }
    } catch (error) {
      errorElement.textContent = "Error de conexión con el servidor";
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorElement = document.getElementById("login-error");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        errorElement.textContent = data.mensaje || "Error en el login";
      }
    } catch (error) {
      errorElement.textContent = "Error de conexión con el servidor";
    }
  });
});