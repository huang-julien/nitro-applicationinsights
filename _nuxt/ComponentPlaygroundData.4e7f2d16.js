import b from"./TabsHeader.35d4e332.js";import g from"./ComponentPlaygroundProps.4cf0517e.js";import{_ as v}from"./ComponentPlaygroundSlots.vue.7cd23329.js";import{_ as x}from"./ComponentPlaygroundTokens.vue.8f07b765.js";import{d as k,ar as D,r as V,b as n,c as C,g as P,J as o,X as m,as as T,f as s,k as B}from"./entry.d5a0dc38.js";import"./ProseH4.77427e1d.js";import"./ProseCodeInline.eb9e5eb2.js";import"./Badge.84213461.js";import"./slot.42f12478.js";import"./node.676c5e99.js";import"./ProseP.a077a364.js";const I={class:"component-playground-data"},j=k({__name:"ComponentPlaygroundData",props:{modelValue:{type:Object,required:!1,default:()=>({})},componentData:{type:Object,required:!1,default:()=>({})}},emits:["update:modelValue"],setup(t,{emit:p}){const a=D(t,"modelValue",p),e=V(0),r=[{label:"Props"},{label:"Slots"},{label:"Design Tokens"}],d=c=>e.value=c;return(c,l)=>{const u=b,_=g,i=v,f=x;return n(),C("div",I,[P(u,{"active-tab-index":o(e),tabs:r,"onUpdate:activeTabIndex":d},null,8,["active-tab-index"]),o(e)===0?(n(),m(_,{key:0,modelValue:o(a),"onUpdate:modelValue":l[0]||(l[0]=y=>T(a)?a.value=y:null),"component-data":t.componentData},null,8,["modelValue","component-data"])):s("",!0),o(e)===1?(n(),m(i,{key:1,"component-data":t.componentData},null,8,["component-data"])):s("",!0),o(e)===2?(n(),m(f,{key:2,"component-data":t.componentData},null,8,["component-data"])):s("",!0)])}}});const w=B(j,[["__scopeId","data-v-60366e2c"]]);export{w as default};