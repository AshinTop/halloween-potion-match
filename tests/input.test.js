import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const gestures=source.slice(source.indexOf('let pointerStart=null'),source.indexOf("$('#spark').addEventListener"));
function harness(){
 const handlers={},calls={swaps:0,animations:0,activations:0};
 const board={addEventListener:(event,handler)=>{handlers[event]=handler;}};
 const context=vm.createContext({$:()=>board,busy:false,state:{status:'playing'},epoch:1,armed:false,keyboard:false,
  swap:(state,a,b)=>{calls.swaps++;return {ok:true,state,a,b};},
  animate:()=>{calls.animations++;},activate:()=>{calls.activations++;}});
 vm.runInContext(gestures,context);
 const cell={dataset:{index:'7'}},target={closest:()=>cell};
 const down=()=>handlers.pointerdown({target,pointerId:1,clientX:100,clientY:100});
 const up=()=>handlers.pointerup({target,pointerId:1,clientX:140,clientY:100});
 const click=()=>handlers.click({target});
 return {handlers,calls,context,down,up,click};
}
test('a pointer gesture cannot submit a second swap after another input starts a cascade',()=>{const h=harness();h.down();h.context.busy=true;h.context.epoch++;h.up();h.click();assert.deepEqual(h.calls,{swaps:0,animations:0,activations:0});});
test('a gesture from an older board is discarded even after that cascade has finished',()=>{const h=harness();h.down();h.context.epoch++;h.up();h.click();assert.deepEqual(h.calls,{swaps:0,animations:0,activations:0});});
test('terminal games discard in-flight gestures while a current legal swipe still works',()=>{const h=harness();h.down();h.context.state.status='won';h.up();h.click();assert.equal(h.calls.swaps,0);const normal=harness();normal.down();normal.up();normal.click();assert.deepEqual(normal.calls,{swaps:1,animations:1,activations:0});});
test('the animation entry point also rejects concurrent or terminal results',async()=>{const functionSource=source.slice(source.indexOf('async function animate('),source.indexOf('\nfunction activate('));let rendered=0;const context=vm.createContext({busy:true,state:{status:'playing'},renderBoard:()=>rendered++,setMessage:()=>rendered++});vm.runInContext(functionSource,context);await vm.runInContext('animate({ok:false})',context);context.busy=false;context.state.status='won';await vm.runInContext('animate({ok:false})',context);assert.equal(rendered,0);});
