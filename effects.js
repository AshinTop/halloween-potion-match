import {COLORS, ingredient} from './art.js?v=20261029-2';

// Each visual run owns its waits, animations and temporary elements. Cancelling
// settles every pending promise so an obsolete recipe can never finish later.
export function createAnimationScope({setTimer=setTimeout, clearTimer=clearTimeout}={}) {
  let cancelled=false;
  const timers=new Map(), animations=new Map(), cleanups=new Set();
  const scope={
    get cancelled(){return cancelled;},
    wait(ms){
      if(cancelled||ms<=0)return Promise.resolve(!cancelled);
      return new Promise(resolve=>{
        const id=setTimer(()=>{timers.delete(id);resolve(!cancelled);},ms);
        timers.set(id,resolve);
      });
    },
    animate(node,frames,options={}){
      if(cancelled)return Promise.resolve(false);
      if(!node?.animate)return Promise.resolve(true);
      let animation;
      try{animation=node.animate(frames,{fill:'none',...options});}
      catch{return Promise.resolve(true);}
      return new Promise(resolve=>{
        let settled=false,watchdog=null;
        const done=ok=>{
          if(settled)return;
          settled=true;
          if(watchdog!==null){clearTimer(watchdog);watchdog=null;}
          animations.delete(animation);
          resolve(ok&&!cancelled);
        };
        animations.set(animation,done);
        const duration=Number(options.duration??0),iterations=Number(options.iterations??1);
        const delay=Math.max(0,Number(options.delay??0)),endDelay=Math.max(0,Number(options.endDelay??0));
        const nominal=duration*iterations+delay+endDelay;
        // A paused rendering timeline must not hold the resolved game move
        // hostage. Normal animations finish first; this only skips a late
        // visual effect, and shares the same once-only cleanup as cancel().
        if(Number.isFinite(nominal)&&nominal>=0)watchdog=setTimer(()=>{
          if(settled)return;
          try{animation.cancel();}catch{}
          done(false);
        },Math.max(750,nominal+350));
        animation.finished.then(()=>done(true),()=>done(false));
      });
    },
    own(node){
      const remove=()=>node.remove();
      if(cancelled){remove();return ()=>{};}
      cleanups.add(remove);
      return ()=>{cleanups.delete(remove);remove();};
    },
    cancel(){
      if(cancelled)return;
      cancelled=true;
      for(const [id,resolve] of timers){clearTimer(id);resolve(false);}
      timers.clear();
      for(const [animation,resolve] of animations){
        try{animation.cancel();}catch{}
        resolve(false);
      }
      animations.clear();
      for(const cleanup of cleanups)cleanup();
      cleanups.clear();
    }
  };
  return scope;
}

// The engine already resolved the cascade. Reconstruct only the visual route:
// survivors keep their order, and every new ingredient starts above the board.
export function fallPlan(wave,size=6) {
  const removed=new Set(wave.clear), plan=[];
  for(let column=0;column<size;column++){
    let destination=size-1;
    for(let row=size-1;row>=0;row--){
      const from=row*size+column;
      if(removed.has(from))continue;
      plan.push({index:destination*size+column,from,rows:destination-row,spawned:false});
      destination--;
    }
    const missing=destination+1;
    for(let row=destination;row>=0;row--)
      plan.push({index:row*size+column,from:null,rows:missing,spawned:true});
  }
  return plan.sort((a,b)=>a.index-b.index);
}

const center=r=>({x:r.left+r.width/2,y:r.top+r.height/2});
const visibleRect=node=>{
  const r=node?.getBoundingClientRect();
  return r&&r.width>0&&r.height>0?r:null;
};

