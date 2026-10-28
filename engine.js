export const SIZE = 6;
export const COLORS = 5;
export const LEVELS = [
  {name:['第一瓶月光','A bottle of moonlight'], seed:1926, moves:20, recipe:[10,0,9,0,0], candles:[]},
  {name:['南瓜糖浆','Pumpkin syrup'], seed:8421, moves:21, recipe:[15,9,0,0,0], candles:[]},
  {name:['唤醒烛火','Wake the candles'], seed:7312, moves:22, recipe:[0,18,0,18,0], candles:[7,28]},
  {name:['蝙蝠的晚餐','A bat’s supper'], seed:4198, moves:22, recipe:[0,0,24,0,20], candles:[8,27]},
  {name:['薄荷星尘','Mint & stardust'], seed:5524, moves:23, recipe:[0,24,0,25,0], candles:[7,10,25,28]},
  {name:['双倍南瓜','Double pumpkin'], seed:9927, moves:24, recipe:[35,0,20,0,0], candles:[12,17,30,35]},
  {name:['女巫的茶会','The witches’ tea'], seed:20471, moves:24, recipe:[24,24,24,0,0], candles:[0,5,14,21,30,35]},
  {name:['午夜护身符','Midnight charm'], seed:6358, moves:25, recipe:[0,24,0,25,20], candles:[1,4,13,22,31,34]},
  {name:['幽灵好梦','Sweet ghost dreams'], seed:38147, moves:25, recipe:[26,0,28,0,26], candles:[0,5,12,17,24,29]},
  {name:['满月庆典','The full-moon feast'], seed:76053, moves:26, recipe:[32,32,0,32,0], candles:[7,8,9,10,25,26,27,28]},
  {name:['最后一缕星光','The last starlight'], seed:28866, moves:27, recipe:[0,26,28,26,26], candles:[0,5,7,10,25,28,30,35]},
  {name:['大魔药师','The grand brew'], seed:100731, moves:28, recipe:[30,30,30,30,30], candles:[0,2,3,5,12,17,18,23,30,32,33,35]}
].map((l,i)=>Object.freeze({...l,id:i+1,recipe:Object.freeze(l.recipe),candles:Object.freeze(l.candles)}));

