import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createAnimationScope,fallPlan} from '../effects.js';
import {createGame,swap,spark,bestMove} from '../engine.js';

test('animated gravity preserves real survivor identities and introduces replacements only above the board',()=>{
  for(let level=0;level<12;level++){
    const state=createGame(level);
    for(const result of [swap(state,...bestMove(state)),spark(state,14)]){
      for(const wave of result.waves){
        const plan=fallPlan(wave);
        assert.equal(plan.length,36);
        assert.equal(new Set(plan.map(move=>move.index)).size,36);
        assert.equal(plan.filter(move=>move.spawned).length,wave.clear.length);
        for(const move of plan){
          assert.ok(Number.isInteger(move.rows)&&move.rows>=0);
          if(move.spawned){
            assert.equal(move.from,null);
            assert.ok(Math.floor(move.index/6)-move.rows<0,'new ingredients enter from above the board');
          }else{
            assert.ok(!wave.clear.includes(move.from));
            assert.equal(move.from%6,move.index%6);
            assert.equal(Math.floor(move.index/6)-Math.floor(move.from/6),move.rows);
            assert.equal(wave.after[move.index],wave.before[move.from]);
          }
        }
        assert.deepEqual(plan.filter(move=>!move.spawned).map(move=>move.from).sort((a,b)=>a-b),
          Array.from({length:36},(_,i)=>i).filter(i=>!wave.clear.includes(i)));
      }
    }
  }
});

test('cancelling a visual scope settles waits and animations and removes every owned overlay',async()=>{
  const scheduled=new Map();let id=0,animationCancel=0,removed=0,finish;
  const scope=createAnimationScope({setTimer:callback=>{scheduled.set(++id,callback);return id;},clearTimer:timer=>scheduled.delete(timer)});
  const waiting=scope.wait(500);
  const animation={finished:new Promise(resolve=>finish=resolve),cancel(){animationCancel++;}};
  const animated=scope.animate({animate:()=>animation},[],{duration:300});
  scope.own({remove(){removed++;}});
  const lateCallbacks=[...scheduled.values()];
  scope.cancel();scope.cancel();
  assert.deepEqual(await Promise.all([waiting,animated]),[false,false]);
  assert.equal(scheduled.size,0);assert.equal(animationCancel,1);assert.equal(removed,1);
  for(const callback of lateCallbacks)callback();
  finish();await Promise.resolve();
  assert.equal(animationCancel,1,'a queued watchdog cannot cancel an already cancelled animation again');
  assert.equal(removed,1,'a late finished promise must not repeat cleanup');
  assert.equal(await scope.wait(20),false);
  assert.equal(await scope.animate({animate(){throw new Error('must not start');}},[]),false);
});

test('a finite animation whose finished promise never settles releases its wait and overlay through the watchdog',async()=>{
  const scheduled=new Map();let id=0,cancelled=0,removed=0,settlements=0,finish;
  const scope=createAnimationScope({setTimer:(callback,ms)=>{scheduled.set(++id,{callback,ms});return id;},clearTimer:timer=>scheduled.delete(timer)});
  const animation={finished:new Promise(resolve=>finish=resolve),cancel(){cancelled++;}};
  const remove=scope.own({remove(){removed++;}});
  const result=scope.animate({animate:()=>animation},[],{duration:430,delay:64}).then(ok=>{settlements++;remove();return ok;});
  assert.equal(scheduled.size,1);
  const watchdog=[...scheduled.values()][0];
  assert.ok(watchdog.ms>494,'fallback must allow the configured duration and delay to finish normally');
  assert.ok(watchdog.ms<=1494,'a short visual effect must not retain game input indefinitely');
  watchdog.callback();
  assert.equal(await result,false);
  assert.equal(scheduled.size,0);assert.equal(cancelled,1);assert.equal(removed,1);assert.equal(settlements,1);
  finish();watchdog.callback();await Promise.resolve();scope.cancel();
  assert.equal(cancelled,1);assert.equal(removed,1);assert.equal(settlements,1);
});