export function createPotionEffects({board,shell,combo,isReduced=()=>false}) {
  const layer=document.createElement('div');
  layer.className='potion-fx-layer';
  layer.setAttribute('aria-hidden','true');
  document.body.append(layer);
  let current=null;

  function reset(){
    current?.cancel();
    layer.replaceChildren();
    combo.classList.remove('show');
    combo.style.visibility='hidden';
    shell.classList.remove('brewing','spark-wave');
    board.removeAttribute('aria-busy');
    document.querySelector('#cauldron')?.classList.remove('is-brewing');
    for(const node of board.querySelectorAll('.match-charge,.is-falling'))
      node.classList.remove('match-charge','is-falling');
    for(const node of document.querySelectorAll('.win-sparks'))node.remove();
  }

  return {
    cancel:reset,
    begin(){
      reset();
      const scope=current=createAnimationScope();
      const reduced=()=>isReduced()||document.hidden;
      board.setAttribute('aria-busy','true');

      function temporary(node,frames,options,parent=layer){
        if(scope.cancelled)return;
        parent.append(node);
        const remove=scope.own(node);
        scope.animate(node,frames,options).then(remove);
      }

      function dot(x,y,color,size,kind='star'){
        const node=document.createElement('i');
        node.className=`magic-particle ${kind}`;
        node.style.cssText=`left:${x}px;top:${y}px;width:${size}px;height:${size}px;--magic:${color}`;
        return node;
      }

      function pulse(target,color){
        if(scope.cancelled||reduced()||!target)return;
        scope.animate(target,[
          {transform:'scale(1)',boxShadow:'0 0 0 0 transparent'},
          {transform:'scale(1.055)',boxShadow:`0 0 0 2px ${color}77,0 0 20px ${color}33`,offset:.38},
          {transform:'scale(1)',boxShadow:'0 0 0 0 transparent'}
        ],{duration:280,easing:'ease-out'});
        const number=target.querySelector('strong');
        if(number)scope.animate(number,[{transform:'translateY(2px)',opacity:.6},{transform:'translateY(0)',opacity:1}],{duration:210});
      }

      function sendIngredients(wave,cells){
        const groups=new Map();
        for(const entry of cells){
          const color=wave.before[entry.index];
          if(!groups.has(color))groups.set(color,[]);
          groups.get(color).push(entry.point);
        }
        let order=0;
        // One travelling emblem per ingredient type: at most five, even for
        // a full cross clear. The board remains readable on small phones.
        for(const [color,points] of groups){
          const selector=`[data-ingredient-goal="${color}"]`;
          const goal=document.querySelector(selector);
          const target=visibleRect(goal)||visibleRect(document.querySelector('#cauldron'));
          if(!target)continue;
          const start={x:points.reduce((s,p)=>s+p.x,0)/points.length,y:points.reduce((s,p)=>s+p.y,0)/points.length};
          const end=center(target),dx=end.x-start.x,dy=end.y-start.y;
          const arc=Math.min(100,35+Math.abs(dx)*.17);
          const node=document.createElement('span');
          node.className='brew-flight';
          node.innerHTML=ingredient(color);
          node.style.cssText=`left:${start.x}px;top:${start.y}px;--magic:${COLORS[color-1]}`;
          const frames=[0,.28,.62,1].map(progress=>({
            transform:`translate(calc(-50% + ${dx*progress}px),calc(-50% + ${dy*progress-4*arc*progress*(1-progress)}px)) scale(${1-progress*.48}) rotate(${progress*12-6}deg)`,
            opacity:progress===1?0:1,offset:progress
          }));
          layer.append(node);
          const remove=scope.own(node);
          scope.animate(node,frames,{duration:430,delay:order++*16,easing:'cubic-bezier(.32,.02,.6,1)',fill:'backwards'}).then(ok=>{
            remove();
            if(ok)pulse(document.querySelector(selector)||document.querySelector('#cauldron'),COLORS[color-1]);
          });
        }
      }

      function matchThreads(wave,isSpark){
        const clear=new Set(wave.clear);
        const lines=[];
        for(let axis=0;axis<2;axis++)for(let outer=0;outer<6;outer++){
          let run=[];
          const flush=()=>{if(run.length>=3)lines.push(run);run=[];};
          for(let inner=0;inner<=6;inner++){
            const index=axis?inner*6+outer:outer*6+inner;
            if(inner<6&&clear.has(index)&&(isSpark||!run.length||wave.before[index]===wave.before[run[0]]))run.push(index);
            else{flush();if(inner<6&&clear.has(index))run.push(index);}
          }
        }
        for(const run of lines.slice(0,12)){
          const a=visibleRect(board.querySelector(`[data-index="${run[0]}"]`));
          const b=visibleRect(board.querySelector(`[data-index="${run.at(-1)}"]`));
          if(!a||!b)continue;
          const from=center(a),to=center(b),dx=to.x-from.x,dy=to.y-from.y;
          const angle=Math.atan2(dy,dx)*180/Math.PI;
          const node=document.createElement('i');
          node.className='spell-thread';
          node.style.cssText=`left:${from.x}px;top:${from.y}px;width:${Math.hypot(dx,dy)}px;--magic:${isSpark?'#efe0b3':COLORS[wave.before[run[0]]-1]}`;
          temporary(node,[
            {transform:`rotate(${angle}deg) scaleX(0)`,opacity:0},
            {transform:`rotate(${angle}deg) scaleX(1)`,opacity:.85,offset:.45},
            {transform:`rotate(${angle}deg) scaleX(1.06)`,opacity:0}
          ],{duration:340,easing:'ease-out'});
        }
      }

      return {
        async swap(before,after){
          if(scope.cancelled||reduced())return;
          const changed=before.flatMap((value,index)=>value!==after[index]?[index]:[]);
          if(changed.length!==2)return;
          const [a,b]=changed.map(index=>board.querySelector(`[data-index="${index}"]`));
          const ar=visibleRect(a),br=visibleRect(b);
          if(!ar||!br)return;
          await Promise.all([[a,br.left-ar.left,br.top-ar.top],[b,ar.left-br.left,ar.top-br.top]].map(([cell,x,y])=>
            scope.animate(cell.querySelector('.ingredient-art'),[
              {transform:'translate(0,0) scale(1)'},
              {transform:`translate(${x*.5}px,${y*.5}px) scale(1.06)`,offset:.5},
              {transform:`translate(${x}px,${y}px) scale(1)`}
            ],{duration:145,easing:'cubic-bezier(.3,.05,.2,1)',fill:'forwards'})
          ));
        },
        async charge(wave,{language='en',isSpark=false}={}){
          if(scope.cancelled)return;
          const accent=COLORS[Math.min(4,wave.depth-1)];
          shell.style.setProperty('--brew-accent',accent);
          shell.classList.add('brewing');
          shell.classList.toggle('spark-wave',isSpark);
          for(const index of wave.clear){
            const cell=board.querySelector(`[data-index="${index}"]`);
            cell?.style.setProperty('--ingredient-color',COLORS[wave.before[index]-1]);
            cell?.classList.add('match-charge');
          }
          if(reduced())return;
          const zh=language==='zh',depth=wave.depth;
          const titles=zh?['一点小魔法','连成好滋味','月光的魔法','奇妙的连锁','大魔药师！']:['A little magic','Lovely chain','Moonlit magic','Wonderful brew','Spellbinding!'];
          const title=isSpark?(zh?'月光，绽放！':'Moonlight, bloom!'):titles[Math.min(4,depth-1)];
          const label=isSpark?(zh?'月光火花':'MOON SPARK'):depth>1?(zh?`连锁 ×${depth}`:`CASCADE ×${depth}`):(zh?`${wave.clear.length} 个原料`:`${wave.clear.length} INGREDIENTS`);
          combo.innerHTML=`<span class="combo-label">${label}</span><strong>${title}</strong><span class="combo-score">+${wave.clear.length*10*depth}</span>`;
          combo.dataset.tier=String(Math.min(4,depth));
          combo.style.visibility='visible';
          combo.classList.add('show');
          scope.animate(combo,[
            {opacity:0,transform:'translate(-50%,-7px) scale(.94)'},
            {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.22},
            {opacity:1,transform:'translate(-50%,0) scale(1)',offset:.84},
            {opacity:0,transform:'translate(-50%,-3px) scale(1.02)'}
          ],{duration:720,easing:'ease-out'});
          matchThreads(wave,isSpark);
          return scope.wait(isSpark?150:110);
        },
        async clear(wave){
          if(scope.cancelled||reduced())return;
          const cells=wave.clear.flatMap(index=>{
            const node=board.querySelector(`[data-index="${index}"]`),rect=visibleRect(node);
            return rect?[{index,node,rect,point:center(rect)}]:[];
          });
          const small=board.clientWidth<340,maxParticles=small?30:48,maxRings=small?10:16;
          let particleCount=0;
          const fades=[];
          for(let order=0;order<cells.length;order++){
            const entry=cells[order],color=COLORS[wave.before[entry.index]-1];
            fades.push(scope.animate(entry.node.querySelector('.ingredient-art'),[
              {opacity:1,transform:'scale(1)',filter:'brightness(1)'},
              {opacity:1,transform:'scale(1.16) rotate(-4deg)',filter:'brightness(1.55)',offset:.26},
              {opacity:0,transform:'scale(.18) rotate(12deg)',filter:'brightness(1.8)'}
            ],{duration:190,delay:(order%3)*10,easing:'cubic-bezier(.38,0,.8,.4)',fill:'forwards'}));
            if(order<maxRings){
              const ring=document.createElement('i'),size=entry.rect.width*.78;
              ring.className='magic-ring';
              ring.style.cssText=`left:${entry.point.x}px;top:${entry.point.y}px;width:${size}px;height:${size}px;--magic:${color}`;
              temporary(ring,[{transform:'translate(-50%,-50%) scale(.3)',opacity:.9},{transform:'translate(-50%,-50%) scale(1.5)',opacity:0}],{duration:400,easing:'ease-out'});
            }
            for(let k=0;k<3&&particleCount<maxParticles;k++,particleCount++){
              const angle=(order*2.399+k*2.094+wave.depth*.4),distance=entry.rect.width*(.32+k*.12);
              const x=Math.cos(angle)*distance,y=Math.sin(angle)*distance-8;
              const node=dot(entry.point.x,entry.point.y,color,Math.max(3,Math.min(7,entry.rect.width*.1)),k===1?'orb':'star');
              temporary(node,[
                {transform:'translate(-50%,-50%) scale(.25) rotate(0deg)',opacity:0},
                {transform:`translate(calc(-50% + ${x*.4}px),calc(-50% + ${y*.4}px)) scale(1) rotate(35deg)`,opacity:.95,offset:.23},
                {transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(.1) rotate(115deg)`,opacity:0}
              ],{duration:370+k*45,easing:'cubic-bezier(.1,.55,.3,1)'});
            }
          }
          sendIngredients(wave,cells);
          const pot=document.querySelector('#cauldron');
          pot?.classList.add('is-brewing');
          if(wave.depth>=3)scope.animate(shell,[
            {transform:'translateX(0)'},{transform:'translateX(-1.5px)',offset:.22},
            {transform:'translateX(1px)',offset:.48},{transform:'translateX(0)'}
          ],{duration:180,easing:'ease-out'});
          await Promise.all(fades);
        },
        async fall(wave){
          if(scope.cancelled||reduced())return;
          const first=visibleRect(board.querySelector('[data-index="0"]'));
          const below=visibleRect(board.querySelector('[data-index="6"]'));
          if(!first||!below)return;
          const step=below.top-first.top,falls=[];
          for(const move of fallPlan(wave)){
            if(!move.rows)continue;
            const cell=board.querySelector(`[data-index="${move.index}"]`),art=cell?.querySelector('.ingredient-art');
            cell?.classList.add('is-falling');
            const y=-move.rows*step;
            falls.push(scope.animate(art,[
              {transform:`translateY(${y}px) scale(.96,1.04)`,opacity:move.spawned?0:1},
              {transform:`translateY(${y*.78}px) scale(.98,1.02)`,opacity:1,offset:.18},
              {transform:'translateY(1px) scale(1.045,.94)',opacity:1,offset:.79},
              {transform:'translateY(-1px) scale(.99,1.02)',opacity:1,offset:.92},
              {transform:'translateY(0) scale(1)',opacity:1}
            ],{duration:265+Math.min(95,move.rows*20),delay:(move.index%6)*9+(move.spawned?18:0),easing:'cubic-bezier(.3,.05,.5,1)',fill:'backwards'}).then(()=>cell?.classList.remove('is-falling')));
          }
          for(const index of wave.newLights){
            const flame=board.querySelector(`[data-index="${index}"] .candle`);
            scope.animate(flame,[{transform:'scale(.8)',filter:'brightness(1)'},{transform:'scale(1.36)',filter:'brightness(1.8)',offset:.4},{transform:'scale(1)',filter:'brightness(1)'}],{duration:440,easing:'ease-out'});
          }
          await Promise.all(falls);
        },
        end(){
          if(scope.cancelled)return;
          combo.classList.remove('show');
          combo.style.visibility='hidden';
          shell.classList.remove('brewing','spark-wave');
          document.querySelector('#cauldron')?.classList.remove('is-brewing');
          board.removeAttribute('aria-busy');
        },
        celebrate(dialog){
          if(scope.cancelled||reduced())return;
          const art=dialog.querySelector('.result-art');
          if(!art)return;
          const sparks=document.createElement('div');
          sparks.className='win-sparks';
          art.append(sparks);
          const removeSparks=scope.own(sparks);
          const scale=Math.min(1,art.clientHeight/100);
          for(let i=0;i<16;i++){
            const angle=i*Math.PI*2/16,distance=(42+(i%3)*13)*scale;
            const node=dot(0,0,COLORS[i%5],4+i%3,i%3?'star':'orb');
            temporary(node,[
              {transform:'translate(-50%,-50%) scale(0)',opacity:0},
              {transform:`translate(calc(-50% + ${Math.cos(angle)*distance*.7}px),calc(-50% + ${Math.sin(angle)*distance*.7}px)) scale(1) rotate(40deg)`,opacity:1,offset:.35},
              {transform:`translate(calc(-50% + ${Math.cos(angle)*distance}px),calc(-50% + ${Math.sin(angle)*distance+10}px)) scale(.2) rotate(130deg)`,opacity:0}
            ],{duration:850,delay:i%4*35,easing:'ease-out',fill:'backwards'},sparks);
          }
          scope.wait(1050).then(removeSparks);
        }
      };
    }
  };
}
