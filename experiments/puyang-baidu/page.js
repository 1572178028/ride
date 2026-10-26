import { cases, baiduRouteLink } from "./links.js";
import { esc } from "../../src/shared/dom.js";

const platform = document.querySelector("#platform");
platform.value = /Android/i.test(navigator.userAgent) ? "android" : "ios";
function render() {
  document.querySelector("#cases").innerHTML = cases.map(test => `
    <section data-case="${test.id}">
      <h2>${esc(test.title)}</h2>
      <p>${esc(test.note)}</p>
      <ol>${test.points.map(point => `<li>${esc(point.name)}</li>`).join("")}</ol>
      <a class="open-route" href="${esc(baiduRouteLink(test.points, platform.value))}">用百度地图打开${test.id === "roundtrip" ? "完整往返" : test.id === "inbound" ? "返程" : test.id === "outbound" ? "去程" : "基础骑行"}</a>
      <details><summary>点击后没有打开 App？</summary>
        <p>先确认已安装百度地图，并用系统浏览器打开本页。仍无响应时，可手动尝试备用调起方式；它同样尚待手机验证。</p>
        <a class="alternate" href="${esc(baiduRouteLink(test.points, platform.value, true))}">尝试备用方式打开同一路线</a>
      </details>
    </section>`).join("");
  document.querySelector("#loading").textContent = "链接已生成；百度 App 内的路线结果仍待手机实测。";
}
platform.addEventListener("change", render);
render();
