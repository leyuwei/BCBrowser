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

let blockHeight = 1284302;
let tps = 3184;
let gasPrice = 38.2;
let nodes = 1024;
let dailyTx = 142093201;
let tvl = 93.4;
let confirmTime = 1.4;
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
      <div>矿工: <span>${data.miner}</span></div>
      <div>时间: <span>${data.time}</span></div>
      <div>交易: <span>${data.txCount}</span></div>
    </div>
    <div class="block-tags">
      <span class="tag">${data.size} KB</span>
      <span class="tag">Gas ${data.gas}M</span>
      <span class="tag">${data.reward} OMN</span>
    </div>
  `;
  return item;
};

const addBlock = () => {
  blockHeight += 1;
  const data = {
    height: blockHeight,
    hash: randomHex(12),
    miner: randomAddress(),
    time: new Date().toLocaleTimeString("zh-CN"),
    txCount: Math.floor(1200 + Math.random() * 2400),
    size: (1.2 + Math.random() * 3.8).toFixed(2),
    gas: (12 + Math.random() * 8).toFixed(2),
    reward: (1.5 + Math.random() * 0.6).toFixed(2),
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
  dailyTx += Math.floor(50000 + Math.random() * 50000);
  tvl += (Math.random() - 0.5) * 0.4;
  confirmTime += (Math.random() - 0.5) * 0.06;
  contracts += Math.floor(120 + Math.random() * 260);

  tps = Math.max(1200, Math.round(tps));
  gasPrice = Math.max(12, Number(gasPrice.toFixed(2)));
  nodes = Math.max(900, nodes);
  tvl = Math.max(40, Number(tvl.toFixed(2)));
  confirmTime = Math.max(0.6, Number(confirmTime.toFixed(2)));

  blockHeightEl.textContent = formatNumber(blockHeight);
  tpsEl.textContent = formatNumber(tps);
  nodesEl.textContent = formatNumber(nodes);
  gasPriceEl.textContent = gasPrice.toFixed(2);
  latencyEl.textContent = `${Math.floor(8 + Math.random() * 18)}ms`;

  dailyTxEl.textContent = formatNumber(dailyTx);
  tvlEl.textContent = `$${tvl.toFixed(1)}B`;
  confirmTimeEl.textContent = `${confirmTime.toFixed(2)}s`;
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

const boot = () => {
  blocksStream.innerHTML = "";
  for (let i = 0; i < 8; i += 1) {
    addBlock();
  }
  updateMetrics();
  updateCharts();
};

boot();

setInterval(() => {
  addBlock();
  updateMetrics();
  updateCharts();
}, 1400);
