import{d as v,aj as _,r as y,G as f,c as e,e as o,H as c,f as t,h as d,F as k,ah as C,t as g,k as h}from"./G6OTL4Qx.js";const x={key:0,class:"copied"},B={class:"window"},b={class:"content"},w={key:1,class:"prompt"},T=v({__name:"Terminal",props:{content:{type:[Array,String],required:!0}},setup(l){const a=l,{copy:p}=_(),n=y("init"),i=f(()=>typeof a.content=="string"?[a.content]:a.content),u=m=>{p(i.value.join(`
`)).then(()=>{n.value="copied",setTimeout(()=>{n.value="init"},1e3)}).catch(()=>{console.warn("Couldn't copy to clipboard!")})};return(m,s)=>(e(),o("div",{class:"terminal",onClick:u},[c(n)==="copied"?(e(),o("div",x,s[0]||(s[0]=[t("div",{class:"scrim"},null,-1),t("div",{class:"content"}," Copied! ",-1)]))):d("",!0),s[2]||(s[2]=t("div",{class:"header"},[t("div",{class:"controls"},[t("div"),t("div"),t("div")]),t("div",{class:"title"}," Bash ")],-1)),t("div",B,[(e(!0),o(k,null,C(c(i),r=>(e(),o("span",{key:r,class:"line"},[s[1]||(s[1]=t("span",{class:"sign"},"$",-1)),t("span",b,g(r),1)]))),128))]),c(n)!=="copied"?(e(),o("div",w," Click to copy ")):d("",!0)]))}}),F=h(T,[["__scopeId","data-v-40588e6c"]]);export{F as default};