(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{FHoP:function(e,n,t){"use strict";t.r(n);var i=t("7mTa"),r=t.n(i),a=t("LkAs"),o=t("Moms"),s=t("tEuJ"),l=t("bMj6"),d=t("hZod"),u=t("mXGw"),c=t.n(u),p=t("bgFo"),h=t("FRWW"),v=t("cBaE"),m=t("beUD"),f=(t("x9yg"),t("azxR")),x=function e(n,t){Object(a.a)(this,e),Object(f.a)(this,"val",void 0),Object(f.a)(this,"next",void 0),Object(f.a)(this,"key",void 0),this.val=n,this.next=null,this.key=t},k=function(e){for(var n,t,i=0;i<e.length;i++){var r=new x(e[i],i);t?(t.next=r,t=t.next):t=n=r}return n},y=function(e,n){var t=n.value,i=k(e),r=new m.a,a=g("search"),o=i,s=!1;r.setCodeLine(a.init),r.pushActionsAndEndStep("linkedList",[{name:"focus",params:[0]}]);do{if(r.setCodeLine(a.compare),r.endStep(),o.val===t)s=!0,r.setCodeLine(a.compareSuccess);else{var l=o.key;(o=o.next)&&(r.setCodeLine(a.moveNext),r.pushActionsAndEndStep("linkedList",[{name:"visit",params:[l,o.key]},{name:"label",params:["current",o.key,!0]}]),r.setCodeLine(a.repeat),r.endStep())}}while(o&&!s);return s||(r.setCodeLine(a.outOfLoop),r.endStep()),r.pushActionsAndEndStep("linkedList",[{name:"resetAll",params:[]}]),r.get()},w=function(e,n){var t,i=n.value,r=n.index,a=k(e),o=new m.a,s=g("insert"),l=a,d=0;for(o.setCodeLine(s.init),o.pushActionsAndEndStep("linkedList",[{name:"focus",params:[0]},{name:"label",params:["current",l.key,!0]}]);d!==r&&null!==l;)t=l,d++,(l=l.next)&&(o.setCodeLine(s.findPosition),o.pushActionsAndEndStep("linkedList",[{name:"visit",params:[t.key,l.key,!0]},{name:"label",params:["previous",t.key,!0]},{name:"label",params:["current",l.key,!0]}]));if(r===d){var u,c=new x(i,e.length);t.next=c,c.next=l,o.setCodeLine(s.insert),o.pushActionsAndEndStep("linkedList",[{name:"insert",params:[i,t.key,c.key]},{name:"changePointer",params:[t.key,c.key]},{name:"changePointer",params:[c.key,null===(u=l)||void 0===u?void 0:u.key]}])}return o.setCodeLine(s.complete),o.pushActionsAndEndStep("linkedList",[{name:"resetAll",params:[]}]),o.get()},L=function(e,n){var t=n.index,i=k(e),r=new m.a,a=g("insert"),o=null,s=i;r.setCodeLine(a.init),r.pushActionsAndEndStep("linkedList",[{name:"focus",params:[0]}]);for(var l=0;l<t;l++){var d,u;o=s,s=s.next,r.setCodeLine(a.findPosition),r.pushActionsAndEndStep("linkedList",[{name:"visit",params:[null===(d=o)||void 0===d?void 0:d.key,null===(u=s)||void 0===u?void 0:u.key]}])}return o.next=s.next,r.setCodeLine(a.delete),r.pushActionsAndEndStep("linkedList",[{name:"remove",params:[s.key]},{name:"changePointer",params:[o.key,s.next&&s.next.key]}]),r.setCodeLine(a.complete),r.pushActionsAndEndStep("linkedList",[{name:"resetAll",params:[]}]),r.get()},A=function(e){var n,t=k(e),i=new m.a,r=g("reverse"),a=null,o=t;for(i.setCodeLine(r.init),i.pushActionsAndEndStep("linkedList",[{name:"focus",params:[0]},{name:"label",params:["current",0,!0]}]);o;){n=o.next,i.setCodeLine(r.reversePointer),i.pushActionsAndEndStep("linkedList",[{name:"label",params:["temp",n&&n.key,!0]},{name:"changePointer",params:[o.key,a&&a.key]}]),o.next,a=o;var s=(o=n)&&o.key;i.setCodeLine(r.moveNext),i.pushActionsAndEndStep("linkedList",[{name:"focus",params:[s]},{name:"label",params:["current",s,!0]},{name:"label",params:["previous",a.key,!0]}])}return i.setCodeLine(r.complete),i.endStep(),i.pushActionsAndEndStep("linkedList",[{name:"resetAll",params:[]}]),i.get()},b=function(e){var n,t,i=k(e),r=new m.a,a=g("detectCycle"),o=i,s=i.next,l=!1;for(r.setCodeLine(a.init),r.pushActionsAndEndStep("linkedList",[{name:"focus",params:[o.key]},{name:"focus",params:[null===(n=s)||void 0===n?void 0:n.key,!0]},{name:"label",params:["slow",o.key,!0]},{name:"label",params:["fast",null===(t=s)||void 0===t?void 0:t.key,!0]}]);null!==o&&null!==s;){var d,u,c,p,h,v,f,x;if(r.setCodeLine(a.checkMeet),r.endStep(),o===s){l=!0;break}o=o.next,s=s.next?s.next.next:null,r.setCodeLine(a.moveNext),r.pushActionsAndEndStep("linkedList",[{name:"focus",params:[null===(d=o)||void 0===d?void 0:null===(u=d.next)||void 0===u?void 0:u.key]},{name:"focus",params:[null===(c=s)||void 0===c?void 0:null===(p=c.next)||void 0===p?void 0:p.key,!0]},{name:"label",params:["slow",null===(h=o)||void 0===h?void 0:null===(v=h.next)||void 0===v?void 0:v.key,!0]},{name:"label",params:["fast",null===(f=s)||void 0===f?void 0:null===(x=f.next)||void 0===x?void 0:x.key,!0]}])}return l||(r.setCodeLine(a.complete),r.endStep()),r.pushActionsAndEndStep("linkedList",[{name:"resetAll",params:[]}]),r.get()},g=function(e){switch(e){case"search":return{init:"2-3",compare:"6",compareSuccess:"6",moveNext:"7-8",outOfLoop:"11"};case"insert":return{init:"2-4",findPosition:"5-9",insert:"11-17",complete:"19"};case"delete":return{init:"2-3",findPosition:"4-7",delete:"9",complete:"10"};case"reverse":return{init:"2-4",reversePointer:"7-11",moveNext:"13-15",complete:"18"};case"detectCycle":return{init:"2-3",checkMeet:"6-7",moveNext:"9-11",outOfLoop:"14-15"};default:return{}}},S={search:"function search(value) {\n  let current = this.list;\n  let index = 0;\n  do {\n    // N\u1ebfu t\xecm th\u1ea5y th\xec return index\n    if (current.val === value) return index;\n    current = current.next;\n    index++;\n  } while (current);\n\n  return null;\n}",insert:"function insert(value, index) {\n  let currentIndex = 0;\n  let current = this.list;\n  let previous;\n  while (index !== currentIndex && currentNode !== null) {\n    previous = current;\n    current = current.next;\n    currentIndex++;\n  }\n\n  if (currentIndex === index) {\n    let newNode = {\n      val: value,\n    };\n    previous.next = newNode;\n    newNode.next = current;\n  };\n\n  return this.list;\n}",delete:"function delete(index) {\n  let current = this.list;\n  let previous;\n  for (let i = 0; i < index; i++) {\n    previous = current;\n    current = current.next;\n  }\n\n  previous.next = current.next;\n  return this.list;\n}",reverse:"function reverse(head) {\n  let current = head;\n  let previous = null;\n  let temp;\n\n  while (current) {\n    // Save next before we overwrite current.next!\n    temp = current.next;\n\n    // Reverse pointer\n    current.next = previous;link\n\n    // Step forward in the list\n    previous = current;\n    current = temp;\n  }\n\n  return previous;\n}",detectCycle:"function detectCycle(head) {\n  let slow = head;\n  let fast = head.next;\n\n  while (slow !== null && fast !== null) {\n    // If fast and slow meets, this mean the linked list does have a loop\n    if (fast === slow) return true;\n\n    // The fast pointer will jump two nodes while the slow only jump one\n    slow = slow.next;\n    fast = fast.next ? fast.next.next : null;\n  }\n\n  // If either slow or fast reach the end, the linked list doesn't have any loop\n  return false;\n}"};t.d(n,"LinkedListPage",(function(){return N}));var C=c.a.createElement;function E(e){var n=function(){if("undefined"===typeof Reflect||!r.a)return!1;if(r.a.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(r()(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,i=Object(d.a)(e);if(n){var a=Object(d.a)(this).constructor;t=r()(i,arguments,a)}else t=i.apply(this,arguments);return Object(l.a)(this,t)}}var N=function(e){Object(s.a)(t,e);var n=E(t);function t(){return Object(a.a)(this,t),n.apply(this,arguments)}return Object(o.a)(t,[{key:"render",value:function(){var e=this.props,n=e.data,t=e.onDataChange,i=e.currentStep,r=e.stepDescription,a=e.autoPlay,o=e.executedApiCount,s=e.sideBarWidth,l=e.onExecuteApi,d=Object(v.f)(r,"linkedList");return n?C(p.e,null,C(p.y,{x:100,y:200,currentStep:i,totalStep:r.length-1,instructions:d,initialData:n,handleExecuteApi:l,interactive:!0,dropdownDisabled:a,executedApiCount:o,keepStateWhenSwitchingApi:!0})):C("div",{className:"h-full fx-center linked-list-page__init-button",style:{transform:"translateX(-".concat((s||0)/2,"px)")}},C(p.s,{onSubmit:t,text:"Create new linked list",defaultLength:5}))}}]),t}(u.Component);n.default=Object(h.a)({code:S,explanation:{search:["Kh\u1edfi t\u1ea1o bi\u1ebfn l\u01b0u gi\xe1 tr\u1ecb node hi\u1ec7n t\u1ea1i l\xe0 head c\u1ee7a linked list v\xe0 gi\xe1 tr\u1ecb index b\u1eb1ng 0","So s\xe1nh gi\xe1 tr\u1ecb c\u1ee7a node hi\u1ec7n t\u1ea1i v\u1edbi gi\xe1 tr\u1ecb \u0111ang t\xecm ki\u1ebfm","N\u1ebfu kh\u1edbp th\xec tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb index","N\u1ebfu kh\xf4ng th\xec \u0111\u1eb7t node ti\u1ebfp theo (node.next) l\xe0 node hi\u1ec7n t\u1ea1i v\xe0 t\u0103ng index l\xean 1","L\u1eb7p l\u1ea1i b\u01b0\u1edbc 2","N\u1ebfu k\u1ebft th\xfac v\xf2ng loop m\xe0 v\u1eabn ch\u01b0a t\xecm th\u1ea5y value th\xec tr\u1ea3 v\u1ec1 null"],insert:["Kh\u1edfi t\u1ea1o bi\u1ebfn l\u01b0u gi\xe1 tr\u1ecb index hi\u1ec7n t\u1ea1i, node hi\u1ec7n t\u1ea1i v\xe0 node ph\xeda sau node hi\u1ec7n t\u1ea1i","T\xecm v\u1ecb tr\xed \u0111\u1ec3 ch\xe8n node m\u1edbi","N\u1ebfu \u0111\xe3 \u0111\u1ebfn index c\u1ea7n t\xecm th\xec th\xeam node m\u1edbi v\xe0o v\u1ecb tr\xed hi\u1ec7n t\u1ea1i","Tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb head c\u1ee7a linked list"],delete:["Kh\u1edfi t\u1ea1o bi\u1ebfn l\u01b0u gi\xe1 tr\u1ecb index hi\u1ec7n t\u1ea1i, node hi\u1ec7n t\u1ea1i v\xe0 node ph\xeda sau node hi\u1ec7n t\u1ea1i","T\xecm node c\u1ea7n xo\xe1","K\u1ebft n\u1ed1i node ph\xeda tr\u01b0\u1edbc node c\u1ea7n xo\xe1 (previousNode) v\u1edbi node ph\xeda sau node c\u1ea7n xo\xe1 (currentNode.next)","Tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb head c\u1ee7a linked list"],reverse:["Kh\u1edfi t\u1ea1o bi\u1ebfn l\u01b0u gi\xe1 tr\u1ecb node hi\u1ec7n t\u1ea1i, node ph\xeda sau node hi\u1ec7n t\u1ea1i v\xe0 bi\u1ebfn t\u1ea1m tmp","L\u01b0u node ti\u1ebfp theo (current.next) v\xe0o bi\u1ebfn t\u1ea1m v\xe0 \u0111\u1ea3o ng\u01b0\u1ee3c pointer: node hi\u1ec7n t\u1ea1i tr\u1ecf \u0111\u1ebfn node ph\xeda sau (previous)","Di chuy\u1ec3n \u0111\u1ebfn node ti\u1ebfp theo","Tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb head m\u1edbi"],detectCycle:["Kh\u1edfi t\u1ea1o hai bi\u1ebfn l\u01b0u gi\xe1 tr\u1ecb slow v\xe0 fast","N\u1ebfu slow ho\u1eb7c fast c\xf3 gi\xe1 tr\u1ecb b\u1eb1ng null th\xec tho\xe1t kh\u1ecfi v\xf2ng while v\xe0 tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb false, linked list kh\xf4ng c\xf3 cycle","N\u1ebfu slow v\xe0 fast b\u1eb1ng nhau th\xec tr\u1ea3 v\u1ec1 gi\xe1 tr\u1ecb true, linked list c\xf3 cycle","Di chuy\u1ec3n slow v\xe0 fast d\u1ebfn node ti\u1ebfp theo, slow nh\u1ea3y 1 node c\xf2n fast nh\u1ea3y 2 node"]},instructionGenerator:function(e,n,t){switch(n){case"search":return y(e,t);case"insert":return w(e,t);case"delete":return L(e,t);case"reverse":return A(e);case"detectCycle":return b(e);default:return[]}}})(N)},"N34/":function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/linked_list",function(){return t("FHoP")}])}},[["N34/",1,2,5,0,4,6,3]]]);