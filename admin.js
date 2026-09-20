/* admin.js — Firebase Auth login gate + Firestore product CRUD.
   The admin password is verified by Firebase's own servers — it is never
   stored in this code or visible via browser dev tools. */

const loginScreen = document.querySelector("#loginScreen");
const dashboard = document.querySelector("#dashboard");
const logoutBtn = document.querySelector("#logoutBtn");

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
  logoutBtn.hidden = false;
}
function showLogin() {
  loginScreen.hidden = false;
  dashboard.hidden = true;
  logoutBtn.hidden = true;
}

window.hhOnAuthStateChanged((user) => {
  if (user) showDashboard();
  else showLogin();
});

document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#emailInput").value.trim();
  const password = document.querySelector("#passwordInput").value;
  const errorMsg = document.querySelector("#loginError");
  const submitBtn = e.target.querySelector("button[type=submit]");
  errorMsg.hidden = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";
  try {
    await window.hhSignIn(email, password);
  } catch (err) {
    errorMsg.textContent = "Login failed: " + (err.code === "auth/invalid-credential" ? "wrong email or password." : err.message);
    errorMsg.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";
  }
});

logoutBtn.addEventListener("click", () => window.hhSignOut());

document.querySelector("#passwordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPassword = document.querySelector("#newPassword").value;
  const saved = document.querySelector("#passwordSaved");
  const error = document.querySelector("#passwordError");
  saved.hidden = true;
  error.hidden = true;
  try {
    await window.hhUpdatePassword(newPassword);
    document.querySelector("#newPassword").value = "";
    saved.hidden = false;
    setTimeout(() => (saved.hidden = true), 2500);
  } catch (err) {
    error.textContent = "Could not update password: " + err.message;
    error.hidden = false;
  }
});

/* ---------- product CRUD ---------- */

const productForm = document.querySelector("#productForm");
const formTitle = document.querySelector("#formTitle");
const cancelEditBtn = document.querySelector("#cancelEditBtn");

function resetForm() {
  productForm.reset();
  document.querySelector("#productId").value = "";
  document.querySelector("#pStock").checked = true;
  formTitle.textContent = "Add a product";
  cancelEditBtn.hidden = true;
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = e.target.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";
  try {
    const product = {
      id: document.querySelector("#productId").value || undefined,
      name: document.querySelector("#pName").value.trim(),
      category: document.querySelector("#pCategory").value,
      price: Number(document.querySelector("#pPrice").value) || 0,
      description: document.querySelector("#pDescription").value.trim(),
      composition: document.querySelector("#pComposition").value.trim(),
      uses: document.querySelector("#pUses").value.trim(),
      sideEffects: document.querySelector("#pSideEffects").value.trim(),
      dosage: document.querySelector("#pDosage").value.trim(),
      howToTake: document.querySelector("#pHowToTake").value.trim(),
      image: document.querySelector("#pImage").value.trim(),
      buyLink: document.querySelector("#pBuyLink").value.trim(),
      stock: document.querySelector("#pStock").checked,
      active: true
    };
    await window.hhSaveProduct(product);
    resetForm();
  } catch (err) {
    alert("Could not save product: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save product";
  }
});

cancelEditBtn.addEventListener("click", resetForm);

function editProduct(id) {
  const product = (window.hhLatestProducts || []).find(p => p.id === id);
  if (!product) return;
  document.querySelector("#productId").value = product.id;
  document.querySelector("#pName").value = product.name;
  document.querySelector("#pCategory").value = product.category;
  document.querySelector("#pPrice").value = product.price;
  document.querySelector("#pDescription").value = product.description || "";
  document.querySelector("#pComposition").value = product.composition || "";
  document.querySelector("#pUses").value = product.uses || "";
  document.querySelector("#pSideEffects").value = product.sideEffects || "";
  document.querySelector("#pDosage").value = product.dosage || "";
  document.querySelector("#pHowToTake").value = product.howToTake || "";
  document.querySelector("#pImage").value = product.image || "";
  document.querySelector("#pBuyLink").value = product.buyLink || "";
  document.querySelector("#pStock").checked = product.stock !== false;
  formTitle.textContent = "Edit product";
  cancelEditBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.editProduct = editProduct;

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  try {
    await window.hhDeleteProduct(id);
  } catch (err) {
    alert("Could not delete product: " + err.message);
  }
}
window.deleteProduct = deleteProduct;

/* Render the admin list whenever products.js pushes a fresh snapshot.
   products.js sets window.hhLatestProducts on every update; we just
   re-render the admin list on the same cadence via a light poll-free
   MutationObserver-free approach: hook into the same onSnapshot data by
   re-rendering whenever the shop grid re-renders. */
const adminListTarget = document.querySelector("#adminProductList");
function renderAdminList() {
  if (!adminListTarget) return;
  const products = window.hhLatestProducts || [];
  document.querySelector("#productCount").textContent = products.length;
  document.querySelector("#noProducts").hidden = products.length !== 0;
  adminListTarget.innerHTML = products.map(p => `
    <div class="admin-product-row">
      <div class="admin-product-info">
        <b>${p.name}</b>
        <span class="muted">${p.category} · Rs. ${Number(p.price).toLocaleString("en-IN")}${p.stock === false ? " · Out of stock" : ""}</span>
      </div>
      <div class="admin-product-actions">
        <button class="btn secondary small" onclick="editProduct('${p.id}')">Edit</button>
        <button class="btn secondary small danger" onclick="deleteProduct('${p.id}')">Delete</button>
      </div>
    </div>`).join("");
}
// products.js dispatches this event on load and on every live change.
window.addEventListener("hh-products-updated", renderAdminList);
