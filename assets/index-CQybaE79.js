var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=globalThis,u=l.ShadowRoot&&(l.ShadyCSS===void 0||l.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,d=Symbol(),f=new WeakMap,p=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==d)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(u&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=f.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&f.set(t,e))}return e}toString(){return this.cssText}},m=e=>new p(typeof e==`string`?e:e+``,void 0,d),h=(e,...t)=>new p(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,d),g=(e,t)=>{if(u)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let n of t){let t=document.createElement(`style`),r=l.litNonce;r!==void 0&&t.setAttribute(`nonce`,r),t.textContent=n.cssText,e.appendChild(t)}},_=u?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return m(t)})(e):e,{is:v,defineProperty:ee,getOwnPropertyDescriptor:y,getOwnPropertyNames:te,getOwnPropertySymbols:b,getPrototypeOf:x}=Object,ne=globalThis,re=ne.trustedTypes,ie=re?re.emptyScript:``,ae=ne.reactiveElementPolyfillSupport,oe=(e,t)=>e,se={toAttribute(e,t){switch(t){case Boolean:e=e?ie:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ce=(e,t)=>!v(e,t),le={attribute:!0,type:String,converter:se,reflect:!1,useDefault:!1,hasChanged:ce};Symbol.metadata??=Symbol(`metadata`),ne.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=le){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&ee(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=y(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??le}static _$Ei(){if(this.hasOwnProperty(oe(`elementProperties`)))return;let e=x(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(oe(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(oe(`properties`))){let e=this.properties,t=[...te(e),...b(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(_(e))}else e!==void 0&&t.push(_(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return g(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?se:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?se:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??ce)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:`open`},S[oe(`elementProperties`)]=new Map,S[oe(`finalized`)]=new Map,ae?.({ReactiveElement:S}),(ne.reactiveElementVersions??=[]).push(`2.1.2`);var ue=globalThis,de=e=>e,fe=ue.trustedTypes,pe=fe?fe.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,me=`$lit$`,C=`lit$${Math.random().toFixed(9).slice(2)}$`,he=`?`+C,ge=`<${he}>`,w=document,T=()=>w.createComment(``),E=e=>e===null||typeof e!=`object`&&typeof e!=`function`,_e=Array.isArray,ve=e=>_e(e)||typeof e?.[Symbol.iterator]==`function`,ye=`[ 	
\f\r]`,be=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,Se=/>/g,D=RegExp(`>|${ye}(?:([^\\s"'>=/]+)(${ye}*=${ye}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),Ce=/'/g,we=/"/g,Te=/^(?:script|style|textarea|title)$/i,O=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),k=Symbol.for(`lit-noChange`),A=Symbol.for(`lit-nothing`),Ee=new WeakMap,j=w.createTreeWalker(w,129);function De(e,t){if(!_e(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return pe===void 0?t:pe.createHTML(t)}var Oe=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=be;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===be?c[1]===`!--`?o=xe:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=D):(Te.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=D):o=Se:o===D?c[0]===`>`?(o=i??be,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?D:c[3]===`"`?we:Ce):o===we||o===Ce?o=D:o===xe||o===Se?o=be:(o=D,i=void 0);let d=o===D&&e[t+1].startsWith(`/>`)?` `:``;a+=o===be?n+ge:l>=0?(r.push(s),n.slice(0,l)+me+n.slice(l)+C+d):n+C+(l===-2?t:d)}return[De(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},ke=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=Oe(t,n);if(this.el=e.createElement(l,r),j.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=j.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(me)){let t=u[o++],n=i.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?Ne:r[1]===`?`?Pe:r[1]===`@`?Fe:Me}),i.removeAttribute(e)}else e.startsWith(C)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(Te.test(i.tagName)){let e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=fe?fe.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],T()),j.nextNode(),c.push({type:2,index:++a});i.append(e[t],T())}}}else if(i.nodeType===8){if(i.data===he)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(C,e+1))!==-1;)c.push({type:7,index:a}),e+=C.length-1}}a++}}static createElement(e,t){let n=w.createElement(`template`);return n.innerHTML=e,n}};function M(e,t,n=e,r){if(t===k)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=E(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=M(e,i._$AS(e,t.values),i,r)),t}var Ae=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??w).importNode(t,!0);j.currentNode=r;let i=j.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new je(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new Ie(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=j.nextNode(),a++)}return j.currentNode=w,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},je=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),E(e)?e===A||e==null||e===``?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==k&&this._(e):e._$litType$===void 0?e.nodeType===void 0?ve(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&E(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=ke.createElement(De(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new Ae(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=Ee.get(e.strings);return t===void 0&&Ee.set(e.strings,t=new ke(e)),t}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(T()),this.O(T()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=de(e).nextSibling;de(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},Me=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=A}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=M(this,e,t,0),a=!E(e)||e!==this._$AH&&e!==k,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=M(this,r[n+o],t,o),s===k&&(s=this._$AH[o]),a||=!E(s)||s!==this._$AH[o],s===A?e=A:e!==A&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},Ne=class extends Me{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}},Pe=class extends Me{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}},Fe=class extends Me{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=M(this,e,t,0)??A)===k)return;let n=this._$AH,r=e===A&&n!==A||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==A&&(n===A||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Ie=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}},Le=ue.litHtmlPolyfillSupport;Le?.(ke,je),(ue.litHtmlVersions??=[]).push(`3.3.3`);var Re=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new je(t.insertBefore(T(),e),e,void 0,n??{})}return i._$AI(e),i},ze=globalThis,N=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Re(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};N._$litElement$=!0,N.finalized=!0,ze.litElementHydrateSupport?.({LitElement:N});var Be=ze.litElementPolyfillSupport;Be?.({LitElement:N}),(ze.litElementVersions??=[]).push(`4.2.2`);var P=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Ve={attribute:!0,type:String,converter:se,reflect:!1,hasChanged:ce},He=(e=Ve,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function Ue(e){return(t,n)=>typeof n==`object`?He(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function F(e){return Ue({...e,state:!0,attribute:!1})}var We=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function Ge(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return We(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return We(n,r,{get(){return a(this)}})}}var Ke=[`en`,`ar`,`fr`,`es`,`it`],qe={en:`English`,ar:`العربية`,fr:`Français`,es:`Español`,it:`Italiano`},Je=`justqr.locale`,Ye={"make.types":`Type of code`,"make.type.link":`Link`,"make.type.text":`Text`,"make.type.wifi":`Wi-Fi`,"make.type.contact":`Contact`,"make.type.phone":`Phone`,"make.type.sms":`SMS`,"make.type.email":`Email`,"field.url":`Link`,"field.text":`Text`,"field.ssid":`Network name`,"field.password":`Password`,"field.security":`Security`,"field.security_wpa":`WPA/WPA2/WPA3`,"field.security_wep":`WEP (old)`,"field.security_none":`None (open network)`,"field.hidden":`Hidden network`,"field.first_name":`First name`,"field.last_name":`Last name`,"field.phone":`Phone`,"field.email":`Email`,"field.org":`Organisation`,"field.job_title":`Job title`,"field.website":`Website`,"field.number":`Phone number`,"field.message":`Message`,"field.to":`To`,"field.subject":`Subject`,"make.empty":`Your code appears here as you type.`,"make.preview_alt":`QR code`,"make.too_long":`Too long for one QR code. Make it shorter.`,"make.almost_full":`This code is almost full. Long codes are dense and harder to scan.`,"make.honest.link":`This code holds your link directly.`,"make.honest.text":`This code holds your text directly.`,"make.honest.wifi":`This code holds your Wi-Fi details directly.`,"make.honest.contact":`This code holds your contact card directly.`,"make.honest.phone":`This code holds your phone number directly.`,"make.honest.sms":`This code holds your message directly.`,"make.honest.email":`This code holds your email directly.`,"make.honest_end":`It works forever, and nobody can track who scans it.`,"action.save":`Save`,"action.share":`Share`,"action.more":`More options`,"action.save_svg":`Save as SVG`,"action.copy":`Copy`,"action.print":`Print`,"toast.saved":`Saved`,"toast.copied":`Copied`,"toast.copied_text":`Copied as text`,"toast.failed":`That did not work. Please try again.`,"toast.save_denied":`To save, allow storage access. Or use Share.`,"style.title":`Style`,"style.default":`Default`,"style.custom":`Custom`,"style.colours":`Colours`,"style.fg":`Code`,"style.bg":`Background`,"style.size":`Image size`,"style.size_help":`The size of the saved image. The code itself is the same.`,"style.ec":`Error correction`,"style.ec_help":`How much of the code can be dirty or covered and still scan: L 7%, M 15%, Q 25%, H 30%. Higher makes a denser code.`,"style.margin":`Margin`,"style.margin_help":`White space around the code, in squares. Scanners need it: 4 is the standard.`,"style.reset":`Back to default`,"warn.low_contrast":`The colours are too close. Some phones may not scan this code. Use a darker code or a lighter background.`,"warn.inverted":`The code is lighter than its background. Many phones only scan dark codes on a light background.`,"warn.no_margin":`No margin: leave white space around the code wherever you print it.`,"style.logo":`Logo`,"style.logo_add":`Add a logo`,"style.logo_help":`A picture from your phone in the middle of the code. It stays on your phone.`,"style.logo_change":`Change`,"style.logo_remove":`Remove`,"style.logo_size":`Logo size`,"style.ec_logo":`With a logo, H is always used, so the code still scans.`,"warn.logo_large":`The logo is large. Some phones may not scan this code. Try a smaller logo.`,"toast.logo_failed":`This picture could not be opened. Try another one.`,"field.more":`More fields`,"nav.back":`Back`,"history.title":`History`,"history.empty":`Codes you save, share, copy or print are kept here, on this device only.`,"history.delete":`Delete`,"history.deleted":`Deleted`,"history.undo":`Undo`,"history.clear":`Clear all`,"history.clear_confirm":`Delete every saved code?`,"history.clear_yes":`Delete all`,"history.cancel":`Cancel`,"history.unreadable":`{{count}} saved code(s) come from a newer version of the app and cannot be shown.`,"draft.restored":`Back where you left off.`,"draft.fresh":`Start fresh`,"settings.title":`Settings`,"settings.language":`Language`,"settings.theme":`Theme`,"settings.theme_system":`Phone`,"settings.theme_light":`Light`,"settings.theme_dark":`Dark`,"settings.theme_oled":`OLED black`,"settings.privacy":`Privacy`,"settings.privacy_text":`Nothing is collected. No account, no ads, no tracking, no server. Your codes, your logos and your history stay on this device. The codes you make hold your text directly, so nobody can see who scans them.`,"settings.about":`About`,"settings.about_text":`Just QR makes plain QR codes that never expire. Free, as a waqf: an Open Waqf app.`,"settings.version":`Version {{version}}`,"settings.source":`Source code`,"settings.licences":`Open-source licences`,"settings.licences_text":`Just QR is built with these free libraries:`,"update.ready":`A new version is ready.`,"update.apply":`Update`,"toast.saved_android":`Saved in Documents/Just QR`},Xe={en:Ye,ar:{"make.types":`نوع الرمز`,"make.type.link":`رابط`,"make.type.text":`نص`,"make.type.wifi":`واي فاي`,"make.type.contact":`جهة اتصال`,"make.type.phone":`هاتف`,"make.type.sms":`رسالة`,"make.type.email":`بريد`,"field.url":`الرابط`,"field.text":`النص`,"field.ssid":`اسم الشبكة`,"field.password":`كلمة المرور`,"field.security":`الحماية`,"field.security_wpa":`WPA/WPA2/WPA3`,"field.security_wep":`WEP (قديم)`,"field.security_none":`بدون (شبكة مفتوحة)`,"field.hidden":`شبكة مخفية`,"field.first_name":`الاسم`,"field.last_name":`اسم العائلة`,"field.phone":`الهاتف`,"field.email":`البريد الإلكتروني`,"field.org":`المؤسسة`,"field.job_title":`المسمى الوظيفي`,"field.website":`الموقع`,"field.number":`رقم الهاتف`,"field.message":`الرسالة`,"field.to":`إلى`,"field.subject":`الموضوع`,"make.empty":`يظهر رمزك هنا أثناء الكتابة.`,"make.preview_alt":`رمز QR`,"make.too_long":`النص طويل جدًا على رمز QR واحد. اجعله أقصر.`,"make.almost_full":`هذا الرمز ممتلئ تقريبًا. الرموز الطويلة كثيفة ويصعب مسحها.`,"make.honest.link":`هذا الرمز يحمل رابطك مباشرة.`,"make.honest.text":`هذا الرمز يحمل نصك مباشرة.`,"make.honest.wifi":`هذا الرمز يحمل بيانات الواي فاي مباشرة.`,"make.honest.contact":`هذا الرمز يحمل بطاقة الاتصال مباشرة.`,"make.honest.phone":`هذا الرمز يحمل رقم هاتفك مباشرة.`,"make.honest.sms":`هذا الرمز يحمل رسالتك مباشرة.`,"make.honest.email":`هذا الرمز يحمل بريدك مباشرة.`,"make.honest_end":`يعمل إلى الأبد، ولا يمكن لأحد تتبع من يمسحه.`,"action.save":`حفظ`,"action.share":`مشاركة`,"action.more":`خيارات أخرى`,"action.save_svg":`حفظ بصيغة SVG`,"action.copy":`نسخ`,"action.print":`طباعة`,"toast.saved":`تم الحفظ`,"toast.copied":`تم النسخ`,"toast.copied_text":`تم النسخ كنص`,"toast.failed":`لم ينجح ذلك. حاول مرة أخرى.`,"toast.save_denied":`للحفظ، اسمح بالوصول إلى التخزين. أو استخدم المشاركة.`,"style.title":`التنسيق`,"style.default":`افتراضي`,"style.custom":`مخصص`,"style.colours":`الألوان`,"style.fg":`الرمز`,"style.bg":`الخلفية`,"style.size":`حجم الصورة`,"style.size_help":`حجم الصورة المحفوظة. الرمز نفسه لا يتغير.`,"style.ec":`تصحيح الأخطاء`,"style.ec_help":`كم يمكن أن يتسخ الرمز أو يُغطى ويبقى قابلًا للمسح: L ‏7%، M ‏15%، Q ‏25%، H ‏30%. القيمة الأعلى تجعل الرمز أكثف.`,"style.margin":`الهامش`,"style.margin_help":`مساحة بيضاء حول الرمز، بعدد المربعات. الماسحات تحتاجها: 4 هو المعيار.`,"style.reset":`العودة إلى الافتراضي`,"warn.low_contrast":`اللونان متقاربان جدًا. قد لا تتمكن بعض الهواتف من مسح هذا الرمز. استخدم رمزًا أغمق أو خلفية أفتح.`,"warn.inverted":`الرمز أفتح من خلفيته. كثير من الهواتف لا تمسح إلا الرموز الداكنة على خلفية فاتحة.`,"warn.no_margin":`بلا هامش: اترك مساحة بيضاء حول الرمز أينما طبعته.`,"style.logo":`الشعار`,"style.logo_add":`إضافة شعار`,"style.logo_help":`صورة من هاتفك في وسط الرمز. تبقى على هاتفك.`,"style.logo_change":`تغيير`,"style.logo_remove":`إزالة`,"style.logo_size":`حجم الشعار`,"style.ec_logo":`مع الشعار يُستخدم المستوى H دائمًا، ليبقى الرمز قابلًا للمسح.`,"warn.logo_large":`الشعار كبير. قد لا تتمكن بعض الهواتف من مسح هذا الرمز. جرّب شعارًا أصغر.`,"toast.logo_failed":`تعذّر فتح هذه الصورة. جرّب صورة أخرى.`,"field.more":`حقول أخرى`,"nav.back":`رجوع`,"history.title":`السجل`,"history.empty":`الرموز التي تحفظها أو تشاركها أو تنسخها أو تطبعها تبقى هنا، على هذا الجهاز فقط.`,"history.delete":`حذف`,"history.deleted":`تم الحذف`,"history.undo":`تراجع`,"history.clear":`مسح الكل`,"history.clear_confirm":`حذف كل الرموز المحفوظة؟`,"history.clear_yes":`حذف الكل`,"history.cancel":`إلغاء`,"history.unreadable":`{{count}} من الرموز المحفوظة من إصدار أحدث من التطبيق ولا يمكن عرضها.`,"draft.restored":`عدت إلى حيث توقفت.`,"draft.fresh":`ابدأ من جديد`,"settings.title":`الإعدادات`,"settings.language":`اللغة`,"settings.theme":`المظهر`,"settings.theme_system":`الهاتف`,"settings.theme_light":`فاتح`,"settings.theme_dark":`داكن`,"settings.theme_oled":`أسود OLED`,"settings.privacy":`الخصوصية`,"settings.privacy_text":`لا يُجمع أي شيء. لا حساب، ولا إعلانات، ولا تتبع، ولا خادم. رموزك وشعاراتك وسجلك تبقى على هذا الجهاز. الرموز التي تنشئها تحمل نصك مباشرة، فلا يمكن لأحد أن يعرف من يمسحها.`,"settings.about":`حول التطبيق`,"settings.about_text":`‏Just QR ينشئ رموز QR بسيطة لا تنتهي صلاحيتها أبدًا. مجاني، وقفًا: تطبيق من Open Waqf.`,"settings.version":`الإصدار {{version}}`,"settings.source":`الشيفرة المصدرية`,"settings.licences":`تراخيص المصادر المفتوحة`,"settings.licences_text":`بُني Just QR بهذه المكتبات المجانية:`,"update.ready":`إصدار جديد جاهز.`,"update.apply":`تحديث`,"toast.saved_android":`تم الحفظ في Documents/Just QR`},fr:{"make.types":`Type de code`,"make.type.link":`Lien`,"make.type.text":`Texte`,"make.type.wifi":`Wi-Fi`,"make.type.contact":`Contact`,"make.type.phone":`Téléphone`,"make.type.sms":`SMS`,"make.type.email":`E-mail`,"field.url":`Lien`,"field.text":`Texte`,"field.ssid":`Nom du réseau`,"field.password":`Mot de passe`,"field.security":`Sécurité`,"field.security_wpa":`WPA/WPA2/WPA3`,"field.security_wep":`WEP (ancien)`,"field.security_none":`Aucune (réseau ouvert)`,"field.hidden":`Réseau masqué`,"field.first_name":`Prénom`,"field.last_name":`Nom`,"field.phone":`Téléphone`,"field.email":`E-mail`,"field.org":`Organisation`,"field.job_title":`Fonction`,"field.website":`Site web`,"field.number":`Numéro de téléphone`,"field.message":`Message`,"field.to":`À`,"field.subject":`Objet`,"make.empty":`Votre code apparaît ici pendant que vous écrivez.`,"make.preview_alt":`Code QR`,"make.too_long":`Trop long pour un seul code QR. Raccourcissez-le.`,"make.almost_full":`Ce code est presque plein. Les codes longs sont denses et plus difficiles à scanner.`,"make.honest.link":`Ce code contient votre lien directement.`,"make.honest.text":`Ce code contient votre texte directement.`,"make.honest.wifi":`Ce code contient vos informations Wi-Fi directement.`,"make.honest.contact":`Ce code contient votre fiche contact directement.`,"make.honest.phone":`Ce code contient votre numéro directement.`,"make.honest.sms":`Ce code contient votre message directement.`,"make.honest.email":`Ce code contient votre e-mail directement.`,"make.honest_end":`Il fonctionne pour toujours, et personne ne peut savoir qui le scanne.`,"action.save":`Enregistrer`,"action.share":`Partager`,"action.more":`Plus d’options`,"action.save_svg":`Enregistrer en SVG`,"action.copy":`Copier`,"action.print":`Imprimer`,"toast.saved":`Enregistré`,"toast.copied":`Copié`,"toast.copied_text":`Copié en texte`,"toast.failed":`Cela n’a pas marché. Réessayez.`,"toast.save_denied":`Pour enregistrer, autorisez l’accès au stockage. Ou utilisez Partager.`,"style.title":`Style`,"style.default":`Par défaut`,"style.custom":`Personnalisé`,"style.colours":`Couleurs`,"style.fg":`Code`,"style.bg":`Fond`,"style.size":`Taille de l’image`,"style.size_help":`La taille de l’image enregistrée. Le code lui-même ne change pas.`,"style.ec":`Correction d’erreurs`,"style.ec_help":`La part du code qui peut être salie ou cachée sans gêner le scan : L 7 %, M 15 %, Q 25 %, H 30 %. Plus c’est haut, plus le code est dense.`,"style.margin":`Marge`,"style.margin_help":`L’espace blanc autour du code, en carrés. Les scanners en ont besoin : 4 est la norme.`,"style.reset":`Revenir au style par défaut`,"warn.low_contrast":`Les couleurs sont trop proches. Certains téléphones risquent de ne pas scanner ce code. Prenez un code plus foncé ou un fond plus clair.`,"warn.inverted":`Le code est plus clair que son fond. Beaucoup de téléphones ne scannent que des codes foncés sur fond clair.`,"warn.no_margin":`Pas de marge : laissez un espace blanc autour du code là où vous l’imprimez.`,"style.logo":`Logo`,"style.logo_add":`Ajouter un logo`,"style.logo_help":`Une image de votre téléphone au milieu du code. Elle reste sur votre téléphone.`,"style.logo_change":`Changer`,"style.logo_remove":`Retirer`,"style.logo_size":`Taille du logo`,"style.ec_logo":`Avec un logo, H est toujours utilisé, pour que le code reste lisible.`,"warn.logo_large":`Le logo est grand. Certains téléphones risquent de ne pas scanner ce code. Essayez un logo plus petit.`,"toast.logo_failed":`Impossible d’ouvrir cette image. Essayez-en une autre.`,"field.more":`Plus de champs`,"nav.back":`Retour`,"history.title":`Historique`,"history.empty":`Les codes que vous enregistrez, partagez, copiez ou imprimez restent ici, sur cet appareil seulement.`,"history.delete":`Supprimer`,"history.deleted":`Supprimé`,"history.undo":`Annuler`,"history.clear":`Tout effacer`,"history.clear_confirm":`Supprimer tous les codes enregistrés ?`,"history.clear_yes":`Tout supprimer`,"history.cancel":`Annuler`,"history.unreadable":`{{count}} code(s) enregistré(s) viennent d’une version plus récente de l’application et ne peuvent pas être affichés.`,"draft.restored":`Vous reprenez où vous en étiez.`,"draft.fresh":`Repartir à zéro`,"settings.title":`Réglages`,"settings.language":`Langue`,"settings.theme":`Thème`,"settings.theme_system":`Téléphone`,"settings.theme_light":`Clair`,"settings.theme_dark":`Sombre`,"settings.theme_oled":`Noir OLED`,"settings.privacy":`Confidentialité`,"settings.privacy_text":`Rien n’est collecté. Pas de compte, pas de pub, pas de suivi, pas de serveur. Vos codes, vos logos et votre historique restent sur cet appareil. Les codes que vous créez contiennent votre texte directement : personne ne peut savoir qui les scanne.`,"settings.about":`À propos`,"settings.about_text":`Just QR crée des codes QR simples qui n’expirent jamais. Gratuit, en waqf : une application Open Waqf.`,"settings.version":`Version {{version}}`,"settings.source":`Code source`,"settings.licences":`Licences open source`,"settings.licences_text":`Just QR est construit avec ces bibliothèques libres :`,"update.ready":`Une nouvelle version est prête.`,"update.apply":`Mettre à jour`,"toast.saved_android":`Enregistré dans Documents/Just QR`},es:{"make.types":`Tipo de código`,"make.type.link":`Enlace`,"make.type.text":`Texto`,"make.type.wifi":`Wi-Fi`,"make.type.contact":`Contacto`,"make.type.phone":`Teléfono`,"make.type.sms":`SMS`,"make.type.email":`Correo`,"field.url":`Enlace`,"field.text":`Texto`,"field.ssid":`Nombre de la red`,"field.password":`Contraseña`,"field.security":`Seguridad`,"field.security_wpa":`WPA/WPA2/WPA3`,"field.security_wep":`WEP (antiguo)`,"field.security_none":`Ninguna (red abierta)`,"field.hidden":`Red oculta`,"field.first_name":`Nombre`,"field.last_name":`Apellidos`,"field.phone":`Teléfono`,"field.email":`Correo`,"field.org":`Organización`,"field.job_title":`Cargo`,"field.website":`Sitio web`,"field.number":`Número de teléfono`,"field.message":`Mensaje`,"field.to":`Para`,"field.subject":`Asunto`,"make.empty":`Tu código aparece aquí mientras escribes.`,"make.preview_alt":`Código QR`,"make.too_long":`Demasiado largo para un solo código QR. Acórtalo.`,"make.almost_full":`Este código está casi lleno. Los códigos largos son densos y más difíciles de escanear.`,"make.honest.link":`Este código contiene tu enlace directamente.`,"make.honest.text":`Este código contiene tu texto directamente.`,"make.honest.wifi":`Este código contiene los datos de tu Wi-Fi directamente.`,"make.honest.contact":`Este código contiene tu tarjeta de contacto directamente.`,"make.honest.phone":`Este código contiene tu número directamente.`,"make.honest.sms":`Este código contiene tu mensaje directamente.`,"make.honest.email":`Este código contiene tu correo directamente.`,"make.honest_end":`Funciona para siempre y nadie puede rastrear quién lo escanea.`,"action.save":`Guardar`,"action.share":`Compartir`,"action.more":`Más opciones`,"action.save_svg":`Guardar como SVG`,"action.copy":`Copiar`,"action.print":`Imprimir`,"toast.saved":`Guardado`,"toast.copied":`Copiado`,"toast.copied_text":`Copiado como texto`,"toast.failed":`No ha funcionado. Inténtalo de nuevo.`,"toast.save_denied":`Para guardar, permite el acceso al almacenamiento. O usa Compartir.`,"style.title":`Estilo`,"style.default":`Predeterminado`,"style.custom":`Personalizado`,"style.colours":`Colores`,"style.fg":`Código`,"style.bg":`Fondo`,"style.size":`Tamaño de la imagen`,"style.size_help":`El tamaño de la imagen guardada. El código en sí no cambia.`,"style.ec":`Corrección de errores`,"style.ec_help":`Cuánto del código puede estar sucio o tapado y aún escanearse: L 7 %, M 15 %, Q 25 %, H 30 %. Cuanto más alto, más denso es el código.`,"style.margin":`Margen`,"style.margin_help":`Espacio blanco alrededor del código, en cuadros. Los escáneres lo necesitan: 4 es el estándar.`,"style.reset":`Volver al predeterminado`,"warn.low_contrast":`Los colores están demasiado cerca. Algunos teléfonos quizá no escaneen este código. Usa un código más oscuro o un fondo más claro.`,"warn.inverted":`El código es más claro que su fondo. Muchos teléfonos solo escanean códigos oscuros sobre fondo claro.`,"warn.no_margin":`Sin margen: deja espacio blanco alrededor del código donde lo imprimas.`,"style.logo":`Logo`,"style.logo_add":`Añadir un logo`,"style.logo_help":`Una imagen de tu teléfono en el centro del código. Se queda en tu teléfono.`,"style.logo_change":`Cambiar`,"style.logo_remove":`Quitar`,"style.logo_size":`Tamaño del logo`,"style.ec_logo":`Con un logo siempre se usa H, para que el código se siga escaneando.`,"warn.logo_large":`El logo es grande. Algunos teléfonos quizá no escaneen este código. Prueba con un logo más pequeño.`,"toast.logo_failed":`No se ha podido abrir esta imagen. Prueba con otra.`,"field.more":`Más campos`,"nav.back":`Atrás`,"history.title":`Historial`,"history.empty":`Los códigos que guardas, compartes, copias o imprimes se quedan aquí, solo en este dispositivo.`,"history.delete":`Eliminar`,"history.deleted":`Eliminado`,"history.undo":`Deshacer`,"history.clear":`Borrar todo`,"history.clear_confirm":`¿Eliminar todos los códigos guardados?`,"history.clear_yes":`Eliminar todo`,"history.cancel":`Cancelar`,"history.unreadable":`{{count}} código(s) guardado(s) vienen de una versión más reciente de la aplicación y no se pueden mostrar.`,"draft.restored":`Sigues donde lo dejaste.`,"draft.fresh":`Empezar de cero`,"settings.title":`Ajustes`,"settings.language":`Idioma`,"settings.theme":`Tema`,"settings.theme_system":`Teléfono`,"settings.theme_light":`Claro`,"settings.theme_dark":`Oscuro`,"settings.theme_oled":`Negro OLED`,"settings.privacy":`Privacidad`,"settings.privacy_text":`No se recoge nada. Sin cuenta, sin anuncios, sin rastreo, sin servidor. Tus códigos, tus logos y tu historial se quedan en este dispositivo. Los códigos que creas contienen tu texto directamente, así que nadie puede saber quién los escanea.`,"settings.about":`Acerca de`,"settings.about_text":`Just QR crea códigos QR sencillos que nunca caducan. Gratis, como waqf: una app de Open Waqf.`,"settings.version":`Versión {{version}}`,"settings.source":`Código fuente`,"settings.licences":`Licencias de código abierto`,"settings.licences_text":`Just QR está hecho con estas bibliotecas libres:`,"update.ready":`Hay una versión nueva lista.`,"update.apply":`Actualizar`,"toast.saved_android":`Guardado en Documents/Just QR`},it:{"make.types":`Tipo di codice`,"make.type.link":`Link`,"make.type.text":`Testo`,"make.type.wifi":`Wi-Fi`,"make.type.contact":`Contatto`,"make.type.phone":`Telefono`,"make.type.sms":`SMS`,"make.type.email":`Email`,"field.url":`Link`,"field.text":`Testo`,"field.ssid":`Nome della rete`,"field.password":`Password`,"field.security":`Sicurezza`,"field.security_wpa":`WPA/WPA2/WPA3`,"field.security_wep":`WEP (vecchio)`,"field.security_none":`Nessuna (rete aperta)`,"field.hidden":`Rete nascosta`,"field.first_name":`Nome`,"field.last_name":`Cognome`,"field.phone":`Telefono`,"field.email":`Email`,"field.org":`Organizzazione`,"field.job_title":`Ruolo`,"field.website":`Sito web`,"field.number":`Numero di telefono`,"field.message":`Messaggio`,"field.to":`A`,"field.subject":`Oggetto`,"make.empty":`Il tuo codice appare qui mentre scrivi.`,"make.preview_alt":`Codice QR`,"make.too_long":`Troppo lungo per un solo codice QR. Accorcialo.`,"make.almost_full":`Questo codice è quasi pieno. I codici lunghi sono fitti e più difficili da scansionare.`,"make.honest.link":`Questo codice contiene direttamente il tuo link.`,"make.honest.text":`Questo codice contiene direttamente il tuo testo.`,"make.honest.wifi":`Questo codice contiene direttamente i dati del tuo Wi-Fi.`,"make.honest.contact":`Questo codice contiene direttamente il tuo biglietto da visita.`,"make.honest.phone":`Questo codice contiene direttamente il tuo numero.`,"make.honest.sms":`Questo codice contiene direttamente il tuo messaggio.`,"make.honest.email":`Questo codice contiene direttamente la tua email.`,"make.honest_end":`Funziona per sempre e nessuno può sapere chi lo scansiona.`,"action.save":`Salva`,"action.share":`Condividi`,"action.more":`Altre opzioni`,"action.save_svg":`Salva come SVG`,"action.copy":`Copia`,"action.print":`Stampa`,"toast.saved":`Salvato`,"toast.copied":`Copiato`,"toast.copied_text":`Copiato come testo`,"toast.failed":`Non ha funzionato. Riprova.`,"toast.save_denied":`Per salvare, consenti l’accesso alla memoria. Oppure usa Condividi.`,"style.title":`Stile`,"style.default":`Predefinito`,"style.custom":`Personalizzato`,"style.colours":`Colori`,"style.fg":`Codice`,"style.bg":`Sfondo`,"style.size":`Dimensione dell’immagine`,"style.size_help":`La dimensione dell’immagine salvata. Il codice in sé non cambia.`,"style.ec":`Correzione degli errori`,"style.ec_help":`Quanto del codice può essere sporco o coperto e funzionare ancora: L 7%, M 15%, Q 25%, H 30%. Più è alto, più il codice è fitto.`,"style.margin":`Margine`,"style.margin_help":`Spazio bianco intorno al codice, in quadretti. Gli scanner ne hanno bisogno: 4 è lo standard.`,"style.reset":`Torna al predefinito`,"warn.low_contrast":`I colori sono troppo vicini. Alcuni telefoni potrebbero non leggere questo codice. Usa un codice più scuro o uno sfondo più chiaro.`,"warn.inverted":`Il codice è più chiaro del suo sfondo. Molti telefoni leggono solo codici scuri su sfondo chiaro.`,"warn.no_margin":`Nessun margine: lascia spazio bianco intorno al codice dove lo stampi.`,"style.logo":`Logo`,"style.logo_add":`Aggiungi un logo`,"style.logo_help":`Un’immagine dal tuo telefono al centro del codice. Resta sul tuo telefono.`,"style.logo_change":`Cambia`,"style.logo_remove":`Rimuovi`,"style.logo_size":`Dimensione del logo`,"style.ec_logo":`Con un logo si usa sempre H, così il codice resta leggibile.`,"warn.logo_large":`Il logo è grande. Alcuni telefoni potrebbero non leggere questo codice. Prova un logo più piccolo.`,"toast.logo_failed":`Impossibile aprire questa immagine. Prova con un’altra.`,"field.more":`Altri campi`,"nav.back":`Indietro`,"history.title":`Cronologia`,"history.empty":`I codici che salvi, condividi, copi o stampi restano qui, solo su questo dispositivo.`,"history.delete":`Elimina`,"history.deleted":`Eliminato`,"history.undo":`Annulla`,"history.clear":`Cancella tutto`,"history.clear_confirm":`Eliminare tutti i codici salvati?`,"history.clear_yes":`Elimina tutto`,"history.cancel":`Annulla`,"history.unreadable":`{{count}} codice/i salvato/i provengono da una versione più recente dell’app e non possono essere mostrati.`,"draft.restored":`Riprendi da dove avevi lasciato.`,"draft.fresh":`Ricomincia da capo`,"settings.title":`Impostazioni`,"settings.language":`Lingua`,"settings.theme":`Tema`,"settings.theme_system":`Telefono`,"settings.theme_light":`Chiaro`,"settings.theme_dark":`Scuro`,"settings.theme_oled":`Nero OLED`,"settings.privacy":`Privacy`,"settings.privacy_text":`Non si raccoglie nulla. Niente account, niente pubblicità, niente tracciamento, niente server. I tuoi codici, i tuoi logo e la tua cronologia restano su questo dispositivo. I codici che crei contengono direttamente il tuo testo, quindi nessuno può sapere chi li scansiona.`,"settings.about":`Informazioni`,"settings.about_text":`Just QR crea codici QR semplici che non scadono mai. Gratis, come waqf: un’app Open Waqf.`,"settings.version":`Versione {{version}}`,"settings.source":`Codice sorgente`,"settings.licences":`Licenze open source`,"settings.licences_text":`Just QR è fatto con queste librerie libere:`,"update.ready":`È pronta una nuova versione.`,"update.apply":`Aggiorna`,"toast.saved_android":`Salvato in Documents/Just QR`}},Ze=`en`;function I(e,t={}){return(Xe[Ze][e]??Ye[e]).replace(/\{\{(\w+)\}\}/g,(e,n)=>String(t[n]??``))}var Qe=()=>Ze,$e=e=>e===`ar`?`rtl`:`ltr`;function et(e,t){let n=e=>Ke.find(t=>t===e.toLowerCase().split(`-`)[0]);if(e&&n(e))return n(e);for(let e of t){let t=n(e);if(t)return t}return`en`}function tt(){let e=null;try{e=localStorage.getItem(Je)}catch{}return et(e,navigator.languages??[navigator.language])}function nt(e,t=!1){if(Ze=e,document.documentElement.lang=e,document.documentElement.dir=$e(e),t)try{localStorage.setItem(Je,e)}catch{}window.dispatchEvent(new CustomEvent(`jq-locale`))}var rt=48,L=e=>{let t=e.replace(/\s+/g,` `).trim();return t.length>rt?`${t.slice(0,47)}…`:t};function it(e,t,n){switch(e){case`link`:return L(t.url.trim().replace(/^https?:\/\//i,``).replace(/\/$/,``)||n);case`text`:return L(t.text);case`wifi`:return L(t.ssid);case`contact`:{let e=t;return L([e.firstName,e.lastName].filter(Boolean).join(` `)||e.org||e.phone||e.email)}case`phone`:return L(t.number);case`sms`:return L(t.number);case`email`:return L(t.to);default:return L(n)}}function R(e){let t=e.trim().replace(/^#/,``);return/^[0-9a-f]{3}$/i.test(t)&&(t=[...t].map(e=>e+e).join(``)),/^[0-9a-f]{6}$/i.test(t)?[0,2,4].map(e=>Number.parseInt(t.slice(e,e+2),16)):[0,0,0]}function at([e,t,n]){let r=e=>{let t=e/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4};return .2126*r(e)+.7152*r(t)+.0722*r(n)}function ot(e,t){let n=at(R(e)),r=at(R(t));return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function st(e,t){return ot(e,t)<4.5?`low-contrast`:at(R(e))>at(R(t))?`inverted`:null}var ct=o(((e,t)=>{t.exports=function(){return typeof Promise==`function`&&Promise.prototype&&Promise.prototype.then}})),z=o((e=>{var t,n=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];e.getSymbolSize=function(e){if(!e)throw Error(`"version" cannot be null or undefined`);if(e<1||e>40)throw Error(`"version" should be in range from 1 to 40`);return e*4+17},e.getSymbolTotalCodewords=function(e){return n[e]},e.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t},e.setToSJISFunction=function(e){if(typeof e!=`function`)throw Error(`"toSJISFunc" is not a valid function.`);t=e},e.isKanjiModeEnabled=function(){return t!==void 0},e.toSJIS=function(e){return t(e)}})),lt=o((e=>{e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`l`:case`low`:return e.L;case`m`:case`medium`:return e.M;case`q`:case`quartile`:return e.Q;case`h`:case`high`:return e.H;default:throw Error(`Unknown EC Level: `+t)}}e.isValid=function(e){return e&&e.bit!==void 0&&e.bit>=0&&e.bit<4},e.from=function(n,r){if(e.isValid(n))return n;try{return t(n)}catch{return r}}})),ut=o(((e,t)=>{function n(){this.buffer=[],this.length=0}n.prototype={get:function(e){let t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)==1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)==1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},t.exports=n})),dt=o(((e,t)=>{function n(e){if(!e||e<1)throw Error(`BitMatrix size must be defined and greater than 0`);this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}n.prototype.set=function(e,t,n,r){let i=e*this.size+t;this.data[i]=n,r&&(this.reservedBit[i]=!0)},n.prototype.get=function(e,t){return this.data[e*this.size+t]},n.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n},n.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},t.exports=n})),ft=o((e=>{var t=z().getSymbolSize;e.getRowColCoords=function(e){if(e===1)return[];let n=Math.floor(e/7)+2,r=t(e),i=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let e=1;e<n-1;e++)a[e]=a[e-1]-i;return a.push(6),a.reverse()},e.getPositions=function(t){let n=[],r=e.getRowColCoords(t),i=r.length;for(let e=0;e<i;e++)for(let t=0;t<i;t++)e===0&&t===0||e===0&&t===i-1||e===i-1&&t===0||n.push([r[e],r[t]]);return n}})),pt=o((e=>{var t=z().getSymbolSize,n=7;e.getPositions=function(e){let r=t(e);return[[0,0],[r-n,0],[0,r-n]]}})),mt=o((e=>{e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(e){return e!=null&&e!==``&&!isNaN(e)&&e>=0&&e<=7},e.from=function(t){return e.isValid(t)?parseInt(t,10):void 0},e.getPenaltyN1=function(e){let n=e.size,r=0,i=0,a=0,o=null,s=null;for(let c=0;c<n;c++){i=a=0,o=s=null;for(let l=0;l<n;l++){let n=e.get(c,l);n===o?i++:(i>=5&&(r+=t.N1+(i-5)),o=n,i=1),n=e.get(l,c),n===s?a++:(a>=5&&(r+=t.N1+(a-5)),s=n,a=1)}i>=5&&(r+=t.N1+(i-5)),a>=5&&(r+=t.N1+(a-5))}return r},e.getPenaltyN2=function(e){let n=e.size,r=0;for(let t=0;t<n-1;t++)for(let i=0;i<n-1;i++){let n=e.get(t,i)+e.get(t,i+1)+e.get(t+1,i)+e.get(t+1,i+1);(n===4||n===0)&&r++}return r*t.N2},e.getPenaltyN3=function(e){let n=e.size,r=0,i=0,a=0;for(let t=0;t<n;t++){i=a=0;for(let o=0;o<n;o++)i=i<<1&2047|e.get(t,o),o>=10&&(i===1488||i===93)&&r++,a=a<<1&2047|e.get(o,t),o>=10&&(a===1488||a===93)&&r++}return r*t.N3},e.getPenaltyN4=function(e){let n=0,r=e.data.length;for(let t=0;t<r;t++)n+=e.data[t];return Math.abs(Math.ceil(n*100/r/5)-10)*t.N4};function n(t,n,r){switch(t){case e.Patterns.PATTERN000:return(n+r)%2==0;case e.Patterns.PATTERN001:return n%2==0;case e.Patterns.PATTERN010:return r%3==0;case e.Patterns.PATTERN011:return(n+r)%3==0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2==0;case e.Patterns.PATTERN101:return n*r%2+n*r%3==0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2==0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2==0;default:throw Error(`bad maskPattern:`+t)}}e.applyMask=function(e,t){let r=t.size;for(let i=0;i<r;i++)for(let a=0;a<r;a++)t.isReserved(a,i)||t.xor(a,i,n(e,a,i))},e.getBestMask=function(t,n){let r=Object.keys(e.Patterns).length,i=0,a=1/0;for(let o=0;o<r;o++){n(o),e.applyMask(o,t);let r=e.getPenaltyN1(t)+e.getPenaltyN2(t)+e.getPenaltyN3(t)+e.getPenaltyN4(t);e.applyMask(o,t),r<a&&(a=r,i=o)}return i}})),ht=o((e=>{var t=lt(),n=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],r=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];e.getBlocksCount=function(e,r){switch(r){case t.L:return n[(e-1)*4+0];case t.M:return n[(e-1)*4+1];case t.Q:return n[(e-1)*4+2];case t.H:return n[(e-1)*4+3];default:return}},e.getTotalCodewordsCount=function(e,n){switch(n){case t.L:return r[(e-1)*4+0];case t.M:return r[(e-1)*4+1];case t.Q:return r[(e-1)*4+2];case t.H:return r[(e-1)*4+3];default:return}}})),gt=o((e=>{var t=new Uint8Array(512),n=new Uint8Array(256);(function(){let e=1;for(let r=0;r<255;r++)t[r]=e,n[e]=r,e<<=1,e&256&&(e^=285);for(let e=255;e<512;e++)t[e]=t[e-255]})(),e.log=function(e){if(e<1)throw Error(`log(`+e+`)`);return n[e]},e.exp=function(e){return t[e]},e.mul=function(e,r){return e===0||r===0?0:t[n[e]+n[r]]}})),_t=o((e=>{var t=gt();e.mul=function(e,n){let r=new Uint8Array(e.length+n.length-1);for(let i=0;i<e.length;i++)for(let a=0;a<n.length;a++)r[i+a]^=t.mul(e[i],n[a]);return r},e.mod=function(e,n){let r=new Uint8Array(e);for(;r.length-n.length>=0;){let e=r[0];for(let i=0;i<n.length;i++)r[i]^=t.mul(n[i],e);let i=0;for(;i<r.length&&r[i]===0;)i++;r=r.slice(i)}return r},e.generateECPolynomial=function(n){let r=new Uint8Array([1]);for(let i=0;i<n;i++)r=e.mul(r,new Uint8Array([1,t.exp(i)]));return r}})),vt=o(((e,t)=>{var n=_t();function r(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}r.prototype.initialize=function(e){this.degree=e,this.genPoly=n.generateECPolynomial(this.degree)},r.prototype.encode=function(e){if(!this.genPoly)throw Error(`Encoder not initialized`);let t=new Uint8Array(e.length+this.degree);t.set(e);let r=n.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){let e=new Uint8Array(this.degree);return e.set(r,i),e}return r},t.exports=r})),yt=o((e=>{e.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}})),bt=o((e=>{var t=`[0-9]+`,n=`[A-Z $%*+\\-./:]+`,r=`(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+`;r=r.replace(/u/g,`\\u`);var i=`(?:(?![A-Z0-9 $%*+\\-./:]|`+r+`)(?:.|[\r
]))+`;e.KANJI=new RegExp(r,`g`),e.BYTE_KANJI=RegExp(`[^A-Z0-9 $%*+\\-./:]+`,`g`),e.BYTE=new RegExp(i,`g`),e.NUMERIC=new RegExp(t,`g`),e.ALPHANUMERIC=new RegExp(n,`g`);var a=RegExp(`^`+r+`$`),o=RegExp(`^[0-9]+$`),s=RegExp(`^[A-Z0-9 $%*+\\-./:]+$`);e.testKanji=function(e){return a.test(e)},e.testNumeric=function(e){return o.test(e)},e.testAlphanumeric=function(e){return s.test(e)}})),B=o((e=>{var t=yt(),n=bt();e.NUMERIC={id:`Numeric`,bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:`Alphanumeric`,bit:2,ccBits:[9,11,13]},e.BYTE={id:`Byte`,bit:4,ccBits:[8,16,16]},e.KANJI={id:`Kanji`,bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(e,n){if(!e.ccBits)throw Error(`Invalid mode: `+e);if(!t.isValid(n))throw Error(`Invalid version: `+n);return n>=1&&n<10?e.ccBits[0]:n<27?e.ccBits[1]:e.ccBits[2]},e.getBestModeForData=function(t){return n.testNumeric(t)?e.NUMERIC:n.testAlphanumeric(t)?e.ALPHANUMERIC:n.testKanji(t)?e.KANJI:e.BYTE},e.toString=function(e){if(e&&e.id)return e.id;throw Error(`Invalid mode`)},e.isValid=function(e){return e&&e.bit&&e.ccBits};function r(t){if(typeof t!=`string`)throw Error(`Param is not a string`);switch(t.toLowerCase()){case`numeric`:return e.NUMERIC;case`alphanumeric`:return e.ALPHANUMERIC;case`kanji`:return e.KANJI;case`byte`:return e.BYTE;default:throw Error(`Unknown mode: `+t)}}e.from=function(t,n){if(e.isValid(t))return t;try{return r(t)}catch{return n}}})),xt=o((e=>{var t=z(),n=ht(),r=lt(),i=B(),a=yt(),o=7973,s=t.getBCHDigit(o);function c(t,n,r){for(let i=1;i<=40;i++)if(n<=e.getCapacity(i,r,t))return i}function l(e,t){return i.getCharCountIndicator(e,t)+4}function u(e,t){let n=0;return e.forEach(function(e){let r=l(e.mode,t);n+=r+e.getBitsLength()}),n}function d(t,n){for(let r=1;r<=40;r++)if(u(t,r)<=e.getCapacity(r,n,i.MIXED))return r}e.from=function(e,t){return a.isValid(e)?parseInt(e,10):t},e.getCapacity=function(e,r,o){if(!a.isValid(e))throw Error(`Invalid QR Code version`);o===void 0&&(o=i.BYTE);let s=(t.getSymbolTotalCodewords(e)-n.getTotalCodewordsCount(e,r))*8;if(o===i.MIXED)return s;let c=s-l(o,e);switch(o){case i.NUMERIC:return Math.floor(c/10*3);case i.ALPHANUMERIC:return Math.floor(c/11*2);case i.KANJI:return Math.floor(c/13);case i.BYTE:default:return Math.floor(c/8)}},e.getBestVersionForData=function(e,t){let n,i=r.from(t,r.M);if(Array.isArray(e)){if(e.length>1)return d(e,i);if(e.length===0)return 1;n=e[0]}else n=e;return c(n.mode,n.getLength(),i)},e.getEncodedBits=function(e){if(!a.isValid(e)||e<7)throw Error(`Invalid QR Code version`);let n=e<<12;for(;t.getBCHDigit(n)-s>=0;)n^=o<<t.getBCHDigit(n)-s;return e<<12|n}})),St=o((e=>{var t=z(),n=1335,r=21522,i=t.getBCHDigit(n);e.getEncodedBits=function(e,a){let o=e.bit<<3|a,s=o<<10;for(;t.getBCHDigit(s)-i>=0;)s^=n<<t.getBCHDigit(s)-i;return(o<<10|s)^r}})),Ct=o(((e,t)=>{var n=B();function r(e){this.mode=n.NUMERIC,this.data=e.toString()}r.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){let t,n,r;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),r=parseInt(n,10),e.put(r,10);let i=this.data.length-t;i>0&&(n=this.data.substr(t),r=parseInt(n,10),e.put(r,i*3+1))},t.exports=r})),wt=o(((e,t)=>{var n=B(),r=`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:`.split(``);function i(e){this.mode=n.ALPHANUMERIC,this.data=e}i.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t+2<=this.data.length;t+=2){let n=r.indexOf(this.data[t])*45;n+=r.indexOf(this.data[t+1]),e.put(n,11)}this.data.length%2&&e.put(r.indexOf(this.data[t]),6)},t.exports=i})),Tt=o(((e,t)=>{var n=B();function r(e){this.mode=n.BYTE,this.data=typeof e==`string`?new TextEncoder().encode(e):new Uint8Array(e)}r.getBitsLength=function(e){return e*8},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)},t.exports=r})),Et=o(((e,t)=>{var n=B(),r=z();function i(e){this.mode=n.KANJI,this.data=e}i.getBitsLength=function(e){return e*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t=0;for(;t<this.data.length;t++){let n=r.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw Error(`Invalid SJIS character: `+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}},t.exports=i})),Dt=o(((e,t)=>{var n={single_source_shortest_paths:function(e,t,r){var i={},a={};a[t]=0;var o=n.PriorityQueue.make();o.push(t,0);for(var s,c,l,u,d,f,p,m,h;!o.empty();)for(l in s=o.pop(),c=s.value,u=s.cost,d=e[c]||{},d)d.hasOwnProperty(l)&&(f=d[l],p=u+f,m=a[l],h=a[l]===void 0,(h||m>p)&&(a[l]=p,o.push(l,p),i[l]=c));if(r!==void 0&&a[r]===void 0){var g=[`Could not find a path from `,t,` to `,r,`.`].join(``);throw Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,t){for(var n=[],r=t;r;)n.push(r),e[r],r=e[r];return n.reverse(),n},find_path:function(e,t,r){var i=n.single_source_shortest_paths(e,t,r);return n.extract_shortest_path_from_predecessor_list(i,r)},PriorityQueue:{make:function(e){var t=n.PriorityQueue,r={},i;for(i in e||={},t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r.queue=[],r.sorter=e.sorter||t.default_sorter,r},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){var n={value:e,cost:t};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};t!==void 0&&(t.exports=n)})),Ot=o((e=>{var t=B(),n=Ct(),r=wt(),i=Tt(),a=Et(),o=bt(),s=z(),c=Dt();function l(e){return unescape(encodeURIComponent(e)).length}function u(e,t,n){let r=[],i;for(;(i=e.exec(n))!==null;)r.push({data:i[0],index:i.index,mode:t,length:i[0].length});return r}function d(e){let n=u(o.NUMERIC,t.NUMERIC,e),r=u(o.ALPHANUMERIC,t.ALPHANUMERIC,e),i,a;return s.isKanjiModeEnabled()?(i=u(o.BYTE,t.BYTE,e),a=u(o.KANJI,t.KANJI,e)):(i=u(o.BYTE_KANJI,t.BYTE,e),a=[]),n.concat(r,i,a).sort(function(e,t){return e.index-t.index}).map(function(e){return{data:e.data,mode:e.mode,length:e.length}})}function f(e,o){switch(o){case t.NUMERIC:return n.getBitsLength(e);case t.ALPHANUMERIC:return r.getBitsLength(e);case t.KANJI:return a.getBitsLength(e);case t.BYTE:return i.getBitsLength(e)}}function p(e){return e.reduce(function(e,t){let n=e.length-1>=0?e[e.length-1]:null;return n&&n.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)},[])}function m(e){let n=[];for(let r=0;r<e.length;r++){let i=e[r];switch(i.mode){case t.NUMERIC:n.push([i,{data:i.data,mode:t.ALPHANUMERIC,length:i.length},{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.ALPHANUMERIC:n.push([i,{data:i.data,mode:t.BYTE,length:i.length}]);break;case t.KANJI:n.push([i,{data:i.data,mode:t.BYTE,length:l(i.data)}]);break;case t.BYTE:n.push([{data:i.data,mode:t.BYTE,length:l(i.data)}])}}return n}function h(e,n){let r={},i={start:{}},a=[`start`];for(let o=0;o<e.length;o++){let s=e[o],c=[];for(let e=0;e<s.length;e++){let l=s[e],u=``+o+e;c.push(u),r[u]={node:l,lastCount:0},i[u]={};for(let e=0;e<a.length;e++){let o=a[e];r[o]&&r[o].node.mode===l.mode?(i[o][u]=f(r[o].lastCount+l.length,l.mode)-f(r[o].lastCount,l.mode),r[o].lastCount+=l.length):(r[o]&&(r[o].lastCount=l.length),i[o][u]=f(l.length,l.mode)+4+t.getCharCountIndicator(l.mode,n))}}a=c}for(let e=0;e<a.length;e++)i[a[e]].end=0;return{map:i,table:r}}function g(e,o){let c,l=t.getBestModeForData(e);if(c=t.from(o,l),c!==t.BYTE&&c.bit<l.bit)throw Error(`"`+e+`" cannot be encoded with mode `+t.toString(c)+`.
 Suggested mode is: `+t.toString(l));switch(c===t.KANJI&&!s.isKanjiModeEnabled()&&(c=t.BYTE),c){case t.NUMERIC:return new n(e);case t.ALPHANUMERIC:return new r(e);case t.KANJI:return new a(e);case t.BYTE:return new i(e)}}e.fromArray=function(e){return e.reduce(function(e,t){return typeof t==`string`?e.push(g(t,null)):t.data&&e.push(g(t.data,t.mode)),e},[])},e.fromString=function(t,n){let r=h(m(d(t,s.isKanjiModeEnabled())),n),i=c.find_path(r.map,`start`,`end`),a=[];for(let e=1;e<i.length-1;e++)a.push(r.table[i[e]].node);return e.fromArray(p(a))},e.rawSplit=function(t){return e.fromArray(d(t,s.isKanjiModeEnabled()))}})),kt=o((e=>{var t=z(),n=lt(),r=ut(),i=dt(),a=ft(),o=pt(),s=mt(),c=ht(),l=vt(),u=xt(),d=St(),f=B(),p=Ot();function m(e,t){let n=e.size,r=o.getPositions(t);for(let t=0;t<r.length;t++){let i=r[t][0],a=r[t][1];for(let t=-1;t<=7;t++)if(!(i+t<=-1||n<=i+t))for(let r=-1;r<=7;r++)a+r<=-1||n<=a+r||(t>=0&&t<=6&&(r===0||r===6)||r>=0&&r<=6&&(t===0||t===6)||t>=2&&t<=4&&r>=2&&r<=4?e.set(i+t,a+r,!0,!0):e.set(i+t,a+r,!1,!0))}}function h(e){let t=e.size;for(let n=8;n<t-8;n++){let t=n%2==0;e.set(n,6,t,!0),e.set(6,n,t,!0)}}function g(e,t){let n=a.getPositions(t);for(let t=0;t<n.length;t++){let r=n[t][0],i=n[t][1];for(let t=-2;t<=2;t++)for(let n=-2;n<=2;n++)t===-2||t===2||n===-2||n===2||t===0&&n===0?e.set(r+t,i+n,!0,!0):e.set(r+t,i+n,!1,!0)}}function _(e,t){let n=e.size,r=u.getEncodedBits(t),i,a,o;for(let t=0;t<18;t++)i=Math.floor(t/3),a=t%3+n-8-3,o=(r>>t&1)==1,e.set(i,a,o,!0),e.set(a,i,o,!0)}function v(e,t,n){let r=e.size,i=d.getEncodedBits(t,n),a,o;for(a=0;a<15;a++)o=(i>>a&1)==1,a<6?e.set(a,8,o,!0):a<8?e.set(a+1,8,o,!0):e.set(r-15+a,8,o,!0),a<8?e.set(8,r-a-1,o,!0):a<9?e.set(8,15-a-1+1,o,!0):e.set(8,15-a-1,o,!0);e.set(r-8,8,1,!0)}function ee(e,t){let n=e.size,r=-1,i=n-1,a=7,o=0;for(let s=n-1;s>0;s-=2)for(s===6&&s--;;){for(let n=0;n<2;n++)if(!e.isReserved(i,s-n)){let r=!1;o<t.length&&(r=(t[o]>>>a&1)==1),e.set(i,s-n,r),a--,a===-1&&(o++,a=7)}if(i+=r,i<0||n<=i){i-=r,r=-r;break}}}function y(e,n,i){let a=new r;i.forEach(function(t){a.put(t.mode.bit,4),a.put(t.getLength(),f.getCharCountIndicator(t.mode,e)),t.write(a)});let o=(t.getSymbolTotalCodewords(e)-c.getTotalCodewordsCount(e,n))*8;for(a.getLengthInBits()+4<=o&&a.put(0,4);a.getLengthInBits()%8!=0;)a.putBit(0);let s=(o-a.getLengthInBits())/8;for(let e=0;e<s;e++)a.put(e%2?17:236,8);return te(a,e,n)}function te(e,n,r){let i=t.getSymbolTotalCodewords(n),a=i-c.getTotalCodewordsCount(n,r),o=c.getBlocksCount(n,r),s=o-i%o,u=Math.floor(i/o),d=Math.floor(a/o),f=d+1,p=u-d,m=new l(p),h=0,g=Array(o),_=Array(o),v=0,ee=new Uint8Array(e.buffer);for(let e=0;e<o;e++){let t=e<s?d:f;g[e]=ee.slice(h,h+t),_[e]=m.encode(g[e]),h+=t,v=Math.max(v,t)}let y=new Uint8Array(i),te=0,b,x;for(b=0;b<v;b++)for(x=0;x<o;x++)b<g[x].length&&(y[te++]=g[x][b]);for(b=0;b<p;b++)for(x=0;x<o;x++)y[te++]=_[x][b];return y}function b(e,n,r,a){let o;if(Array.isArray(e))o=p.fromArray(e);else if(typeof e==`string`){let t=n;if(!t){let n=p.rawSplit(e);t=u.getBestVersionForData(n,r)}o=p.fromString(e,t||40)}else throw Error(`Invalid data`);let c=u.getBestVersionForData(o,r);if(!c)throw Error(`The amount of data is too big to be stored in a QR Code`);if(!n)n=c;else if(n<c)throw Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+c+`.
`);let l=y(n,r,o),d=new i(t.getSymbolSize(n));return m(d,n),h(d),g(d,n),v(d,r,0),n>=7&&_(d,n),ee(d,l),isNaN(a)&&(a=s.getBestMask(d,v.bind(null,d,r))),s.applyMask(a,d),v(d,r,a),{modules:d,version:n,errorCorrectionLevel:r,maskPattern:a,segments:o}}e.create=function(e,r){if(e===void 0||e===``)throw Error(`No input text`);let i=n.M,a,o;return r!==void 0&&(i=n.from(r.errorCorrectionLevel,n.M),a=u.from(r.version),o=s.from(r.maskPattern),r.toSJISFunc&&t.setToSJISFunction(r.toSJISFunc)),b(e,a,i,o)}})),At=o((e=>{function t(e){if(typeof e==`number`&&(e=e.toString()),typeof e!=`string`)throw Error(`Color should be defined as hex string`);let t=e.slice().replace(`#`,``).split(``);if(t.length<3||t.length===5||t.length>8)throw Error(`Invalid hex color: `+e);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(e){return[e,e]}))),t.length===6&&t.push(`F`,`F`);let n=parseInt(t.join(``),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:`#`+t.slice(0,6).join(``)}}e.getOptions=function(e){e||={},e.color||(e.color={});let n=e.margin===void 0||e.margin===null||e.margin<0?4:e.margin,r=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:r,scale:r?4:i,margin:n,color:{dark:t(e.color.dark||`#000000ff`),light:t(e.color.light||`#ffffffff`)},type:e.type,rendererOpts:e.rendererOpts||{}}},e.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale},e.getImageWidth=function(t,n){let r=e.getScale(t,n);return Math.floor((t+n.margin*2)*r)},e.qrToImageData=function(t,n,r){let i=n.modules.size,a=n.modules.data,o=e.getScale(i,r),s=Math.floor((i+r.margin*2)*o),c=r.margin*o,l=[r.color.light,r.color.dark];for(let e=0;e<s;e++)for(let n=0;n<s;n++){let u=(e*s+n)*4,d=r.color.light;if(e>=c&&n>=c&&e<s-c&&n<s-c){let t=Math.floor((e-c)/o),r=Math.floor((n-c)/o);d=l[+!!a[t*i+r]]}t[u++]=d.r,t[u++]=d.g,t[u++]=d.b,t[u]=d.a}}})),jt=o((e=>{var t=At();function n(e,t,n){e.clearRect(0,0,t.width,t.height),t.style||={},t.height=n,t.width=n,t.style.height=n+`px`,t.style.width=n+`px`}function r(){try{return document.createElement(`canvas`)}catch{throw Error(`You need to specify a canvas element`)}}e.render=function(e,i,a){let o=a,s=i;o!==void 0||i&&i.getContext||(o=i,i=void 0),i||(s=r()),o=t.getOptions(o);let c=t.getImageWidth(e.modules.size,o),l=s.getContext(`2d`),u=l.createImageData(c,c);return t.qrToImageData(u.data,e,o),n(l,s,c),l.putImageData(u,0,0),s},e.renderToDataURL=function(t,n,r){let i=r;i!==void 0||n&&n.getContext||(i=n,n=void 0),i||={};let a=e.render(t,n,i),o=i.type||`image/png`,s=i.rendererOpts||{};return a.toDataURL(o,s.quality)}})),Mt=o((e=>{var t=At();function n(e,t){let n=e.a/255,r=t+`="`+e.hex+`"`;return n<1?r+` `+t+`-opacity="`+n.toFixed(2).slice(1)+`"`:r}function r(e,t,n){let r=e+t;return n!==void 0&&(r+=` `+n),r}function i(e,t,n){let i=``,a=0,o=!1,s=0;for(let c=0;c<e.length;c++){let l=Math.floor(c%t),u=Math.floor(c/t);!l&&!o&&(o=!0),e[c]?(s++,c>0&&l>0&&e[c-1]||(i+=o?r(`M`,l+n,.5+u+n):r(`m`,a,0),a=0,o=!1),l+1<t&&e[c+1]||(i+=r(`h`,s),s=0)):a++}return i}e.render=function(e,r,a){let o=t.getOptions(r),s=e.modules.size,c=e.modules.data,l=s+o.margin*2,u=o.color.light.a?`<path `+n(o.color.light,`fill`)+` d="M0 0h`+l+`v`+l+`H0z"/>`:``,d=`<path `+n(o.color.dark,`stroke`)+` d="`+i(c,s,o.margin)+`"/>`,f=`viewBox="0 0 `+l+` `+l+`"`,p=`<svg xmlns="http://www.w3.org/2000/svg" `+(o.width?`width="`+o.width+`" height="`+o.width+`" `:``)+f+` shape-rendering="crispEdges">`+u+d+`</svg>
`;return typeof a==`function`&&a(null,p),p}})),Nt=c(o((e=>{var t=ct(),n=kt(),r=jt(),i=Mt();function a(e,r,i,a,o){let s=[].slice.call(arguments,1),c=s.length,l=typeof s[c-1]==`function`;if(!l&&!t())throw Error(`Callback required as last argument`);if(l){if(c<2)throw Error(`Too few arguments provided`);c===2?(o=i,i=r,r=a=void 0):c===3&&(r.getContext&&o===void 0?(o=a,a=void 0):(o=a,a=i,i=r,r=void 0))}else{if(c<1)throw Error(`Too few arguments provided`);return c===1?(i=r,r=a=void 0):c===2&&!r.getContext&&(a=i,i=r,r=void 0),new Promise(function(t,o){try{t(e(n.create(i,a),r,a))}catch(e){o(e)}})}try{let t=n.create(i,a);o(null,e(t,r,a))}catch(e){o(e)}}e.create=n.create,e.toCanvas=a.bind(null,r.render),e.toDataURL=a.bind(null,r.renderToDataURL),e.toString=a.bind(null,function(e,t,n){return i.render(e,n)})}))(),1),Pt=[`L`,`M`,`Q`,`H`],Ft={L:2953,M:2331,Q:1663,H:1273},It=class extends Error{constructor(){super(`Too much text for one QR code`),this.name=`TooLongError`}};function Lt(e){return new TextEncoder().encode(e).length}function Rt(e,t){if(!e)throw Error(`Nothing to encode`);let n;try{n=Nt.create(e,{errorCorrectionLevel:t})}catch(e){throw/too big|amount of data/i.test(String(e?.message))?new It:e}let r=n.modules.size,i=new Uint8Array(r*r);for(let e=0;e<i.length;e++)i[e]=+!!n.modules.data[e];return{size:r,version:n.version,data:i}}var zt=(e,t,n)=>e.data[n*e.size+t]===1,Bt={fg:`#000000`,bg:`#ffffff`,margin:4},Vt=.1,Ht=.3;function Ut(e,t){let n=Math.min(Math.max(t,Vt),Ht),r=Math.round(e.size*n);(e.size-r)%2!=0&&(r+=1);let i=(e.size-r)/2;return{x:i,y:i,size:r}}function Wt(e,t,n){let r=(e,t)=>!!n&&e>=n.x&&e<n.x+n.size&&t>=n.y&&t<n.y+n.size,i=``;for(let n=0;n<e.size;n++){let a=0;for(;a<e.size;){if(!zt(e,a,n)||r(a,n)){a++;continue}let o=a;for(;a<e.size&&zt(e,a,n)&&!r(a,n);)a++;i+=`M${o+t} ${n+t}h${a-o}v1h${o-a}z`}}return i}var Gt=e=>e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`);function Kt(e,t,n,r){let i=e.size+2*t.margin,a=r?Ut(e,r.ratio):void 0,o=[`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i} ${i}" width="${n}" height="${n}" shape-rendering="crispEdges">`,`<rect width="${i}" height="${i}" fill="${t.bg}"/>`,`<path fill="${t.fg}" d="${Wt(e,t.margin,a)}"/>`];if(r&&a){let e=.5;o.push(`<image href="${Gt(r.href)}" x="${a.x+t.margin+e}" y="${a.y+t.margin+e}" width="${a.size-2*e}" height="${a.size-2*e}" preserveAspectRatio="xMidYMid meet"/>`)}return o.push(`</svg>`),o.join(``)}function qt(e,t,n){return Math.max(1,Math.round(n/(e.size+2*t)))}function Jt(e,t,n,r){let i=(e.size+2*t.margin)*n,a=new Uint8ClampedArray(i*i*4),[o,s,c]=R(t.bg),[l,u,d]=R(t.fg);for(let e=0;e<a.length;e+=4)a[e]=o,a[e+1]=s,a[e+2]=c,a[e+3]=255;let f=r?Ut(e,r):void 0;for(let r=0;r<e.size;r++)for(let o=0;o<e.size;o++)if(zt(e,o,r)&&!(f&&o>=f.x&&o<f.x+f.size&&r>=f.y&&r<f.y+f.size))for(let e=0;e<n;e++){let s=(((r+t.margin)*n+e)*i+(o+t.margin)*n)*4;for(let e=0;e<n;e++,s+=4)a[s]=l,a[s+1]=u,a[s+2]=d}return{data:a,width:i,height:i}}function Yt(e,t,n,r){let i=Ut(e,r),a=Math.round(n/2);return{x:(i.x+t.margin)*n+a,y:(i.y+t.margin)*n+a,size:i.size*n-2*a}}var V={...Bt,ec:`M`,px:1024,logo:null},Xt=[512,1024,2048],Zt=[0,2,4];function Qt(e){return e.logo?`H`:e.ec}function $t(e){let t=[],n=st(e.fg,e.bg);return n&&t.push(n),e.margin===0&&t.push(`no-margin`),e.logo&&e.logo.ratio>.25+1e-9&&t.push(`logo-large`),t}function en(e){return e.fg.toLowerCase()===V.fg&&e.bg.toLowerCase()===V.bg&&e.margin===V.margin&&e.ec===V.ec&&e.px===V.px&&!e.logo}var tn=(e,t)=>t.some(t=>e instanceof t),nn,rn;function an(){return nn||=[IDBIndex,IDBObjectStore,IDBCursor,IDBDatabase,IDBTransaction]}function on(){return rn||=[`advance`,`continue`,`continuePrimaryKey`].map(e=>IDBCursor.prototype[e])}var sn=new WeakMap,cn=new WeakMap,ln=new WeakMap;function un(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(H(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return ln.set(t,e),t}function dn(e){if(sn.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});sn.set(e,t)}var fn={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return sn.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return H(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)||t in e}};function pn(e){fn=e(fn)}function mn(e){return on().includes(e)?function(...t){return e.apply(gn(this),t),H(this.request)}:function(...t){return H(e.apply(gn(this),t))}}function hn(e){return typeof e==`function`?mn(e):(e instanceof IDBTransaction&&dn(e),tn(e,an())?new Proxy(e,fn):e)}function H(e){if(e instanceof IDBRequest)return un(e);if(cn.has(e))return cn.get(e);let t=hn(e);return Object.is(t,e)||(cn.set(e,t),ln.set(t,e)),t}var gn=e=>ln.get(e);function _n(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=H(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(H(o.result),e.oldVersion,e.newVersion,H(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}var vn=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],yn=[`put`,`add`,`delete`,`clear`],bn={};function xn(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(bn[t])return bn[t];let n=t.replace(/FromIndex$/,``),r=t!==n,i=yn.includes(n);return!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||vn.includes(n))?void 0:bn[t]=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]}}pn(e=>({...e,get:(t,n,r)=>xn(t,n)||e.get(t,n,r),has:(t,n)=>!!xn(t,n)||e.has(t,n)}));var Sn=[`advance`,`continue`,`continuePrimaryKey`],Cn={},wn=new WeakMap,Tn=new WeakMap,En={get(e,t){if(!Sn.includes(t))return e[t];let n=Cn[t];return n||=Cn[t]=function(...e){wn.set(this,Tn.get(this)[t](...e))},n}};async function*Dn(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;let n=new Proxy(t,En);for(Tn.set(n,t),ln.set(n,gn(t));t;)yield n,t=await(wn.get(n)||t.continue()),wn.delete(n)}function On(e,t){return t===Symbol.asyncIterator&&tn(e,[IDBIndex,IDBObjectStore,IDBCursor])||t===`iterate`&&tn(e,[IDBIndex,IDBObjectStore])}pn(e=>({...e,get(t,n,r){return On(t,n)?Dn:e.get(t,n,r)},has(t,n){return On(t,n)||e.has(t,n)}}));var U=[`link`,`text`,`wifi`,`contact`,`phone`,`sms`,`email`];function kn(e){return{link:{url:``},text:{text:``},wifi:{ssid:``,password:``,security:`WPA`,hidden:!1},contact:{firstName:``,lastName:``,phone:``,email:``,org:``,title:``,url:``},phone:{number:``},sms:{number:``,message:``},email:{to:``,subject:``,body:``}}[e]}function An(e){let t=e.trim();return t?/^[^\s/:]+\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(t)?`https://${t}`:t:``}function jn(e){return e.replace(/([\\;,:"])/g,`\\$1`)}function W(e){return e.replace(/\\/g,`\\\\`).replace(/([,;])/g,`\\$1`).replace(/\r\n|\r|\n/g,`\\n`)}function Mn(e){return e.replace(/[^\d+*#]/g,``)}var G=e=>e.replace(/[\r\n]+/g,` `).trim();function Nn(e,t){switch(e){case`link`:return An(t.url);case`text`:return t.text;case`wifi`:return Pn(t);case`contact`:return Fn(t);case`phone`:{let e=Mn(t.number);return e?`tel:${e}`:``}case`sms`:{let e=t,n=Mn(e.number);return n?e.message?`SMSTO:${n}:${e.message}`:`SMSTO:${n}`:``}case`email`:return In(t);default:return``}}function Pn(e){if(!e.ssid)return``;let t=[`T:${e.security}`,`S:${jn(e.ssid)}`];return e.security!==`nopass`&&e.password&&t.push(`P:${jn(e.password)}`),e.hidden&&t.push(`H:true`),`WIFI:${t.join(`;`)};;`}function Fn(e){let t=G(e.firstName),n=G(e.lastName),r=G(e.org),i=[t,n].filter(Boolean).join(` `)||r;if(!i&&!e.phone.trim()&&!e.email.trim())return``;let a=[`BEGIN:VCARD`,`VERSION:3.0`,`N:${W(n)};${W(t)};;;`];a.push(`FN:${W(i)}`),r&&a.push(`ORG:${W(r)}`),e.title.trim()&&a.push(`TITLE:${W(G(e.title))}`);let o=Mn(e.phone);o&&a.push(`TEL;TYPE=CELL:${o}`),e.email.trim()&&a.push(`EMAIL:${G(e.email)}`);let s=An(G(e.url));return s&&a.push(`URL:${s}`),a.push(`END:VCARD`),a.join(`\r
`)}function In(e){let t=G(e.to);if(!t)return``;let n=[e.subject?`subject=${encodeURIComponent(e.subject)}`:``,e.body?`body=${encodeURIComponent(e.body)}`:``].filter(Boolean);return`mailto:${t}${n.length?`?${n.join(`&`)}`:``}`}var Ln=`justqr`,K=`codes`,Rn=`justqr.draft`,zn=null;async function Bn(){let e=zn;zn=null,e&&(await e).close()}function Vn(){return zn??=_n(Ln,1,{upgrade(e,t){t<1&&e.createObjectStore(K,{keyPath:`id`}).createIndex(`updatedAt`,`updatedAt`)},blocking(){Bn()}}),zn}var Hn=e=>typeof e==`string`&&/^#[0-9a-f]{6}$/i.test(e),Un=new Set([`L`,`M`,`Q`,`H`]),Wn=e=>typeof e==`string`&&U.includes(e);function Gn(e){if(!e||typeof e!=`object`)return null;let t=e;if(!Hn(t.fg)||!Hn(t.bg)||typeof t.margin!=`number`||typeof t.px!=`number`||typeof t.ec!=`string`||!Un.has(t.ec))return null;let n=null;if(t.logo!=null){let e=t.logo;if(typeof e.href!=`string`||!e.href.startsWith(`data:image/`)||typeof e.ratio!=`number`||e.ratio<.1-1e-9||e.ratio>.3+1e-9)return null;n={href:e.href,ratio:e.ratio}}return{fg:t.fg,bg:t.bg,margin:t.margin,px:t.px,ec:t.ec,logo:n}}function Kn(e){if(!e||typeof e!=`object`)return null;let t=e;if(t.schema!==1||typeof t.id!=`string`||!t.id||typeof t.createdAt!=`number`||typeof t.updatedAt!=`number`||!Wn(t.type)||!t.fields||typeof t.fields!=`object`||typeof t.payload!=`string`||!t.payload)return null;let n=Gn(t.look);return n?{id:t.id,schema:1,createdAt:t.createdAt,updatedAt:t.updatedAt,type:t.type,fields:t.fields,look:n,payload:t.payload}:null}function qn(e){if(!e||typeof e!=`object`)return null;let t=e;if(t.schema!==1||typeof t.savedAt!=`number`||!Wn(t.type))return null;let n=t.fields;if(!n||typeof n!=`object`)return null;for(let e of U)if(!n[e]||typeof n[e]!=`object`)return null;let r=Gn(t.look);return r?{schema:1,savedAt:t.savedAt,type:t.type,fields:n,look:r}:null}function Jn(e){localStorage.setItem(Rn,JSON.stringify(e))}function Yn(){try{let e=localStorage.getItem(Rn);return e?qn(JSON.parse(e)):null}catch{return null}}function Xn(){try{localStorage.removeItem(Rn)}catch{}}async function Zn(){let e=await(await Vn()).getAll(K),t=[],n=0;for(let r of e){let e=Kn(r);e?t.push(e):n++}return t.sort((e,t)=>t.updatedAt-e.updatedAt),{codes:t,unreadable:n}}function Qn(){return crypto.randomUUID()}async function $n(e){await(await Vn()).put(K,e)}async function er(e){await(await Vn()).delete(K,e)}async function tr(){await(await Vn()).clear(K)}function nr(e,t){return e.payload===t.payload&&e.look.fg.toLowerCase()===t.look.fg.toLowerCase()&&e.look.bg.toLowerCase()===t.look.bg.toLowerCase()&&e.look.margin===t.look.margin&&e.look.ec===t.look.ec&&e.look.px===t.look.px&&(e.look.logo?.href??null)===(t.look.logo?.href??null)&&(e.look.logo?.ratio??null)===(t.look.logo?.ratio??null)}async function rr(e){let t=Date.now(),{codes:n}=await Zn(),r=n.find(t=>nr(t,e)),i=r?{...r,fields:e.fields,type:e.type,updatedAt:t}:{id:Qn(),schema:1,createdAt:t,updatedAt:t,...e};return await $n(i),i}async function ir(){try{return await navigator.storage?.persist?.()??!1}catch{return!1}}var ar={link:`make.type.link`,text:`make.type.text`,wifi:`make.type.wifi`,contact:`make.type.contact`,phone:`make.type.phone`,sms:`make.type.sms`,email:`make.type.email`},or=e=>ar[e],q=class extends N{constructor(...e){super(...e),this.onLocale=()=>this.requestUpdate()}connectedCallback(){super.connectedCallback(),window.addEventListener(`jq-locale`,this.onLocale)}disconnectedCallback(){window.removeEventListener(`jq-locale`,this.onLocale),super.disconnectedCallback()}};function sr(e,t){let n=getComputedStyle(t).direction===`rtl`,r={ArrowRight:n?-1:1,ArrowLeft:n?1:-1,ArrowDown:1,ArrowUp:-1}[e.key]??0;return r&&e.preventDefault(),r}function cr(e,t,n){return e[(e.indexOf(t)+n+e.length)%e.length]}var lr=h`
    [hidden] {
        /* biome-ignore lint/complexity/noImportantStyles: on purpose, see above */
        display: none !important;
    }
`,ur=h`
    [hidden] {
        /* biome-ignore lint/complexity/noImportantStyles: on purpose, see hiddenStyles */
        display: none !important;
    }
    label {
        display: block;
        font-size: 13px;
        color: var(--muted);
        margin: 10px 0 4px;
    }
    input,
    select,
    textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--bg);
        color: var(--text);
        font: inherit;
        font-size: 16px;
    }
    /* A field you type in shows focus on its own border. Browsers count every tap on a
       text field as "focus-visible", so an outline ring there drew a second box around
       the field on phones. */
    input:focus,
    select:focus,
    textarea:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: inset 0 0 0 1px var(--accent);
    }
    /* Buttons and the like: a ring only for keyboard users. */
    button:focus-visible,
    input[type='color']:focus-visible,
    input[type='file']:focus-visible,
    input[type='checkbox']:focus-visible,
    input[type='range']:focus-visible,
    summary:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
    .notice {
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.4;
        margin: 8px 0;
        background: var(--warn-bg);
        color: var(--warn-text);
        border: 1px solid var(--warn-line);
    }
    .seg {
        display: flex;
        border: 1px solid var(--line);
        border-radius: 10px;
        overflow: hidden;
    }
    .seg button {
        flex: 1;
        min-height: 44px;
        border: 0;
        background: none;
        color: var(--text);
        font: inherit;
        font-size: 14px;
        cursor: pointer;
    }
    .seg button + button {
        border-inline-start: 1px solid var(--line);
    }
    .seg button[aria-checked='true'] {
        background: var(--accent);
        color: var(--on-accent);
        font-weight: 600;
    }
    .help {
        font-size: 13px;
        color: var(--muted);
        margin: 4px 0 0;
        line-height: 1.4;
    }
`;function J(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var dr=6e3,Y=class extends q{constructor(...e){super(...e),this.codes=[],this.unreadable=0,this.loaded=!1,this.confirmClear=!1,this.removed=null,this.undoTimer=0,this.onChanged=()=>void this.refresh()}static{this.styles=[ur,h`
            :host {
                display: block;
                position: relative;
                padding-bottom: 80px;
            }
            .item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 0;
                border-bottom: 1px solid var(--divider);
            }
            .open {
                flex: 1;
                min-width: 0;
                display: flex;
                align-items: center;
                gap: 12px;
                min-height: 64px;
                padding: 0;
                border: 0;
                background: none;
                color: var(--text);
                font: inherit;
                text-align: start;
                cursor: pointer;
                border-radius: 8px;
            }
            .thumb {
                width: 56px;
                height: 56px;
                flex: none;
                border-radius: 8px;
                border: 1px solid var(--divider);
                background: #ffffff;
                image-rendering: pixelated;
            }
            .text {
                min-width: 0;
            }
            .label {
                display: block;
                font-size: 15px;
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .meta {
                display: block;
                font-size: 13px;
                color: var(--muted);
                margin-top: 2px;
            }
            .delete {
                width: 44px;
                height: 44px;
                flex: none;
                border: 0;
                border-radius: 22px;
                background: none;
                color: var(--muted);
                cursor: pointer;
                display: grid;
                place-items: center;
            }
            .delete svg {
                width: 22px;
                height: 22px;
                fill: none;
                stroke: currentColor;
                stroke-width: 1.8;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .empty {
                text-align: center;
                color: var(--muted);
                padding: 48px 20px;
                font-size: 15px;
                line-height: 1.5;
            }
            .foot {
                text-align: center;
                padding: 20px 0;
            }
            .link {
                min-height: 44px;
                padding: 0 12px;
                border: 0;
                background: none;
                color: var(--accent);
                font: inherit;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                border-radius: 8px;
            }
            .confirm {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                justify-content: center;
                padding: 12px;
                border-radius: 10px;
                border: 1px solid var(--line);
            }
            .confirm .danger {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 0;
                background: #b3261e;
                color: #ffffff;
                font: inherit;
                font-weight: 600;
                cursor: pointer;
            }
            .confirm .plain {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
            .toast {
                position: fixed;
                left: 50%;
                bottom: calc(24px + var(--inset-bottom));
                transform: translateX(-50%);
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 0;
                padding: 8px 8px 8px 16px;
                border-radius: 999px;
                background: var(--text);
                color: var(--bg);
                font-size: 14px;
                white-space: nowrap;
            }
            .toast button {
                min-height: 36px;
                padding: 0 12px;
                border: 0;
                border-radius: 999px;
                background: var(--bg);
                color: var(--text);
                font: inherit;
                font-weight: 600;
                cursor: pointer;
            }
        `]}connectedCallback(){super.connectedCallback(),window.addEventListener(`jq-history-changed`,this.onChanged),this.refresh()}disconnectedCallback(){window.removeEventListener(`jq-history-changed`,this.onChanged),super.disconnectedCallback()}async refresh(){let{codes:e,unreadable:t}=await Zn();this.codes=e,this.unreadable=t,this.loaded=!0}async removeCode(e){await er(e.id),this.removed=e,clearTimeout(this.undoTimer),this.undoTimer=window.setTimeout(()=>{this.removed=null},dr),await this.refresh()}async undo(){let e=this.removed;e&&(clearTimeout(this.undoTimer),this.removed=null,await $n(e),await this.refresh())}async clearAll(){this.confirmClear=!1,this.removed=null,await tr(),await this.refresh()}thumb(e){try{let t=Kt(Rt(e.payload,Qt(e.look)),e.look,112,e.look.logo??void 0);return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(t)}`}catch{return``}}when(e){return new Intl.DateTimeFormat(Qe(),{dateStyle:`medium`,timeStyle:`short`}).format(e)}renderItem(e){let t=it(e.type,e.fields,e.payload);return O`<li class="item" data-testid="history-item">
            <button
                class="open"
                data-testid="history-open"
                @click=${()=>this.dispatchEvent(new CustomEvent(`open-code`,{detail:e,bubbles:!0,composed:!0}))}
            >
                <img class="thumb" src=${this.thumb(e)} alt="" />
                <span class="text">
                    <span class="label" data-testid="history-label">${t}</span>
                    <span class="meta">${I(or(e.type))} · ${this.when(e.updatedAt)}</span>
                </span>
            </button>
            <button
                class="delete"
                data-testid="history-delete"
                aria-label=${`${I(`history.delete`)}: ${t}`}
                @click=${()=>this.removeCode(e)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                </svg>
            </button>
        </li>`}render(){return this.loaded?O`
            ${this.codes.length===0?O`<p class="empty" id="history-empty" data-testid="history-empty">${I(`history.empty`)}</p>`:O`<ul style="list-style:none;margin:0;padding:0" id="history-list" data-testid="history-list">
                          ${this.codes.map(e=>this.renderItem(e))}
                      </ul>`}
            ${this.unreadable?O`<p class="help" data-testid="history-unreadable">
                          ${I(`history.unreadable`,{count:this.unreadable})}
                      </p>`:A}
            ${this.codes.length||this.unreadable?O`<div class="foot">
                          ${this.confirmClear?O`<div class="confirm" role="group" aria-label=${I(`history.clear`)}>
                                        <span>${I(`history.clear_confirm`)}</span>
                                        <button class="danger" data-testid="history-clear-yes" @click=${this.clearAll}>
                                            ${I(`history.clear_yes`)}
                                        </button>
                                        <button
                                            class="plain"
                                            data-testid="history-clear-no"
                                            @click=${()=>{this.confirmClear=!1}}
                                        >
                                            ${I(`history.cancel`)}
                                        </button>
                                    </div>`:O`<button
                                        class="link"
                                        id="history-clear" data-testid="history-clear"
                                        @click=${()=>{this.confirmClear=!0}}
                                    >
                                        ${I(`history.clear`)}
                                    </button>`}
                      </div>`:A}
            ${this.removed?O`<p class="toast" role="status" data-testid="history-undo-toast">
                          ${I(`history.deleted`)}
                          <button data-testid="history-undo" @click=${this.undo}>${I(`history.undo`)}</button>
                      </p>`:A}
        `:A}};J([F()],Y.prototype,`codes`,void 0),J([F()],Y.prototype,`unreadable`,void 0),J([F()],Y.prototype,`loaded`,void 0),J([F()],Y.prototype,`confirmClear`,void 0),J([F()],Y.prototype,`removed`,void 0),Y=J([P(`jq-history`)],Y);var fr=256,pr=class extends Error{};async function mr(e){let t=URL.createObjectURL(e);try{let e=new Image;e.src=t;try{await e.decode()}catch{throw new pr(`Not an image`)}let n=e.naturalWidth||fr,r=e.naturalHeight||fr,i=Math.min(1,fr/Math.max(n,r)),a=document.createElement(`canvas`);return a.width=Math.max(1,Math.round(n*i)),a.height=Math.max(1,Math.round(r*i)),a.getContext(`2d`)?.drawImage(e,0,0,a.width,a.height),a.toDataURL(`image/png`)}finally{URL.revokeObjectURL(t)}}async function hr(e){let t=new Image;return t.src=e,await t.decode(),t}var X;(function(e){e.Unimplemented=`UNIMPLEMENTED`,e.Unavailable=`UNAVAILABLE`})(X||={});var gr=class extends Error{constructor(e,t,n){super(e),this.message=e,this.code=t,this.data=n}},_r=e=>e?.androidBridge?`android`:e?.webkit?.messageHandlers?.bridge?`ios`:`web`,vr=e=>{let t=e.CapacitorCustomPlatform||null,n=e.Capacitor||{},r=n.Plugins=n.Plugins||{},i=()=>t===null?_r(e):t.name,a=()=>i()!==`web`,o=e=>!!(l.get(e)?.platforms.has(i())||s(e)),s=e=>n.PluginHeaders?.find(t=>t.name===e),c=t=>e.console.error(t),l=new Map;return n.convertFileSrc||=e=>e,n.getPlatform=i,n.handleError=c,n.isNativePlatform=a,n.isPluginAvailable=o,n.registerPlugin=(e,a={})=>{let o=l.get(e);if(o)return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`),o.proxy;let c=i(),u=s(e),d,f=async()=>(!d&&c in a?d=d=typeof a[c]==`function`?await a[c]():a[c]:t!==null&&!d&&`web`in a&&(d=d=typeof a.web==`function`?await a.web():a.web),d),p=(t,r)=>{if(u){let i=u?.methods.find(e=>r===e.name);if(i)return i.rtype===`promise`?t=>n.nativePromise(e,r.toString(),t):(t,i)=>n.nativeCallback(e,r.toString(),t,i);if(t)return t[r]?.bind(t)}else if(t)return t[r]?.bind(t);else throw new gr(`"${e}" plugin is not implemented on ${c}`,X.Unimplemented)},m=t=>{let n,r=(...r)=>{let i=f().then(i=>{let a=p(i,t);if(a){let e=a(...r);return n=e?.remove,e}throw new gr(`"${e}.${t}()" is not implemented on ${c}`,X.Unimplemented)});return t===`addListener`&&(i.remove=async()=>n()),i};return r.toString=()=>`${t.toString()}() { [capacitor code] }`,Object.defineProperty(r,"name",{value:t,writable:!1,configurable:!1}),r},h=m(`addListener`),g=m(`removeListener`),_=(e,t)=>{let n=h({eventName:e},t),r=async()=>{let r=await n;g({eventName:e,callbackId:r},t)},i=new Promise(e=>n.then(()=>e({remove:r})));return i.remove=async()=>{console.warn(`Using addListener() without 'await' is deprecated.`),await r()},i},v=new Proxy({},{get(e,t){switch(t){case`$$typeof`:return;case`toJSON`:return()=>({});case`addListener`:return u?_:h;case`removeListener`:return g;default:return m(t)}}});return r[e]=v,l.set(e,{name:e,proxy:v,platforms:new Set([...Object.keys(a),...u?[c]:[]])}),v},n.Exception=gr,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n},yr=(e=>e.Capacitor=vr(e))(typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{}),Z=yr.registerPlugin,br=class{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let n=!1;this.listeners[e]||(this.listeners[e]=[],n=!0),this.listeners[e].push(t);let r=this.windowListeners[e];return r&&!r.registered&&this.addWindowListener(r),n&&this.sendRetainedArgumentsForEvent(e),Promise.resolve({remove:async()=>this.removeListener(e,t)})}async removeAllListeners(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,n){let r=this.listeners[e];if(r)r.forEach(e=>e(t));else if(n){let n=this.retainedEventArguments[e];n||=[],n.push(t),this.retainedEventArguments[e]=n}}hasListeners(e){return!!this.listeners[e]?.length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:e=>{this.notifyListeners(t,e)}}}unimplemented(e=`not implemented`){return new yr.Exception(e,X.Unimplemented)}unavailable(e=`not available`){return new yr.Exception(e,X.Unavailable)}async removeListener(e,t){let n=this.listeners[e];if(!n)return;let r=n.indexOf(t);r!==-1&&this.listeners[e].splice(r,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(t=>{this.notifyListeners(e,t)}))}},xr=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Sr=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),Cr=class extends br{async getCookies(){let e=document.cookie,t={};return e.split(`;`).forEach(e=>{if(e.length<=0)return;let[n,r]=e.replace(/=/,`CAP_COOKIE`).split(`CAP_COOKIE`);n=Sr(n).trim(),r=Sr(r).trim(),t[n]=r}),t}async setCookie(e){try{let t=xr(e.key),n=xr(e.value),r=e.expires?`; expires=${e.expires.replace(`expires=`,``)}`:``,i=(e.path||`/`).replace(`path=`,``),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:``;document.cookie=`${t}=${n||``}${r}; path=${i}; ${a};`}catch(e){return Promise.reject(e)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(e){return Promise.reject(e)}}async clearCookies(){try{let e=document.cookie.split(`;`)||[];for(let t of e)document.cookie=t.replace(/^ +/,``).replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}};Z(`CapacitorCookies`,{web:()=>new Cr});var wr=async e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{let e=r.result;t(e.indexOf(`,`)>=0?e.split(`,`)[1]:e)},r.onerror=e=>n(e),r.readAsDataURL(e)}),Tr=(e={})=>{let t=Object.keys(e);return Object.keys(e).map(e=>e.toLocaleLowerCase()).reduce((n,r,i)=>(n[r]=e[t[i]],n),{})},Er=(e,t=!0)=>e?Object.entries(e).reduce((e,n)=>{let[r,i]=n,a,o;return Array.isArray(i)?(o=``,i.forEach(e=>{a=t?encodeURIComponent(e):e,o+=`${r}=${a}&`}),o.slice(0,-1)):(a=t?encodeURIComponent(i):i,o=`${r}=${a}`),`${e}&${o}`},``).substr(1):null,Dr=(e,t={})=>{let n=Object.assign({method:e.method||`GET`,headers:e.headers},t),r=Tr(e.headers)[`content-type`]||``;if(typeof e.data==`string`)n.body=e.data;else if(r.includes(`application/x-www-form-urlencoded`)){let t=new URLSearchParams;for(let[n,r]of Object.entries(e.data||{}))t.set(n,r);n.body=t.toString()}else if(r.includes(`multipart/form-data`)||e.data instanceof FormData){let t=new FormData;if(e.data instanceof FormData)e.data.forEach((e,n)=>{t.append(n,e)});else for(let n of Object.keys(e.data))t.append(n,e.data[n]);n.body=t;let r=new Headers(n.headers);r.delete(`content-type`),n.headers=r}else(r.includes(`application/json`)||typeof e.data==`object`)&&(n.body=JSON.stringify(e.data));return n},Or=class extends br{async request(e){let t=Dr(e,e.webFetchExtra),n=Er(e.params,e.shouldEncodeUrlParams),r=n?`${e.url}?${n}`:e.url,i=await fetch(r,t),a=i.headers.get(`content-type`)||``,{responseType:o=`text`}=i.ok?e:{};a.includes(`application/json`)&&(o=`json`);let s,c;switch(o){case`arraybuffer`:case`blob`:c=await i.blob(),s=await wr(c);break;case`json`:s=await i.json();break;default:s=await i.text()}let l={};return i.headers.forEach((e,t)=>{l[t]=e}),{data:s,headers:l,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:`GET`}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:`POST`}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:`PUT`}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:`PATCH`}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:`DELETE`}))}};Z(`CapacitorHttp`,{web:()=>new Or});var kr;(function(e){e.Dark=`DARK`,e.Light=`LIGHT`,e.Default=`DEFAULT`})(kr||={});var Ar;(function(e){e.StatusBar=`StatusBar`,e.NavigationBar=`NavigationBar`})(Ar||={});var jr=class extends br{async setStyle(){this.unavailable(`not available for web`)}async setAnimation(){this.unavailable(`not available for web`)}async show(){this.unavailable(`not available for web`)}async hide(){this.unavailable(`not available for web`)}},Mr=Z(`SystemBars`,{web:()=>new jr}),Nr=`modulepreload`,Pr=function(e,t){return new URL(e,t).href},Fr={},Ir=function(e){return e.pathname.endsWith(`.css`)},Lr=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},Rr=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Pr(t,n);let r=s(t),i=Ir(r);return Lr(Fr,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:Nr,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},zr=Z(`App`,{web:()=>Rr(()=>import(`./web-5C9epLyb.js`).then(e=>new e.AppWeb),[],import.meta.url)});function Br(e){e.CapacitorUtils.Synapse=new Proxy({},{get(t,n){return new Proxy({},{get(t,r){return(t,i,a)=>{let o=e.Capacitor.Plugins[n];o===void 0?a(Error(`Capacitor plugin ${n} not found`)):typeof o[r]==`function`?(async()=>{try{i(await o[r](t))}catch(e){a(e)}})():a(Error(`Method ${r} not found in Capacitor plugin ${n}`))}}})}})}function Vr(e){e.CapacitorUtils.Synapse=new Proxy({},{get(t,n){return e.cordova.plugins[n]}})}function Hr(e=!1){typeof window>`u`||(window.CapacitorUtils=window.CapacitorUtils||{},window.Capacitor!==void 0&&!e?Br(window):window.cordova!==void 0&&Vr(window))}var Ur;(function(e){e.Documents=`DOCUMENTS`,e.Data=`DATA`,e.Library=`LIBRARY`,e.Cache=`CACHE`,e.External=`EXTERNAL`,e.ExternalStorage=`EXTERNAL_STORAGE`,e.ExternalCache=`EXTERNAL_CACHE`,e.LibraryNoCloud=`LIBRARY_NO_CLOUD`,e.Temporary=`TEMPORARY`})(Ur||={});var Wr;(function(e){e.UTF8=`utf8`,e.ASCII=`ascii`,e.UTF16=`utf16`})(Wr||={});var Gr=Z(`Filesystem`,{web:()=>Rr(()=>import(`./web-Dm4BK6uX.js`).then(e=>new e.FilesystemWeb),[],import.meta.url)});Hr();var Kr=Z(`Share`,{web:()=>Rr(()=>import(`./web-Dftta5Nj.js`).then(e=>new e.ShareWeb),[],import.meta.url)}),qr=`Just QR`,Q=()=>yr.isNativePlatform();async function Jr(e){let t=new Uint8Array(await e.arrayBuffer()),n=``;for(let e=0;e<t.length;e+=32768)n+=String.fromCharCode(...t.subarray(e,e+32768));return btoa(n)}function Yr(e,t){if(t<2)return e;let n=e.lastIndexOf(`.`);return n>0?`${e.slice(0,n)}-${t}${e.slice(n)}`:`${e}-${t}`}var Xr=class extends Error{constructor(){super(`Storage access denied`),this.name=`StorageDeniedError`}};async function Zr(e,t){let{publicStorage:n}=await Gr.requestPermissions();if(n!==`granted`)throw new Xr;let r=await Jr(t),i;for(let t=1;t<=20;t++){let n=`${qr}/${Yr(e,t)}`;if(!await Gr.stat({path:n,directory:Ur.Documents}).then(()=>!0,()=>!1))try{return await Gr.writeFile({path:n,data:r,directory:Ur.Documents,recursive:!0}),`Documents/${n}`}catch(e){i=e}}throw i??Error(`No free file name`)}async function Qr(e,t){let{uri:n}=await Gr.writeFile({path:e,data:await Jr(t),directory:Ur.Cache});try{return await Kr.share({files:[n]}),!0}catch(e){if(/cancel/i.test(String(e?.message??e)))return!1;throw e}}function $r(e){if(!Q())return;let t=e===`light`?kr.Light:e===`system`?kr.Default:kr.Dark;Mr.setStyle({style:t}).catch(()=>{})}function ei(e){Q()&&zr.addListener(`backButton`,()=>{e()||zr.minimizeApp()})}function ti(e,t=new Date){let n=e=>String(e).padStart(2,`0`);return`just-qr-${e}-${`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}`}-${`${n(t.getHours())}${n(t.getMinutes())}${n(t.getSeconds())}`}`}function ni(e){return`<?xml version="1.0" encoding="UTF-8"?>\n${Kt(e.matrix,e.style,e.px,e.logo??void 0)}\n`}async function ri(e){let t=qt(e.matrix,e.style.margin,e.px),n=Jt(e.matrix,e.style,t,e.logo?.ratio),r=document.createElement(`canvas`);r.width=n.width,r.height=n.height;let i=r.getContext(`2d`);if(!i)throw Error(`No canvas`);if(i.putImageData(new ImageData(new Uint8ClampedArray(n.data),n.width,n.height),0,0),e.logo){let n=await hr(e.logo.href),r=Yt(e.matrix,e.style,t,e.logo.ratio),a=Math.min(r.size/n.naturalWidth,r.size/n.naturalHeight),o=n.naturalWidth*a,s=n.naturalHeight*a;i.imageSmoothingQuality=`high`,i.drawImage(n,r.x+(r.size-o)/2,r.y+(r.size-s)/2,o,s)}return new Promise((e,t)=>r.toBlob(n=>n?e(n):t(Error(`PNG failed`)),`image/png`))}function ii(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,document.body.append(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e4)}async function ai(e,t){return Q()?(await Zr(t,e),`android`):(ii(e,t),`download`)}async function oi(e){return ai(await ri(e),`${ti(e.type)}.png`)}function si(e){return ai(new Blob([ni(e)],{type:`image/svg+xml`}),`${ti(e.type)}.svg`)}var ci=()=>!Q();function li(){if(Q())return!0;try{let e=new File([new Uint8Array(1)],`probe.png`,{type:`image/png`});return typeof navigator.share==`function`&&!!navigator.canShare?.({files:[e]})}catch{return!1}}async function ui(e){if(Q())return Qr(`${ti(e.type)}.png`,await ri(e));let t=new File([await ri(e)],`${ti(e.type)}.png`,{type:`image/png`});try{return await navigator.share({files:[t]}),!0}catch(e){if(e?.name===`AbortError`)return!1;throw e}}async function di(e){if(Q())return await navigator.clipboard.writeText(e.payload),`text`;try{if(typeof ClipboardItem>`u`)throw Error(`No ClipboardItem`);return await navigator.clipboard.write([new ClipboardItem({"image/png":ri(e)})]),`image`}catch{return await navigator.clipboard.writeText(e.payload),`text`}}function fi(e){let t=document.getElementById(`print-area`);t||(t=document.createElement(`div`),t.id=`print-area`,document.body.append(t));let n=document.createElement(`img`);n.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(ni(e))}`,n.alt=``,t.replaceChildren(n),n.decode().finally(()=>window.print())}var pi=class extends q{constructor(...e){super(...e),this.look=V}static{this.styles=[ur,h`
            :host {
                display: block;
                border-top: 1px solid var(--divider);
            }
            summary {
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 48px;
                font-size: 15px;
                cursor: pointer;
                list-style: none;
            }
            summary::-webkit-details-marker {
                display: none;
            }
            summary .state {
                color: var(--muted);
                font-size: 14px;
            }
            summary .state::after {
                content: '▾';
                margin-inline-start: 8px;
            }
            details[open] summary .state::after {
                content: '▴';
            }
            .colours {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .colour {
                display: flex;
                align-items: center;
                gap: 10px;
                min-height: 44px;
                padding: 0 10px;
                border: 1px solid var(--line);
                border-radius: 10px;
            }
            .colour input {
                width: 32px;
                min-height: 32px;
                height: 32px;
                padding: 0;
                border: 1px solid var(--line);
                border-radius: 6px;
                cursor: pointer;
            }
            .colour span {
                font-size: 14px;
                font-family: ui-monospace, monospace;
                direction: ltr;
            }
            .action {
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
            .logo-row {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }
            .logo-thumb {
                width: 44px;
                height: 44px;
                object-fit: contain;
                border-radius: 8px;
                border: 1px solid var(--divider);
                background: #ffffff;
            }
            input[type='range'] {
                padding: 0;
                min-height: 32px;
                border: 0;
                background: none;
                accent-color: var(--accent);
            }
            .seg button:disabled {
                cursor: default;
            }
            .seg button:disabled:not([aria-checked='true']) {
                color: var(--muted);
            }
            .reset {
                margin: 16px 0 8px;
                min-height: 44px;
                padding: 0 16px;
                border-radius: 10px;
                border: 1px solid var(--line);
                background: var(--surface);
                color: var(--text);
                font: inherit;
                cursor: pointer;
            }
        `]}change(e){this.dispatchEvent(new CustomEvent(`look-change`,{detail:{...this.look,...e}}))}segment(e,t,n,r,i,a,o=!1){return O`<label id=${`${e}-label`}>${I(t)}</label>
            <div class="seg" role="radiogroup" aria-labelledby=${`${e}-label`} @keydown=${t=>{let i=sr(t,this);if(!i)return;let o=cr(n,r,i);a(o),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-testid="${e}-${o}"]`)?.focus())}}>
                ${n.map(t=>O`<button
                            role="radio"
                            data-testid=${`${e}-${t}`}
                            aria-checked=${t===r?`true`:`false`}
                            tabindex=${t===r?0:-1}
                            ?disabled=${o}
                            @click=${()=>a(t)}
                        >
                            ${i(t)}
                        </button>`)}
            </div>`}colour(e,t,n,r){return O`<div>
            <label for=${e}>${I(t)}</label>
            <div class="colour">
                <input
                    id=${e}
                    data-testid=${e}
                    type="color"
                    .value=${n}
                    @input=${e=>this.change({[r]:e.target.value})}
                />
                <span>${n.toUpperCase()}</span>
            </div>
        </div>`}async pick(e){let t=e.target,n=t.files?.[0];if(t.value=``,n)try{let e=await mr(n);this.change({logo:{href:e,ratio:this.look.logo?.ratio??.2}})}catch(e){if(!(e instanceof pr))throw e;this.dispatchEvent(new CustomEvent(`logo-error`,{bubbles:!0,composed:!0}))}}renderLogo(){let e=this.look.logo,t=O`<input
            id="logo-file"
            data-testid="logo-file"
            type="file"
            accept="image/*"
            hidden
            @change=${this.pick}
        />`;if(!e)return O`<label>${I(`style.logo`)}</label>${t}
                <button
                    class="action"
                    data-testid="logo-add"
                    @click=${()=>this.renderRoot.querySelector(`#logo-file`)?.click()}
                >
                    ${I(`style.logo_add`)}
                </button>
                <p class="help">${I(`style.logo_help`)}</p>`;let n=Math.round(e.ratio*100);return O`<label>${I(`style.logo`)}</label>${t}
            <div class="logo-row">
                <img class="logo-thumb" data-testid="logo-thumb" src=${e.href} alt="" />
                <button
                    class="action"
                    data-testid="logo-change"
                    @click=${()=>this.renderRoot.querySelector(`#logo-file`)?.click()}
                >
                    ${I(`style.logo_change`)}
                </button>
                <button class="action" data-testid="logo-remove" @click=${()=>this.change({logo:null})}>
                    ${I(`style.logo_remove`)}
                </button>
            </div>
            <label for="logo-size">${I(`style.logo_size`)}: ${n}%</label>
            <input
                id="logo-size"
                data-testid="logo-size"
                type="range"
                min=${Vt}
                max=${Ht}
                step="0.025"
                .value=${String(e.ratio)}
                aria-valuetext=${`${n}%`}
                @input=${t=>this.change({logo:{...e,ratio:Number(t.target.value)}})}
            />`}render(){let e=this.look,t=en(e);return O`<details data-testid="style">
            <summary data-testid="style-toggle">
                <span>${I(`style.title`)}</span>
                <span class="state">${I(t?`style.default`:`style.custom`)}</span>
            </summary>
            <label>${I(`style.colours`)}</label>
            <div class="colours">
                ${this.colour(`style-fg`,`style.fg`,e.fg,`fg`)} ${this.colour(`style-bg`,`style.bg`,e.bg,`bg`)}
            </div>
            ${this.renderLogo()}
            ${this.segment(`style-size`,`style.size`,Xt,e.px,e=>`${e} px`,e=>this.change({px:e}))}
            <p class="help">${I(`style.size_help`)}</p>
            ${this.segment(`style-ec`,`style.ec`,Pt,Qt(e),e=>e,e=>this.change({ec:e}),!!e.logo)}
            <p class="help">${e.logo?I(`style.ec_logo`):I(`style.ec_help`)}</p>
            ${this.segment(`style-margin`,`style.margin`,Zt,e.margin,e=>String(e),e=>this.change({margin:e}))}
            <p class="help">${I(`style.margin_help`)}</p>
            ${t?A:O`<button class="reset" data-testid="style-reset" @click=${()=>this.change(V)}>
                          ${I(`style.reset`)}
                      </button>`}
        </details>`}};J([Ue({attribute:!1})],pi.prototype,`look`,void 0),pi=J([P(`jq-style`)],pi);var mi={link:`make.honest.link`,text:`make.honest.text`,wifi:`make.honest.wifi`,contact:`make.honest.contact`,phone:`make.honest.phone`,sms:`make.honest.sms`,email:`make.honest.email`},hi={"low-contrast":`warn.low_contrast`,inverted:`warn.inverted`,"no-margin":`warn.no_margin`,"logo-large":`warn.logo_large`},gi=e=>e===`android`?`toast.saved_android`:`toast.saved`,_i=.8;function vi(e,t){if(!e)return{kind:`empty`};try{let n=Qt(t),r=Rt(e,n);return{kind:`code`,svg:Kt(r,t,512,t.logo??void 0),almostFull:Lt(e)>Ft[n]*_i,payload:e,matrix:r}}catch(e){if(e instanceof It)return{kind:`too-long`};throw e}}var $=class extends q{constructor(...e){super(...e),this.type=`link`,this.fields=Object.fromEntries(U.map(e=>[e,kn(e)])),this.look=V,this.moreContact=!1,this.menuOpen=!1,this.toast=``,this.toastTimer=0,this.canShare=li(),this.onOutside=e=>{this.menuOpen&&!e.composedPath().includes(this.renderRoot.querySelector(`.bar`))&&(this.menuOpen=!1)},this.restored=!1,this.draftTimer=0,this.draftReady=!1,this.onHidden=()=>{document.visibilityState===`hidden`&&this.saveDraft()},this.onLeave=()=>this.saveDraft(),this.persisted=!1}static{this.styles=[ur,h`
        :host {
            display: block;
            /* Room for the bottom bar. */
            padding-bottom: calc(96px + var(--inset-bottom));
        }
        .bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            max-width: 560px;
            margin: 0 auto;
            box-sizing: border-box;
            display: flex;
            gap: 8px;
            padding: 10px 12px calc(10px + var(--inset-bottom));
            background: var(--bg);
            border-top: 1px solid var(--divider);
        }
        .btn {
            flex: 1;
            min-height: 48px;
            border-radius: 12px;
            border: 1px solid var(--line);
            background: var(--surface);
            color: var(--text);
            font: inherit;
            font-size: 15px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
        }
        .btn.primary {
            background: var(--accent);
            color: var(--on-accent);
            border-color: var(--accent);
        }
        .btn.more {
            flex: 0 0 56px;
        }
        .btn:disabled {
            opacity: 0.45;
            cursor: default;
        }
        .btn:focus-visible,
        .menu button:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .btn svg {
            width: 20px;
            height: 20px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        .menu {
            position: absolute;
            bottom: calc(100% + 6px);
            inset-inline-end: 12px;
            min-width: 200px;
            padding: 6px;
            border-radius: 12px;
            border: 1px solid var(--divider);
            background: var(--bg);
            box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
        }
        .menu button {
            display: block;
            width: 100%;
            min-height: 44px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: none;
            color: var(--text);
            font: inherit;
            font-size: 15px;
            text-align: start;
            cursor: pointer;
        }
        .menu button:hover {
            background: var(--surface);
        }
        .toast {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            margin: 0;
            padding: 8px 14px;
            border-radius: 999px;
            background: var(--text);
            color: var(--bg);
            font-size: 14px;
            white-space: nowrap;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 4px 0 8px;
        }
        .chip {
            font: inherit;
            font-size: 14px;
            min-height: 40px;
            padding: 8px 14px;
            border-radius: 999px;
            border: 1px solid transparent;
            background: var(--chip);
            color: var(--text);
            cursor: pointer;
        }
        .chip[aria-checked='true'] {
            background: var(--accent);
            color: var(--on-accent);
            font-weight: 600;
        }
        textarea {
            min-height: 96px;
            resize: vertical;
        }
        .restored {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 4px 0 8px;
            padding: 6px 6px 6px 12px;
            border-radius: 10px;
            background: var(--surface);
            color: var(--muted);
            font-size: 14px;
        }
        .restored button {
            min-height: 36px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: var(--bg);
            color: var(--accent);
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
        }
        .more-fields {
            margin-top: 10px;
            min-height: 44px;
            padding: 0 4px;
            border: 0;
            background: none;
            color: var(--accent);
            font: inherit;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        }
        .row2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        .check {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 12px;
            color: var(--text);
            font-size: 15px;
        }
        .check input {
            width: 22px;
            min-height: 22px;
            height: 22px;
            margin: 0;
            accent-color: var(--accent);
        }
        .preview {
            margin: 16px auto 8px;
            width: min(240px, 70vw);
            aspect-ratio: 1;
            border-radius: 12px;
            border: 1px solid var(--divider);
            /* The code draws its own background; this only shows behind the empty state. */
            background: #ffffff;
            display: grid;
            place-items: center;
            overflow: hidden;
        }
        .preview img {
            width: 100%;
            height: 100%;
            display: block;
            image-rendering: pixelated;
        }
        .preview .placeholder {
            padding: 20px;
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            color: #5b6470;
        }
        .honest {
            text-align: center;
            font-size: 14px;
            line-height: 1.45;
            color: var(--muted);
            margin: 8px 0 12px;
        }
    `]}connectedCallback(){super.connectedCallback(),document.addEventListener(`pointerdown`,this.onOutside),document.addEventListener(`visibilitychange`,this.onHidden),window.addEventListener(`pagehide`,this.onLeave),this.restoreDraft()}disconnectedCallback(){document.removeEventListener(`pointerdown`,this.onOutside),document.removeEventListener(`visibilitychange`,this.onHidden),window.removeEventListener(`pagehide`,this.onLeave),super.disconnectedCallback()}updated(e){this.draftReady&&(e.has(`type`)||e.has(`fields`)||e.has(`look`))&&(clearTimeout(this.draftTimer),this.draftTimer=window.setTimeout(()=>this.saveDraft(),800))}draft(){return{schema:1,savedAt:Date.now(),type:this.type,fields:this.fields,look:this.look}}saveDraft(){if(this.draftReady){clearTimeout(this.draftTimer);try{Jn(this.draft())}catch{}}}restoreDraft(){let e=Yn();e&&Nn(e.type,e.fields[e.type])&&(this.type=e.type,this.fields={...this.fields,...e.fields},this.look=e.look,this.restored=!0),this.draftReady=!0}startFresh(){this.restored=!1,this.type=`link`,this.fields=Object.fromEntries(U.map(e=>[e,kn(e)])),this.look=V,this.moreContact=!1,clearTimeout(this.draftTimer),Xn()}closeMenu(){return this.menuOpen?(this.menuOpen=!1,!0):!1}load(e){this.restored=!1,this.type=e.type,this.fields={...this.fields,[e.type]:{...e.fields}},this.look=e.look,this.moreContact=!1,this.menuOpen=!1}async remember(){let e=this.payload;e&&(await rr({type:this.type,fields:this.fields[this.type],look:this.look,payload:e}),window.dispatchEvent(new CustomEvent(`jq-history-changed`)),this.persisted||(this.persisted=!0,ir()))}get payload(){return Nn(this.type,this.fields[this.type])}set(e,t,n){this.fields={...this.fields,[e]:{...this.fields[e],[t]:n}}}input(e,t,n,r={}){let i=`f-${t}`,a=String(this.fields[e][t]??``),o=n=>this.set(e,t,n.target.value),s=r.ltr?`ltr`:`auto`;return O`<label for=${i}>${I(n)}</label>
            ${r.multiline?O`<textarea id=${i} data-testid=${i} dir=${s} .value=${a} @input=${o}></textarea>`:O`<input
                          id=${i}
                          data-testid=${i}
                          type=${r.kind??`text`}
                          dir=${s}
                          autocomplete="off"
                          autocapitalize=${r.ltr?`off`:`sentences`}
                          spellcheck=${r.ltr?`false`:`true`}
                          .value=${a}
                          @input=${o}
                      />`}`}renderMoreContact(){let e=this.fields.contact;return this.moreContact||e.org||e.title||e.url?O`${this.input(`contact`,`org`,`field.org`)} ${this.input(`contact`,`title`,`field.job_title`)}
            ${this.input(`contact`,`url`,`field.website`,{kind:`url`,ltr:!0})}`:O`<button
            class="more-fields"
            data-testid="contact-more"
            @click=${()=>{this.moreContact=!0,this.updateComplete.then(()=>this.renderRoot.querySelector(`#f-org`)?.focus())}}
        >
            ${I(`field.more`)}
        </button>`}renderFields(){switch(this.type){case`link`:return this.input(`link`,`url`,`field.url`,{kind:`url`,ltr:!0});case`text`:return this.input(`text`,`text`,`field.text`,{multiline:!0});case`wifi`:{let e=this.fields.wifi;return O`${this.input(`wifi`,`ssid`,`field.ssid`)}
                    <div class="row2">
                        <div>${this.input(`wifi`,`password`,`field.password`,{ltr:!0})}</div>
                        <div>
                            <label for="f-security">${I(`field.security`)}</label>
                            <select
                                id="f-security"
                                data-testid="f-security"
                                .value=${e.security}
                                @change=${e=>this.set(`wifi`,`security`,e.target.value)}
                            >
                                <option value="WPA">${I(`field.security_wpa`)}</option>
                                <option value="WEP">${I(`field.security_wep`)}</option>
                                <option value="nopass">${I(`field.security_none`)}</option>
                            </select>
                        </div>
                    </div>
                    <label class="check"
                        ><input
                            type="checkbox"
                            data-testid="f-hidden"
                            .checked=${e.hidden}
                            @change=${e=>this.set(`wifi`,`hidden`,e.target.checked)}
                        />${I(`field.hidden`)}</label
                    >`}case`contact`:return O`<div class="row2">
                        <div>${this.input(`contact`,`firstName`,`field.first_name`)}</div>
                        <div>${this.input(`contact`,`lastName`,`field.last_name`)}</div>
                    </div>
                    ${this.input(`contact`,`phone`,`field.phone`,{kind:`tel`,ltr:!0})}
                    ${this.input(`contact`,`email`,`field.email`,{kind:`email`,ltr:!0})}
                    ${this.renderMoreContact()}`;case`phone`:return this.input(`phone`,`number`,`field.number`,{kind:`tel`,ltr:!0});case`sms`:return O`${this.input(`sms`,`number`,`field.number`,{kind:`tel`,ltr:!0})}
                ${this.input(`sms`,`message`,`field.message`,{multiline:!0})}`;case`email`:return O`${this.input(`email`,`to`,`field.to`,{kind:`email`,ltr:!0})}
                ${this.input(`email`,`subject`,`field.subject`)}
                ${this.input(`email`,`body`,`field.message`,{multiline:!0})}`}}onTypeKey(e){let t=sr(e,this);if(!t)return;let n=cr(U,this.type,t);this.type=n,this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-testid="type-${n}"]`)?.focus())}exportCode(e){if(e.kind!==`code`)return null;let{look:t}=this;return{matrix:e.matrix,style:t,type:this.type,payload:e.payload,px:t.px,logo:t.logo}}say(e){this.toast=I(e),clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>{this.toast=``},2500)}async run(e){this.menuOpen=!1;try{let t=await e();if(t===!1)return;await this.remember(),t&&this.say(t)}catch(e){this.say(e instanceof Xr?`toast.save_denied`:`toast.failed`)}}renderBar(e){let t=!e,n=(e,t,n)=>O`<button role="menuitem" id=${e} data-testid=${e} @click=${()=>this.run(n)}>${I(t)}</button>`;return O`<div
            class="bar"
            @keydown=${e=>{e.key===`Escape`&&this.menuOpen&&(this.menuOpen=!1,this.renderRoot.querySelector(`#btn-more`)?.focus())}}
        >
            ${this.toast?O`<p class="toast" role="status" id="toast" data-testid="toast">${this.toast}</p>`:A}
            <button
                class="btn primary"
                id="btn-save" data-testid="btn-save"
                ?disabled=${t}
                @click=${()=>e&&this.run(async()=>gi(await oi(e)))}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M6 10l6 6 6-6M4 20h16" /></svg>
                ${I(`action.save`)}
            </button>
            ${this.canShare?O`<button
                          class="btn"
                          id="btn-share" data-testid="btn-share"
                          ?disabled=${t}
                          @click=${()=>e&&this.run(async()=>await ui(e)?null:!1)}
                      >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="18" cy="5" r="3" />
                              <circle cx="6" cy="12" r="3" />
                              <circle cx="18" cy="19" r="3" />
                              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                          </svg>
                          ${I(`action.share`)}
                      </button>`:A}
            <button
                class="btn more"
                id="btn-more" data-testid="btn-more"
                aria-label=${I(`action.more`)}
                aria-haspopup="menu"
                aria-expanded=${this.menuOpen?`true`:`false`}
                ?disabled=${t}
                @click=${()=>{this.menuOpen=!this.menuOpen,this.menuOpen&&this.updateComplete.then(()=>this.renderRoot.querySelector(`.menu button`)?.focus())}}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                </svg>
            </button>
            ${this.menuOpen&&e?O`<div class="menu" role="menu" data-testid="menu">
                          ${n(`menu-svg`,`action.save_svg`,async()=>gi(await si(e)))}
                          ${n(`menu-copy`,`action.copy`,async()=>await di(e)===`image`?`toast.copied`:`toast.copied_text`)}
                          ${ci()?n(`menu-print`,`action.print`,()=>(fi(e),null)):A}
                      </div>`:A}
        </div>`}renderPreview(e){return e.kind===`code`?O`<img id="preview-img" data-testid="preview-img" src=${`data:image/svg+xml;charset=utf-8,${encodeURIComponent(e.svg)}`} alt=${I(`make.preview_alt`)} />`:O`<p class="placeholder">${I(`make.empty`)}</p>`}render(){let e=vi(this.payload,this.look),t=e.kind===`code`?$t(this.look):[];return O`
            <div class="chips" role="radiogroup" aria-label=${I(`make.types`)} @keydown=${this.onTypeKey}>
                ${U.map(e=>O`<button
                            class="chip"
                            role="radio"
                            id=${`type-${e}`} data-testid=${`type-${e}`}
                            aria-checked=${e===this.type?`true`:`false`}
                            tabindex=${e===this.type?0:-1}
                            @click=${()=>{this.type=e}}
                        >
                            ${I(or(e))}
                        </button>`)}
            </div>
            ${this.restored?O`<p class="restored" role="status" id="draft-restored" data-testid="draft-restored">
                          <span>${I(`draft.restored`)}</span>
                          <button id="draft-fresh" data-testid="draft-fresh" @click=${this.startFresh}>${I(`draft.fresh`)}</button>
                      </p>`:A}
            <div data-testid="fields">${this.renderFields()}</div>
            <div class="preview" data-testid="preview">${this.renderPreview(e)}</div>
            ${e.kind===`too-long`?O`<p class="notice" role="alert" data-testid="too-long">${I(`make.too_long`)}</p>`:A}
            ${e.kind===`code`&&e.almostFull?O`<p class="notice" data-testid="almost-full">${I(`make.almost_full`)}</p>`:A}
            ${t.map(e=>O`<p class="notice" data-testid=${`warn-${e}`}>${I(hi[e])}</p>`)}
            <p class="honest" data-testid="honest-line">
                ${I(mi[this.type])} ${I(`make.honest_end`)}
            </p>
            <jq-style
                .look=${this.look}
                @logo-error=${()=>this.say(`toast.logo_failed`)}
                @look-change=${e=>{this.look=e.detail}}
            ></jq-style>
            ${this.renderBar(this.exportCode(e))}
        `}};J([F()],$.prototype,`type`,void 0),J([F()],$.prototype,`fields`,void 0),J([F()],$.prototype,`look`,void 0),J([F()],$.prototype,`moreContact`,void 0),J([F()],$.prototype,`menuOpen`,void 0),J([F()],$.prototype,`toast`,void 0),J([F()],$.prototype,`restored`,void 0),$=J([P(`jq-make`)],$);var yi=[`system`,`light`,`dark`,`oled`],bi=`justqr.theme`;function xi(e){return yi.includes(e)?e:`system`}function Si(){try{return xi(localStorage.getItem(bi))}catch{return`system`}}function Ci(e,t=!1){let n=document.documentElement;if(e===`system`?n.removeAttribute(`data-theme`):n.setAttribute(`data-theme`,e),t)try{localStorage.setItem(bi,e)}catch{}}var wi={system:`settings.theme_system`,light:`settings.theme_light`,dark:`settings.theme_dark`,oled:`settings.theme_oled`},Ti=[[`Lit`,`BSD-3-Clause`],[`qrcode`,`MIT`],[`idb`,`ISC`],[`Workbox`,`MIT`]],Ei=class extends q{constructor(...e){super(...e),this.theme=Si()}static{this.styles=[ur,h`
            :host {
                display: block;
                padding-bottom: 24px;
            }
            section {
                padding: 12px 0;
                border-bottom: 1px solid var(--divider);
            }
            h2 {
                font-size: 15px;
                font-weight: 600;
                margin: 4px 0 8px;
            }
            p {
                font-size: 15px;
                line-height: 1.5;
                margin: 6px 0;
            }
            .muted {
                color: var(--muted);
                font-size: 14px;
            }
            ul {
                margin: 6px 0;
                padding-inline-start: 20px;
                font-size: 14px;
                line-height: 1.7;
                color: var(--muted);
            }
            a {
                color: var(--accent);
            }
            .seg {
                flex-wrap: wrap;
            }
        `]}setTheme(e){this.theme=e,Ci(e,!0),$r(e)}renderThemes(){return O`<div class="seg" role="radiogroup" aria-labelledby="theme-label" @keydown=${e=>{let t=sr(e,this);if(!t)return;let n=cr(yi,this.theme,t);this.setTheme(n),this.updateComplete.then(()=>this.renderRoot.querySelector(`[data-testid="theme-${n}"]`)?.focus())}}>
            ${yi.map(e=>O`<button
                        role="radio"
                        data-testid=${`theme-${e}`}
                        aria-checked=${e===this.theme?`true`:`false`}
                        tabindex=${e===this.theme?0:-1}
                        @click=${()=>this.setTheme(e)}
                    >
                        ${I(wi[e])}
                    </button>`)}
        </div>`}render(){return O`
            <section>
                <label for="language">${I(`settings.language`)}</label>
                <select
                    id="language"
                    data-testid="language"
                    .value=${Qe()}
                    @change=${e=>nt(e.target.value,!0)}
                >
                    ${Ke.map(e=>O`<option value=${e} lang=${e} ?selected=${e===Qe()}>${qe[e]}</option>`)}
                </select>
                <label id="theme-label">${I(`settings.theme`)}</label>
                ${this.renderThemes()}
            </section>
            <section data-testid="privacy">
                <h2>${I(`settings.privacy`)}</h2>
                <p>${I(`settings.privacy_text`)}</p>
            </section>
            <section>
                <h2>${I(`settings.about`)}</h2>
                <p>${I(`settings.about_text`)}</p>
                <p class="muted" data-testid="version">${I(`settings.version`,{version:`0.1.0`})}</p>
                <p class="muted">
                    <a href="https://github.com/Open-Waqf/justqr" target="_blank" rel="noopener noreferrer"
                        >${I(`settings.source`)}</a
                    >
                </p>
            </section>
            <section>
                <h2>${I(`settings.licences`)}</h2>
                <p class="muted">${I(`settings.licences_text`)}</p>
                <ul data-testid="licences">
                    ${Ti.map(([e,t])=>O`<li>${e}: ${t}</li>`)}
                </ul>
            </section>
        `}};J([F()],Ei.prototype,`theme`,void 0),Ei=J([P(`jq-settings`)],Ei);function Di(){return location.hash===`#history`?`history`:location.hash===`#settings`?`settings`:`make`}var Oi=class extends q{constructor(...e){super(...e),this.route=Di(),this.applyUpdate=null,this.onUpdate=e=>{this.applyUpdate=e.detail.apply},this.onHash=()=>{this.route=Di()}}static{this.styles=[lr,h`
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            min-height: 100%;
            padding-top: var(--inset-top);
            max-width: 560px;
            margin: 0 auto;
        }
        header {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 6px 8px 6px 16px;
        }
        header.sub {
            padding-inline-start: 4px;
        }
        h1 {
            flex: 1;
            font-size: 20px;
            font-weight: 650;
            margin: 0;
        }
        .icon {
            width: 44px;
            height: 44px;
            border: 0;
            border-radius: 22px;
            background: none;
            color: var(--text);
            display: grid;
            place-items: center;
            cursor: pointer;
        }
        .icon:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        .icon svg {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        [dir='rtl'] .back svg {
            transform: scaleX(-1);
        }
        main {
            flex: 1;
            padding: 0 16px 16px;
        }
        .update {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 0 16px 8px;
            padding: 6px 6px 6px 12px;
            border-radius: 10px;
            background: var(--surface);
            font-size: 14px;
        }
        .update button {
            min-height: 36px;
            padding: 0 12px;
            border: 0;
            border-radius: 8px;
            background: var(--accent);
            color: var(--on-accent);
            font: inherit;
            font-weight: 600;
            cursor: pointer;
        }
    `]}connectedCallback(){super.connectedCallback(),window.addEventListener(`hashchange`,this.onHash),window.addEventListener(`jq-update-ready`,this.onUpdate)}disconnectedCallback(){window.removeEventListener(`hashchange`,this.onHash),window.removeEventListener(`jq-update-ready`,this.onUpdate),super.disconnectedCallback()}firstUpdated(){performance.mark(`jq-ready`),ei(()=>this.make.closeMenu()?!0:this.route!==`make`&&(this.goBack(),!0))}goBack(){history.length>1&&history.state?.jq?history.back():location.hash=``}open(e){history.pushState({jq:e},``,`#${e}`),this.onHash()}openCode(e){this.make.load(e.detail),this.goBack()}render(){let e=document.documentElement.dir,t=this.route!==`make`;return O`
            <header class=${t?`sub`:``} dir=${e}>
                ${t?O`<button class="icon back" id="btn-back" data-testid="btn-back" aria-label=${I(`nav.back`)} @click=${this.goBack}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
                              </button>
                              <h1>${this.route===`history`?I(`history.title`):I(`settings.title`)}</h1>`:O`<h1>Just QR</h1>
                              <button class="icon" id="btn-history" data-testid="btn-history" aria-label=${I(`history.title`)} @click=${()=>this.open(`history`)}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 2" />
                                  </svg>
                              </button>
                              <button class="icon" id="btn-settings" data-testid="btn-settings" aria-label=${I(`settings.title`)} @click=${()=>this.open(`settings`)}>
                                  <svg viewBox="0 0 24 24" aria-hidden="true">
                                      <circle cx="12" cy="12" r="3" />
                                      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
                                  </svg>
                              </button>`}
            </header>
            ${this.applyUpdate?O`<p class="update" role="status" data-testid="update-ready">
                          <span>${I(`update.ready`)}</span>
                          <button id="update-apply" data-testid="update-apply" @click=${()=>this.applyUpdate?.()}>${I(`update.apply`)}</button>
                      </p>`:A}
            <main data-testid="app">
                <jq-make ?hidden=${t}></jq-make>
                ${this.route===`history`?O`<jq-history @open-code=${this.openCode}></jq-history>`:A}
                ${this.route===`settings`?O`<jq-settings></jq-settings>`:A}
            </main>
        `}};J([F()],Oi.prototype,`route`,void 0),J([F()],Oi.prototype,`applyUpdate`,void 0),J([Ge(`jq-make`)],Oi.prototype,`make`,void 0),Oi=J([P(`jq-app`)],Oi);var ki=`false`,Ai=`false`,ji=ki===`true`,Mi=Ai===`true`;function Ni(e={}){let{immediate:t=!1,onNeedReload:n,onNeedRefresh:r,onOfflineReady:i,onRegistered:a,onRegisteredSW:o,onRegisterError:s}=e,c,l,u,d=async(e=!0)=>{await l,ji||u?.()};async function f(){if(`serviceWorker`in navigator){if(c=await Rr(async()=>{let{Workbox:e}=await import(`./workbox-window.prod.es5-Bd17z0YL.js`);return{Workbox:e}},[],import.meta.url).then(({Workbox:e})=>new e(`./sw.js`,{scope:`./`,type:`classic`})).catch(e=>{s?.(e)}),!c)return;if(u=()=>{c?.messageSkipWaiting()},!Mi){if(ji)c.addEventListener(`activated`,e=>{(e.isUpdate||e.isExternal)&&(n?n():window.location.reload())}),c.addEventListener(`installed`,e=>{e.isUpdate||i?.()});else{let e=!1,t=()=>{e=!0,c?.addEventListener(`controlling`,e=>{e.isUpdate&&(n?n():window.location.reload())}),r?.()};c.addEventListener(`installed`,n=>{n.isUpdate===void 0?n.isExternal===void 0?!e&&i?.():n.isExternal?t():!e&&i?.():n.isUpdate||i?.()}),c.addEventListener(`waiting`,t)}}c.register({immediate:t}).then(e=>{o?o(`./sw.js`,e):a?.(e)}).catch(e=>{s?.(e)})}}return l=f(),d}var Pi=Si();if(Ci(Pi),$r(Pi),nt(tt()),!Q()&&`serviceWorker`in navigator){let e=Ni({immediate:!0,onNeedRefresh(){window.dispatchEvent(new CustomEvent(`jq-update-ready`,{detail:{apply:()=>e(!0)}}))}})}export{br as n,Dr as r,Wr as t};