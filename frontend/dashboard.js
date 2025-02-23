document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/usuarios";
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "index.html";
      return;
    }
  
    const userListBody = document.getElementById("users-body");
    const editForm = document.getElementById("edit-form");
    const editId = document.getElementById("edit-id");
    const editNombre = document.getElementById("edit-nombre");
    const editEmail = document.getElementById("edit-email");
    const editRole = document.getElementById("edit-role");
    const editError = document.getElementById("edit-error");
    const logoutButton = document.getElementById("logout");
  
    // Cargar lista de usuarios
    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/listar`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const users = await response.json();
  
        if (!response.ok) throw new Error(users.mensaje);
  
        userListBody.innerHTML = "";
        users.forEach(user => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
              <button onclick="editUser(${user.id})">Editar</button>
              <button onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
          `;
          userListBody.appendChild(row);
        });
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        userListBody.innerHTML = "<tr><td colspan='5'>Error al cargar usuarios</td></tr>";
      }
    };
  
    // Editar usuario
    window.editUser = async (id) => {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const user = await response.json();
  
        if (!response.ok) throw new Error(user.mensaje);
  
        editId.value = user.id;  // Asegúrate de que el ID se establece aquí
        editNombre.value = user.nombre;
        editEmail.value = user.email;
        editRole.value = user.role;
        editError.textContent = "";  // Limpia errores previos
      } catch (error) {
        editError.textContent = "Error al cargar usuario: " + error.message;
      }
    };
  
    // Guardar cambios
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = editId.value;  // Obtener el ID del campo oculto
      const nombre = editNombre.value;
      const email = editEmail.value;
      const role = editRole.value;
  
      if (!id) {
        editError.textContent = "No se ha seleccionado un usuario para actualizar";
        return;
      }
  
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre, email, role }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje || "Error desconocido");
  
        alert("Usuario actualizado con éxito");
        editForm.reset();
        editError.textContent = "";
        loadUsers();
      } catch (error) {
        editError.textContent = "Error al actualizar: " + error.message;
        console.error("Error en PUT:", error);
      }
    });
  
    // Eliminar usuario
    window.deleteUser = async (id) => {
      if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
  
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje);
  
        alert("Usuario eliminado con éxito");
        loadUsers();
      } catch (error) {
        alert("Error al eliminar: " + error.message);
      }
    };
  
    // Cerrar sesión
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  
    // Cargar usuarios al iniciar
    loadUsers();
  });