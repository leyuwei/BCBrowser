const blocksStream = document.getElementById("blocksStream");
const blockHeightEl = document.getElementById("blockHeight");
const tpsEl = document.getElementById("tps");
const nodesEl = document.getElementById("nodes");
const gasPriceEl = document.getElementById("gasPrice");
const latencyEl = document.getElementById("latency");
const dailyTxEl = document.getElementById("dailyTx");
const tvlEl = document.getElementById("tvl");
const confirmTimeEl = document.getElementById("confirmTime");
const contractsEl = document.getElementById("contracts");
const tpsDeltaEl = document.getElementById("tpsDelta");
const gasDeltaEl = document.getElementById("gasDelta");

const tpsChart = document.getElementById("tpsChart");
const gasChart = document.getElementById("gasChart");

const moduleKeys = ["auth", "interaction", "privacy", "supervision"];

let blockHeight = 1284302;
let tps = 3184;
let gasPrice = 38.2;
let nodes = 1024;
let dailyItems = 142093201;
let poolSize = 93.4;
let syncTime = 1.4;
let contracts = 289421;

const tpsSeries = new Array(40).fill(0).map(() => 2800 + Math.random() * 800);
const gasSeries = new Array(40).fill(0).map(() => 30 + Math.random() * 20);

const randomHex = (length) =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const randomAddress = () => `0x${randomHex(4)}...${randomHex(4)}`;

const formatNumber = (value) => value.toLocaleString("en-US");

const createBlockElement = (data) => {
  const item = document.createElement("div");
  item.className = "block-item";
  item.innerHTML = `
    <div class="block-id">#${data.height}</div>
    <div class="block-meta">
      <div>Hash: <span>${data.hash}</span></div>
      <div>协同节点: <span>${data.peer}</span></div>
      <div>时间: <span>${data.time}</span></div>
      <div>事物: <span>${data.itemCount}</span></div>
    </div>
    <div class="block-tags">
      <span class="tag">${data.size} KB</span>
      <span class="tag">资源负载 ${data.load}M</span>
      <span class="tag">共识评分 ${data.score}</span>
    </div>
  `;
  return item;
};

const addBlock = () => {
  blockHeight += 1;
  const data = {
    height: blockHeight,
    hash: randomHex(12),
    peer: randomAddress(),
    time: new Date().toLocaleTimeString("zh-CN"),
    itemCount: Math.floor(1200 + Math.random() * 2400),
    size: (1.2 + Math.random() * 3.8).toFixed(2),
    load: (12 + Math.random() * 8).toFixed(2),
    score: (92 + Math.random() * 7).toFixed(1),
  };
  const element = createBlockElement(data);
  blocksStream.prepend(element);

  if (blocksStream.children.length > 16) {
    blocksStream.removeChild(blocksStream.lastElementChild);
  }
};

const updateMetrics = () => {
  tps += (Math.random() - 0.5) * 180;
  gasPrice += (Math.random() - 0.5) * 2.2;
  nodes += Math.floor((Math.random() - 0.4) * 6);
  dailyItems += Math.floor(50000 + Math.random() * 50000);
  poolSize += (Math.random() - 0.5) * 0.4;
  syncTime += (Math.random() - 0.5) * 0.06;
  contracts += Math.floor(120 + Math.random() * 260);

  tps = Math.max(1200, Math.round(tps));
  gasPrice = Math.max(12, Number(gasPrice.toFixed(2)));
  nodes = Math.max(900, nodes);
  poolSize = Math.max(40, Number(poolSize.toFixed(2)));
  syncTime = Math.max(0.6, Number(syncTime.toFixed(2)));

  blockHeightEl.textContent = formatNumber(blockHeight);
  tpsEl.textContent = formatNumber(tps);
  nodesEl.textContent = formatNumber(nodes);
  gasPriceEl.textContent = gasPrice.toFixed(2);
  latencyEl.textContent = `${Math.floor(8 + Math.random() * 18)}ms`;

  dailyTxEl.textContent = formatNumber(dailyItems);
  tvlEl.textContent = `${poolSize.toFixed(1)}PB`;
  confirmTimeEl.textContent = `${syncTime.toFixed(2)}s`;
  contractsEl.textContent = formatNumber(contracts);
};

