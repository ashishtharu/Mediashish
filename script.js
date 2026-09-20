const articles = [
 {cat:"Medicine", icon:"💊", title:"Understanding Medicines: Basic Safety Tips", text:"Simple reminders about labels, doses, storage and when to ask a healthcare professional."},
 {cat:"Nutrition", icon:"🥗", title:"Everyday Habits for a Balanced Diet", text:"Practical ways to build balanced meals and make healthier food choices."},
 {cat:"Fitness", icon:"🏃", title:"Why Regular Movement Matters", text:"Learn how regular physical activity can support overall health and daily energy."},
 {cat:"First Aid", icon:"🩹", title:"First Aid Basics Everyone Should Know", text:"An easy introduction to common first-aid principles and emergency preparedness."},
 {cat:"Wellness", icon:"🧘", title:"Simple Ways to Support Your Wellbeing", text:"Small daily habits that can support sleep, stress management and a healthier routine."},
 {cat:"Prevention", icon:"🛡️", title:"Everyday Health Prevention", text:"General preventive habits, checkups and practical steps for staying informed about your health."}
];

const grid = document.querySelector("#articlesGrid");
const search = document.querySelector("#search");
const count = document.querySelector("#resultCount");
const empty = document.querySelector("#empty");

function render(list){
  grid.innerHTML = list.map(a => `
    <article class="article">
      <div class="article-img">${a.icon}</div>
      <div class="article-body">
        <div class="tag">${a.cat}</div>
        <h3>${a.title}</h3>
        <p>${a.text}</p>
        <a class="read" href="#about">Read article →</a>
      </div>
    </article>`).join("");
  count.textContent = `${list.length} article${list.length===1?"":"s"}`;
  empty.hidden = list.length !== 0;
}
function filter(){
  const q = search.value.toLowerCase().trim();
  render(articles.filter(a => `${a.cat} ${a.title} ${a.text}`.toLowerCase().includes(q)));
}
search.addEventListener("input", filter);
document.querySelectorAll(".category").forEach(btn => btn.addEventListener("click",()=>{
  document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  const cat = btn.dataset.cat;
  search.value = "";
  render(articles.filter(a=>a.cat===cat));
  document.querySelector("#articles").scrollIntoView({behavior:"smooth"});
}));
document.querySelector(".menu").addEventListener("click",()=> {
  const nav=document.querySelector("nav");
  nav.style.display = nav.style.display==="flex" ? "" : "flex";
  nav.style.flexDirection="column";
  nav.style.position="absolute";
  nav.style.top="72px";
  nav.style.right="4%";
  nav.style.background="#fff";
  nav.style.padding="18px";
  nav.style.border="1px solid #dcebe6";
  nav.style.borderRadius="14px";
});
document.querySelector("#year").textContent = new Date().getFullYear();
render(articles);
