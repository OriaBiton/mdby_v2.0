export default class Loader {
  static init(){
    Loader.css = [];
    document.addEventListener('DOMContentLoaded', DOMLoaded);
    resources();
    
    async function resources(){
      console.log('resources');
      setLoaderDiv();
      setHeaderImage();
      setTitles();
      notyf();
      await firebase();
    }

    function setHeaderImage(){
      if (isHome()) return;
      const loadDivImg = Loader.div.dataset.img;
      const fallbackImg = document.querySelector('main img.post')?.src;
      const imgToSet = loadDivImg || fallbackImg;
      if (!imgToSet) return;
      const headerImg = document.querySelector('header .bg-img');
      headerImg.src = imgToSet;
    }
    function setTitles(){
      if (isHome()) return;
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
      const swup = new Swup({
        linkSelector: `a[href]:not([href^="#"]):not([data-no-swup]):not([href="/"]):not([target="_blank"])`,
        animateHistoryBrowsing: true
      });
      swup.on('contentReplaced', onContentReplaced);
      
      function onContentReplaced(){
        console.log('Content Replaced');        
        setNewPage();
        window.scrollTo(0, 0);        
      }
      async function setNewPage(){
        console.log('setNewPage');
        await resources();
        await runScripts();
        window.dispatchEvent(new Event('load'));
      }
      function runScripts(){
        return new Promise(res => {
          console.log('runScripts');
          const scripts = document.querySelectorAll(":is(header, main) script");
          console.log(scripts);
          if (!scripts.length) res();
          Loader.scriptsToLoad = scripts.length;
          Loader.scriptsLoaded = 0;
          for (const oldScript of scripts) {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
            newScript.addEventListener('load', countLoaded, {once: true});
          }
          function countLoaded(){
            Loader.scriptsLoaded++;
            if (Loader.scriptsLoaded == Loader.scriptsToLoad){
              console.log('scriptsToLoad == scriptsLoaded');
              res();
            }
          }
        });
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

function isHome(){ return location.pathname == '/'; }