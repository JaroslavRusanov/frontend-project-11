if(!self.define){let e,i={};const n=(n,t)=>(n=new URL(n+".js",t).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,s)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const c=e=>n(e,r),d={module:{uri:r},exports:o,require:c};i[r]=Promise.all(t.map((e=>d[e]||c(e)))).then((e=>(s(...e),o)))}}define(["./workbox-9a84fccb"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"3bfe530c27e2da7941b1afcc5e931127"},{url:"main.bundle.js",revision:"ef7dfbe2ca47dc0bda3a06c18fa0786b"},{url:"main.bundle.js.LICENSE.txt",revision:"23578f41929aa3bc9f18add0e17ecbd4"}],{})}));