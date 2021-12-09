export default class Loader {
  static init(){
    Loader.css = [];
    document.addEventListener('DOMContentLoaded', DOMLoaded);
    window.addEventListener('pageReplaced', setNewPage);
    resources();
    
    async function resources(){
      console.log('resources');
      setLoaderDiv();
      setTitles();
      notyf();
      await firebase();      
    }
    async function setNewPage(){
      console.log('setNewPage');
      await resources();
      runScripts();
    }
    function runScripts(){
      console.log('runScripts');
      const scripts = document.querySelectorAll(":is(main, header) script");
      Loader.scriptsToLoad = scripts.length;
      Loader.scriptsLoaded = 0;

      for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
        newScript.addEventListener('load', countUntilLoad, {once: true});
      }

      function countUntilLoad(){
        Loader.scriptsLoaded++;
        console.log('loaded: ', Loader.scriptsLoaded);
        console.log('to Load: ', Loader.scriptsToLoad);
        if (Loader.scriptsLoaded == Loader.scriptsToLoad){
          console.log('scriptsToLoad >= scriptsLoaded');
          window.dispatchEvent(new Event('load'));            
        }
      }
    }
    function setTitles(){
      if (location.pathname == '/') return;
      const title = Loader.div?.dataset?.title;
      if (title) document.title = title;
      document.querySelector('header h1').innerText = document.title;
    }
    function needs(need){
      return Loader.div?.hasAttribute(`data-${need}`);
    }
    function setLoaderDiv(){
      Loader.div = document.getElementById('load');
    }
    function DOMLoaded(){
      recaptcha();
      setSwup();
    }

    function setSwup(){
      Loader.swup = new Swup({
        linkSelector: `a[href]:not([href^="#"]):not([data-no-swup]):not([href="/"]):not([target="_blank"])`,
        animateHistoryBrowsing: true
      });
      Loader.swup.on('contentReplaced', onContentReplaced);
      
      function onContentReplaced(){
        console.log('Content Replaced');
        window.dispatchEvent(new Event('pageReplaced'));
        window.scrollTo(0, 0);
      }
    }
    async function notyf(){
      if (!needs('notyf')) return;
      Loader.loadCss('/assets/notyf/notyf.min.css');
      await import('/assets/notyf/notyf.min.js');
      window.notyf = new Notyf({
        duration: 7000,
        position: {x: 'right', y: 'top'},
        dismissible: true
      });
    }
    function recaptcha(){
      if (needs('recaptcha')) import('https://www.google.com/recaptcha/api.js');
    }
    async function firebase(){
      const dirURL = 'https://www.gstatic.com/firebasejs/8.3.0/';
      if (!window.firebase){
        await import(dirURL + 'firebase-app.js');
        await import('/assets/js/firebase-init.js');
        await import(dirURL + 'firebase-analytics.js');
        window.firebase.analytics();
      }
      const hasAuth = needs('firebase-auth');
      const hasFunctions = needs('firebase-functions');
      const hasDatabase = needs('firebase-database');
      const hasStorage = needs('firebase-storage');
      const needsFirebase = hasAuth || hasStorage || hasFunctions || hasDatabase;
      if (!needsFirebase) return;
      if (hasAuth) await import(dirURL + 'firebase-auth.js');
      if (hasFunctions) await import(dirURL + 'firebase-functions.js');
      if (hasDatabase) await import(dirURL + 'firebase-database.js');
      if (hasStorage) await import(dirURL + 'firebase-storage.js');
    }
  }
  static async appendScript(src, cb){
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    if (cb) script.onload = cb;
    document.head.appendChild(script);
  }
  static loadCss(path) {
    if (Loader.css.includes(path)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = path;
    document.head.appendChild(l);
    Loader.css.push(path);
  }

}
Loader.init();