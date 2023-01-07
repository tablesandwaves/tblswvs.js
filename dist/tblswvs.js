"use strict";var F=Object.defineProperty;var Ee=Object.getOwnPropertyDescriptor;var Ie=Object.getOwnPropertyNames,ee=Object.getOwnPropertySymbols;var ie=Object.prototype.hasOwnProperty,Ce=Object.prototype.propertyIsEnumerable;var ne=Math.pow,te=(o,e,t)=>e in o?F(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,W=(o,e)=>{for(var t in e||(e={}))ie.call(e,t)&&te(o,t,e[t]);if(ee)for(var t of ee(e))Ce.call(e,t)&&te(o,t,e[t]);return o};var h=(o,e)=>()=>(o&&(e=o(o=0)),e);var g=(o,e)=>{for(var t in e)F(o,t,{get:e[t],enumerable:!0})},we=(o,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Ie(e))!ie.call(o,n)&&n!==t&&F(o,n,{get:()=>e[n],enumerable:!(i=Ee(e,n))||i.enumerable});return o};var b=o=>we(F({},"__esModule",{value:!0}),o);var Oe=(o,e,t)=>{if(!e.has(o))throw TypeError("Cannot "+t)};var D=(o,e,t)=>{if(e.has(o))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(o):e.set(o,t)};var y=(o,e,t)=>(Oe(o,e,"access private method"),t);var l,T=h(()=>{"use strict";l=class extends Error{constructor(e){super(e),Object.setPrototypeOf(this,l.prototype)}}});var I={};g(I,{INCOMPATIBLE_SEQ_MSG:()=>j,NON_INTEGER_INPUTS:()=>oe,SCALE_DEGREE_ERROR:()=>Q,SELF_SIMILARITY_REQUIRES_COPRIMES:()=>q,areCoprime:()=>k,inversionMap:()=>Fe,rotate:()=>A,unique:()=>E});var j,oe,q,Q,E,k,A,Fe,C=h(()=>{"use strict";T();j="A Sequence can only be made new from and Array of Sequence objects that share the same rest symbol and mode",oe="Numbers must be integers",q="A self-similar melody can only be produced for an input sequence length that is coprime with the output sequence length",Q="Scale degrees must be negative or positive, but not 0",E=(o,e,t)=>t.indexOf(o)===e,k=(o,e)=>{if(!Number.isInteger(o)||!Number.isInteger(e))throw new l(oe);let t=o>e?e:o;for(let i=2;i<=t;i++)if(o%i===0&&e%i===0)return!1;return!0},A=(o,e)=>{let t=o.slice();if(t.length>e)t.unshift(...t.splice(-e));else{let i=0;for(;i<e;)t.unshift(t.splice(-1)),i++}return t},Fe=o=>{let e=new Map,t=Array.isArray(o)?o.filter(E).sort():[...new Array(o).keys()].map(i=>i+1);for(let i=0;i<t.length;i++)e.set(t[i],t[t.length-i-1]);return e}});var se={};g(se,{Rhythm:()=>w});var w,H=h(()=>{"use strict";R();w=class{constructor(e,t="wrap",i){this.steps=e,this.fillMode=t,this.length=i}applyTo(e){let t=this.steps.filter(r=>r!=0).length,i=Math.ceil(e.steps.length/t),n=new Array(i).fill(this.steps).flat();if(this.length!==void 0){if(this.length>n.length){let r=this.length-n.length;if(this.fillMode=="silence")n.push(...new Array(r).fill(0));else{let a=Math.ceil(r/this.steps.length);n.push(...new Array(a).fill(this.steps).flat())}}n=n.slice(0,this.length)}let s=0;return n.forEach((r,a)=>{r==1?(n[a]=e.steps[s%e.steps.length],s++):n[a]=e.restSymbol}),new d(n,e.restSymbol,e.melodicMode)}}});var re={};g(re,{Melody:()=>d,MelodyType:()=>V});var V,d,R=h(()=>{"use strict";T();C();H();V=(t=>(t.MIDI="MIDI",t.Degrees="Scale Degrees",t))(V||{}),d=class{constructor(e,t,i){this.steps=e===void 0?new Array:e,this.restSymbol=t===void 0?0:t,this.melodicMode=i==null?"Scale Degrees":i}clone(){return new d(this.steps,this.restSymbol,this.melodicMode)}static newFrom(e){let t=e.map(s=>s.restSymbol).filter(E),i=e.map(s=>s.melodicMode).filter(E);if(t.length>1||i.length>1)throw new l(j);let n=e.map(s=>s.steps).flat();return new d(n,e[0].restSymbol,e[0].melodicMode)}selfReplicate(e,t){if(t=t===void 0?2:t,!k(e,t))throw new l(q);let i=new Array(e).fill(-1);i[0]=this.steps[0],i[1]=this.steps[1];let n,s,r,a,m=i.findIndex(f=>f==-1),p=2;do{n=i.slice(0,m);for(let f=0;f<n.length;f++){s=n[f];for(let P=1;P<=Math.log2(e);P++)r=ne(t,P),i[f*r%e]=s}a=this.steps[p%this.steps.length],m=i.findIndex(f=>f==-1),m!=-1&&(i[m]=a),p++}while(m!=-1);let S=this.clone();return S.steps=i,S}counted(){let e=new Array;for(let i=1;i<=this.steps.length;i++){let n=new Array(i).fill(1);n.push(0);let s=this.steps.length*(i+1);new w(n,"wrap",s).applyTo(this).steps.forEach(a=>e.push(a))}let t=this.clone();return t.steps=e,t}zigZag(){let e=this.steps.length%2==0?this.steps.length/2+1:Math.ceil(this.steps.length/2),t=this.steps.reduce((i,n,s)=>{let r=new Array(e).fill(-1).map((a,m)=>this.steps[(m+s)%this.steps.length]);return i.push(r),i.push(r.slice(1,e).reverse()),i},new Array).flat();return new d(t)}static infinitySeries(e=[0,1],t=16,i=0){let n=new d,s=e[0],a=e[1]-s;return n.steps=Array.from(new Array(t),(m,p)=>p+i).map(m=>s+d.norgardInteger(m)*a),n}static norgardInteger(e){return e.toString(2).split("").map(i=>parseInt(i)).reduce((i,n)=>(n==1?i+=1:i*=-1,i),0)}}});var ce={};g(ce,{Mode:()=>u,Scale:()=>O});var O,N,ae,v,u,$=h(()=>{"use strict";C();O=(c=>(c[c.Ionian=0]="Ionian",c[c.Dorian=1]="Dorian",c[c.Phrygian=2]="Phrygian",c[c.Lydian=3]="Lydian",c[c.Mixolydian=4]="Mixolydian",c[c.Aeolian=5]="Aeolian",c[c.Locrian=6]="Locrian",c[c.Major=7]="Major",c[c.Minor=8]="Minor",c[c.MajPentatonic=9]="MajPentatonic",c[c.MinPentatonic=10]="MinPentatonic",c[c.WholeTone=11]="WholeTone",c[c.Chromatic=12]="Chromatic",c[c.GS=13]="GS",c))(O||{}),v=class{constructor(e){D(this,N);this.scale=e,this.name=O[e],[this.stepOffsets,this.scaleDegreeMapping]=y(this,N,ae).call(this,e),this.scaleOffsets=v.cummulativeOffsets(this.stepOffsets),this.chordQualities=v.chordQualities(this.stepOffsets)}static cummulativeOffsets(e){return e.reduce((t,i,n,s)=>(t.push(s.slice(0,n).reduce((r,a)=>r+=a,0)),t),[])}static chordQualities(e){return e.reduce((t,i,n,s)=>{let r=A(s,-n),a=r.slice(0,2).reduce((p,S)=>p+S,0),m=r.slice(2,4).reduce((p,S)=>p+S,0);return t.push(v.CHORD_INTERVAL_MAP[[a,m].join(":")]),t},[])}},u=v;N=new WeakSet,ae=function(e){let t,i,n=new Array;return t=e==7||e==9?0:e,t=e==8||e==10?5:e,i=A(v.MAJOR_STEP_OFFSETS,-t),e==9?(i.splice(2,2,3),i.splice(-2,2,3),n=[1,2,3,5,6]):e==10?(i.splice(0,2,3),i.splice(-3,2,3),n=[1,3,4,5,7]):e==11?(i=v.WHOLE_TONE_OFFSETS,n=[1,2,3,4,5,6]):e==12?(i=v.CHROMATIC_OFFSETS,n=[1,1.5,2,2.5,3,4,4.5,5,5.5,6,6.5,7]):e==13&&(i=v.GS_OFFSETS),[i,n]},u.MAJOR_STEP_OFFSETS=[2,2,1,2,2,2,1],u.WHOLE_TONE_OFFSETS=[2,2,2,2,2,2],u.CHROMATIC_OFFSETS=[1,1,1,1,1,1,1,1,1,1,1,1],u.GS_OFFSETS=[1,2,1,1,3,1,3],u.CHORD_INTERVAL_MAP={"4:3":"M","3:4":"m","3:3":"dim","4:4":"aug","4:5":"m/3","2:4":"sus25b","5:5":"sus2/2","5:4":"M/5","2:2":"WT","3:2":"m5bb"}});var z,X,U,M,me,x,le=h(()=>{"use strict";z=[["B#","C"],["C#","Db"],["Cx","D"],["D#","Eb"],["E","Fb"],["E#","F","Gbb"],["F#","Gb"],["Fx","G"],["G#","Ab"],["Gx","A","Bbb"],["A#","Bb"],["B","Cb"]],X=["C","D","E","F","G","A","B"],U=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],M={1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X",11:"XI",12:"XII"},me={oct:{intervals:[0,12]},pow:{intervals:[0,7]},M:{intervals:[0,4,7]},m:{intervals:[0,3,7]},dim:{intervals:[0,3,6]},aug:{intervals:[0,4,8]},sus2:{intervals:[0,2,7]},sus4:{intervals:[0,5,7]},"m/3":{intervals:[0,4,9]},sus25b:{intervals:[0,2,6]},"sus2/2":{intervals:[0,5,10]},"M/5":{intervals:[0,5,9]},WT:{intervals:[0,2,4]},m5bb:{intervals:[0,3,5]}},x=[{octave:-2,note:"C",midi:0},{octave:-2,note:"C#",midi:1},{octave:-2,note:"D",midi:2},{octave:-2,note:"D#",midi:3},{octave:-2,note:"E",midi:4},{octave:-2,note:"F",midi:5},{octave:-2,note:"F#",midi:6},{octave:-2,note:"G",midi:7},{octave:-2,note:"G#",midi:8},{octave:-2,note:"A",midi:9},{octave:-2,note:"A#",midi:10},{octave:-2,note:"B",midi:11},{octave:-1,note:"C",midi:12},{octave:-1,note:"C#",midi:13},{octave:-1,note:"D",midi:14},{octave:-1,note:"D#",midi:15},{octave:-1,note:"E",midi:16},{octave:-1,note:"F",midi:17},{octave:-1,note:"F#",midi:18},{octave:-1,note:"G",midi:19},{octave:-1,note:"G#",midi:20},{octave:-1,note:"A",midi:21},{octave:-1,note:"A#",midi:22},{octave:-1,note:"B",midi:23},{octave:0,note:"C",midi:24},{octave:0,note:"C#",midi:25},{octave:0,note:"D",midi:26},{octave:0,note:"D#",midi:27},{octave:0,note:"E",midi:28},{octave:0,note:"F",midi:29},{octave:0,note:"F#",midi:30},{octave:0,note:"G",midi:31},{octave:0,note:"G#",midi:32},{octave:0,note:"A",midi:33},{octave:0,note:"A#",midi:34},{octave:0,note:"B",midi:35},{octave:1,note:"C",midi:36},{octave:1,note:"C#",midi:37},{octave:1,note:"D",midi:38},{octave:1,note:"D#",midi:39},{octave:1,note:"E",midi:40},{octave:1,note:"F",midi:41},{octave:1,note:"F#",midi:42},{octave:1,note:"G",midi:43},{octave:1,note:"G#",midi:44},{octave:1,note:"A",midi:45},{octave:1,note:"A#",midi:46},{octave:1,note:"B",midi:47},{octave:2,note:"C",midi:48},{octave:2,note:"C#",midi:49},{octave:2,note:"D",midi:50},{octave:2,note:"D#",midi:51},{octave:2,note:"E",midi:52},{octave:2,note:"F",midi:53},{octave:2,note:"F#",midi:54},{octave:2,note:"G",midi:55},{octave:2,note:"G#",midi:56},{octave:2,note:"A",midi:57},{octave:2,note:"A#",midi:58},{octave:2,note:"B",midi:59},{octave:3,note:"C",midi:60},{octave:3,note:"C#",midi:61},{octave:3,note:"D",midi:62},{octave:3,note:"D#",midi:63},{octave:3,note:"E",midi:64},{octave:3,note:"F",midi:65},{octave:3,note:"F#",midi:66},{octave:3,note:"G",midi:67},{octave:3,note:"G#",midi:68},{octave:3,note:"A",midi:69},{octave:3,note:"A#",midi:70},{octave:3,note:"B",midi:71},{octave:4,note:"C",midi:72},{octave:4,note:"C#",midi:73},{octave:4,note:"D",midi:74},{octave:4,note:"D#",midi:75},{octave:4,note:"E",midi:76},{octave:4,note:"F",midi:77},{octave:4,note:"F#",midi:78},{octave:4,note:"G",midi:79},{octave:4,note:"G#",midi:80},{octave:4,note:"A",midi:81},{octave:4,note:"A#",midi:82},{octave:4,note:"B",midi:83},{octave:5,note:"C",midi:84},{octave:5,note:"C#",midi:85},{octave:5,note:"D",midi:86},{octave:5,note:"D#",midi:87},{octave:5,note:"E",midi:88},{octave:5,note:"F",midi:89},{octave:5,note:"F#",midi:90},{octave:5,note:"G",midi:91},{octave:5,note:"G#",midi:92},{octave:5,note:"A",midi:93},{octave:5,note:"A#",midi:94},{octave:5,note:"B",midi:95},{octave:6,note:"C",midi:96},{octave:6,note:"C#",midi:97},{octave:6,note:"D",midi:98},{octave:6,note:"D#",midi:99},{octave:6,note:"E",midi:100},{octave:6,note:"F",midi:101},{octave:6,note:"F#",midi:102},{octave:6,note:"G",midi:103},{octave:6,note:"G#",midi:104},{octave:6,note:"A",midi:105},{octave:6,note:"A#",midi:106},{octave:6,note:"B",midi:107},{octave:7,note:"C",midi:108},{octave:7,note:"C#",midi:109},{octave:7,note:"D",midi:110},{octave:7,note:"D#",midi:111},{octave:7,note:"E",midi:112},{octave:7,note:"F",midi:113},{octave:7,note:"F#",midi:114},{octave:7,note:"G",midi:115},{octave:7,note:"G#",midi:116},{octave:7,note:"A",midi:117},{octave:7,note:"A#",midi:118},{octave:7,note:"B",midi:119},{octave:8,note:"C",midi:120},{octave:8,note:"C#",midi:121},{octave:8,note:"D",midi:122},{octave:8,note:"D#",midi:123},{octave:8,note:"E",midi:124},{octave:8,note:"F",midi:125},{octave:8,note:"F#",midi:126},{octave:8,note:"G",midi:127}]});var ve={};g(ve,{Key:()=>J});var G,de,_,pe,B,he,L,ue,J,fe=h(()=>{"use strict";$();le();C();T();J=class{constructor(e,t){D(this,G);D(this,_);D(this,B);D(this,L);this.scale=t,this.mode=new u(t),typeof e=="string"?(this.tonic=e,this.midiTonic=U.indexOf(e),this.octave=1):(this.tonic=U[e%12],this.midiTonic=e%12,this.octave=x[e].octave),this.scaleName=O[t],this.name=`${this.tonic} ${this.scaleName}`,this.scaleNotes=y(this,L,ue).call(this)}degree(e,t){if(e==0)throw new l(Q);if(e<0)return y(this,G,de).call(this,e,t);let i=this.octave+Math.floor((e-1)/this.scaleNotes.length),n=this.mode.scaleOffsets[(e-1)%this.scaleNotes.length]+this.midiTonic+i*12+24,s=W({},x[n]);return s.note=this.scaleNotes[(e-1)%this.scaleNotes.length],s.scaleDegree=e,t!=null&&(s.octave+=t,s.midi+=t*12),s}chord(e,t,i){let n=t=="T"?this.mode.chordQualities[e-1]:t,s=(i==null?0:i*12)+this.midiTonic+this.octave*12+24,r=me[n].intervals.reduce((a,m)=>(a.push(m+this.mode.scaleOffsets[e-1]+s),a),[]);return{midi:r,quality:n,root:y(this,_,pe).call(this,r,n),degree:y(this,B,he).call(this,n,e),keyTransposition:i==null?0:i}}midi2note(e){let t=e%12,i=this.mode.scaleOffsets.indexOf(t);if(i!=-1)return this.scaleNotes[i]+x[e].octave;{let n=x[e].note,s=this.scaleNotes.find(r=>r[0]==n[0]);return n+=s!=null&&s.length==2?"\u266E":"",n+x[e].octave}}};G=new WeakSet,de=function(e,t){let i=this.mode.stepOffsets.slice().reverse(),n=Math.ceil(-e/i.length),s=new Array(n).fill(i).flat(),r=this.octave*12+this.midiTonic+24-s.slice(0,-e).reduce((m,p)=>m+=p,0),a=W({},x[r]);return a.note=this.scaleNotes.at(e%this.scaleNotes.length),a.scaleDegree=e,t!=null&&(a.octave+=t,a.midi+=t*12),a},_=new WeakSet,pe=function(e,t){let i=t.split("/")[1];return i==null?this.midi2note(e[0]).replace(/[0-9]/g,""):i=="2"||i=="3"||i=="4"?this.midi2note(e[2]).replace(/[0-9]/g,""):i=="5"?this.midi2note(e[1]).replace(/[0-9]/g,""):this.midi2note(e[0]).replace(/[0-9]/g,"")},B=new WeakSet,he=function(e,t){return e.startsWith("M")?e.replace("M",M[t]):e.startsWith("m")?e.replace("m",M[t].toLowerCase()):e.startsWith("aug")?e.replace("aug",M[t])+"+":e.startsWith("dim")?e.replace("dim",M[t]).toLowerCase()+"o":e.startsWith("sus2")?M[t]+e:e.startsWith("sus4")?e.replace("sus2",M[t])+"sus4":e.startsWith("WT")?e.replace("WT",M[t]).toLowerCase()+"WT":t+e},L=new WeakSet,ue=function(){let e=A(z,-z.findIndex(i=>i.includes(this.tonic))),t=A(X,-X.indexOf(this.tonic[0]));return this.mode.scaleDegreeMapping.length!=0&&(t=this.mode.scaleDegreeMapping.map(i=>t[Math.floor(i)-1])),t.map((i,n)=>{let s=this.mode.scaleOffsets[n];return e[s].find(r=>r[0]==i)})}});var ge={};g(ge,{MelodicVector:()=>Y});var Y,be=h(()=>{"use strict";R();Y=class{constructor(e){this.steps=e}applyTo(e){let t=Math.ceil(e.steps.length/this.steps.length),i=new Array(t).fill(this.steps).flat().slice(0,e.steps.length),n=e.clone();return n.steps=i.map((s,r)=>e.melodicMode=="Scale Degrees"&&e.steps[r]==0?0:e.steps[r]==e.restSymbol?e.steps[r]:s+e.steps[r]),n}}});var Me={};g(Me,{LindenmayerSystem:()=>K});var K,De=h(()=>{"use strict";K=class{constructor(e){this.axiom=e,this.string=e,this.productionRules={}}add(e){this.productionRules[e.matchStr]=e.output}rules(){return Object.keys(this.productionRules)}advance(){this.string=this.string.split(" ").map(e=>e in this.productionRules?this.productionRules[e]:e).join(" ")}matrix(){let e=new Array;e.push(new Array);let t=0,i=0,n=[t,i];return this.string.split(" ").forEach((s,r)=>{s=="["?(n=[t,i],t=e.length,e.push(new Array),i-=1):s=="]"?(t=n[0],i=n[1]):(e[t][i]=s,i+=1)}),e}}});var ye={};g(ye,{MarkovChain:()=>Z});var Z,Ae=h(()=>{"use strict";Z=class{constructor(e){this.input=e,this.stateTransitionMatrix=this.generateStm()}get(e,t){let i=this.stateTransitionMatrix.get(`${e}:${t}`)||[];return i[Math.floor(Math.random()*i.length)]}generateStm(){return this.input.steps.reduce((e,t,i,n)=>{if(i<n.length-1){let s=i==0?t:n[i-1],r=n[i+1],a=`${s}:${t}`,m=e.get(a)||new Array;m.push(r),e.set(a,m)}return e},new Map)}}});var xe=(R(),b(re)),Se=($(),b(ce)),Re=(fe(),b(ve)),Ne=(be(),b(ge)),Ge=(H(),b(se)),_e=(De(),b(Me)),Be=(Ae(),b(ye)),Le=(C(),b(I));module.exports.MelodyType=xe.MelodyType;module.exports.Melody=xe.Melody;module.exports.Mode=Se.Mode;module.exports.Scale=Se.Scale;module.exports.Key=Re.Key;module.exports.MelodicVector=Ne.MelodicVector;module.exports.Rhythm=Ge.Rhythm;module.exports.LindenmayerSystem=_e.LindenmayerSystem;module.exports.MarkovChain=Be.MarkovChain;module.exports.util=Le;
