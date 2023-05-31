// Copyright (c) the JPEG XL Project Authors. All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/*
 * ServiceWorker script.
 *
 * Multi-threading in WASM is currently implemented by the means of
 * SharedArrayBuffer. Due to infamous vulnerabilities this feature is disabled
 * unless site is running in "cross-origin isolated" mode.
 * If there is not enough control over the server (e.g. when pages are hosted as
 * "github pages") ServiceWorker is used to upgrade responses with corresponding
 * headers.
 *
 * This script could be executed in 2 environments: HTML page or ServiceWorker.
 * The environment is detected by the type of "window" reference.
 *
 * When this script is executed from HTML page then ServiceWorker is registered.
 * Page reload might be necessary in some situations. By default it is done via
 * `window.location.reload()`. However this can be altered by setting a
 * configuration object `window.serviceWorkerConfig`. It's `doReload` property
 * should be a replacement callable.
 *
 * When this script is executed from ServiceWorker then standard lifecycle
 * event dispatchers are setup along with `fetch` interceptor.
 */

(() => {
  // Set COOP/COEP headers for document/script responses; use when this can not
  // be done on server side (e.g. GitHub Pages).
  const FORCE_COP = true;
  // Interpret 'content-type: application/octet-stream' as JXL; use when server
  // does not set appropriate content type (e.g. GitHub Pages).
  const FORCE_DECODING = true;
  // Embedded (baked-in) responses for faster turn-around.
  const EMBEDDED = {
    'client_worker.js': 'let decoder=null,jobs=[];const processJobs=()=>{if(decoder)for(;;){let o=null;for(let e=0;e<jobs.length;++e)if(jobs[e].inputComplete){o=jobs[e],jobs[e]=jobs[jobs.length-1],jobs.pop();break}if(!o)return;console.log("CW job: "+o.uid);var r=o.input;let l=0;for(let e=0;e<r.length;e++)l+=r[e].length;var t=decoder._malloc(l);let d=0;for(let e=0;e<r.length;++e)decoder.HEAP8.set(r[e],t+d),d+=r[e].length;var e=Date.now(),s=decoder._jxlDecompress(t,l),n=Date.now(),n="Decoded "+o.url+" in "+(n-e)+"ms",e=(decoder._free(t),decoder.HEAP32[s>>2]),c=decoder.HEAP32[s+4>>2],i=new Uint8Array(e),u=new Uint8Array(decoder.HEAP8.buffer),u=(i.set(u.slice(c,c+e)),decoder._jxlCleanup(s),{uid:o.uid,data:i,msg:n});postMessage(u,[i.buffer])}},onLoadJxlModule=(onmessage=function(e){var l=e.data;if(console.log("CW received: "+l.op),"decodeJxl"===l.op){let o=null;for(let e=0;e<jobs.length;++e)if(jobs[e].uid===l.uid){o=jobs[e];break}o||(o={uid:l.uid,input:[],inputComplete:!1,url:l.url},jobs.push(o)),l.data?o.input.push(l.data):o.inputComplete=!0,processJobs()}},e=>{decoder=e,processJobs()}),config=(importScripts("jxl_decoder.js"),{mainScriptUrlOrBlob:"https://jxl-demo.netlify.app/jxl_decoder.js",INITIAL_MEMORY:16777216});JxlDecoderModule(config).then(onLoadJxlModule);',
    'jxl_decoder.js': 'var JxlDecoderModule=(()=>{var Le="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0;return"undefined"!=typeof __filename&&(Le=Le||__filename),function(e={}){function D(){return w.buffer!=g.buffer&&A(),X}function r(){return w.buffer!=g.buffer&&A(),z}function f(){return w.buffer!=g.buffer&&A(),V}function O(){return w.buffer!=g.buffer&&A(),Y}var t,o,i=i||(void 0!==e?e:{}),q=(i.ready=new Promise((e,n)=>{t=e,o=n}),Object.assign({},i)),n=(e,n)=>{throw n},a="object"==typeof window,s="function"==typeof importScripts,u="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,l=i.ENVIRONMENT_IS_PTHREAD||!1,c="";function B(e){return i.locateFile?i.locateFile(e,c):c+e}if(u){var p=require("fs"),d=require("path"),c=s?d.dirname(c)+"/":__dirname+"/",H=(e,n)=>(e=e.startsWith("file://")?new URL(e):d.normalize(e),p.readFileSync(e,n?void 0:"utf8")),m=e=>e=(e=H(e,!0)).buffer?e:new Uint8Array(e),h=(e,r,t,a=!0)=>{e=e.startsWith("file://")?new URL(e):d.normalize(e),p.readFile(e,a?void 0:"utf8",(e,n)=>{e?t(e):r(a?n.buffer:n)})};process.argv.slice(2),n=(e,n)=>{throw process.exitCode=e,n},i.inspect=()=>"[Emscripten Module object]";let e;try{e=require("worker_threads")}catch(e){throw console.error(\'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?\'),e}global.Worker=e.Worker}else(a||s)&&(s?c=self.location.href:"undefined"!=typeof document&&document.currentScript&&(c=document.currentScript.src),c=0!==(c=Le?Le:c).indexOf("blob:")?c.substr(0,c.replace(/[?#].*/,"").lastIndexOf("/")+1):"",u||(H=e=>{var n=new XMLHttpRequest;return n.open("GET",e,!1),n.send(null),n.responseText},s&&(m=e=>{var n=new XMLHttpRequest;return n.open("GET",e,!1),n.responseType="arraybuffer",n.send(null),new Uint8Array(n.response)}),h=(e,n,r)=>{var t=new XMLHttpRequest;t.open("GET",e,!0),t.responseType="arraybuffer",t.onload=()=>{200==t.status||0==t.status&&t.response?n(t.response):r()},t.onerror=r,t.send(null)}));u&&"undefined"==typeof performance&&(global.performance=require("perf_hooks").performance);var y,b=console.log.bind(console),L=console.error.bind(console),F=(u&&(b=(...e)=>p.writeSync(1,e.join(" ")+"\\n"),L=(...e)=>p.writeSync(2,e.join(" ")+"\\n")),i.print||b),_=i.printErr||L,N=(Object.assign(i,q),i.quit&&(n=i.quit),i.wasmBinary&&(y=i.wasmBinary),i.noExitRuntime||!1);"object"!=typeof WebAssembly&&E("no native wasm support detected");var w,J,v,g,X,z,V,Y,x=!1;function A(){var e=w.buffer;i.HEAP8=g=new Int8Array(e),i.HEAP16=new Int16Array(e),i.HEAP32=z=new Int32Array(e),i.HEAPU8=X=new Uint8Array(e),i.HEAPU16=new Uint16Array(e),i.HEAPU32=V=new Uint32Array(e),i.HEAPF32=new Float32Array(e),i.HEAPF64=Y=new Float64Array(e)}if(65536<=(b=i.INITIAL_MEMORY||16777216)||E("INITIAL_MEMORY should be larger than STACK_SIZE, was "+b+"! (STACK_SIZE=65536)"),l)w=i.wasmMemory;else if(i.wasmMemory)w=i.wasmMemory;else if(!((w=new WebAssembly.Memory({initial:b/65536,maximum:32768,shared:!0})).buffer instanceof SharedArrayBuffer))throw _("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),u&&_("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"),Error("bad memory");A();w.buffer.byteLength;var Z,$=[],G=[],K=[],Q=[],ee=!1,ne=0;function S(){return N||0<ne}var T,R=0,re=null,M=null;function te(){R++,i.monitorRunDependencies&&i.monitorRunDependencies(R)}function ae(){var e;R--,i.monitorRunDependencies&&i.monitorRunDependencies(R),0==R&&(null!==re&&(clearInterval(re),re=null),M)&&(e=M,M=null,e())}function E(e){throw i.onAbort&&i.onAbort(e),_(e="Aborted("+e+")"),x=!0,v=1,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),o(e),e}function oe(e){return e.startsWith("data:application/octet-stream;base64,")}function ie(e){try{if(e==T&&y)return new Uint8Array(y);if(m)return m(e);throw"both async and sync fetching of the wasm failed"}catch(e){E(e)}}function se(e,n,r){return function(r){if(!y&&(a||s)){if("function"==typeof fetch&&!r.startsWith("file://"))return fetch(r,{credentials:"same-origin"}).then(e=>{if(e.ok)return e.arrayBuffer();throw"failed to load wasm binary file at \'"+r+"\'"}).catch(()=>ie(r));if(h)return new Promise((n,e)=>{h(r,e=>n(new Uint8Array(e)),e)})}return Promise.resolve().then(()=>ie(r))}(e).then(e=>WebAssembly.instantiate(e,n)).then(e=>e).then(r,e=>{_("failed to asynchronously prepare wasm: "+e),E(e)})}function ue(e){this.name="ExitStatus",this.message=`Program terminated with exit(${e})`,this.status=e}function fe(e){e.terminate(),e.onmessage=()=>{}}function le(e){(e=I.S[e])||E(),I.na(e)}function ce(e){var n=I.ia();if(!n)return 6;I.U.push(n),(I.S[e.R]=n).R=e.R;var r={cmd:"run",start_routine:e.oa,arg:e.ga,pthread_ptr:e.R};return u&&n.unref(),n.postMessage(r,e.pa),0}oe(T="jxl_decoder.wasm")||(T=B(T));var pe="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function de(e){if(l)return P(1,1,e);v=e,S()||(I.$(),i.onExit&&i.onExit(e),x=!0),n(e,new ue(e))}function me(e){if(v=e,l)throw ye(e),"unwind";S()||l||(je(),j(K),Ie(0),Se[1].length&&Te(1,10),Se[2].length&&Te(2,10),I.$(),ee=!0),de(e)}function he(e){e instanceof ue||"unwind"==e||n(1,e)}var I={T:[],U:[],ba:[],S:{},W:function(){l?I.ka():I.ja()},ja:function(){for(var e=4;e--;)I.X();$.unshift(()=>{te(),I.la(()=>ae())})},ka:function(){I.receiveObjectTransfer=I.ma,I.threadInitTLS=I.aa,I.setExitStatus=I.Z,N=!1},Z:function(e){v=e},ta:["$terminateWorker"],$:function(){for(var e of I.U)fe(e);for(e of I.T)fe(e);I.T=[],I.U=[],I.S=[]},na:function(e){var n=e.R;delete I.S[n],I.T.push(e),I.U.splice(I.U.indexOf(e),1),e.R=0,Pe(n)},ma:function(){},aa:function(){I.ba.forEach(e=>e())},Y:a=>new Promise(t=>{a.onmessage=e=>{var n,r=(e=e.data).cmd;a.R&&(I.ha=a.R),e.targetThread&&e.targetThread!=U()?(n=I.S[e.sa])?n.postMessage(e,e.transferList):_(\'Internal error! Worker sent a message "\'+r+\'" to target pthread \'+e.targetThread+", but that thread no longer exists!"):"checkMailbox"===r?W():"spawnThread"===r?ce(e):"cleanupThread"===r?le(e.thread):"killThread"===r?(e=e.thread,r=I.S[e],delete I.S[e],fe(r),Pe(e),I.U.splice(I.U.indexOf(r),1),r.R=0):"cancelThread"===r?I.S[e.thread].postMessage({cmd:"cancel"}):"loaded"===r?(a.loaded=!0,u&&!a.R&&a.unref(),t(a)):"print"===r?F("Thread "+e.threadId+": "+e.text):"printErr"===r?_("Thread "+e.threadId+": "+e.text):"alert"===r?alert("Thread "+e.threadId+": "+e.text):"setimmediate"===e.target?a.postMessage(e):"callHandler"===r?i[e.handler](...e.args):r&&_("worker sent an unknown command "+r),I.ha=void 0},a.onerror=e=>{throw _("worker sent an error! "+e.filename+":"+e.lineno+": "+e.message),e},u&&(a.on("message",function(e){a.onmessage({data:e})}),a.on("error",function(e){a.onerror(e)}));var e,n=[];for(e of["onExit","onAbort","print","printErr"])i.hasOwnProperty(e)&&n.push(e);a.postMessage({cmd:"load",handlers:n,urlOrBlob:i.mainScriptUrlOrBlob||Le,wasmMemory:w,wasmModule:J})}),la:function(e){if(l)return e();Promise.all(I.T.map(I.Y)).then(e)},X:function(){var e=B("jxl_decoder.worker.js"),e=new Worker(e);I.T.push(e)},ia:function(){return 0==I.T.length&&(I.X(),I.Y(I.T[0])),I.T.pop()}};function j(e){for(;0<e.length;)e.shift()(i)}function ye(e){if(l)return P(2,0,e);me(e)}i.PThread=I,i.establishStackSpace=function(){var e=U(),n=r()[e+52>>2];De(n,n-r()[e+56>>2]),qe(n)};var k=[];function be(e){this.V=e-24,this.fa=function(e){f()[this.V+4>>2]=e},this.ea=function(e){f()[this.V+8>>2]=e},this.W=function(e,n){this.da(),this.fa(e),this.ea(n)},this.da=function(){f()[this.V+16>>2]=0}}i.invokeEntryPoint=function(e,n){ne=0;var r=k[e];r||(e>=k.length&&(k.length=e+1),k[e]=r=Z.get(e)),e=r(n),S()?I.Z(e):Ue(e)};function _e(e,n,r,t){return l?P(3,1,e,n,r,t):we(e,n,r,t)}function we(e,n,r,t){var a;return"undefined"==typeof SharedArrayBuffer?(_("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6):(a=[],l&&0===a.length?_e(e,n,r,t):(e={oa:r,R:e,ga:t,pa:a},l?(e.ra="spawnThread",postMessage(e,a),0):ce(e)))}function ve(e){"function"==typeof Atomics.qa&&(Atomics.qa(r(),e>>2,e).value.then(W),e+=128,Atomics.store(r(),e>>2,1))}function W(){var e=U();if(e){ve(e);e=()=>Ce();if(!ee&&!x)try{if(e(),!ee&&!S())try{(l?Ue:me)(v)}catch(e){he(e)}}catch(e){he(e)}}}function P(a,o){var e,n,i=arguments.length-2,s=arguments;return e=()=>{for(var e=Be(8*i),n=e>>3,r=0;r<i;r++){var t=s[2+r];O()[n+r]=t}return We(a,i,e,o)},n=Oe(),e=e(),qe(n),e}i.__emscripten_thread_mailbox_await=ve,i.checkMailbox=W,u&&(global.performance=require("perf_hooks").performance);var ge=[];function xe(e){return l?P(4,1,e):52}function Ae(e,n,r,t,a){return l?P(5,1,e,n,r,t,a):70}var Se=[null,[],[]];function Te(e,n){var r=Se[e];if(0===n||10===n){for(var t=(n=0)+NaN,a=n;r[a]&&!(t<=a);)++a;if(16<a-n&&r.buffer&&pe)n=pe.decode(r.buffer instanceof SharedArrayBuffer?r.slice(n,a):r.subarray(n,a));else{for(t="";n<a;){var o,i,s=r[n++];128&s?(o=63&r[n++],192==(224&s)?t+=String.fromCharCode((31&s)<<6|o):(i=63&r[n++],(s=224==(240&s)?(15&s)<<12|o<<6|i:(7&s)<<18|o<<12|i<<6|63&r[n++])<65536?t+=String.fromCharCode(s):(s-=65536,t+=String.fromCharCode(55296|s>>10,56320|1023&s)))):t+=String.fromCharCode(s)}n=t}(1===e?F:_)(n),r.length=0}else r.push(n)}function Re(e,n,r,t){if(l)return P(6,1,e,n,r,t);for(var a=0,o=0;o<r;o++){var i=f()[n>>2],s=f()[n+4>>2];n+=8;for(var u=0;u<s;u++)Te(e,D()[i+u]);a+=s}return f()[t>>2]=a,0}I.W();var Me=[null,de,ye,_e,xe,Ae,Re],Ee={g:function(e,n,r){throw new be(e).W(n,r),e},i:function(e){ke(e,!s,1,!a,65536),I.aa()},e:function(e){l?postMessage({cmd:"cleanupThread",thread:e}):le(e)},s:we,q:function(e,n){e==n?setTimeout(()=>W()):l?postMessage({targetThread:e,cmd:"checkMailbox"}):(e=I.S[e])&&e.postMessage({cmd:"checkMailbox"})},k:function(){return-1},h:ve,m:function(e){u&&I.S[e].ref()},b:function(){E("")},f:function(){},l:function(){throw ne+=1,"unwind"},c:()=>performance.timeOrigin+performance.now(),j:function(e,n,r){ge.length=n,r>>=3;for(var t=0;t<n;t++)ge[t]=O()[r+t];return Me[e].apply(null,ge)},p:function(e){var n=D().length;if(!((e>>>=0)<=n||2147483648<e))for(var r=1;r<=4;r*=2){var t=n*(1+.2/r),t=Math.min(t,e+100663296),a=Math,o=a.min;t=Math.max(e,t),t+=(65536-t%65536)%65536;e:{var i=w.buffer;try{w.grow(o.call(a,2147483648,t)-i.byteLength+65535>>>16),A();var s=1;break e}catch(e){}s=void 0}if(s)return!0}return!1},n:me,r:xe,o:Ae,d:Re,a:w||i.wasmMemory},Ie=(!function(){function n(e,n){return e=e.exports,i.asm=e,I.ba.push(i.asm.E),Z=i.asm.A,G.unshift(i.asm.t),J=n,ae(),e}var r,t,a,e={a:Ee};if(te(),i.instantiateWasm)try{return i.instantiateWasm(e,n)}catch(e){_("Module.instantiateWasm callback failed with error: "+e),o(e)}r=e,t=function(e){n(e.instance,e.module)},a=T,(y||"function"!=typeof WebAssembly.instantiateStreaming||oe(a)||a.startsWith("file://")||u||"function"!=typeof fetch?se(a,r,t):fetch(a,{credentials:"same-origin"}).then(e=>WebAssembly.instantiateStreaming(e,r).then(t,function(e){return _("wasm streaming compile failed: "+e),_("falling back to ArrayBuffer instantiation"),se(a,r,t)}))).catch(o)}(),i._jxlCreateInstance=function(){return(i._jxlCreateInstance=i.asm.u).apply(null,arguments)},i._jxlDestroyInstance=function(){return(i._jxlDestroyInstance=i.asm.v).apply(null,arguments)},i._free=function(){return(i._free=i.asm.w).apply(null,arguments)},i._jxlProcessInput=function(){return(i._jxlProcessInput=i.asm.x).apply(null,arguments)},i._malloc=function(){return(i._malloc=i.asm.y).apply(null,arguments)},i._jxlFlush=function(){return(i._jxlFlush=i.asm.z).apply(null,arguments)},i._jxlDecompress=function(){return(i._jxlDecompress=i.asm.B).apply(null,arguments)},i._jxlCleanup=function(){return(i._jxlCleanup=i.asm.C).apply(null,arguments)},i._fflush=function(){return(Ie=i._fflush=i.asm.D).apply(null,arguments)}),U=(i.__emscripten_tls_init=function(){return(i.__emscripten_tls_init=i.asm.E).apply(null,arguments)},i._pthread_self=function(){return(U=i._pthread_self=i.asm.F).apply(null,arguments)});function je(){return(je=i.asm.G).apply(null,arguments)}var ke=i.__emscripten_thread_init=function(){return(ke=i.__emscripten_thread_init=i.asm.H).apply(null,arguments)};function We(){return(We=i.asm.J).apply(null,arguments)}function Pe(){return(Pe=i.asm.K).apply(null,arguments)}i.__emscripten_thread_crashed=function(){return(i.__emscripten_thread_crashed=i.asm.I).apply(null,arguments)};var C,Ue=i.__emscripten_thread_exit=function(){return(Ue=i.__emscripten_thread_exit=i.asm.L).apply(null,arguments)},Ce=i.__emscripten_check_mailbox=function(){return(Ce=i.__emscripten_check_mailbox=i.asm.M).apply(null,arguments)};function De(){return(De=i.asm.N).apply(null,arguments)}function Oe(){return(Oe=i.asm.O).apply(null,arguments)}function qe(){return(qe=i.asm.P).apply(null,arguments)}function Be(){return(Be=i.asm.Q).apply(null,arguments)}function He(){function e(){if(!C&&(C=!0,i.calledRun=!0,!x)&&(l||j(G),t(i),i.onRuntimeInitialized&&i.onRuntimeInitialized(),!l)){if(i.postRun)for("function"==typeof i.postRun&&(i.postRun=[i.postRun]);i.postRun.length;){var e=i.postRun.shift();Q.unshift(e)}j(Q)}}if(!(0<R))if(l)t(i),l||j(G),startWorker(i);else{if(i.preRun)for("function"==typeof i.preRun&&(i.preRun=[i.preRun]);i.preRun.length;)$.unshift(i.preRun.shift());j($),0<R||(i.setStatus?(i.setStatus("Running..."),setTimeout(function(){setTimeout(function(){i.setStatus("")},1),e()},1)):e())}}if(i.keepRuntimeAlive=S,i.wasmMemory=w,i.ExitStatus=ue,i.PThread=I,M=function e(){C||He(),C||(M=e)},i.preInit)for("function"==typeof i.preInit&&(i.preInit=[i.preInit]);0<i.preInit.length;)i.preInit.pop()();return He(),e.ready}})();"object"==typeof exports&&"object"==typeof module?module.exports=JxlDecoderModule:"function"==typeof define&&define.amd?define([],function(){return JxlDecoderModule}):"object"==typeof exports&&(exports.JxlDecoderModule=JxlDecoderModule);',
    'jxl_decoder.worker.js': '"use strict";var Module={},ENVIRONMENT_IS_NODE="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,nodeWorkerThreads,parentPort,fs,initializedJS=(ENVIRONMENT_IS_NODE&&(nodeWorkerThreads=require("worker_threads"),parentPort=nodeWorkerThreads.parentPort,parentPort.on("message",e=>onmessage({data:e})),fs=require("fs"),Object.assign(global,{self:global,require:require,Module:Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:function(e){(0,eval)(fs.readFileSync(e,"utf8")+"//# sourceURL="+e)},postMessage:function(e){parentPort.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})),!1);function threadPrintErr(){var e=Array.prototype.slice.call(arguments).join(" ");ENVIRONMENT_IS_NODE?fs.writeSync(2,e+"\\n"):console.error(e)}function threadAlert(){var e=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:e,threadId:Module._pthread_self()})}var err=threadPrintErr;function handleMessage(e){try{if("load"===e.data.cmd){let a=[];self.onmessage=e=>a.push(e),self.startWorker=e=>{Module=e,postMessage({cmd:"loaded"});for(var r of a)handleMessage(r);self.onmessage=handleMessage},Module.wasmModule=e.data.wasmModule;for(const t of e.data.handlers)Module[t]=function(){postMessage({cmd:"callHandler",handler:t,args:[...arguments]})};var r;Module.wasmMemory=e.data.wasmMemory,Module.buffer=Module.wasmMemory.buffer,Module.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof e.data.urlOrBlob?importScripts(e.data.urlOrBlob):(r=URL.createObjectURL(e.data.urlOrBlob),importScripts(r),URL.revokeObjectURL(r)),JxlDecoderModule(Module)}else if("run"===e.data.cmd){Module.__emscripten_thread_init(e.data.pthread_ptr,0,0,1),Module.__emscripten_thread_mailbox_await(e.data.pthread_ptr),Module.establishStackSpace(),Module.PThread.receiveObjectTransfer(e.data),Module.PThread.threadInitTLS(),initializedJS=initializedJS||!0;try{Module.invokeEntryPoint(e.data.start_routine,e.data.arg)}catch(e){if("unwind"!=e)throw e}}else"cancel"===e.data.cmd?Module._pthread_self()&&Module.__emscripten_thread_exit(-1):"setimmediate"!==e.data.target&&("checkMailbox"===e.data.cmd?initializedJS&&Module.checkMailbox():e.data.cmd&&(err("worker.js received unknown command "+e.data.cmd),err(e.data)))}catch(e){throw Module.__emscripten_thread_crashed&&Module.__emscripten_thread_crashed(),e}}self.alert=threadAlert,Module.instantiateWasm=(e,r)=>{var a=Module.wasmModule;return Module.wasmModule=null,r(new WebAssembly.Instance(a,e))},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=handleMessage;',
  };

  // Enable SharedArrayBuffer.
  const setCopHeaders = (headers) => {
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  };

  // Inflight object: {clientId, uid, timestamp, controller}
  const inflight = [];

  // Generate (very likely) unique string.
  const makeUid = () => {
    return Math.random().toString(36).substring(2) +
        Math.random().toString(36).substring(2);
  };

  // Make list (non-recursively) of transferable entities.
  const gatherTransferrables = (...args) => {
    const result = [];
    for (let i = 0; i < args.length; ++i) {
      if (args[i] && args[i].buffer) {
        result.push(args[i].buffer);
      }
    }
    return result;
  };

  // Serve items that are embedded in this service worker.
  const maybeProcessEmbeddedResources = (event) => {
    const url = event.request.url;
    // Shortcut for baked-in scripts.
    for (const [key, value] of Object.entries(EMBEDDED)) {
      if (url.endsWith(key)) {
        const headers = new Headers();
        headers.set('Content-Type', 'application/javascript');
        setCopHeaders(headers);

        event.respondWith(new Response(value, {
          status: 200,
          statusText: 'OK',
          headers: headers,
        }));
        return true;
      }
    }
    return false;
  };

  // Decode JXL image response and serve it as a PNG image.
  const wrapImageResponse = async (clientId, originalResponse) => {
    // TODO: cache?
    const client = await clients.get(clientId);
    // Client is gone? Not our problem then.
    if (!client) {
      return originalResponse;
    }

    const inputStream = await originalResponse.body;
    // Can't use "BYOB" for regular responses.
    const reader = inputStream.getReader();

    const inflightEntry = {
      clientId: clientId,
      uid: makeUid(),
      timestamp: Date.now(),
      inputStreamReader: reader,
      outputStreamController: null
    };
    inflight.push(inflightEntry);

    const outputStream = new ReadableStream({
      start: (controller) => {
        inflightEntry.outputStreamController = controller;
      }
    });

    const onRead = (chunk) => {
      const msg = {
        op: 'decodeJxl',
        uid: inflightEntry.uid,
        url: originalResponse.url,
        data: chunk.value || null
      };
      client.postMessage(msg, gatherTransferrables(msg.data));
      if (!chunk.done) {
        reader.read().then(onRead);
      }
    };
    // const view = new SharedArrayBuffer(65536);
    const view = new Uint8Array(65536);
    reader.read(view).then(onRead);

    let modifiedResponseHeaders = new Headers(originalResponse.headers);
    modifiedResponseHeaders.delete('Content-Length');
    modifiedResponseHeaders.set('Content-Type', 'image/png');
    modifiedResponseHeaders.set('Server', 'ServiceWorker');
    return new Response(outputStream, {headers: modifiedResponseHeaders});
  };

  // Check if response needs decoding; if so - do it.
  const wrapImageRequest = async (clientId, request) => {
    let modifiedRequestHeaders = new Headers(request.headers);
    modifiedRequestHeaders.append('Accept', 'image/jxl');
    let modifiedRequest =
        new Request(request, {headers: modifiedRequestHeaders});
    let originalResponse = await fetch(modifiedRequest);
    let contentType = originalResponse.headers.get('Content-Type');

    let isJxlResponse = (contentType === 'image/jxl');
    if (FORCE_DECODING && contentType === 'application/octet-stream') {
      isJxlResponse = true;
    }
    if (isJxlResponse) {
      return wrapImageResponse(clientId, originalResponse);
    }

    return originalResponse;
  };

  const reportError = (err) => {
    // console.error(err);
  };

  const upgradeResponse = (response) => {
    if (response.status === 0) {
      return response;
    }

    const newHeaders = new Headers(response.headers);
    setCopHeaders(newHeaders);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };

  // Process fetch request; either bypass, or serve embedded resource,
  // or upgrade.
  const onFetch = async (event) => {
    const clientId = event.clientId;
    const request = event.request;

    // Pass direct cached resource requests.
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
      return;
    }

    // Serve backed resources.
    if (maybeProcessEmbeddedResources(event)) {
      return;
    }

    // Notify server we are JXL-capable.
    if (request.destination === 'image') {
      let accept = request.headers.get('Accept');
      // Only if browser does not support JXL.
      if (accept.indexOf('image/jxl') === -1) {
        event.respondWith(wrapImageRequest(clientId, request));
      }
      return;
    }

    if (FORCE_COP) {
      event.respondWith(
          fetch(event.request).then(upgradeResponse).catch(reportError));
    }
  };

  // Serve decoded bytes.
  const onMessage = (event) => {
    const data = event.data;
    const uid = data.uid;
    let inflightEntry = null;
    for (let i = 0; i < inflight.length; ++i) {
      if (inflight[i].uid === uid) {
        inflightEntry = inflight[i];
        break;
      }
    }
    if (!inflightEntry) {
      console.log('Ooops, not found: ' + uid);
      return;
    }
    inflightEntry.outputStreamController.enqueue(data.data);
    inflightEntry.outputStreamController.close();
  };

  // This method is "main" for service worker.
  const serviceWorkerMain = () => {
    // https://v8.dev/blog/wasm-code-caching
    // > Every web site must perform at least one full compilation of a
    // > WebAssembly module — use workers to hide that from your users.
    // TODO(eustas): not 100% reliable, investigate why
    self['JxlDecoderLeak'] =
        WebAssembly.compileStreaming(fetch('jxl_decoder.wasm'));

    // ServiceWorker lifecycle.
    self.addEventListener('install', () => {
      return self.skipWaiting();
    });
    self.addEventListener(
        'activate', (event) => event.waitUntil(self.clients.claim()));
    self.addEventListener('message', onMessage);
    // Intercept some requests.
    self.addEventListener('fetch', onFetch);
  };

  // Service workers does not support multi-threading; that is why decoding is
  // relayed back to "client" (document / window).
  const prepareClient = () => {
    const clientWorker = new Worker('client_worker.js');
    clientWorker.onmessage = (event) => {
      const data = event.data;
      if (typeof addMessage !== 'undefined') {
        if (data.msg) {
          addMessage(data.msg, 'blue');
        }
      }
      navigator.serviceWorker.controller.postMessage(
          data, gatherTransferrables(data.data));
    };

    // Forward ServiceWorker requests to "Client" worker.
    navigator.serviceWorker.addEventListener('message', (event) => {
      clientWorker.postMessage(
          event.data, gatherTransferrables(event.data.data));
    });
  };

  // Executed in HTML page environment.
  const maybeRegisterServiceWorker = () => {
    const config = {
      log: console.log,
      error: console.error,
      ...window.serviceWorkerConfig  // add overrides
    }

    if (!window.isSecureContext) {
      config.log('Secure context is required for this ServiceWorker.');
      return;
    }

    const onServiceWorkerRegistrationSuccess = (registration) => {
      config.log('Service Worker registered', registration.scope);
    };

    const onServiceWorkerRegistrationFailure = (err) => {
      config.error('Service Worker failed to register:', err);
    };

    navigator.serviceWorker.register(window.document.currentScript.src)
        .then(
            onServiceWorkerRegistrationSuccess,
            onServiceWorkerRegistrationFailure);
  };

  const pageMain = () => {
    maybeRegisterServiceWorker();
    prepareClient();
  };

  // Detect environment and run corresponding "main" method.
  if (typeof window === 'undefined') {
    serviceWorkerMain();
  } else {
    pageMain();
  }
})();
