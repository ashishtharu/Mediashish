/* products.js — real shared product database (Firebase Firestore).
   Every visitor, on any device/browser, sees the same live product list.
   Requires firebase-config.js to be filled in (see SETUP.md). */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const productsCol = collection(db, "products");

function hhFormatPrice(amount) {
  const n = Number(amount) || 0;
  return "Rs. " + n.toLocaleString("en-IN");
}

/* ---------- live shop grid on index.html ---------- */
function hhRenderShop(products) {
  const grid = document.querySelector("#productsGrid");
  if (!grid) return;
  const empty = document.querySelector("#productsEmpty");
  const visible = products.filter(p => p.active !== false);

  if (visible.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = visible.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span>${p.icon || "🩺"}</span>`}
      </div>
      <div class="product-body">
        <div class="tag">${p.category || "General"}</div>
        <h3>${p.name}</h3>
        ${p.description ? `<p>${p.description}</p>` : ""}
        <div class="product-footer">
          <span class="price">${hhFormatPrice(p.price)}</span>
          ${p.stock === false ? `<span class="stock-badge out">Out of stock</span>` : `<span class="stock-badge in">In stock</span>`}
        </div>
        <span class="view-details">View details →</span>
      </div>
    </article>`).join("");

  grid.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const product = visible.find(p => p.id === card.dataset.id);
      if (product) hhOpenProductModal(product);
    });
  });
  if (window.hhReveal) window.hhReveal(grid);
}

/* ---------- product detail modal ---------- */
function hhDetailRow(label, value) {
  return value ? `<div class="modal-detail"><b>${label}</b><span>${value}</span></div>` : "";
}
function hhOpenProductModal(p) {
  const overlay = document.querySelector("#productModal");
  if (!overlay) return;
  document.querySelector("#modalImage").innerHTML = p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : `<span>${p.icon || "🩺"}</span>`;
  document.querySelector("#modalTag").textContent = p.category || "General";
  document.querySelector("#modalName").textContent = p.name;
  document.querySelector("#modalDesc").textContent = p.description || "";
  document.querySelector("#modalDetails").innerHTML = [
    hhDetailRow("Composition", p.composition),
    hhDetailRow("Uses & benefits", p.uses),
    hhDetailRow("Side effects", p.sideEffects),
    hhDetailRow("Dosage", p.dosage),
    hhDetailRow("How to take", p.howToTake)
  ].join("");
  document.querySelector("#modalPrice").textContent = hhFormatPrice(p.price);
  const stockEl = document.querySelector("#modalStock");
  stockEl.textContent = p.stock === false ? "Out of stock" : "In stock";
  stockEl.className = "stock-badge " + (p.stock === false ? "out" : "in");
  const buyBtn = document.querySelector("#modalBuyBtn");
  if (p.buyLink && p.stock !== false) {
    buyBtn.href = p.buyLink;
    buyBtn.style.display = "block";
  } else {
    buyBtn.style.display = "none";
  }
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function hhCloseProductModal() {
  const overlay = document.querySelector("#productModal");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
const hhModalOverlay = document.querySelector("#productModal");
const hhModalCloseBtn = document.querySelector("#modalCloseBtn");
if (hhModalCloseBtn) hhModalCloseBtn.addEventListener("click", hhCloseProductModal);
if (hhModalOverlay) hhModalOverlay.addEventListener("click", (e) => {
  if (e.target === hhModalOverlay) hhCloseProductModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hhCloseProductModal();
});

/* Live-updates: any change made in the admin panel (on any device) pushes
   here instantly, on every open tab of the site. */
onSnapshot(productsCol, (snapshot) => {
  const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  hhRenderShop(products);
  window.hhLatestProducts = products; // used by admin.js
  window.dispatchEvent(new CustomEvent("hh-products-updated", { detail: products }));
}, (err) => console.error("Product sync error:", err));

/* ---------- exposed for admin.js ---------- */
window.hhSaveProduct = async (product) => {
  const id = product.id || String(Date.now());
  await setDoc(doc(db, "products", id), { ...product, id });
};
window.hhDeleteProduct = async (id) => {
  await deleteDoc(doc(db, "products", id));
};
window.hhAuth = auth;
window.hhSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
window.hhSignOut = () => signOut(auth);
window.hhOnAuthStateChanged = (cb) => onAuthStateChanged(auth, cb);
window.hhUpdatePassword = (newPassword) => updatePassword(auth.currentUser, newPassword);
