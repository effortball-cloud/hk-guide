// src/ 를 한 파일(dist/index.html)로 합치고, 홈 화면 아이콘·오프라인 캐시를 같이 넣는다.
// 실행: node build.mjs  →  dist/ 폴더를 그대로 아무 정적 호스팅(GitHub Pages 등)에 올리면 된다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const src = f => fs.readFileSync(path.join(dir, "src", f), "utf8");
const geo = fs.readFileSync(path.join(dir, "geo.json"), "utf8");

const built = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16).replace("T", " ") + " KST";
const data = `window.GEO=${geo};\n` + src("places.js") + "\n" + src("data_extra.js");
// </script> 가 데이터 안에 들어가지 않도록 방어
const safe = s => s.replace(/<\/script/gi, "<\\/script");

const html = src("index.html")
  .replace("/*STYLE*/", () => src("style.css"))
  .replace("/*DATA*/", () => safe(data))
  .replace("/*APP*/", () => safe(src("app.js")))
  .replace("<!--BUILT-->", built);

const DIST = path.join(dir, "dist");
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, "index.html"), html);
// 홈 화면 아이콘·manifest
const PWA = path.join(dir, "pwa");
for (const f of fs.readdirSync(PWA)) fs.copyFileSync(path.join(PWA, f), path.join(DIST, f));
// 오프라인 캐시 서비스워커 (빌드 시각이 버전 → 새로 배포하면 캐시가 갈아끼워짐)
fs.writeFileSync(path.join(DIST, "sw.js"), fs.readFileSync(path.join(dir, "sw_offline_template.js"), "utf8").replace("__VERSION__", built));
console.log("dist/index.html", (html.length / 1024).toFixed(0) + "KB", built);
