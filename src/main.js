document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.querySelector("#nostr-search");
    input.value = button.dataset.query;
    input.focus();
  });
});
const sections = document.querySelectorAll("main > section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
          link.classList.toggle(
            "nav-active",
            link.hash === `#${entry.target.id}`,
          );
        });
      }
    }
  },
  { rootMargin: "-10% 0px -50% 0px" },
);
sections.forEach((section) => observer.observe(section));

const fanStages = document.querySelectorAll(".boris-stage, .feather-stage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let fanFrame = 0;
function updateScreenshotFans() {
  fanFrame = 0;
  for (const stage of fanStages) {
    const top = stage.getBoundingClientRect().top;
    const progress = reducedMotion.matches
      ? 1
      : Math.max(0, Math.min(1, (innerHeight * 0.95 - top) / (innerHeight * 0.45)));
    stage.style.setProperty("--fan", progress.toFixed(3));
  }
}
function requestScreenshotFanUpdate() {
  if (!fanFrame) fanFrame = requestAnimationFrame(updateScreenshotFans);
}
window.addEventListener("scroll", requestScreenshotFanUpdate, { passive: true });
window.addEventListener("resize", requestScreenshotFanUpdate);
reducedMotion.addEventListener("change", requestScreenshotFanUpdate);
updateScreenshotFans();

// Wander in the empty space, checking each step against controls and other ants.
const antStage = document.querySelector(".ants-stage");
const searchDemo = antStage.querySelector(".search-demo");
const ants = [...antStage.querySelectorAll(".crawling-ants span")].map((el, i) => ({
  el, x: 0, y: 0, angle: Math.random() * Math.PI * 2,
  target: Math.random() * Math.PI * 2, turnIn: 0, speed: 7 + i * 1.5,
}));
let antBounds;
let antFrame = 0;
let antLastTime = 0;
let antsVisible = false;
function placeAnts() {
  const stage = antStage.getBoundingClientRect();
  const search = searchDemo.getBoundingClientRect();
  antBounds = {
    width: stage.width, height: stage.height,
    left: search.left - stage.left - 24, right: search.right - stage.left + 24,
    top: search.top - stage.top - 24, bottom: search.bottom - stage.top + 24,
  };
  ants.forEach((ant, i) => {
    ant.x = stage.width * [0.18, 0.72, 0.45][i];
    ant.y = i === 1 ? stage.height - 22 : 22;
    drawAnt(ant);
  });
}
function drawAnt(ant) {
  ant.el.style.transform = `translate(${ant.x - 6.5}px, ${ant.y - 6.5}px) rotate(${ant.angle + Math.PI / 2}rad)`;
}
function safeAntPosition(ant, x, y) {
  const b = antBounds;
  if (x < 18 || y < 18 || x > b.width - 18 || y > b.height - 18) return false;
  if (x > b.left && x < b.right && y > b.top && y < b.bottom) return false;
  return ants.every(other => other === ant || Math.hypot(other.x - x, other.y - y) > 28);
}
function animateAnts(time) {
  antFrame = 0;
  if (!antsVisible || reducedMotion.matches || document.hidden) { antLastTime = 0; return; }
  const dt = antLastTime ? Math.min((time - antLastTime) / 1000, 0.05) : 0;
  antLastTime = time;
  for (const ant of ants) {
    ant.turnIn -= dt;
    if (ant.turnIn <= 0) {
      ant.target = ant.angle + (Math.random() - 0.5) * 2.4;
      ant.turnIn = 1.5 + Math.random() * 3;
    }
    const delta = Math.atan2(Math.sin(ant.target - ant.angle), Math.cos(ant.target - ant.angle));
    ant.angle += Math.max(-dt * 2, Math.min(dt * 2, delta));
    const x = ant.x + Math.cos(ant.angle) * ant.speed * dt;
    const y = ant.y + Math.sin(ant.angle) * ant.speed * dt;
    if (safeAntPosition(ant, x, y)) { ant.x = x; ant.y = y; }
    else { ant.target = ant.angle + Math.PI * (0.6 + Math.random() * 0.4); ant.turnIn = 2; }
    drawAnt(ant);
  }
  antFrame = requestAnimationFrame(animateAnts);
}
function resumeAnts() {
  if (!antFrame && antsVisible && !reducedMotion.matches && !document.hidden) antFrame = requestAnimationFrame(animateAnts);
}
new ResizeObserver(placeAnts).observe(antStage);
new IntersectionObserver(([entry]) => { antsVisible = entry.isIntersecting; resumeAnts(); }).observe(antStage);
reducedMotion.addEventListener("change", resumeAnts);
document.addEventListener("visibilitychange", resumeAnts);
placeAnts();

const podcastAudio = document.querySelector("#podcast-audio");
const podcastPlay = document.querySelector(".podcast-play");
const podcastSeek = document.querySelector(".podcast-seek");
const podcastTime = document.querySelector(".podcast-time");
const podcastStatus = document.querySelector(".podcast-status");
const podcastBars = [...document.querySelectorAll(".podcast-wave i")];
function audioTime(seconds) {
  const value = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
function syncPodcast() {
  const playing = !podcastAudio.paused && !podcastAudio.ended;
  podcastPlay.setAttribute("aria-label", playing ? "Pause episode" : "Play episode");
  podcastPlay.setAttribute("aria-pressed", String(playing));
  podcastPlay.querySelector("path").setAttribute("d", playing ? "M6 4h4v16H6zM14 4h4v16h-4z" : "M8 4.5v15l12-7.5z");
  const duration = podcastAudio.duration;
  const ready = Number.isFinite(duration) && duration > 0;
  const progress = ready ? podcastAudio.currentTime / duration : 0;
  podcastSeek.disabled = !ready;
  podcastSeek.value = progress * 100;
  podcastSeek.setAttribute("aria-valuetext", `${audioTime(podcastAudio.currentTime)}${ready ? ` of ${audioTime(duration)}` : ""}`);
  podcastTime.textContent = `${audioTime(podcastAudio.currentTime)}${ready ? ` / ${audioTime(duration)}` : ""}`;
  podcastBars.forEach((bar, i) => { bar.style.background = i / podcastBars.length < progress ? "#388ab8" : ""; });
}
function podcastError() {
  podcastStatus.textContent = "Audio couldn’t load. You can listen on the podcast website via All episodes.";
  podcastStatus.hidden = false;
  syncPodcast();
}
podcastPlay.addEventListener("click", async () => {
  if (!podcastAudio.paused) { podcastAudio.pause(); return; }
  podcastStatus.hidden = true;
  podcastPlay.disabled = true;
  try { await podcastAudio.play(); } catch { podcastError(); }
  finally { podcastPlay.disabled = false; syncPodcast(); }
});
podcastSeek.addEventListener("input", () => {
  if (Number.isFinite(podcastAudio.duration)) podcastAudio.currentTime = Number(podcastSeek.value) / 100 * podcastAudio.duration;
  syncPodcast();
});
for (const event of ["play", "pause", "ended", "timeupdate", "loadedmetadata", "durationchange"]) podcastAudio.addEventListener(event, syncPodcast);
podcastAudio.addEventListener("error", podcastError);

const podcastSpeed = document.querySelector(".podcast-speed");
const playbackSpeeds = [1, 2, 1.5, 1.25, 0.75];
podcastSpeed.addEventListener("click", () => {
  const current = playbackSpeeds.indexOf(podcastAudio.playbackRate);
  podcastAudio.playbackRate = playbackSpeeds[(current + 1) % playbackSpeeds.length];
});
podcastAudio.addEventListener("ratechange", () => {
  const rate = podcastAudio.playbackRate;
  const next = playbackSpeeds[(playbackSpeeds.indexOf(rate) + 1) % playbackSpeeds.length];
  podcastSpeed.textContent = `${rate}×`;
  podcastSpeed.setAttribute("aria-label", `Playback speed: ${rate}×. Change to ${next}×`);
});
