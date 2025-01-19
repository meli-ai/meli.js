import type { ConditionalKeys } from "type-fest";

// `meli` lives on the `window` object
interface WindowWithMeli extends Window {
  meli?: Meli;

  // Array of `[method, deferred?, args]` tuples
  MELI_QUEUE?: [string, Deferred | null, any[]][];

  MELI_ENV_VARS?: Record<string, any>;
  __meliStatePatched: Boolean;
}

// meli.js API
export interface Meli {
  _stubbed: boolean;

  load: () => Promise<void>;

  init: (tourId: string) => Promise<void>;
  auth: (userId: string, attributes?: Attributes) => Promise<void>;
  authAnonymous: (attributes?: Attributes) => Promise<void>;
  start: (tourId: string, opts?: StartOptions) => Promise<void>;
  end: () => Promise<void>;
}

// Helper types for meli.js API
export interface Attributes {
  [name: string]: AttributeLiteralOrList | AttributeChange;
}

type AttributeLiteral = string | number | boolean | null | undefined;
type AttributeLiteralOrList = AttributeLiteral | AttributeLiteral[];

interface AttributeChange {
  set?: AttributeLiteralOrList;
  set_once?: AttributeLiteralOrList;
  add?: string | number;
  subtract?: string | number;
  append?: AttributeLiteralOrList;
  prepend?: AttributeLiteralOrList;
  remove?: AttributeLiteralOrList;
  data_type?: AttributeDataType;
}

type AttributeDataType = "string" | "boolean" | "number" | "datetime" | "list";

export interface StartOptions {
  once?: boolean;
}

interface Deferred {
  resolve: () => void;
  reject: (e: any) => void;
}

// If window.meli has not been initalized yet, then stub all its methods, so
// it can be used immediately, and load the meli.js script from CDN.
// Support importing meli.js with server-side rendering by attaching to an
// empty object instead of `window`.
var w: WindowWithMeli = typeof window === "undefined" ? ({} as any) : window;
var meli = w.meli;
var history = w.history;

function overrideHistoryMethods(method: () => void, eventName: string) {
  return function () {
    var event = new CustomEvent(eventName);
    var args = Array.prototype.slice.call(arguments);
    var ret = method.apply(history, args as any);
    w.dispatchEvent(event);
    return ret;
  };
}

// patch the history API's
// pushState method to emit meli:pushstate and
// replaceState method to emit meli:replacestate
if (history) {
  // indicates if the history API's pushState and replaceState are patched with custom event emitters
  w.__meliStatePatched = true;

  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;

  history.pushState = overrideHistoryMethods(
    originalPushState as any,
    "meli:pushstate"
  );
  history.replaceState = overrideHistoryMethods(
    originalReplaceState as any,
    "meli:replacestate"
  );
}

if (!meli) {
  const urlPrefix = "https://meli-tour.vercel.app/";

  // Initialize as an empty object (methods will be stubbed below)
  var loadPromise: Promise<void> | null = null;
  meli = w.meli = {
    _stubbed: true,
    // Helper to inject the proper meli.js script/module into the document
    load: function (): Promise<void> {
      // Make sure we only load meli.js once
      if (!loadPromise) {
        loadPromise = new Promise(function (resolve, reject) {
          var script = document.createElement("script");
          script.async = true;
          script.type = "module";
          script.src = `${urlPrefix}bundle.min.js`;

          script.onload = function () {
            resolve();
          };

          script.onerror = function () {
            document.head.removeChild(script);
            loadPromise = null;
            var e = new Error("Could not load meli.js");
            console.warn(e.message);
            reject(e);
          };

          document.head.appendChild(script);
        });
      }
      return loadPromise;
    },
  } as Meli;

  // Initialize the queue, which will be flushed by meli.js when it loads
  var q = (w.MELI_QUEUE = w.MELI_QUEUE || []);

  /**
   * Helper to stub void-returning methods that should be queued
   */
  // var stubVoid = function (
  //   method: ConditionalKeys<Meli, (...args: any[]) => void>
  // ) {
  //   meli![method] = function () {
  //     var args = Array.prototype.slice.call(arguments);
  //     meli!.load();
  //     q.push([method, null, args]);
  //   } as any;
  // };

  // Helper to stub promise-returning methods that should be queued
  var stubPromise = function (
    method: ConditionalKeys<Meli, (...args: any[]) => Promise<void>>
  ) {
    meli![method] = function () {
      var args = Array.prototype.slice.call(arguments);
      meli!.load();
      var deferred: Deferred;
      var promise = new Promise<void>(function (resolve, reject) {
        deferred = { resolve: resolve, reject: reject };
      });
      q.push([method, deferred!, args]);
      return promise;
    } as any;
  };

  // Helper to stub methods that must return a value synchronously, and
  // therefore must support using a default callback until meli.js is
  // loaded.
  //   var stubDefault = function (
  //     method: ConditionalKeys<Meli, () => any>,
  //     returnValue: any
  //   ) {
  //     meli![method] = function () {
  //       return returnValue;
  //     };
  //   };

  // Methods that return void and should be queued
  //stubVoid("");

  // Methods that return promises and should be queued
  stubPromise("init");
  stubPromise("start");
  stubPromise("end");
  stubPromise("auth");
  stubPromise("authAnonymous");

  // Methods that synchronously return and can be stubbed with default return
  // values and are not queued
  // stubDefault("", null)
}

export default meli!;
