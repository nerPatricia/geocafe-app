function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function _createClass(e,n,t){return n&&_defineProperties(e.prototype,n),t&&_defineProperties(e,t),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{erbJ:function(e,n,t){"use strict";t.r(n),t.d(n,"HomeOrganizerPageModule",(function(){return S}));var o,r,c=t("ofXK"),i=t("TEn/"),a=t("3Pt+"),s=t("PSD3"),u=t.n(s),l=t("fXoL"),p=t("tyNb"),b=t("mrSG"),d=t("C6fG"),f=function(e){function n(){return null!==e&&e.apply(this,arguments)||this}Object(b.c)(n,e),n.prototype.prepare=function(){return Object(d.cordova)(this,"prepare",{callbackStyle:"node"},arguments)},n.prototype.scan=function(){return Object(d.cordova)(this,"scan",{callbackStyle:"node",observable:!0,clearFunction:"cancelScan"},arguments)},n.prototype.show=function(){return Object(d.cordova)(this,"show",{},arguments)},n.prototype.hide=function(){return Object(d.cordova)(this,"hide",{},arguments)},n.prototype.enableLight=function(){return Object(d.cordova)(this,"enableLight",{callbackStyle:"node"},arguments)},n.prototype.destroy=function(){return Object(d.cordova)(this,"destroy",{},arguments)},n.prototype.disableLight=function(){return Object(d.cordova)(this,"disableLight",{callbackStyle:"node"},arguments)},n.prototype.useFrontCamera=function(){return Object(d.cordova)(this,"useFrontCamera",{callbackStyle:"node"},arguments)},n.prototype.useBackCamera=function(){return Object(d.cordova)(this,"useBackCamera",{callbackStyle:"node"},arguments)},n.prototype.useCamera=function(e){return Object(d.cordova)(this,"useCamera",{callbackStyle:"node"},arguments)},n.prototype.pausePreview=function(){return Object(d.cordova)(this,"pausePreview",{},arguments)},n.prototype.resumePreview=function(){return Object(d.cordova)(this,"resumePreview",{},arguments)},n.prototype.getStatus=function(){return Object(d.cordova)(this,"getStatus",{},arguments)},n.prototype.openSettings=function(){return Object(d.cordova)(this,"openSettings",{sync:!0},arguments)},n.pluginName="QRScanner",n.plugin="cordova-plugin-qrscanner",n.pluginRef="QRScanner",n.repo="https://github.com/bitpay/cordova-plugin-qrscanner",n.platforms=["Android","Browser","iOS","Windows"],n.\u0275fac=function(e){return t(e||n)},n.\u0275prov=l.Gb({token:n,factory:function(e){return n.\u0275fac(e)}});var t=l.Pb(n);return n}(d.IonicNativePlugin),h=t("EVkI"),g=t("RSLB"),v=t("PMmS"),y=((o=function(){function e(n,t,o,r){_classCallCheck(this,e),this.router=n,this.qrScanner=t,this.eventService=o,this.loading=r,this.isOn=!1}return _createClass(e,[{key:"goToCreateEvent",value:function(){this.router.navigateByUrl("/register-event")}},{key:"scanner",value:function(){var e=this;this.qrScanner.prepare().then((function(n){if(n.authorized){e.isOn=!0;var t=e.qrScanner.scan().subscribe((function(n){e.loading.present(),e.isOn=!1;var o=Number(n[0]),r=Number(n[n.length-1]);e.eventService.qrCodeScan(o,r).then((function(n){e.loading.dismiss(),u.a.fire({title:"Sucesso",text:"Horas complementares adiciondas ao perfil do aluno.",icon:"success",confirmButtonText:"OK"}).then((function(){e.router.navigateByUrl("/home-organizer")}))}),(function(n){e.loading.dismiss(),console.log(n)})),e.qrScanner.hide().then(),t.unsubscribe()}));e.qrScanner.show().then()}else n.denied?e.qrScanner.openSettings():console.log("denied not permanently")})).catch((function(e){return console.log("Error is",e)}))}}]),e}()).\u0275fac=function(e){return new(e||o)(l.Kb(p.g),l.Kb(f),l.Kb(h.a),l.Kb(g.a))},o.\u0275cmp=l.Eb({type:o,selectors:[["app-home-organizer"]],decls:14,vars:2,consts:[["title","Eventex",3,"showButtonLogout"],[1,"ion-padding",3,"ngClass"],[2,"justify-content","space-around"],["size","3",1,"card",3,"click"],["name","add-circle-outline"],["name","qr-code-outline"]],template:function(e,n){1&e&&(l.Lb(0,"app-header",0),l.Nb(1,"ion-content",1),l.Nb(2,"ion-grid"),l.Nb(3,"ion-row",2),l.Nb(4,"ion-col",3),l.Vb("click",(function(){return n.goToCreateEvent()})),l.Lb(5,"ion-icon",4),l.Lb(6,"br"),l.Nb(7,"span"),l.gc(8,"CRIAR EVENTO"),l.Mb(),l.Mb(),l.Nb(9,"ion-col",3),l.Vb("click",(function(){return n.scanner()})),l.Lb(10,"ion-icon",5),l.Lb(11,"br"),l.Nb(12,"span"),l.gc(13,"LEITOR QR"),l.Mb(),l.Mb(),l.Mb(),l.Mb(),l.Mb()),2&e&&(l.ac("showButtonLogout",!0),l.zb(1),l.ac("ngClass",!0===n.isOn?"show-qr-scanner":"off"))},directives:[v.a,i.j,c.h,i.k,i.s,i.i,i.m],styles:[".show-qr-scanner[_ngcontent-%COMP%]{display:none}.off[_ngcontent-%COMP%]{display:flex!important}.card[_ngcontent-%COMP%]{text-align:center;border-radius:10px;background-color:var(--ion-color-primary);margin:14px;padding:.5em .2em;--box-shadow:0px 2px 5px rgba(0,0,0,0.16);-webkit-box-shadow:0 2px 5px rgba(0,0,0,.161);opacity:1}.card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:.6em;color:#fff;font-weight:700}.card[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{color:#fff;font-size:xx-large}"]}),o),m=t("oLyS"),O=[{path:"",component:y}],S=((r=function e(){_classCallCheck(this,e)}).\u0275mod=l.Ib({type:r}),r.\u0275inj=l.Hb({factory:function(e){return new(e||r)},providers:[f,g.a],imports:[[c.b,a.e,i.w,m.a,p.i.forChild(O)]]}),r)}}]);