test('normal animation completion removes the watchdog and a late timeout cannot cancel the completed effect',async()=>{
  const scheduled=new Map();let id=0,cancelled=0,finish;
  const scope=createAnimationScope({setTimer:callback=>{scheduled.set(++id,callback);return id;},clearTimer:timer=>scheduled.delete(timer)});
  const animation={finished:new Promise(resolve=>finish=resolve),cancel(){cancelled++;}};
  const result=scope.animate({animate:()=>animation},[],{duration:210});
  assert.equal(scheduled.size,1);
  const lateWatchdog=[...scheduled.values()][0];
  finish();assert.equal(await result,true);
  assert.equal(scheduled.size,0);assert.equal(cancelled,0);
  lateWatchdog();scope.cancel();await Promise.resolve();
  assert.equal(cancelled,0,'normal completion stays completed even if a stale timeout callback is already queued');
});

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const flow=app.slice(app.indexOf('function start(index)'),app.indexOf('\nfunction activate('));
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};

function appHarness({pauseAt=null,failAt=null}={}){
  const sessions=[],snapshots=[],warnings=[];
  let current=null;
  const motion={
    cancel(){current?.release?.();},
    begin(){
      motion.cancel();
      const session={ended:0,celebrated:0,release:null};current=session;sessions.push(session);
      for(const stage of ['swap','charge','clear','fall'])session[stage]=async()=>{
        if(stage===failAt)throw new Error('visual backend unavailable');
        if(stage===pauseAt)await new Promise(resolve=>session.release=resolve);
      };
      session.end=()=>session.ended++;
      session.celebrate=()=>session.celebrated++;
      return session;
    }
  };
  const context=vm.createContext({
    motion,busy:false,epoch:0,state:createGame(0),visualState:null,selected:null,
    armed:false,focus:14,hinted:[],message:'',lang:'en',pointerStart:null,skipClick:false,
    createGame,t:(zh,en)=>en,tone:()=>{},finish:()=>{},setMessage:()=>{},
    $:()=>({close(){}}),history:{replaceState(){}},location:{pathname:'/',search:''},
    console:{warn:(...args)=>warnings.push(args)},renderBoard:()=>{},
    renderStats:()=>{
      const value=context.visualState||context.state;
      snapshots.push({score:value.score,moves:value.moves,collected:[...value.collected],lit:[...value.lit]});
    },
    render:()=>context.renderStats()
  });
  vm.runInContext(flow,context);
  return {context,sessions,snapshots,warnings};
}

test('a restart or recipe change during any cascade phase cannot let an old run commit or unlock a newer run',async()=>{
  for(const pauseAt of ['charge','clear','fall']){
    const h=appHarness({pauseAt}),c=h.context;
    const oldRun=c.animate(swap(c.state,...bestMove(c.state)));
    await flush();assert.equal(c.busy,true);assert.ok(h.sessions[0].release);
    c.start(1);
    assert.equal(c.state.level,1);assert.equal(c.state.score,0);assert.equal(c.visualState,null);
    const newRun=c.animate(swap(c.state,...bestMove(c.state)));
    await flush();await oldRun;
    assert.equal(c.state.level,1);assert.equal(c.busy,true,'the obsolete run must not unlock the active board');
    assert.equal(h.sessions[0].ended,0);
    c.start(1); // A same-recipe Restart has the same cancellation guarantee.
    await flush();await newRun;
    assert.equal(c.busy,false);assert.equal(c.state.level,1);assert.equal(c.state.score,0);
    assert.equal(c.state.moves,21);assert.equal(c.visualState,null);assert.equal(h.sessions[1].ended,0);
  }
});

test('animated counters follow each actual wave and finish with the exact immutable engine result',async()=>{
  const h=appHarness(),c=h.context,initial=c.state;
  const result=swap(initial,20,26);
  assert.equal(result.waves.length,4);
  await c.animate(result);
  let score=initial.score;const collected=initial.collected.slice(),expected=[];
  for(const wave of result.waves){
    score+=wave.clear.length*10*wave.depth;
    for(const index of wave.clear)collected[wave.before[index]-1]++;
    expected.push({score,moves:19,collected:collected.slice()});
  }
  assert.deepEqual(h.snapshots.slice(1,-1).map(({score,moves,collected})=>({score,moves,collected})),expected);
  assert.equal(c.state,result.state);assert.equal(c.visualState,null);assert.equal(c.busy,false);
  assert.equal(h.sessions[0].ended,1);assert.equal(h.warnings.length,0);
});

test('a failed visual phase still commits the stable game result and restores controls',async()=>{
  const h=appHarness({failAt:'clear'}),c=h.context,result=swap(c.state,20,26);
  await c.animate(result);
  assert.equal(c.state,result.state);assert.equal(c.state.score,300);
  assert.equal(c.busy,false);assert.equal(c.visualState,null);
  assert.equal(h.sessions[0].ended,1);assert.equal(h.warnings.length,1);
});
