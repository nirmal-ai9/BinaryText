const input=document.querySelector("#input"),output=document.querySelector("#output");
const modes=document.querySelectorAll(".mode"),modeTitle=document.querySelector("#modeTitle"),resultTitle=document.querySelector("#resultTitle");
const inputStats=document.querySelector("#inputStats"),outputStats=document.querySelector("#outputStats"),status=document.querySelector("#status"),hint=document.querySelector("#hint");
let mode="text";
const enc=new TextEncoder(),dec=new TextDecoder("utf-8",{fatal:true});

function toBinary(bytes){return [...bytes].map(b=>b.toString(2).padStart(8,"0")).join(" ")}
function fromBinary(s){
 const parts=s.trim()?s.trim().split(/\s+/):[];
 if(parts.some(x=>!/^[01]{8}$/.test(x))) throw Error("Use 8-bit groups, e.g. 01001000.");
 return new Uint8Array(parts.map(x=>parseInt(x,2)));
}
function convert(){
 try{
  if(mode==="text"){
   const bytes=enc.encode(input.value); output.value=toBinary(bytes); output.classList.add("fade"); setTimeout(()=>output.classList.remove("fade"),250);
   inputStats.textContent=`${input.value.length} characters`;outputStats.textContent=`${bytes.length} bytes`;
  }else{
   const bytes=fromBinary(input.value);output.value=dec.decode(bytes); output.classList.add("fade"); setTimeout(()=>output.classList.remove("fade"),250);
   inputStats.textContent=`${bytes.length} bytes`;outputStats.textContent=`${output.value.length} characters`;
  }
  status.textContent="Translated locally ✓";
 }catch(e){output.value="";status.textContent=e.message;outputStats.textContent="Invalid input"}
}
function setMode(m){
 mode=m;modes.forEach(x=>x.classList.toggle("active",x.dataset.mode===m));
 const text=m==="text";
 modeTitle.textContent=text?"TEXT INPUT":"BINARY INPUT";resultTitle.textContent=text?"BINARY OUTPUT":"TEXT OUTPUT";
 input.placeholder=text?"Start typing something...":"Paste 8-bit binary groups here...";
 hint.textContent=text?"UTF-8 · Unicode supported · Emoji supported":"8-bit groups · UTF-8 decoding · Spaces/newlines accepted";
 input.value="";output.value="";inputStats.textContent=text?"0 characters":"0 bytes";outputStats.textContent="0 bytes";status.textContent="Ready";
}
modes.forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
input.addEventListener("input",convert);
document.querySelector("#convert").addEventListener("click",convert);
document.querySelector("#clear").addEventListener("click",()=>{input.value="";convert();input.focus()});
document.querySelector("#sample").addEventListener("click",()=>{
 input.value=mode==="text"?"Hello, world! 😎":"01001000 01100101 01101100 01101100 01101111";
 convert();
});
document.querySelector("#copy").addEventListener("click",async()=>{
 if(!output.value)return;
 await navigator.clipboard.writeText(output.value);
 status.textContent="Copied to clipboard ✓";
 setTimeout(()=>status.textContent="Translated locally ✓",1400);
});
document.addEventListener("keydown",e=>{
 if((e.ctrlKey||e.metaKey)&&e.key==="1"){e.preventDefault();setMode("text")}
 if((e.ctrlKey||e.metaKey)&&e.key==="2"){e.preventDefault();setMode("binary")}
 if((e.ctrlKey||e.metaKey)&&e.key==="c"&&document.activeElement!==input){if(output.value)navigator.clipboard.writeText(output.value)}
});
setMode("text");