export function nextRandom(seed) { const s=((seed>>>0)*1664525+1013904223)>>>0; return [s,s/4294967296]; }
function takeColor(state, colors=COLORS) { const [seed,r]=nextRandom(state.seed); state.seed=seed; return 1+Math.floor(r*colors); }
export function adjacent(a,b) {return Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>=0&&a<SIZE*SIZE&&b<SIZE*SIZE&&Math.abs(a%SIZE-b%SIZE)+Math.abs(Math.floor(a/SIZE)-Math.floor(b/SIZE))===1;}
export function findMatches(board) {
  const set=new Set();
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;){let j=c+1;while(j<SIZE&&board[r*SIZE+j]===board[r*SIZE+c])j++;if(board[r*SIZE+c]>0&&j-c>=3)for(let k=c;k<j;k++)set.add(r*SIZE+k);c=j;}
  for(let c=0;c<SIZE;c++)for(let r=0;r<SIZE;){let j=r+1;while(j<SIZE&&board[j*SIZE+c]===board[r*SIZE+c])j++;if(board[r*SIZE+c]>0&&j-r>=3)for(let k=r;k<j;k++)set.add(k*SIZE+c);r=j;}
  return [...set].sort((a,b)=>a-b);
}
export function legalMoves(board) {
  const moves=[];
  for(let a=0;a<36;a++)for(const b of [a%SIZE<5?a+1:-1,a+SIZE<36?a+SIZE:-1]){if(b<0||board[a]===board[b])continue;const trial=board.slice();[trial[a],trial[b]]=[trial[b],trial[a]];if(findMatches(trial).length)moves.push([a,b]);}
  return moves;
}
function freshBoard(state){
  const board=[];
  for(let i=0;i<36;i++){let color;do{color=takeColor(state);}while((i%SIZE>=2&&board[i-1]===color&&board[i-2]===color)||(i>=SIZE*2&&board[i-SIZE]===color&&board[i-SIZE*2]===color));board.push(color);}
  return board;
}
export function stabilizeBoard(state) {
  if(legalMoves(state.board).length)return false;
  const original=state.board.slice();
  for(let attempt=0;attempt<200;attempt++){
    const candidate=original.slice();
    for(let i=candidate.length-1;i>0;i--){const [seed,r]=nextRandom(state.seed);state.seed=seed;const j=Math.floor(r*(i+1));[candidate[i],candidate[j]]=[candidate[j],candidate[i]];}
    if(!findMatches(candidate).length&&legalMoves(candidate).length){state.board=candidate;return true;}
  }
  // Extremely skewed ingredient sets may admit no stable permutation. Refill safely.
  do{state.board=freshBoard(state);}while(legalMoves(state.board).length===0);
  return true;
}
export function createGame(index=0) {
  if(!Number.isInteger(index)||index<0||index>=LEVELS.length)index=0;
  const level=LEVELS[index],state={version:1,level:index,seed:level.seed,board:[],moves:level.moves,score:0,collected:Array(5).fill(0),lit:[],spark:1,turns:0,status:'playing'};
  state.board=freshBoard(state);stabilizeBoard(state);return state;
}
export function clone(state){return {...state,board:state.board.slice(),collected:state.collected.slice(),lit:state.lit.slice()};}
export function goalsMet(state){const l=LEVELS[state.level];return l.recipe.every((n,i)=>state.collected[i]>=n)&&l.candles.every(i=>state.lit.includes(i));}
function clearAndFall(state, cells, depth){
  const before=state.board.slice(),newLights=[];
  for(const i of cells){state.collected[before[i]-1]++;state.board[i]=0;}
  for(const candle of LEVELS[state.level].candles)if(!state.lit.includes(candle)&&cells.some(i=>i===candle||adjacent(i,candle))){state.lit.push(candle);newLights.push(candle);}
  state.lit.sort((a,b)=>a-b);state.score+=cells.length*10*depth;
  for(let c=0;c<SIZE;c++){
    const pieces=[];for(let r=SIZE-1;r>=0;r--)if(state.board[r*SIZE+c])pieces.push(state.board[r*SIZE+c]);
    for(let r=SIZE-1;r>=0;r--)state.board[r*SIZE+c]=SIZE-1-r<pieces.length?pieces[SIZE-1-r]:takeColor(state);
  }
  return {before,clear:cells.slice(),after:state.board.slice(),newLights,depth};
}
function resolve(state, first){
  const waves=[];let matches=first,depth=1;
  while(matches.length){waves.push(clearAndFall(state,matches,depth++));matches=findMatches(state.board);if(depth>150)throw new Error('Unexpected cascade limit');}
  const shuffled=stabilizeBoard(state);
  state.status=goalsMet(state)?'won':state.moves<=0&&state.spark===0?'lost':'playing';
  return {waves,shuffled};
}
export function swap(state,a,b){
  if(state.status!=='playing'||state.moves<=0||!adjacent(a,b))return {ok:false,reason:'invalid',state};
  const next=clone(state);[next.board[a],next.board[b]]=[next.board[b],next.board[a]];
  const matched=findMatches(next.board);
  if(!matched.length)return {ok:false,reason:'no-match',state};
  next.moves--;next.turns++;
  const result=resolve(next,matched);return {ok:true,state:next,...result};
}
export function spark(state,index){
  if(state.status!=='playing'||state.spark!==1||!Number.isInteger(index)||index<0||index>=36)return {ok:false,reason:'invalid',state};
  const next=clone(state);next.spark=0;next.turns++;
  const cross=[];for(let i=0;i<36;i++)if(i%SIZE===index%SIZE||Math.floor(i/SIZE)===Math.floor(index/SIZE))cross.push(i);
  const result=resolve(next,cross);return {ok:true,state:next,...result};
}
export function starCount(state){if(state.status!=='won')return 0;return state.moves>=8?3:state.moves>=3?2:1;}
export function bestMove(state){
  if(state.status!=='playing'||state.moves<=0)return null;
  const level=LEVELS[state.level];let best=null,bestValue=-Infinity;
  for(const [a,b] of legalMoves(state.board)){
    const next=swap(state,a,b).state;
    let value=(next.score-state.score)*.02+(next.lit.length-state.lit.length)*8;
    for(let i=0;i<5;i++)value+=(Math.min(next.collected[i],level.recipe[i])-Math.min(state.collected[i],level.recipe[i]))*2;
    if(next.status==='won')value+=10000;
    if(value>bestValue){bestValue=value;best=[a,b];}
  }
  return best;
}
export function parseLevel(value){if(typeof value!=='string'||!/^\d+$/.test(value))return 0;const n=Number(value);return Number.isSafeInteger(n)&&n>=1&&n<=LEVELS.length?n-1:0;}
export function readProfile(raw){
  let value;try{value=JSON.parse(raw);}catch{return {language:'en',sound:false,best:{}};}
  if(!value||typeof value!=='object'||Array.isArray(value))value={};
  const best={};if(value.best&&typeof value.best==='object'&&!Array.isArray(value.best))for(const [k,v]of Object.entries(value.best))if(/^\d+$/.test(k)&&Number(k)<LEVELS.length&&Number(k)>=0&&v&&typeof v==='object'&&Number.isInteger(v.stars)&&v.stars>=1&&v.stars<=3&&Number.isSafeInteger(v.score)&&v.score>=0)best[k]={stars:v.stars,score:v.score};
  return {language:value.language==='zh'?'zh':'en',sound:value.sound===true,best};
}
