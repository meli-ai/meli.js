// `meli` lives on the `window` object
interface WindowWithMeli extends Window {
  meli?: Meli;
}

// meli.js API
interface Meli {
  _stubbed: boolean;
  load: () => Promise<void>;
  init: (tourId: string) => Promise<void>;
  start: () => Promise<void>;
  end: () => Promise<void>;
  auth: () => Promise<void>;
  authAnonymous: () => Promise<void>;
  processQueue: () => void;
  [key: string]: any;
}

type MeliLoadState = "NOT_LOADED" | "LOADING" | "LOADED";

// Window with meli defined
const w: WindowWithMeli = typeof window === "undefined" ? ({} as any) : window;
let meli: Meli | undefined = w.meli;

console.log("Is Meli loaded:", meli);

if (!meli) {
  const MELI_QUEUE: Array<[string, string]> = [];
  const urlPrefix = "https://meli-tour.vercel.app/";
  let loadState: MeliLoadState = "NOT_LOADED";
  let queueProcessed = false;

  meli = w.meli = {
    _stubbed: true,
    load: function () {
      return new Promise<void>((resolve, reject) => {
        if (loadState === "LOADING" || loadState === "LOADED") {
          return; // Avoid loading if already in progress or loaded
        }

        loadState = "LOADING";

        const script = document.createElement("script");
        script.type = "module";
        script.async = true;
        script.src = `${urlPrefix}bundle.min.js`;

        script.onload = function () {
          console.log("Meli script loaded successfully");
          loadState = "LOADED";
          meli!._stubbed = false;
          resolve();
        };

        script.onerror = function () {
          loadState = "NOT_LOADED";
          reject(new Error("Could not load meli.js"));
        };

        document.head.appendChild(script);
      });
    },
  } as Meli;

  if (typeof window !== "undefined" && meli._stubbed) {
    console.log("Loading meli...");
    meli
      .load()
      .then(() => meli!.processQueue())
      .catch(console.error);
  }

  const stubMethod = function (name: string) {
    let isCallingMethod = false;

    if (meli) {
      meli[name] = function (tourId: string) {
        if (isCallingMethod) return Promise.resolve(); // Prevent recursive calls

        console.log(`${name} called with argument:`, tourId);
        isCallingMethod = true;

        if (meli!._stubbed) {
          MELI_QUEUE.push([name, tourId]);

          if (loadState === "NOT_LOADED" && !queueProcessed) {
            console.log("Loading Meli...");
            meli!
              .load()
              .then(() => meli!.processQueue())
              .catch(console.error);
          }
          isCallingMethod = false;
          return Promise.resolve();
        } else {
          return meli![name](tourId).finally(() => {
            isCallingMethod = false;
          });
        }
      };
    } else {
      console.error("Meli is undefined while assigning method:", name);
    }
  };

  ["init", "start", "end", "auth", "authAnonymous"].forEach(stubMethod);

  let isQueueProcessed = false;

  meli.processQueue = function () {
    if (queueProcessed || loadState !== "LOADED" || isQueueProcessed) {
      console.log(
        "Queue already processed or Meli not fully loaded or already processed."
      );
      return;
    }

    console.log("Processing queue");
    isQueueProcessed = true;
    queueProcessed = true;
    while (MELI_QUEUE.length > 0) {
      const [method, tourId] = MELI_QUEUE.shift()!;
      console.log(`Executing queued method: ${method} with tourId:`, tourId);
      try {
        if (meli) {
          meli[method](tourId);
        } else {
          console.error("Meli is undefined while processing the queue.");
        }
      } catch (error) {
        console.error(`Error processing queued method ${method}:`, error);
      }
    }
  };
}

export default meli as Meli;
