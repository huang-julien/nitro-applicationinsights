import $ from"./CquCxxMi.js";import g from"./Cf8C4z9F.js";import B from"./Dm94vZoy.js";import b from"./CaBSNU4L.js";import C from"./CEEtYLd1.js";import N from"./K9E6J6RF.js";import R from"./DPEMD-2c.js";import{k as F,d as S,a3 as A,ao as E,G as c,c as l,V as d,w as e,i as r,g as s,h as f,e as G,F as I,ah as L,t as y}from"./pKG9jpHH.js";const Y=S({props:{of:{type:String,default:void 0},required:{type:Boolean,default:void 0},values:{type:Boolean,default:void 0},description:{type:Boolean,default:void 0},default:{type:Boolean,default:void 0}},async setup(t){const o=`/api/component-meta/${A(t.of)}`,{data:w}=await E(t.of,()=>$fetch(o),"$5h5DbD6m8h"),_=c(()=>w.value.props.filter(a=>{var n;return!((n=a.tags)!=null&&n.ignore.includes(a))})),D=c(()=>{var a;return t.required!==void 0?t.required:(a=_.value)==null?void 0:a.find(n=>n.required!==void 0)}),q=c(()=>{var a;return t.values!==void 0?t.values:(a=_.value)==null?void 0:a.find(n=>n.values)}),i=c(()=>{var a;return t.description!==void 0?t.description:(a=_.value)==null?void 0:a.find(n=>n.description)}),k=c(()=>{var a;return t.default!==void 0?t.default:(a=_.value)==null?void 0:a.find(n=>n.default)});return{meta:w,properties:_,showRequired:D,showValues:q,showDescription:i,showDefault:k}}});function j(t,o,w,_,D,q){var v,P,h;const i=$,k=g,a=B,n=b,m=C,T=N,V=R;return t.meta&&((v=t.meta)!=null&&v.props)&&((h=(P=t.meta)==null?void 0:P.props)!=null&&h.length)?(l(),d(V,{key:0},{default:e(()=>[r(a,null,{default:e(()=>[r(k,null,{default:e(()=>[r(i,null,{default:e(()=>o[0]||(o[0]=[s("Prop")])),_:1}),r(i,null,{default:e(()=>o[1]||(o[1]=[s("Type")])),_:1}),t.showRequired?(l(),d(i,{key:0},{default:e(()=>o[2]||(o[2]=[s(" Required ")])),_:1})):f("",!0),t.showDefault?(l(),d(i,{key:1},{default:e(()=>o[3]||(o[3]=[s(" Default ")])),_:1})):f("",!0),t.showValues?(l(),d(i,{key:2},{default:e(()=>o[4]||(o[4]=[s(" Values ")])),_:1})):f("",!0),t.showDescription?(l(),d(i,{key:3},{default:e(()=>o[5]||(o[5]=[s(" Description ")])),_:1})):f("",!0)]),_:1})]),_:1}),r(T,null,{default:e(()=>[(l(!0),G(I,null,L(t.properties,u=>(l(),d(k,{key:u.name},{default:e(()=>[r(m,null,{default:e(()=>[r(n,null,{default:e(()=>[s(y((u==null?void 0:u.name)||"?"),1)]),_:2},1024)]),_:2},1024),r(m,null,{default:e(()=>[r(n,null,{default:e(()=>[s(y((u==null?void 0:u.type)||"?"),1)]),_:2},1024)]),_:2},1024),t.showRequired?(l(),d(m,{key:0},{default:e(()=>[r(n,null,{default:e(()=>[s(y(u.required==="?"?"?":u.required?"Yes":"No"),1)]),_:2},1024)]),_:2},1024)):f("",!0),t.showDefault?(l(),d(m,{key:1},{default:e(()=>[u.default?(l(),d(n,{key:0},{default:e(()=>[s(y((u==null?void 0:u.default)||"?"),1)]),_:2},1024)):f("",!0)]),_:2},1024)):f("",!0),t.showValues?(l(),d(m,{key:2},{default:e(()=>[u.values?(l(),d(n,{key:0},{default:e(()=>[s(y((u==null?void 0:u.values)||"?"),1)]),_:2},1024)):(l(),d(n,{key:1},{default:e(()=>o[6]||(o[6]=[s(" - ")])),_:1}))]),_:2},1024)):f("",!0),t.showDescription?(l(),d(m,{key:3},{default:e(()=>[r(n,null,{default:e(()=>[s(y(u.description),1)]),_:2},1024)]),_:2},1024)):f("",!0)]),_:2},1024))),128))]),_:1})]),_:1})):f("",!0)}const U=F(Y,[["render",j]]);export{U as default};