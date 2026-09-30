// Database simulation using localStorage for ENLOYADOS static platform

const INITIAL_USERS = [
  { id: 1, name: "Jose Perez", email: "pepe@email.com", password: "1234" },
  { id: 3, name: "Eduardo Poot", email: "eduardo@email.com", password: "1234" }
];

const INITIAL_MENU = [
  { 
    id: 1, 
    nombre: "Sushi Especial", 
    desc: "Roll de salmón con queso crema", 
    price: 120, 
    path: "img/menu/sushi-especial.jpg", 
    categoria: "Entrada" 
  },
  { 
    id: 7, 
    nombre: "California Roll", 
    desc: "El California Roll es un tipo de sushi estilo uramaki (rollo invertido) donde el arroz queda por fuera.", 
    price: 200, 
    path: "img/menu/20251212051136-Californiarolls.jpg", 
    categoria: "Plato fuerte" 
  },
  { 
    id: 8, 
    nombre: "Gyozas de Cerdo", 
    desc: "Empanaditas japonesas rellenas de cerdo y vegetales, doradas por un lado y al vapor por el otro.", 
    price: 85, 
    path: "img/menu/20251212052028-gyozas.jpg", 
    categoria: "Entrada" 
  },
  { 
    id: 9, 
    nombre: "Mochi de Té Verde", 
    desc: "Dulce japonés de masa de arroz suave y gelatinosa, rellena de helado de matcha. Refrescante y delicado.", 
    price: 60, 
    path: "img/menu/20251212052147-mochi.jpg", 
    categoria: "Postre" 
  },
  { 
    id: 10, 
    nombre: "Té Helado de Jasmine", 
    desc: "Té de flor de jazmín ligeramente endulzado y servido frío. Aroma floral y sabor suave.", 
    price: 45, 
    path: "img/menu/20251212052250-te.jpg", 
    categoria: "Bebida" 
  },
  { 
    id: 11, 
    nombre: "Tempura Roll", 
    desc: "Rollo de sushi relleno de camarón empanizado, pepino y aguacate. Cubierto con spicy mayo.", 
    price: 140, 
    path: "img/menu/20251212052340-tempura.jpg", 
    categoria: "Plato fuerte" 
  }
];

function initDB() {
  if (!localStorage.getItem("enloyados_users")) {
    localStorage.setItem("enloyados_users", JSON.stringify(INITIAL_USERS));
  }
  const rawMenu = localStorage.getItem("enloyados_menu");
  if (!rawMenu) {
    localStorage.setItem("enloyados_menu", JSON.stringify(INITIAL_MENU));
  } else {
    try {
      let parsed = JSON.parse(rawMenu);
      let updated = false;
      parsed.forEach(item => {
        if (item.path && item.path.startsWith("../img/")) {
          item.path = item.path.replace("../img/", "img/");
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem("enloyados_menu", JSON.stringify(parsed));
      }
    } catch (e) {}
  }
}

function getImageUrl(path) {
  if (!path) return "img/logo.png";
  if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  let cleanPath = path.replace(/^(\.\.\/)+/, "");
  if (!cleanPath.startsWith("img/")) {
    cleanPath = "img/" + cleanPath;
  }
  return cleanPath;
}

// Users Database Functions
function getUsers() {
  initDB();
  try {
    return JSON.parse(localStorage.getItem("enloyados_users")) || [];
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem("enloyados_users", JSON.stringify(users));
}

function addUser(name, email, password) {
  const users = getUsers();
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { success: false, message: "ESTE CORREO YA ESTA REGISTRADO" };
  }
  const maxId = users.reduce((max, u) => u.id > max ? u.id : max, 0);
  const newUser = { id: maxId + 1, name, email, password };
  users.push(newUser);
  saveUsers(users);
  return { success: true, message: "USUARIO REGISTRADO CORRECTAMENTE" };
}

function deleteUser(id) {
  let users = getUsers();
  users = users.filter(u => Number(u.id) !== Number(id));
  saveUsers(users);
}

// Menu Database Functions
function getMenu() {
  initDB();
  try {
    return JSON.parse(localStorage.getItem("enloyados_menu")) || [];
  } catch (e) {
    return INITIAL_MENU;
  }
}

function saveMenu(menu) {
  localStorage.setItem("enloyados_menu", JSON.stringify(menu));
}

function addMenuItem(nombre, desc, price, path, categoria) {
  const menu = getMenu();
  const maxId = menu.reduce((max, item) => item.id > max ? item.id : max, 0);
  const newItem = { 
    id: maxId + 1, 
    nombre, 
    desc, 
    price: Number(price), 
    path, 
    categoria 
  };
  menu.push(newItem);
  saveMenu(menu);
  return { success: true, message: "PLATILLO REGISTRADO CORRECTAMENTE" };
}

function deleteMenuItem(id) {
  let menu = getMenu();
  menu = menu.filter(item => Number(item.id) !== Number(id));
  saveMenu(menu);
}

// Session Authentication Functions
function checkAuth() {
  return sessionStorage.getItem("autentificado") === "SI";
}

function loginUser(email, password) {
  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (found) {
    sessionStorage.setItem("autentificado", "SI");
    sessionStorage.setItem("user_email", email);
    sessionStorage.setItem("user_name", found.name);
    return true;
  }
  return false;
}

function logoutUser() {
  sessionStorage.removeItem("autentificado");
  sessionStorage.removeItem("user_email");
  sessionStorage.removeItem("user_name");
  alert("Saliste del sistema");
  window.location.href = "login.html";
}

function requireAuth() {
  if (!checkAuth()) {
    window.location.href = "login.html";
  }
}

// Global toggle menu function matching header toggle
function toggleMenu() {
  var nav = document.getElementById('navMenu');
  if (nav) {
    nav.classList.toggle('active');
  }
}

function updateNavHeader() {
  const loginBtn = document.getElementById("nav-login-btn");
  if (loginBtn && checkAuth()) {
    loginBtn.href = "dashboard.html";
    loginBtn.innerText = "DASHBOARD";
  }
}

// Initialize DB immediately on script load
initDB();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateNavHeader);
} else {
  updateNavHeader();
}

