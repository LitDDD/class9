const students = [
  {n: "吴子君", w: 1}, {n: "赵妍", w: 1}, {n: "唐粲", w: 1},
  {n: "马娅菲", w: 1}, {n: "谢佳成", w: 1}, {n: "张煜", w: 1},
  {n: "黎馨迪", w: 1}, {n: "包雨轩", w: 1}, {n: "袁懿轩", w: 1},
  {n: "罗羽菡", w: 1}, {n: "赵思琪", w: 1}, {n: "吴泽昌", w: 1},
  {n: "邓智中", w: 1}, {n: "何欣儿", w: 1}, {n: "张景越", w: 1},
  {n: "宁俊翔", w: 1}, {n: "徐梓轩", w: 1}, {n: "罗子涵", w: 1},
  {n: "叶梓萱", w: 1}, {n: "丁靖轩", w: 1}, {n: "邓恩琦", w: 1},
  {n: "蒲奕豪", w: 1}, {n: "张恒瑞", w: 1}, {n: "吴屹涵", w: 1},
  {n: "廖俊瑄", w: 1}, {n: "黄梓琪", w: 1}, {n: "段泓宇", w: 1},
  {n: "张桠霏", w: 1}, {n: "魏子为", w: 1}, {n: "廖玮峰", w: 1},
  {n: "吴桐", w: 1}, {n: "廖惜琳", w: 1}, {n: "唐一为", w: 1},
  {n: "叶枝繁", w: 1}, {n: "石浠彤", w: 1}, {n: "刘子逸", w: 1},
  {n: "汤玉一", w: 1}, {n: "钟佳妮", w: 1}, {n: "薛梓妍", w: 1},
  {n: "陈志铭", w: 1}, {n: "刘凯", w: 1}, {n: "刘雅桐", w: 1},
  {n: "徐浩然", w: 1}, {n: "黄鹏翰", w: 1}, {n: "刘川沪", w: 1},
  {n: "孙倬成", w: 1}, {n: "赵若帆", w: 1}, {n: "丁莟雅", w: 1},
  {n: "刘浩冉", w: 1}, {n: "毛颢憬", w: 1}, {n: "吴宇桐", w: 1},
  {n: "郑淇友", w: 1}, {n: "钱诚", w: 1}
];

const nameList = students.map(s => s.n);
let used = [];
let animationId = null;
let lastTime = 0;
let baseDelay = 80;
let slowFactor = 1;

const display = document.getElementById('name-display');
const btn = document.getElementById('start-btn');
const listEl = document.getElementById('member-list');
const historyEl = document.getElementById('history-row');
const totalCount = document.getElementById('total-count');
const calledCount = document.getElementById('called-count');
const allowRepeat = document.getElementById('allowRepeat');

function renderList() {
  listEl.innerHTML = '';
  nameList.forEach(name => {
    const div = document.createElement('div');
    div.className = 'name-item px-4 py-3 rounded-xl text-sm';
    div.textContent = name;
    listEl.appendChild(div);
  });
  totalCount.textContent = nameList.length;
  document.getElementById('member-total').textContent = nameList.length;
}

function getRandomName() {
  let available = allowRepeat.checked ? [...nameList] : nameList.filter(n => !used.includes(n));
  if (available.length === 0) available = [...nameList];
  return available[Math.floor(Math.random() * available.length)];
}

function roll(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta > baseDelay * slowFactor) {
    display.textContent = getRandomName();
    lastTime = timestamp;
    slowFactor *= 1.06;
  }
  animationId = requestAnimationFrame(roll);
}

function stopRoll() {
  cancelAnimationFrame(animationId);
  animationId = null;
  btn.textContent = '开始抽取';

  const winner = display.textContent;
  if (!allowRepeat.checked) used.push(winner);
  calledCount.textContent = used.length;

  const chip = document.createElement('div');
  chip.className = 'history-chip px-4 py-2 rounded-xl text-sm whitespace-nowrap';
  chip.textContent = winner;
  historyEl.prepend(chip);
}

btn.onclick = function () {
  if (animationId) return;

  btn.textContent = '正在抽取...';
  slowFactor = 1;
  lastTime = 0;
  animationId = requestAnimationFrame(roll);

  setTimeout(stopRoll, 2200);
};

renderList();
