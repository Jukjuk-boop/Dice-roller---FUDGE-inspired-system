const td = document.getElementById("td");
const skill = document.getElementById("skill");
const mod = document.getElementById("mod");
const adv = document.getElementById("adv");

const tdVal = document.getElementById("tdVal");
const skillVal = document.getElementById("skillVal");
const modVal = document.getElementById("modVal");

const rollBtn = document.getElementById("rollBtn");
const resultText = document.getElementById("resultText");
const resultCard = document.getElementById("resultCard");
const diceRow = document.getElementById("diceRow");
const oddsBar = document.getElementById("oddsBar");

[td, skill, mod].forEach(input=>{
  input.oninput = ()=> updateLabels();
});

function updateLabels(){
  tdVal.textContent = td.value;
  skillVal.textContent = skill.value;
  modVal.textContent = mod.value;
  updateOdds();
}

function rollDie(){ return Math.ceil(Math.random()*6); }

function buildDice(pool, keep){
  diceRow.innerHTML = "";
  pool.forEach((d,i)=>{
    const die = document.createElement("div");
    die.className = "die " + (d>=4?"pos":"neg") + (i<keep?" keep":"");
    die.textContent = d;
    diceRow.appendChild(die);
  });
}

function setResult(type,text){
  resultCard.className = "card result " + type + " pop";
  resultText.textContent = text;
  setTimeout(()=>resultCard.classList.remove("pop"),150);
}

rollBtn.onclick = ()=>{
  const poolSize = 2 + Number(skill.value);
  const keep = 2;

  let pool = Array.from({length:Math.max(poolSize,2)}, rollDie);

  if(adv.value==1) pool.push(rollDie());
  if(adv.value==-1) pool.pop();

  pool.sort((a,b)=>b-a);
  const kept = pool.slice(0,keep);

  const sum = kept.reduce((a,b)=>a+b,0) + Number(mod.value);
  const success = sum >= Number(td.value);

  const positives = kept.filter(d=>d>=4).length;
  const negatives = kept.length - positives;

  if(success && positives>negatives) setResult("yesand","YES AND");
  else if(success) setResult("yesbut","YES BUT");
  else if(!success && positives>negatives) setResult("nobut","NO BUT");
  else setResult("noand","NO AND");

  buildDice(pool, keep);
};

function updateOdds(){
  oddsBar.innerHTML = "";

  const segs = [
    {label:"YES AND", val:25, color:"var(--yesand)"},
    {label:"YES BUT", val:25, color:"var(--yesbut)"},
    {label:"NO BUT", val:25, color:"var(--nobut)"},
    {label:"NO AND", val:25, color:"var(--noand)"}
  ];

  segs.forEach(s=>{
    const div = document.createElement("div");
    div.className = "seg";
    div.style.width = s.val+"%";
    div.style.background = s.color;
    div.textContent = s.label;
    oddsBar.appendChild(div);
  });
}

updateLabels();