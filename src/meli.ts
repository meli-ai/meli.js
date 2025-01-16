// `meli` lives on the `window` object
interface WindowWithMeli extends Window {
  meli?: Meli;
}

// meli.js API
interface Meli {
  _stubbed: boolean;
  load: () => Promise<void>;
  init: (...args: any[]) => Promise<void>;
  start: (...args: any[]) => Promise<void>;
  end: (...args: any[]) => Promise<void>;
  auth: (...args: any[]) => Promise<void>;
  authAnonymous: (...args: any[]) => Promise<void>;
  processQueue: () => void;
  [key: string]: any; // This allows for dynamic method addition
}

const w: WindowWithMeli = typeof window === "undefined" ? ({} as any) : window;
let meli: Meli | undefined = w.meli;

if (!meli) {
  const MELI_QUEUE: Array<[string, any[]]> = [];
  const urlPrefix = "https://meli-tour.vercel.app/";
  let loadPromise: Promise<void> | null = null;

  meli = w.meli = {
    _stubbed: true,
    load: function () {
      if (!loadPromise) {
        loadPromise = new Promise(function (resolve, reject) {
          const script = document.createElement("script");
          script.async = true;
          script.src = `${urlPrefix}bundle.min.js`;
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
          document.head.appendChild(script);
        });
      }
      return loadPromise;
    },
  } as Meli;

  const stubMethod = function (name: string) {
    meli![name] = function (...args: any[]) {
      meli!.load().then(function () {
        w.meli![name].apply(w.meli, args);
      });
      MELI_QUEUE.push([name, args]);
    };
  };

  stubMethod("init");
  stubMethod("start");
  stubMethod("end");
  stubMethod("auth");
  stubMethod("authAnonymous");

  meli.processQueue = function () {
    MELI_QUEUE.forEach(function (item) {
      w.meli![item[0]].apply(w.meli, item[1]);
    });
    MELI_QUEUE.length = 0;
    meli!._stubbed = false;
  };
}

export default meli as Meli;
