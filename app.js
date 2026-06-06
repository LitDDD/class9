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
  {n: "毛颢憬", w: 1}, {n: "吴宇桐", w: 1},
  {n: "郑淇友", w: 1}, {n: "钱诚", w: 1}
];

// 预处理：过滤权重为0的学生，提升后续性能
const validStudents = students.filter(s => s.w === 1);
const validNameList = validStudents.map(s => s.n);

let used = [];
let rollTimer = null;
let rollSpeed = 80; // 初始滚动速度
const rollDuration = 2200; // 总滚动时长
let rollStartTime = 0;

// DOM元素缓存（避免重复查询）
const dom = {
  display: document.getElementById('name-display'),
  btn: document.getElementById('start-btn'),
  listEl: document.getElementById('member-list'),
  historyEl: document.getElementById('history-row'),
  totalCount: document.getElementById('total-count'),
  calledCount: document.getElementById('called-count'),
  allowRepeat: document.getElementById('allowRepeat'),
  memberTotal: document.getElementById('member-total')
};

// 批量渲染名单（减少DOM操作）
function renderList() {
  const fragment = document.createDocumentFragment();
  validNameList.forEach(name => {
    const div = document.createElement('div');
    div.className = 'name-item px-4 py-3 rounded-xl text-sm';
    div.textContent = name;
    fragment.appendChild(div);
  });
  dom.listEl.innerHTML = '';
  dom.listEl.appendChild(fragment);
  
  // 统一更新计数
  const total = validNameList.length;
  dom.totalCount.textContent = total;
  dom.memberTotal.textContent = total;
}

// 获取可用名单（核心优化：优先过滤权重0+已抽取）
function getAvailableNames() {
  if (dom.allowRepeat.checked) {
    return [...validNameList];
  }
  // 过滤已抽取的学生
  const available = validNameList.filter(n => !used.includes(n));
  // 无可用时重置已抽取列表
  return available.length > 0 ? available : [...validNameList];
}

// 生成随机名称（优化随机算法）
function getRandomName() {
  const available = getAvailableNames();
  return available[Math.floor(Math.random() * available.length)];
}

// 滚动逻辑（改用定时器，降低性能消耗）
function roll() {
  const now = Date.now();
  const elapsed = now - rollStartTime;
  
  // 随时间增加滚动间隔（模拟减速）
  if (elapsed > rollDuration) {
    stopRoll();
    return;
  }
  
  // 动态调整速度（减速系数）
  const slowFactor = 1 + (elapsed / rollDuration) * 5;
  dom.display.textContent = getRandomName();
  
  rollTimer = setTimeout(roll, rollSpeed * slowFactor);
}

// 停止滚动并记录结果
function stopRoll() {
  clearTimeout(rollTimer);
  rollTimer = null;
  dom.btn.textContent = '开始抽取';

  const winner = dom.display.textContent;
  if (!dom.allowRepeat.checked && !used.includes(winner)) {
    used.push(winner);
  }
  
  // 更新计数
  dom.calledCount.textContent = used.length;

  // 创建历史记录节点（减少样式重计算）
  const chip = document.createElement('div');
  chip.className = 'history-chip px-4 py-2 rounded-xl text-sm whitespace-nowrap';
  chip.textContent = winner;
  dom.historyEl.prepend(chip);
}

// 按钮点击事件（防抖+状态控制）
dom.btn.addEventListener('click', function () {
  if (rollTimer) return;

  dom.btn.textContent = '正在抽取...';
  rollStartTime = Date.now();
  roll();
});

// 初始化
renderList();
