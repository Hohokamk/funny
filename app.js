const form = document.querySelector("#permitForm");
const applicantInput = document.querySelector("#applicant");
const taskInput = document.querySelector("#task");
const reasonLevel = document.querySelector("#reasonLevel");
const reasonLevelLabel = document.querySelector("#reasonLevelLabel");
const permit = document.querySelector("#permit");
const rubberStamp = document.querySelector("#rubberStamp");
const stampButton = document.querySelector("#stampButton");
const regenerateButton = document.querySelector("#regenerateButton");
const copyButton = document.querySelector("#copyButton");
const stampPrompt = document.querySelector("#stampPrompt");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toastMessage");
const approvedCount = document.querySelector("#approvedCount");

const output = {
  applicant: document.querySelector("#permitApplicant"),
  task: document.querySelector("#permitTask"),
  delay: document.querySelector("#permitDelay"),
  reason: document.querySelector("#permitReason"),
  clause: document.querySelector("#permitClause"),
  date: document.querySelector("#permitDate"),
  number: document.querySelector("#permitNumber"),
};

const reasons = {
  1: [
    "当前待办较多，贸然处理容易影响处理质量。",
    "据可靠观察，今日适合先完成准备工作。",
    "为了避免仓促决定，建议保留一点思考空间。",
  ],
  2: [
    "手头这件小事，正在等待一个更合适的时间窗口。",
    "根据优先级临时变更原则，它可以稍后再发光。",
    "系统检测到你的注意力正在维护中，请稍后重试。",
  ],
  3: [
    "经评估，现在开始会破坏这件事本该拥有的仪式感。",
    "附近磁场平稳，但不是适合启动的那一种平稳。",
    "今日灵感偏向暂停营业，强行开工可能损伤心情。",
  ],
  4: [
    "星座运行显示：此刻动手容易和宇宙抢方向盘。",
    "申请书已被一只看不见的猫压在屁股下面。",
    "根据墨菲定律第 12 条，越着急越应该假装没看见。",
  ],
  5: [
    "时间本身尚未就位，贸然开始可能引发平行宇宙对账错误。",
    "刚收到通知：负责这件事的粒子还在赶往现场。",
    "本事项已进入量子叠加态，既该做，也暂时可以不做。",
  ],
};

const clauses = [
  "本许可证在你不看它的时候持续有效。",
  "延期期间不得假装自己已经做完了。",
  "如遇良心不安，可将本文件倒过来阅读。",
  "每次重新打开待办清单，有效期自动刷新一次。",
  "最终截止日期以未来版本的你为准。",
  "禁止在喝水、发呆和整理桌面时产生负罪感。",
  "本批准不构成对拖延行为的长期担保。",
];

const levelLabels = ["严谨得很", "基本可信", "刚刚好", "开始玄学", "宇宙级别"];
let permitState = {
  applicant: "正在等你的名字",
  task: "那件还没开始的事",
  delay: "明天一定",
  reason: reasons[3][0],
  clause: clauses[0],
  date: "",
  number: "NO. 000000",
};
let toastTimer;
let confettiTimer;

function getFormState() {
  const formData = new FormData(form);

  return {
    applicant: applicantInput.value.trim() || "一位不愿透露姓名的朋友",
    task: taskInput.value.trim() || "那件还没开始的事",
    delay: formData.get("delay") || "明天一定",
    level: Number(reasonLevel.value),
  };
}

function pickRandom(items, previousValue) {
  if (items.length === 1) return items[0];

  let item = items[Math.floor(Math.random() * items.length)];
  while (item === previousValue) {
    item = items[Math.floor(Math.random() * items.length)];
  }
  return item;
}

function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function makePermitNumber() {
  const serial = Math.floor(100000 + Math.random() * 900000);
  const dateCode = formatDate().replaceAll(".", "").slice(4);
  return `NO. ${dateCode}-${serial}`;
}

function setText(element, text, animate = false) {
  element.textContent = text;

  if (animate) {
    element.classList.remove("is-changing");
    void element.offsetWidth;
    element.classList.add("is-changing");
  }
}

function renderPermit({ animate = false, regenerateReason = false } = {}) {
  const state = getFormState();

  permitState = {
    ...permitState,
    applicant: state.applicant,
    task: state.task,
    delay: state.delay,
    reason: regenerateReason
      ? pickRandom(reasons[state.level], permitState.reason)
      : reasons[state.level][0],
    clause: pickRandom(clauses, regenerateReason ? permitState.clause : ""),
    date: formatDate(),
    number: makePermitNumber(),
  };

  Object.entries(output).forEach(([key, element]) => {
    setText(element, permitState[key], animate);
  });

  rubberStamp.classList.remove("is-visible", "is-stamping");
  stampPrompt.textContent = "许可证尚未生效，请点击盖章。";

  if (animate) {
    permit.classList.remove("is-updating");
    void permit.offsetWidth;
    permit.classList.add("is-updating");
  }
}

function stampPermit() {
  rubberStamp.classList.remove("is-stamping");
  void rubberStamp.offsetWidth;
  rubberStamp.classList.add("is-visible", "is-stamping");
  stampPrompt.textContent = "已盖章。现在拖延起来更加名正言顺了。";

  approvedCount.textContent = String(Number(approvedCount.textContent) + 1);
  burstConfetti();
}

function burstConfetti() {
  clearTimeout(confettiTimer);
  document.querySelectorAll(".confetti").forEach((piece) => piece.remove());

  const colors = ["#246bfd", "#ffd455", "#ff6b35", "#ff8fb7", "#9fe0c6"];
  const rect = rubberStamp.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let index = 0; index < 26; index += 1) {
    const piece = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 115;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    piece.className = "confetti";
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.borderRadius = index % 3 === 0 ? "50%" : "0";
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 110}px`);
    piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 720}deg`);
    piece.style.animationDelay = `${Math.random() * 90}ms`;
    document.body.append(piece);
  }

  confettiTimer = setTimeout(() => {
    document.querySelectorAll(".confetti").forEach((piece) => piece.remove());
  }, 1300);
}

function permitToText() {
  return [
    "拖延许可证",
    `编号：${permitState.number}`,
    "",
    `兹批准：${permitState.applicant}`,
    `合法暂时不处理：${permitState.task}`,
    `延期至：${permitState.delay}`,
    `批准理由：${permitState.reason}`,
    `附加条款：${permitState.clause}`,
    `签发日期：${permitState.date}`,
    "",
    "拖延事务所 · 最终解释权归未来的你所有",
  ].join("\n");
}

async function copyPermit() {
  try {
    await navigator.clipboard.writeText(permitToText());
    showToast("许可证已复制，可以拿去交差了");
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = permitToText();
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast("许可证已复制，可以拿去交差了");
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  renderPermit({ animate: true });

  if (window.innerWidth < 981) {
    document.querySelector(".document-stage").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
});

reasonLevel.addEventListener("input", () => {
  reasonLevelLabel.textContent = levelLabels[Number(reasonLevel.value) - 1];
});

regenerateButton.addEventListener("click", () => {
  renderPermit({ animate: true, regenerateReason: true });
  showToast("新理由已送达，可信度仍然成谜");
});

stampButton.addEventListener("click", stampPermit);

copyButton.addEventListener("click", copyPermit);

document.addEventListener("keydown", (event) => {
  const isTyping = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);

  if (event.code === "Space" && !isTyping) {
    event.preventDefault();
    stampPermit();
  }
});

renderPermit();