const drawChart = (canvas, series, accent) => {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const max = Math.max(...series) * 1.05;
  const min = Math.min(...series) * 0.95;
  const step = width / (series.length - 1);

  ctx.beginPath();
  series.forEach((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / (max - min)) * height;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 12;
  ctx.stroke();

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `${accent}55`);
  gradient.addColorStop(1, "transparent");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowBlur = 0;
};

const updateCharts = () => {
  tpsSeries.shift();
  gasSeries.shift();
  tpsSeries.push(tps + (Math.random() - 0.5) * 200);
  gasSeries.push(gasPrice + (Math.random() - 0.5) * 2.5);

  drawChart(tpsChart, tpsSeries, "#00f0ff");
  drawChart(gasChart, gasSeries, "#7c5bff");

  const tpsDelta = ((tpsSeries.at(-1) - tpsSeries.at(-2)) / tpsSeries.at(-2)) * 100;
  const gasDelta = ((gasSeries.at(-1) - gasSeries.at(-2)) / gasSeries.at(-2)) * 100;

  tpsDeltaEl.textContent = `${tpsDelta >= 0 ? "+" : ""}${tpsDelta.toFixed(1)}%`;
  gasDeltaEl.textContent = `${gasDelta >= 0 ? "+" : ""}${gasDelta.toFixed(1)}%`;
  tpsDeltaEl.style.color = tpsDelta >= 0 ? "#66ffd3" : "#ff6b7a";
  gasDeltaEl.style.color = gasDelta >= 0 ? "#66ffd3" : "#ff6b7a";
};

const moduleStatusContent = {
  auth: {
    status: ["运行正常", "合约守护", "一致性良好"],
    desc: ["合约群签名一致性校验中", "多节点信誉阈值持续达标", "认证共识持续同步中"],
  },
  interaction: {
    status: ["运行正常", "链路稳定", "交互顺畅"],
    desc: ["多域协同编排与路由畅通", "跨域协同触发器实时响应", "链路语义映射持续优化"],
  },
  privacy: {
    status: ["运行正常", "隐私就绪", "守护中"],
    desc: ["可验证加密通道持续守护", "隐私计算沙箱稳定运行", "零泄露策略覆盖全流程"],
  },
  supervision: {
    status: ["运行正常", "合规同步", "审计就绪"],
    desc: ["合规策略与审计轨迹齐备", "监管规则映射实时校验", "风险巡检合约持续运行"],
  },
};

const updateModules = () => {
  moduleKeys.forEach((key) => {
    const statusEl = document.getElementById(`status-${key}`);
    const descEl = document.getElementById(`desc-${key}`);
    const meterEl = document.getElementById(`meter-${key}`);
    const latencyElModule = document.getElementById(`latency-${key}`);
    const loadElModule = document.getElementById(`load-${key}`);
    const { status, desc } = moduleStatusContent[key];

    const nextStatus = status[Math.floor(Math.random() * status.length)];
    const nextDesc = desc[Math.floor(Math.random() * desc.length)];
    const nextLatency = Math.floor(16 + Math.random() * 18);
    const nextLoad = Math.floor(52 + Math.random() * 24);
    const meterWidth = 70 + Math.random() * 25;

    statusEl.textContent = nextStatus;
    descEl.textContent = nextDesc;
    latencyElModule.textContent = `延迟 ${nextLatency}ms`;
    loadElModule.textContent = `负载 ${nextLoad}%`;
    meterEl.style.width = `${meterWidth}%`;
  });
};

const boot = () => {
  blocksStream.innerHTML = "";
  for (let i = 0; i < 8; i += 1) {
    addBlock();
  }
  updateMetrics();
  updateCharts();
  updateModules();
};

boot();

setInterval(() => {
  addBlock();
  updateMetrics();
  updateCharts();
  updateModules();
}, 1400);
