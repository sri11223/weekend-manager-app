import { _ as _typeof$1, c as commonjsGlobal, g as getDefaultExportFromCjs } from "./index-BQjZhYGd.js";
function toPrimitive$1(t2, r2) {
  if ("object" != _typeof$1(t2) || !t2) return t2;
  var e2 = t2[Symbol.toPrimitive];
  if (void 0 !== e2) {
    var i2 = e2.call(t2, r2);
    if ("object" != _typeof$1(i2)) return i2;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r2 ? String : Number)(t2);
}
function toPropertyKey$1(t2) {
  var i2 = toPrimitive$1(t2, "string");
  return "symbol" == _typeof$1(i2) ? i2 : i2 + "";
}
function _defineProperty(e2, r2, t2) {
  return (r2 = toPropertyKey$1(r2)) in e2 ? Object.defineProperty(e2, r2, {
    value: t2,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e2[r2] = t2, e2;
}
var es_promise = {};
var es_promise_constructor = {};
var globalThis_1;
var hasRequiredGlobalThis;
function requireGlobalThis() {
  if (hasRequiredGlobalThis) return globalThis_1;
  hasRequiredGlobalThis = 1;
  var check = function(it) {
    return it && it.Math === Math && it;
  };
  globalThis_1 = // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == "object" && self) || check(typeof commonjsGlobal == "object" && commonjsGlobal) || check(typeof globalThis_1 == "object" && globalThis_1) || // eslint-disable-next-line no-new-func -- fallback
  /* @__PURE__ */ (function() {
    return this;
  })() || Function("return this")();
  return globalThis_1;
}
var objectGetOwnPropertyDescriptor = {};
var fails;
var hasRequiredFails;
function requireFails() {
  if (hasRequiredFails) return fails;
  hasRequiredFails = 1;
  fails = function(exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };
  return fails;
}
var descriptors;
var hasRequiredDescriptors;
function requireDescriptors() {
  if (hasRequiredDescriptors) return descriptors;
  hasRequiredDescriptors = 1;
  var fails2 = requireFails();
  descriptors = !fails2(function() {
    return Object.defineProperty({}, 1, { get: function() {
      return 7;
    } })[1] !== 7;
  });
  return descriptors;
}
var functionBindNative;
var hasRequiredFunctionBindNative;
function requireFunctionBindNative() {
  if (hasRequiredFunctionBindNative) return functionBindNative;
  hasRequiredFunctionBindNative = 1;
  var fails2 = requireFails();
  functionBindNative = !fails2(function() {
    var test = (function() {
    }).bind();
    return typeof test != "function" || test.hasOwnProperty("prototype");
  });
  return functionBindNative;
}
var functionCall;
var hasRequiredFunctionCall;
function requireFunctionCall() {
  if (hasRequiredFunctionCall) return functionCall;
  hasRequiredFunctionCall = 1;
  var NATIVE_BIND = requireFunctionBindNative();
  var call = Function.prototype.call;
  functionCall = NATIVE_BIND ? call.bind(call) : function() {
    return call.apply(call, arguments);
  };
  return functionCall;
}
var objectPropertyIsEnumerable = {};
var hasRequiredObjectPropertyIsEnumerable;
function requireObjectPropertyIsEnumerable() {
  if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
  hasRequiredObjectPropertyIsEnumerable = 1;
  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;
  return objectPropertyIsEnumerable;
}
var createPropertyDescriptor;
var hasRequiredCreatePropertyDescriptor;
function requireCreatePropertyDescriptor() {
  if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
  hasRequiredCreatePropertyDescriptor = 1;
  createPropertyDescriptor = function(bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value
    };
  };
  return createPropertyDescriptor;
}
var functionUncurryThis;
var hasRequiredFunctionUncurryThis;
function requireFunctionUncurryThis() {
  if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
  hasRequiredFunctionUncurryThis = 1;
  var NATIVE_BIND = requireFunctionBindNative();
  var FunctionPrototype = Function.prototype;
  var call = FunctionPrototype.call;
  var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);
  functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function(fn) {
    return function() {
      return call.apply(fn, arguments);
    };
  };
  return functionUncurryThis;
}
var classofRaw;
var hasRequiredClassofRaw;
function requireClassofRaw() {
  if (hasRequiredClassofRaw) return classofRaw;
  hasRequiredClassofRaw = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var toString2 = uncurryThis({}.toString);
  var stringSlice = uncurryThis("".slice);
  classofRaw = function(it) {
    return stringSlice(toString2(it), 8, -1);
  };
  return classofRaw;
}
var indexedObject;
var hasRequiredIndexedObject;
function requireIndexedObject() {
  if (hasRequiredIndexedObject) return indexedObject;
  hasRequiredIndexedObject = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var fails2 = requireFails();
  var classof2 = requireClassofRaw();
  var $Object = Object;
  var split = uncurryThis("".split);
  indexedObject = fails2(function() {
    return !$Object("z").propertyIsEnumerable(0);
  }) ? function(it) {
    return classof2(it) === "String" ? split(it, "") : $Object(it);
  } : $Object;
  return indexedObject;
}
var isNullOrUndefined;
var hasRequiredIsNullOrUndefined;
function requireIsNullOrUndefined() {
  if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
  hasRequiredIsNullOrUndefined = 1;
  isNullOrUndefined = function(it) {
    return it === null || it === void 0;
  };
  return isNullOrUndefined;
}
var requireObjectCoercible;
var hasRequiredRequireObjectCoercible;
function requireRequireObjectCoercible() {
  if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
  hasRequiredRequireObjectCoercible = 1;
  var isNullOrUndefined2 = requireIsNullOrUndefined();
  var $TypeError = TypeError;
  requireObjectCoercible = function(it) {
    if (isNullOrUndefined2(it)) throw new $TypeError("Can't call method on " + it);
    return it;
  };
  return requireObjectCoercible;
}
var toIndexedObject;
var hasRequiredToIndexedObject;
function requireToIndexedObject() {
  if (hasRequiredToIndexedObject) return toIndexedObject;
  hasRequiredToIndexedObject = 1;
  var IndexedObject = requireIndexedObject();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  toIndexedObject = function(it) {
    return IndexedObject(requireObjectCoercible2(it));
  };
  return toIndexedObject;
}
var isCallable;
var hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var documentAll = typeof document == "object" && document.all;
  isCallable = typeof documentAll == "undefined" && documentAll !== void 0 ? function(argument) {
    return typeof argument == "function" || argument === documentAll;
  } : function(argument) {
    return typeof argument == "function";
  };
  return isCallable;
}
var isObject;
var hasRequiredIsObject;
function requireIsObject() {
  if (hasRequiredIsObject) return isObject;
  hasRequiredIsObject = 1;
  var isCallable2 = requireIsCallable();
  isObject = function(it) {
    return typeof it == "object" ? it !== null : isCallable2(it);
  };
  return isObject;
}
var getBuiltIn;
var hasRequiredGetBuiltIn;
function requireGetBuiltIn() {
  if (hasRequiredGetBuiltIn) return getBuiltIn;
  hasRequiredGetBuiltIn = 1;
  var globalThis2 = requireGlobalThis();
  var isCallable2 = requireIsCallable();
  var aFunction = function(argument) {
    return isCallable2(argument) ? argument : void 0;
  };
  getBuiltIn = function(namespace, method) {
    return arguments.length < 2 ? aFunction(globalThis2[namespace]) : globalThis2[namespace] && globalThis2[namespace][method];
  };
  return getBuiltIn;
}
var objectIsPrototypeOf;
var hasRequiredObjectIsPrototypeOf;
function requireObjectIsPrototypeOf() {
  if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
  hasRequiredObjectIsPrototypeOf = 1;
  var uncurryThis = requireFunctionUncurryThis();
  objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
  return objectIsPrototypeOf;
}
var environmentUserAgent;
var hasRequiredEnvironmentUserAgent;
function requireEnvironmentUserAgent() {
  if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
  hasRequiredEnvironmentUserAgent = 1;
  var globalThis2 = requireGlobalThis();
  var navigator = globalThis2.navigator;
  var userAgent = navigator && navigator.userAgent;
  environmentUserAgent = userAgent ? String(userAgent) : "";
  return environmentUserAgent;
}
var environmentV8Version;
var hasRequiredEnvironmentV8Version;
function requireEnvironmentV8Version() {
  if (hasRequiredEnvironmentV8Version) return environmentV8Version;
  hasRequiredEnvironmentV8Version = 1;
  var globalThis2 = requireGlobalThis();
  var userAgent = requireEnvironmentUserAgent();
  var process2 = globalThis2.process;
  var Deno2 = globalThis2.Deno;
  var versions = process2 && process2.versions || Deno2 && Deno2.version;
  var v8 = versions && versions.v8;
  var match, version;
  if (v8) {
    match = v8.split(".");
    version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
  }
  if (!version && userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = +match[1];
    }
  }
  environmentV8Version = version;
  return environmentV8Version;
}
var symbolConstructorDetection;
var hasRequiredSymbolConstructorDetection;
function requireSymbolConstructorDetection() {
  if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
  hasRequiredSymbolConstructorDetection = 1;
  var V8_VERSION = requireEnvironmentV8Version();
  var fails2 = requireFails();
  var globalThis2 = requireGlobalThis();
  var $String = globalThis2.String;
  symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails2(function() {
    var symbol = Symbol("symbol detection");
    return !$String(symbol) || !(Object(symbol) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });
  return symbolConstructorDetection;
}
var useSymbolAsUid;
var hasRequiredUseSymbolAsUid;
function requireUseSymbolAsUid() {
  if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
  hasRequiredUseSymbolAsUid = 1;
  var NATIVE_SYMBOL = requireSymbolConstructorDetection();
  useSymbolAsUid = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
  return useSymbolAsUid;
}
var isSymbol;
var hasRequiredIsSymbol;
function requireIsSymbol() {
  if (hasRequiredIsSymbol) return isSymbol;
  hasRequiredIsSymbol = 1;
  var getBuiltIn2 = requireGetBuiltIn();
  var isCallable2 = requireIsCallable();
  var isPrototypeOf = requireObjectIsPrototypeOf();
  var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
  var $Object = Object;
  isSymbol = USE_SYMBOL_AS_UID ? function(it) {
    return typeof it == "symbol";
  } : function(it) {
    var $Symbol = getBuiltIn2("Symbol");
    return isCallable2($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
  };
  return isSymbol;
}
var tryToString;
var hasRequiredTryToString;
function requireTryToString() {
  if (hasRequiredTryToString) return tryToString;
  hasRequiredTryToString = 1;
  var $String = String;
  tryToString = function(argument) {
    try {
      return $String(argument);
    } catch (error) {
      return "Object";
    }
  };
  return tryToString;
}
var aCallable;
var hasRequiredACallable;
function requireACallable() {
  if (hasRequiredACallable) return aCallable;
  hasRequiredACallable = 1;
  var isCallable2 = requireIsCallable();
  var tryToString2 = requireTryToString();
  var $TypeError = TypeError;
  aCallable = function(argument) {
    if (isCallable2(argument)) return argument;
    throw new $TypeError(tryToString2(argument) + " is not a function");
  };
  return aCallable;
}
var getMethod;
var hasRequiredGetMethod;
function requireGetMethod() {
  if (hasRequiredGetMethod) return getMethod;
  hasRequiredGetMethod = 1;
  var aCallable2 = requireACallable();
  var isNullOrUndefined2 = requireIsNullOrUndefined();
  getMethod = function(V, P) {
    var func = V[P];
    return isNullOrUndefined2(func) ? void 0 : aCallable2(func);
  };
  return getMethod;
}
var ordinaryToPrimitive;
var hasRequiredOrdinaryToPrimitive;
function requireOrdinaryToPrimitive() {
  if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
  hasRequiredOrdinaryToPrimitive = 1;
  var call = requireFunctionCall();
  var isCallable2 = requireIsCallable();
  var isObject2 = requireIsObject();
  var $TypeError = TypeError;
  ordinaryToPrimitive = function(input, pref) {
    var fn, val;
    if (pref === "string" && isCallable2(fn = input.toString) && !isObject2(val = call(fn, input))) return val;
    if (isCallable2(fn = input.valueOf) && !isObject2(val = call(fn, input))) return val;
    if (pref !== "string" && isCallable2(fn = input.toString) && !isObject2(val = call(fn, input))) return val;
    throw new $TypeError("Can't convert object to primitive value");
  };
  return ordinaryToPrimitive;
}
var sharedStore = { exports: {} };
var isPure;
var hasRequiredIsPure;
function requireIsPure() {
  if (hasRequiredIsPure) return isPure;
  hasRequiredIsPure = 1;
  isPure = false;
  return isPure;
}
var defineGlobalProperty;
var hasRequiredDefineGlobalProperty;
function requireDefineGlobalProperty() {
  if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
  hasRequiredDefineGlobalProperty = 1;
  var globalThis2 = requireGlobalThis();
  var defineProperty = Object.defineProperty;
  defineGlobalProperty = function(key, value) {
    try {
      defineProperty(globalThis2, key, { value, configurable: true, writable: true });
    } catch (error) {
      globalThis2[key] = value;
    }
    return value;
  };
  return defineGlobalProperty;
}
var hasRequiredSharedStore;
function requireSharedStore() {
  if (hasRequiredSharedStore) return sharedStore.exports;
  hasRequiredSharedStore = 1;
  var IS_PURE = requireIsPure();
  var globalThis2 = requireGlobalThis();
  var defineGlobalProperty2 = requireDefineGlobalProperty();
  var SHARED = "__core-js_shared__";
  var store = sharedStore.exports = globalThis2[SHARED] || defineGlobalProperty2(SHARED, {});
  (store.versions || (store.versions = [])).push({
    version: "3.45.1",
    mode: IS_PURE ? "pure" : "global",
    copyright: "© 2014-2025 Denis Pushkarev (zloirock.ru)",
    license: "https://github.com/zloirock/core-js/blob/v3.45.1/LICENSE",
    source: "https://github.com/zloirock/core-js"
  });
  return sharedStore.exports;
}
var shared;
var hasRequiredShared;
function requireShared() {
  if (hasRequiredShared) return shared;
  hasRequiredShared = 1;
  var store = requireSharedStore();
  shared = function(key, value) {
    return store[key] || (store[key] = value || {});
  };
  return shared;
}
var toObject;
var hasRequiredToObject;
function requireToObject() {
  if (hasRequiredToObject) return toObject;
  hasRequiredToObject = 1;
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var $Object = Object;
  toObject = function(argument) {
    return $Object(requireObjectCoercible2(argument));
  };
  return toObject;
}
var hasOwnProperty_1;
var hasRequiredHasOwnProperty;
function requireHasOwnProperty() {
  if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
  hasRequiredHasOwnProperty = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var toObject2 = requireToObject();
  var hasOwnProperty = uncurryThis({}.hasOwnProperty);
  hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty(toObject2(it), key);
  };
  return hasOwnProperty_1;
}
var uid;
var hasRequiredUid;
function requireUid() {
  if (hasRequiredUid) return uid;
  hasRequiredUid = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var id = 0;
  var postfix = Math.random();
  var toString2 = uncurryThis(1.1.toString);
  uid = function(key) {
    return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString2(++id + postfix, 36);
  };
  return uid;
}
var wellKnownSymbol;
var hasRequiredWellKnownSymbol;
function requireWellKnownSymbol() {
  if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
  hasRequiredWellKnownSymbol = 1;
  var globalThis2 = requireGlobalThis();
  var shared2 = requireShared();
  var hasOwn = requireHasOwnProperty();
  var uid2 = requireUid();
  var NATIVE_SYMBOL = requireSymbolConstructorDetection();
  var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();
  var Symbol2 = globalThis2.Symbol;
  var WellKnownSymbolsStore = shared2("wks");
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2["for"] || Symbol2 : Symbol2 && Symbol2.withoutSetter || uid2;
  wellKnownSymbol = function(name) {
    if (!hasOwn(WellKnownSymbolsStore, name)) {
      WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol2, name) ? Symbol2[name] : createWellKnownSymbol("Symbol." + name);
    }
    return WellKnownSymbolsStore[name];
  };
  return wellKnownSymbol;
}
var toPrimitive;
var hasRequiredToPrimitive;
function requireToPrimitive() {
  if (hasRequiredToPrimitive) return toPrimitive;
  hasRequiredToPrimitive = 1;
  var call = requireFunctionCall();
  var isObject2 = requireIsObject();
  var isSymbol2 = requireIsSymbol();
  var getMethod2 = requireGetMethod();
  var ordinaryToPrimitive2 = requireOrdinaryToPrimitive();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var $TypeError = TypeError;
  var TO_PRIMITIVE = wellKnownSymbol2("toPrimitive");
  toPrimitive = function(input, pref) {
    if (!isObject2(input) || isSymbol2(input)) return input;
    var exoticToPrim = getMethod2(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === void 0) pref = "default";
      result = call(exoticToPrim, input, pref);
      if (!isObject2(result) || isSymbol2(result)) return result;
      throw new $TypeError("Can't convert object to primitive value");
    }
    if (pref === void 0) pref = "number";
    return ordinaryToPrimitive2(input, pref);
  };
  return toPrimitive;
}
var toPropertyKey;
var hasRequiredToPropertyKey;
function requireToPropertyKey() {
  if (hasRequiredToPropertyKey) return toPropertyKey;
  hasRequiredToPropertyKey = 1;
  var toPrimitive2 = requireToPrimitive();
  var isSymbol2 = requireIsSymbol();
  toPropertyKey = function(argument) {
    var key = toPrimitive2(argument, "string");
    return isSymbol2(key) ? key : key + "";
  };
  return toPropertyKey;
}
var documentCreateElement;
var hasRequiredDocumentCreateElement;
function requireDocumentCreateElement() {
  if (hasRequiredDocumentCreateElement) return documentCreateElement;
  hasRequiredDocumentCreateElement = 1;
  var globalThis2 = requireGlobalThis();
  var isObject2 = requireIsObject();
  var document2 = globalThis2.document;
  var EXISTS = isObject2(document2) && isObject2(document2.createElement);
  documentCreateElement = function(it) {
    return EXISTS ? document2.createElement(it) : {};
  };
  return documentCreateElement;
}
var ie8DomDefine;
var hasRequiredIe8DomDefine;
function requireIe8DomDefine() {
  if (hasRequiredIe8DomDefine) return ie8DomDefine;
  hasRequiredIe8DomDefine = 1;
  var DESCRIPTORS = requireDescriptors();
  var fails2 = requireFails();
  var createElement = requireDocumentCreateElement();
  ie8DomDefine = !DESCRIPTORS && !fails2(function() {
    return Object.defineProperty(createElement("div"), "a", {
      get: function() {
        return 7;
      }
    }).a !== 7;
  });
  return ie8DomDefine;
}
var hasRequiredObjectGetOwnPropertyDescriptor;
function requireObjectGetOwnPropertyDescriptor() {
  if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
  hasRequiredObjectGetOwnPropertyDescriptor = 1;
  var DESCRIPTORS = requireDescriptors();
  var call = requireFunctionCall();
  var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
  var createPropertyDescriptor2 = requireCreatePropertyDescriptor();
  var toIndexedObject2 = requireToIndexedObject();
  var toPropertyKey2 = requireToPropertyKey();
  var hasOwn = requireHasOwnProperty();
  var IE8_DOM_DEFINE = requireIe8DomDefine();
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O2, P) {
    O2 = toIndexedObject2(O2);
    P = toPropertyKey2(P);
    if (IE8_DOM_DEFINE) try {
      return $getOwnPropertyDescriptor(O2, P);
    } catch (error) {
    }
    if (hasOwn(O2, P)) return createPropertyDescriptor2(!call(propertyIsEnumerableModule.f, O2, P), O2[P]);
  };
  return objectGetOwnPropertyDescriptor;
}
var objectDefineProperty = {};
var v8PrototypeDefineBug;
var hasRequiredV8PrototypeDefineBug;
function requireV8PrototypeDefineBug() {
  if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
  hasRequiredV8PrototypeDefineBug = 1;
  var DESCRIPTORS = requireDescriptors();
  var fails2 = requireFails();
  v8PrototypeDefineBug = DESCRIPTORS && fails2(function() {
    return Object.defineProperty(function() {
    }, "prototype", {
      value: 42,
      writable: false
    }).prototype !== 42;
  });
  return v8PrototypeDefineBug;
}
var anObject;
var hasRequiredAnObject;
function requireAnObject() {
  if (hasRequiredAnObject) return anObject;
  hasRequiredAnObject = 1;
  var isObject2 = requireIsObject();
  var $String = String;
  var $TypeError = TypeError;
  anObject = function(argument) {
    if (isObject2(argument)) return argument;
    throw new $TypeError($String(argument) + " is not an object");
  };
  return anObject;
}
var hasRequiredObjectDefineProperty;
function requireObjectDefineProperty() {
  if (hasRequiredObjectDefineProperty) return objectDefineProperty;
  hasRequiredObjectDefineProperty = 1;
  var DESCRIPTORS = requireDescriptors();
  var IE8_DOM_DEFINE = requireIe8DomDefine();
  var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
  var anObject2 = requireAnObject();
  var toPropertyKey2 = requireToPropertyKey();
  var $TypeError = TypeError;
  var $defineProperty = Object.defineProperty;
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var ENUMERABLE = "enumerable";
  var CONFIGURABLE = "configurable";
  var WRITABLE = "writable";
  objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O2, P, Attributes) {
    anObject2(O2);
    P = toPropertyKey2(P);
    anObject2(Attributes);
    if (typeof O2 === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
      var current = $getOwnPropertyDescriptor(O2, P);
      if (current && current[WRITABLE]) {
        O2[P] = Attributes.value;
        Attributes = {
          configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
          enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
          writable: false
        };
      }
    }
    return $defineProperty(O2, P, Attributes);
  } : $defineProperty : function defineProperty(O2, P, Attributes) {
    anObject2(O2);
    P = toPropertyKey2(P);
    anObject2(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O2, P, Attributes);
    } catch (error) {
    }
    if ("get" in Attributes || "set" in Attributes) throw new $TypeError("Accessors not supported");
    if ("value" in Attributes) O2[P] = Attributes.value;
    return O2;
  };
  return objectDefineProperty;
}
var createNonEnumerableProperty;
var hasRequiredCreateNonEnumerableProperty;
function requireCreateNonEnumerableProperty() {
  if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
  hasRequiredCreateNonEnumerableProperty = 1;
  var DESCRIPTORS = requireDescriptors();
  var definePropertyModule = requireObjectDefineProperty();
  var createPropertyDescriptor2 = requireCreatePropertyDescriptor();
  createNonEnumerableProperty = DESCRIPTORS ? function(object, key, value) {
    return definePropertyModule.f(object, key, createPropertyDescriptor2(1, value));
  } : function(object, key, value) {
    object[key] = value;
    return object;
  };
  return createNonEnumerableProperty;
}
var makeBuiltIn = { exports: {} };
var functionName;
var hasRequiredFunctionName;
function requireFunctionName() {
  if (hasRequiredFunctionName) return functionName;
  hasRequiredFunctionName = 1;
  var DESCRIPTORS = requireDescriptors();
  var hasOwn = requireHasOwnProperty();
  var FunctionPrototype = Function.prototype;
  var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
  var EXISTS = hasOwn(FunctionPrototype, "name");
  var PROPER = EXISTS && (function something() {
  }).name === "something";
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS || DESCRIPTORS && getDescriptor(FunctionPrototype, "name").configurable);
  functionName = {
    EXISTS,
    PROPER,
    CONFIGURABLE
  };
  return functionName;
}
var inspectSource;
var hasRequiredInspectSource;
function requireInspectSource() {
  if (hasRequiredInspectSource) return inspectSource;
  hasRequiredInspectSource = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var isCallable2 = requireIsCallable();
  var store = requireSharedStore();
  var functionToString = uncurryThis(Function.toString);
  if (!isCallable2(store.inspectSource)) {
    store.inspectSource = function(it) {
      return functionToString(it);
    };
  }
  inspectSource = store.inspectSource;
  return inspectSource;
}
var weakMapBasicDetection;
var hasRequiredWeakMapBasicDetection;
function requireWeakMapBasicDetection() {
  if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
  hasRequiredWeakMapBasicDetection = 1;
  var globalThis2 = requireGlobalThis();
  var isCallable2 = requireIsCallable();
  var WeakMap = globalThis2.WeakMap;
  weakMapBasicDetection = isCallable2(WeakMap) && /native code/.test(String(WeakMap));
  return weakMapBasicDetection;
}
var sharedKey;
var hasRequiredSharedKey;
function requireSharedKey() {
  if (hasRequiredSharedKey) return sharedKey;
  hasRequiredSharedKey = 1;
  var shared2 = requireShared();
  var uid2 = requireUid();
  var keys = shared2("keys");
  sharedKey = function(key) {
    return keys[key] || (keys[key] = uid2(key));
  };
  return sharedKey;
}
var hiddenKeys;
var hasRequiredHiddenKeys;
function requireHiddenKeys() {
  if (hasRequiredHiddenKeys) return hiddenKeys;
  hasRequiredHiddenKeys = 1;
  hiddenKeys = {};
  return hiddenKeys;
}
var internalState;
var hasRequiredInternalState;
function requireInternalState() {
  if (hasRequiredInternalState) return internalState;
  hasRequiredInternalState = 1;
  var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
  var globalThis2 = requireGlobalThis();
  var isObject2 = requireIsObject();
  var createNonEnumerableProperty2 = requireCreateNonEnumerableProperty();
  var hasOwn = requireHasOwnProperty();
  var shared2 = requireSharedStore();
  var sharedKey2 = requireSharedKey();
  var hiddenKeys2 = requireHiddenKeys();
  var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
  var TypeError2 = globalThis2.TypeError;
  var WeakMap = globalThis2.WeakMap;
  var set, get, has;
  var enforce = function(it) {
    return has(it) ? get(it) : set(it, {});
  };
  var getterFor = function(TYPE) {
    return function(it) {
      var state;
      if (!isObject2(it) || (state = get(it)).type !== TYPE) {
        throw new TypeError2("Incompatible receiver, " + TYPE + " required");
      }
      return state;
    };
  };
  if (NATIVE_WEAK_MAP || shared2.state) {
    var store = shared2.state || (shared2.state = new WeakMap());
    store.get = store.get;
    store.has = store.has;
    store.set = store.set;
    set = function(it, metadata) {
      if (store.has(it)) throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      store.set(it, metadata);
      return metadata;
    };
    get = function(it) {
      return store.get(it) || {};
    };
    has = function(it) {
      return store.has(it);
    };
  } else {
    var STATE = sharedKey2("state");
    hiddenKeys2[STATE] = true;
    set = function(it, metadata) {
      if (hasOwn(it, STATE)) throw new TypeError2(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty2(it, STATE, metadata);
      return metadata;
    };
    get = function(it) {
      return hasOwn(it, STATE) ? it[STATE] : {};
    };
    has = function(it) {
      return hasOwn(it, STATE);
    };
  }
  internalState = {
    set,
    get,
    has,
    enforce,
    getterFor
  };
  return internalState;
}
var hasRequiredMakeBuiltIn;
function requireMakeBuiltIn() {
  if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
  hasRequiredMakeBuiltIn = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var fails2 = requireFails();
  var isCallable2 = requireIsCallable();
  var hasOwn = requireHasOwnProperty();
  var DESCRIPTORS = requireDescriptors();
  var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
  var inspectSource2 = requireInspectSource();
  var InternalStateModule = requireInternalState();
  var enforceInternalState = InternalStateModule.enforce;
  var getInternalState = InternalStateModule.get;
  var $String = String;
  var defineProperty = Object.defineProperty;
  var stringSlice = uncurryThis("".slice);
  var replace = uncurryThis("".replace);
  var join = uncurryThis([].join);
  var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails2(function() {
    return defineProperty(function() {
    }, "length", { value: 8 }).length !== 8;
  });
  var TEMPLATE = String(String).split("String");
  var makeBuiltIn$1 = makeBuiltIn.exports = function(value, name, options) {
    if (stringSlice($String(name), 0, 7) === "Symbol(") {
      name = "[" + replace($String(name), /^Symbol\(([^)]*)\).*$/, "$1") + "]";
    }
    if (options && options.getter) name = "get " + name;
    if (options && options.setter) name = "set " + name;
    if (!hasOwn(value, "name") || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
      if (DESCRIPTORS) defineProperty(value, "name", { value: name, configurable: true });
      else value.name = name;
    }
    if (CONFIGURABLE_LENGTH && options && hasOwn(options, "arity") && value.length !== options.arity) {
      defineProperty(value, "length", { value: options.arity });
    }
    try {
      if (options && hasOwn(options, "constructor") && options.constructor) {
        if (DESCRIPTORS) defineProperty(value, "prototype", { writable: false });
      } else if (value.prototype) value.prototype = void 0;
    } catch (error) {
    }
    var state = enforceInternalState(value);
    if (!hasOwn(state, "source")) {
      state.source = join(TEMPLATE, typeof name == "string" ? name : "");
    }
    return value;
  };
  Function.prototype.toString = makeBuiltIn$1(function toString2() {
    return isCallable2(this) && getInternalState(this).source || inspectSource2(this);
  }, "toString");
  return makeBuiltIn.exports;
}
var defineBuiltIn;
var hasRequiredDefineBuiltIn;
function requireDefineBuiltIn() {
  if (hasRequiredDefineBuiltIn) return defineBuiltIn;
  hasRequiredDefineBuiltIn = 1;
  var isCallable2 = requireIsCallable();
  var definePropertyModule = requireObjectDefineProperty();
  var makeBuiltIn2 = requireMakeBuiltIn();
  var defineGlobalProperty2 = requireDefineGlobalProperty();
  defineBuiltIn = function(O2, key, value, options) {
    if (!options) options = {};
    var simple = options.enumerable;
    var name = options.name !== void 0 ? options.name : key;
    if (isCallable2(value)) makeBuiltIn2(value, name, options);
    if (options.global) {
      if (simple) O2[key] = value;
      else defineGlobalProperty2(key, value);
    } else {
      try {
        if (!options.unsafe) delete O2[key];
        else if (O2[key]) simple = true;
      } catch (error) {
      }
      if (simple) O2[key] = value;
      else definePropertyModule.f(O2, key, {
        value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
    }
    return O2;
  };
  return defineBuiltIn;
}
var objectGetOwnPropertyNames = {};
var mathTrunc;
var hasRequiredMathTrunc;
function requireMathTrunc() {
  if (hasRequiredMathTrunc) return mathTrunc;
  hasRequiredMathTrunc = 1;
  var ceil = Math.ceil;
  var floor = Math.floor;
  mathTrunc = Math.trunc || function trunc(x) {
    var n2 = +x;
    return (n2 > 0 ? floor : ceil)(n2);
  };
  return mathTrunc;
}
var toIntegerOrInfinity;
var hasRequiredToIntegerOrInfinity;
function requireToIntegerOrInfinity() {
  if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
  hasRequiredToIntegerOrInfinity = 1;
  var trunc = requireMathTrunc();
  toIntegerOrInfinity = function(argument) {
    var number = +argument;
    return number !== number || number === 0 ? 0 : trunc(number);
  };
  return toIntegerOrInfinity;
}
var toAbsoluteIndex;
var hasRequiredToAbsoluteIndex;
function requireToAbsoluteIndex() {
  if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
  hasRequiredToAbsoluteIndex = 1;
  var toIntegerOrInfinity2 = requireToIntegerOrInfinity();
  var max = Math.max;
  var min = Math.min;
  toAbsoluteIndex = function(index2, length) {
    var integer = toIntegerOrInfinity2(index2);
    return integer < 0 ? max(integer + length, 0) : min(integer, length);
  };
  return toAbsoluteIndex;
}
var toLength;
var hasRequiredToLength;
function requireToLength() {
  if (hasRequiredToLength) return toLength;
  hasRequiredToLength = 1;
  var toIntegerOrInfinity2 = requireToIntegerOrInfinity();
  var min = Math.min;
  toLength = function(argument) {
    var len = toIntegerOrInfinity2(argument);
    return len > 0 ? min(len, 9007199254740991) : 0;
  };
  return toLength;
}
var lengthOfArrayLike;
var hasRequiredLengthOfArrayLike;
function requireLengthOfArrayLike() {
  if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
  hasRequiredLengthOfArrayLike = 1;
  var toLength2 = requireToLength();
  lengthOfArrayLike = function(obj) {
    return toLength2(obj.length);
  };
  return lengthOfArrayLike;
}
var arrayIncludes;
var hasRequiredArrayIncludes;
function requireArrayIncludes() {
  if (hasRequiredArrayIncludes) return arrayIncludes;
  hasRequiredArrayIncludes = 1;
  var toIndexedObject2 = requireToIndexedObject();
  var toAbsoluteIndex2 = requireToAbsoluteIndex();
  var lengthOfArrayLike2 = requireLengthOfArrayLike();
  var createMethod = function(IS_INCLUDES) {
    return function($this, el, fromIndex) {
      var O2 = toIndexedObject2($this);
      var length = lengthOfArrayLike2(O2);
      if (length === 0) return !IS_INCLUDES && -1;
      var index2 = toAbsoluteIndex2(fromIndex, length);
      var value;
      if (IS_INCLUDES && el !== el) while (length > index2) {
        value = O2[index2++];
        if (value !== value) return true;
      }
      else for (; length > index2; index2++) {
        if ((IS_INCLUDES || index2 in O2) && O2[index2] === el) return IS_INCLUDES || index2 || 0;
      }
      return !IS_INCLUDES && -1;
    };
  };
  arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };
  return arrayIncludes;
}
var objectKeysInternal;
var hasRequiredObjectKeysInternal;
function requireObjectKeysInternal() {
  if (hasRequiredObjectKeysInternal) return objectKeysInternal;
  hasRequiredObjectKeysInternal = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var hasOwn = requireHasOwnProperty();
  var toIndexedObject2 = requireToIndexedObject();
  var indexOf = requireArrayIncludes().indexOf;
  var hiddenKeys2 = requireHiddenKeys();
  var push = uncurryThis([].push);
  objectKeysInternal = function(object, names) {
    var O2 = toIndexedObject2(object);
    var i2 = 0;
    var result = [];
    var key;
    for (key in O2) !hasOwn(hiddenKeys2, key) && hasOwn(O2, key) && push(result, key);
    while (names.length > i2) if (hasOwn(O2, key = names[i2++])) {
      ~indexOf(result, key) || push(result, key);
    }
    return result;
  };
  return objectKeysInternal;
}
var enumBugKeys;
var hasRequiredEnumBugKeys;
function requireEnumBugKeys() {
  if (hasRequiredEnumBugKeys) return enumBugKeys;
  hasRequiredEnumBugKeys = 1;
  enumBugKeys = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toLocaleString",
    "toString",
    "valueOf"
  ];
  return enumBugKeys;
}
var hasRequiredObjectGetOwnPropertyNames;
function requireObjectGetOwnPropertyNames() {
  if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
  hasRequiredObjectGetOwnPropertyNames = 1;
  var internalObjectKeys = requireObjectKeysInternal();
  var enumBugKeys2 = requireEnumBugKeys();
  var hiddenKeys2 = enumBugKeys2.concat("length", "prototype");
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O2) {
    return internalObjectKeys(O2, hiddenKeys2);
  };
  return objectGetOwnPropertyNames;
}
var objectGetOwnPropertySymbols = {};
var hasRequiredObjectGetOwnPropertySymbols;
function requireObjectGetOwnPropertySymbols() {
  if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
  hasRequiredObjectGetOwnPropertySymbols = 1;
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
  return objectGetOwnPropertySymbols;
}
var ownKeys$3;
var hasRequiredOwnKeys;
function requireOwnKeys() {
  if (hasRequiredOwnKeys) return ownKeys$3;
  hasRequiredOwnKeys = 1;
  var getBuiltIn2 = requireGetBuiltIn();
  var uncurryThis = requireFunctionUncurryThis();
  var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
  var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
  var anObject2 = requireAnObject();
  var concat = uncurryThis([].concat);
  ownKeys$3 = getBuiltIn2("Reflect", "ownKeys") || function ownKeys2(it) {
    var keys = getOwnPropertyNamesModule.f(anObject2(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
  };
  return ownKeys$3;
}
var copyConstructorProperties;
var hasRequiredCopyConstructorProperties;
function requireCopyConstructorProperties() {
  if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
  hasRequiredCopyConstructorProperties = 1;
  var hasOwn = requireHasOwnProperty();
  var ownKeys2 = requireOwnKeys();
  var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
  var definePropertyModule = requireObjectDefineProperty();
  copyConstructorProperties = function(target, source, exceptions) {
    var keys = ownKeys2(source);
    var defineProperty = definePropertyModule.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i2 = 0; i2 < keys.length; i2++) {
      var key = keys[i2];
      if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
        defineProperty(target, key, getOwnPropertyDescriptor(source, key));
      }
    }
  };
  return copyConstructorProperties;
}
var isForced_1;
var hasRequiredIsForced;
function requireIsForced() {
  if (hasRequiredIsForced) return isForced_1;
  hasRequiredIsForced = 1;
  var fails2 = requireFails();
  var isCallable2 = requireIsCallable();
  var replacement = /#|\.prototype\./;
  var isForced = function(feature, detection) {
    var value = data[normalize(feature)];
    return value === POLYFILL ? true : value === NATIVE ? false : isCallable2(detection) ? fails2(detection) : !!detection;
  };
  var normalize = isForced.normalize = function(string) {
    return String(string).replace(replacement, ".").toLowerCase();
  };
  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = "N";
  var POLYFILL = isForced.POLYFILL = "P";
  isForced_1 = isForced;
  return isForced_1;
}
var _export;
var hasRequired_export;
function require_export() {
  if (hasRequired_export) return _export;
  hasRequired_export = 1;
  var globalThis2 = requireGlobalThis();
  var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
  var createNonEnumerableProperty2 = requireCreateNonEnumerableProperty();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var defineGlobalProperty2 = requireDefineGlobalProperty();
  var copyConstructorProperties2 = requireCopyConstructorProperties();
  var isForced = requireIsForced();
  _export = function(options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = globalThis2;
    } else if (STATIC) {
      target = globalThis2[TARGET] || defineGlobalProperty2(TARGET, {});
    } else {
      target = globalThis2[TARGET] && globalThis2[TARGET].prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
      if (!FORCED && targetProperty !== void 0) {
        if (typeof sourceProperty == typeof targetProperty) continue;
        copyConstructorProperties2(sourceProperty, targetProperty);
      }
      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty2(sourceProperty, "sham", true);
      }
      defineBuiltIn2(target, key, sourceProperty, options);
    }
  };
  return _export;
}
var environment;
var hasRequiredEnvironment;
function requireEnvironment() {
  if (hasRequiredEnvironment) return environment;
  hasRequiredEnvironment = 1;
  var globalThis2 = requireGlobalThis();
  var userAgent = requireEnvironmentUserAgent();
  var classof2 = requireClassofRaw();
  var userAgentStartsWith = function(string) {
    return userAgent.slice(0, string.length) === string;
  };
  environment = (function() {
    if (userAgentStartsWith("Bun/")) return "BUN";
    if (userAgentStartsWith("Cloudflare-Workers")) return "CLOUDFLARE";
    if (userAgentStartsWith("Deno/")) return "DENO";
    if (userAgentStartsWith("Node.js/")) return "NODE";
    if (globalThis2.Bun && typeof Bun.version == "string") return "BUN";
    if (globalThis2.Deno && typeof Deno.version == "object") return "DENO";
    if (classof2(globalThis2.process) === "process") return "NODE";
    if (globalThis2.window && globalThis2.document) return "BROWSER";
    return "REST";
  })();
  return environment;
}
var environmentIsNode;
var hasRequiredEnvironmentIsNode;
function requireEnvironmentIsNode() {
  if (hasRequiredEnvironmentIsNode) return environmentIsNode;
  hasRequiredEnvironmentIsNode = 1;
  var ENVIRONMENT = requireEnvironment();
  environmentIsNode = ENVIRONMENT === "NODE";
  return environmentIsNode;
}
var path;
var hasRequiredPath;
function requirePath() {
  if (hasRequiredPath) return path;
  hasRequiredPath = 1;
  var globalThis2 = requireGlobalThis();
  path = globalThis2;
  return path;
}
var functionUncurryThisAccessor;
var hasRequiredFunctionUncurryThisAccessor;
function requireFunctionUncurryThisAccessor() {
  if (hasRequiredFunctionUncurryThisAccessor) return functionUncurryThisAccessor;
  hasRequiredFunctionUncurryThisAccessor = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var aCallable2 = requireACallable();
  functionUncurryThisAccessor = function(object, key, method) {
    try {
      return uncurryThis(aCallable2(Object.getOwnPropertyDescriptor(object, key)[method]));
    } catch (error) {
    }
  };
  return functionUncurryThisAccessor;
}
var isPossiblePrototype;
var hasRequiredIsPossiblePrototype;
function requireIsPossiblePrototype() {
  if (hasRequiredIsPossiblePrototype) return isPossiblePrototype;
  hasRequiredIsPossiblePrototype = 1;
  var isObject2 = requireIsObject();
  isPossiblePrototype = function(argument) {
    return isObject2(argument) || argument === null;
  };
  return isPossiblePrototype;
}
var aPossiblePrototype;
var hasRequiredAPossiblePrototype;
function requireAPossiblePrototype() {
  if (hasRequiredAPossiblePrototype) return aPossiblePrototype;
  hasRequiredAPossiblePrototype = 1;
  var isPossiblePrototype2 = requireIsPossiblePrototype();
  var $String = String;
  var $TypeError = TypeError;
  aPossiblePrototype = function(argument) {
    if (isPossiblePrototype2(argument)) return argument;
    throw new $TypeError("Can't set " + $String(argument) + " as a prototype");
  };
  return aPossiblePrototype;
}
var objectSetPrototypeOf;
var hasRequiredObjectSetPrototypeOf;
function requireObjectSetPrototypeOf() {
  if (hasRequiredObjectSetPrototypeOf) return objectSetPrototypeOf;
  hasRequiredObjectSetPrototypeOf = 1;
  var uncurryThisAccessor = requireFunctionUncurryThisAccessor();
  var isObject2 = requireIsObject();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var aPossiblePrototype2 = requireAPossiblePrototype();
  objectSetPrototypeOf = Object.setPrototypeOf || ("__proto__" in {} ? (function() {
    var CORRECT_SETTER = false;
    var test = {};
    var setter;
    try {
      setter = uncurryThisAccessor(Object.prototype, "__proto__", "set");
      setter(test, []);
      CORRECT_SETTER = test instanceof Array;
    } catch (error) {
    }
    return function setPrototypeOf(O2, proto) {
      requireObjectCoercible2(O2);
      aPossiblePrototype2(proto);
      if (!isObject2(O2)) return O2;
      if (CORRECT_SETTER) setter(O2, proto);
      else O2.__proto__ = proto;
      return O2;
    };
  })() : void 0);
  return objectSetPrototypeOf;
}
var setToStringTag;
var hasRequiredSetToStringTag;
function requireSetToStringTag() {
  if (hasRequiredSetToStringTag) return setToStringTag;
  hasRequiredSetToStringTag = 1;
  var defineProperty = requireObjectDefineProperty().f;
  var hasOwn = requireHasOwnProperty();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var TO_STRING_TAG = wellKnownSymbol2("toStringTag");
  setToStringTag = function(target, TAG, STATIC) {
    if (target && !STATIC) target = target.prototype;
    if (target && !hasOwn(target, TO_STRING_TAG)) {
      defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
    }
  };
  return setToStringTag;
}
var defineBuiltInAccessor;
var hasRequiredDefineBuiltInAccessor;
function requireDefineBuiltInAccessor() {
  if (hasRequiredDefineBuiltInAccessor) return defineBuiltInAccessor;
  hasRequiredDefineBuiltInAccessor = 1;
  var makeBuiltIn2 = requireMakeBuiltIn();
  var defineProperty = requireObjectDefineProperty();
  defineBuiltInAccessor = function(target, name, descriptor) {
    if (descriptor.get) makeBuiltIn2(descriptor.get, name, { getter: true });
    if (descriptor.set) makeBuiltIn2(descriptor.set, name, { setter: true });
    return defineProperty.f(target, name, descriptor);
  };
  return defineBuiltInAccessor;
}
var setSpecies;
var hasRequiredSetSpecies;
function requireSetSpecies() {
  if (hasRequiredSetSpecies) return setSpecies;
  hasRequiredSetSpecies = 1;
  var getBuiltIn2 = requireGetBuiltIn();
  var defineBuiltInAccessor2 = requireDefineBuiltInAccessor();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var DESCRIPTORS = requireDescriptors();
  var SPECIES = wellKnownSymbol2("species");
  setSpecies = function(CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn2(CONSTRUCTOR_NAME);
    if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
      defineBuiltInAccessor2(Constructor, SPECIES, {
        configurable: true,
        get: function() {
          return this;
        }
      });
    }
  };
  return setSpecies;
}
var anInstance;
var hasRequiredAnInstance;
function requireAnInstance() {
  if (hasRequiredAnInstance) return anInstance;
  hasRequiredAnInstance = 1;
  var isPrototypeOf = requireObjectIsPrototypeOf();
  var $TypeError = TypeError;
  anInstance = function(it, Prototype) {
    if (isPrototypeOf(Prototype, it)) return it;
    throw new $TypeError("Incorrect invocation");
  };
  return anInstance;
}
var toStringTagSupport;
var hasRequiredToStringTagSupport;
function requireToStringTagSupport() {
  if (hasRequiredToStringTagSupport) return toStringTagSupport;
  hasRequiredToStringTagSupport = 1;
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var TO_STRING_TAG = wellKnownSymbol2("toStringTag");
  var test = {};
  test[TO_STRING_TAG] = "z";
  toStringTagSupport = String(test) === "[object z]";
  return toStringTagSupport;
}
var classof;
var hasRequiredClassof;
function requireClassof() {
  if (hasRequiredClassof) return classof;
  hasRequiredClassof = 1;
  var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
  var isCallable2 = requireIsCallable();
  var classofRaw2 = requireClassofRaw();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var TO_STRING_TAG = wellKnownSymbol2("toStringTag");
  var $Object = Object;
  var CORRECT_ARGUMENTS = classofRaw2(/* @__PURE__ */ (function() {
    return arguments;
  })()) === "Arguments";
  var tryGet = function(it, key) {
    try {
      return it[key];
    } catch (error) {
    }
  };
  classof = TO_STRING_TAG_SUPPORT ? classofRaw2 : function(it) {
    var O2, tag, result;
    return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O2 = $Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw2(O2) : (result = classofRaw2(O2)) === "Object" && isCallable2(O2.callee) ? "Arguments" : result;
  };
  return classof;
}
var isConstructor;
var hasRequiredIsConstructor;
function requireIsConstructor() {
  if (hasRequiredIsConstructor) return isConstructor;
  hasRequiredIsConstructor = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var fails2 = requireFails();
  var isCallable2 = requireIsCallable();
  var classof2 = requireClassof();
  var getBuiltIn2 = requireGetBuiltIn();
  var inspectSource2 = requireInspectSource();
  var noop2 = function() {
  };
  var construct = getBuiltIn2("Reflect", "construct");
  var constructorRegExp = /^\s*(?:class|function)\b/;
  var exec = uncurryThis(constructorRegExp.exec);
  var INCORRECT_TO_STRING = !constructorRegExp.test(noop2);
  var isConstructorModern = function isConstructor2(argument) {
    if (!isCallable2(argument)) return false;
    try {
      construct(noop2, [], argument);
      return true;
    } catch (error) {
      return false;
    }
  };
  var isConstructorLegacy = function isConstructor2(argument) {
    if (!isCallable2(argument)) return false;
    switch (classof2(argument)) {
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return false;
    }
    try {
      return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource2(argument));
    } catch (error) {
      return true;
    }
  };
  isConstructorLegacy.sham = true;
  isConstructor = !construct || fails2(function() {
    var called;
    return isConstructorModern(isConstructorModern.call) || !isConstructorModern(Object) || !isConstructorModern(function() {
      called = true;
    }) || called;
  }) ? isConstructorLegacy : isConstructorModern;
  return isConstructor;
}
var aConstructor;
var hasRequiredAConstructor;
function requireAConstructor() {
  if (hasRequiredAConstructor) return aConstructor;
  hasRequiredAConstructor = 1;
  var isConstructor2 = requireIsConstructor();
  var tryToString2 = requireTryToString();
  var $TypeError = TypeError;
  aConstructor = function(argument) {
    if (isConstructor2(argument)) return argument;
    throw new $TypeError(tryToString2(argument) + " is not a constructor");
  };
  return aConstructor;
}
var speciesConstructor;
var hasRequiredSpeciesConstructor;
function requireSpeciesConstructor() {
  if (hasRequiredSpeciesConstructor) return speciesConstructor;
  hasRequiredSpeciesConstructor = 1;
  var anObject2 = requireAnObject();
  var aConstructor2 = requireAConstructor();
  var isNullOrUndefined2 = requireIsNullOrUndefined();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var SPECIES = wellKnownSymbol2("species");
  speciesConstructor = function(O2, defaultConstructor) {
    var C = anObject2(O2).constructor;
    var S;
    return C === void 0 || isNullOrUndefined2(S = anObject2(C)[SPECIES]) ? defaultConstructor : aConstructor2(S);
  };
  return speciesConstructor;
}
var functionApply;
var hasRequiredFunctionApply;
function requireFunctionApply() {
  if (hasRequiredFunctionApply) return functionApply;
  hasRequiredFunctionApply = 1;
  var NATIVE_BIND = requireFunctionBindNative();
  var FunctionPrototype = Function.prototype;
  var apply = FunctionPrototype.apply;
  var call = FunctionPrototype.call;
  functionApply = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function() {
    return call.apply(apply, arguments);
  });
  return functionApply;
}
var functionUncurryThisClause;
var hasRequiredFunctionUncurryThisClause;
function requireFunctionUncurryThisClause() {
  if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
  hasRequiredFunctionUncurryThisClause = 1;
  var classofRaw2 = requireClassofRaw();
  var uncurryThis = requireFunctionUncurryThis();
  functionUncurryThisClause = function(fn) {
    if (classofRaw2(fn) === "Function") return uncurryThis(fn);
  };
  return functionUncurryThisClause;
}
var functionBindContext;
var hasRequiredFunctionBindContext;
function requireFunctionBindContext() {
  if (hasRequiredFunctionBindContext) return functionBindContext;
  hasRequiredFunctionBindContext = 1;
  var uncurryThis = requireFunctionUncurryThisClause();
  var aCallable2 = requireACallable();
  var NATIVE_BIND = requireFunctionBindNative();
  var bind = uncurryThis(uncurryThis.bind);
  functionBindContext = function(fn, that) {
    aCallable2(fn);
    return that === void 0 ? fn : NATIVE_BIND ? bind(fn, that) : function() {
      return fn.apply(that, arguments);
    };
  };
  return functionBindContext;
}
var html;
var hasRequiredHtml;
function requireHtml() {
  if (hasRequiredHtml) return html;
  hasRequiredHtml = 1;
  var getBuiltIn2 = requireGetBuiltIn();
  html = getBuiltIn2("document", "documentElement");
  return html;
}
var arraySlice;
var hasRequiredArraySlice;
function requireArraySlice() {
  if (hasRequiredArraySlice) return arraySlice;
  hasRequiredArraySlice = 1;
  var uncurryThis = requireFunctionUncurryThis();
  arraySlice = uncurryThis([].slice);
  return arraySlice;
}
var validateArgumentsLength;
var hasRequiredValidateArgumentsLength;
function requireValidateArgumentsLength() {
  if (hasRequiredValidateArgumentsLength) return validateArgumentsLength;
  hasRequiredValidateArgumentsLength = 1;
  var $TypeError = TypeError;
  validateArgumentsLength = function(passed, required) {
    if (passed < required) throw new $TypeError("Not enough arguments");
    return passed;
  };
  return validateArgumentsLength;
}
var environmentIsIos;
var hasRequiredEnvironmentIsIos;
function requireEnvironmentIsIos() {
  if (hasRequiredEnvironmentIsIos) return environmentIsIos;
  hasRequiredEnvironmentIsIos = 1;
  var userAgent = requireEnvironmentUserAgent();
  environmentIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);
  return environmentIsIos;
}
var task;
var hasRequiredTask;
function requireTask() {
  if (hasRequiredTask) return task;
  hasRequiredTask = 1;
  var globalThis2 = requireGlobalThis();
  var apply = requireFunctionApply();
  var bind = requireFunctionBindContext();
  var isCallable2 = requireIsCallable();
  var hasOwn = requireHasOwnProperty();
  var fails2 = requireFails();
  var html2 = requireHtml();
  var arraySlice2 = requireArraySlice();
  var createElement = requireDocumentCreateElement();
  var validateArgumentsLength2 = requireValidateArgumentsLength();
  var IS_IOS = requireEnvironmentIsIos();
  var IS_NODE = requireEnvironmentIsNode();
  var set = globalThis2.setImmediate;
  var clear = globalThis2.clearImmediate;
  var process2 = globalThis2.process;
  var Dispatch = globalThis2.Dispatch;
  var Function2 = globalThis2.Function;
  var MessageChannel = globalThis2.MessageChannel;
  var String2 = globalThis2.String;
  var counter = 0;
  var queue2 = {};
  var ONREADYSTATECHANGE = "onreadystatechange";
  var $location, defer, channel, port;
  fails2(function() {
    $location = globalThis2.location;
  });
  var run = function(id) {
    if (hasOwn(queue2, id)) {
      var fn = queue2[id];
      delete queue2[id];
      fn();
    }
  };
  var runner = function(id) {
    return function() {
      run(id);
    };
  };
  var eventListener = function(event) {
    run(event.data);
  };
  var globalPostMessageDefer = function(id) {
    globalThis2.postMessage(String2(id), $location.protocol + "//" + $location.host);
  };
  if (!set || !clear) {
    set = function setImmediate(handler) {
      validateArgumentsLength2(arguments.length, 1);
      var fn = isCallable2(handler) ? handler : Function2(handler);
      var args = arraySlice2(arguments, 1);
      queue2[++counter] = function() {
        apply(fn, void 0, args);
      };
      defer(counter);
      return counter;
    };
    clear = function clearImmediate(id) {
      delete queue2[id];
    };
    if (IS_NODE) {
      defer = function(id) {
        process2.nextTick(runner(id));
      };
    } else if (Dispatch && Dispatch.now) {
      defer = function(id) {
        Dispatch.now(runner(id));
      };
    } else if (MessageChannel && !IS_IOS) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = eventListener;
      defer = bind(port.postMessage, port);
    } else if (globalThis2.addEventListener && isCallable2(globalThis2.postMessage) && !globalThis2.importScripts && $location && $location.protocol !== "file:" && !fails2(globalPostMessageDefer)) {
      defer = globalPostMessageDefer;
      globalThis2.addEventListener("message", eventListener, false);
    } else if (ONREADYSTATECHANGE in createElement("script")) {
      defer = function(id) {
        html2.appendChild(createElement("script"))[ONREADYSTATECHANGE] = function() {
          html2.removeChild(this);
          run(id);
        };
      };
    } else {
      defer = function(id) {
        setTimeout(runner(id), 0);
      };
    }
  }
  task = {
    set,
    clear
  };
  return task;
}
var safeGetBuiltIn;
var hasRequiredSafeGetBuiltIn;
function requireSafeGetBuiltIn() {
  if (hasRequiredSafeGetBuiltIn) return safeGetBuiltIn;
  hasRequiredSafeGetBuiltIn = 1;
  var globalThis2 = requireGlobalThis();
  var DESCRIPTORS = requireDescriptors();
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  safeGetBuiltIn = function(name) {
    if (!DESCRIPTORS) return globalThis2[name];
    var descriptor = getOwnPropertyDescriptor(globalThis2, name);
    return descriptor && descriptor.value;
  };
  return safeGetBuiltIn;
}
var queue;
var hasRequiredQueue;
function requireQueue() {
  if (hasRequiredQueue) return queue;
  hasRequiredQueue = 1;
  var Queue = function() {
    this.head = null;
    this.tail = null;
  };
  Queue.prototype = {
    add: function(item) {
      var entry = { item, next: null };
      var tail = this.tail;
      if (tail) tail.next = entry;
      else this.head = entry;
      this.tail = entry;
    },
    get: function() {
      var entry = this.head;
      if (entry) {
        var next = this.head = entry.next;
        if (next === null) this.tail = null;
        return entry.item;
      }
    }
  };
  queue = Queue;
  return queue;
}
var environmentIsIosPebble;
var hasRequiredEnvironmentIsIosPebble;
function requireEnvironmentIsIosPebble() {
  if (hasRequiredEnvironmentIsIosPebble) return environmentIsIosPebble;
  hasRequiredEnvironmentIsIosPebble = 1;
  var userAgent = requireEnvironmentUserAgent();
  environmentIsIosPebble = /ipad|iphone|ipod/i.test(userAgent) && typeof Pebble != "undefined";
  return environmentIsIosPebble;
}
var environmentIsWebosWebkit;
var hasRequiredEnvironmentIsWebosWebkit;
function requireEnvironmentIsWebosWebkit() {
  if (hasRequiredEnvironmentIsWebosWebkit) return environmentIsWebosWebkit;
  hasRequiredEnvironmentIsWebosWebkit = 1;
  var userAgent = requireEnvironmentUserAgent();
  environmentIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);
  return environmentIsWebosWebkit;
}
var microtask_1;
var hasRequiredMicrotask;
function requireMicrotask() {
  if (hasRequiredMicrotask) return microtask_1;
  hasRequiredMicrotask = 1;
  var globalThis2 = requireGlobalThis();
  var safeGetBuiltIn2 = requireSafeGetBuiltIn();
  var bind = requireFunctionBindContext();
  var macrotask = requireTask().set;
  var Queue = requireQueue();
  var IS_IOS = requireEnvironmentIsIos();
  var IS_IOS_PEBBLE = requireEnvironmentIsIosPebble();
  var IS_WEBOS_WEBKIT = requireEnvironmentIsWebosWebkit();
  var IS_NODE = requireEnvironmentIsNode();
  var MutationObserver = globalThis2.MutationObserver || globalThis2.WebKitMutationObserver;
  var document2 = globalThis2.document;
  var process2 = globalThis2.process;
  var Promise2 = globalThis2.Promise;
  var microtask = safeGetBuiltIn2("queueMicrotask");
  var notify, toggle, node2, promise, then;
  if (!microtask) {
    var queue2 = new Queue();
    var flush = function() {
      var parent, fn;
      if (IS_NODE && (parent = process2.domain)) parent.exit();
      while (fn = queue2.get()) try {
        fn();
      } catch (error) {
        if (queue2.head) notify();
        throw error;
      }
      if (parent) parent.enter();
    };
    if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document2) {
      toggle = true;
      node2 = document2.createTextNode("");
      new MutationObserver(flush).observe(node2, { characterData: true });
      notify = function() {
        node2.data = toggle = !toggle;
      };
    } else if (!IS_IOS_PEBBLE && Promise2 && Promise2.resolve) {
      promise = Promise2.resolve(void 0);
      promise.constructor = Promise2;
      then = bind(promise.then, promise);
      notify = function() {
        then(flush);
      };
    } else if (IS_NODE) {
      notify = function() {
        process2.nextTick(flush);
      };
    } else {
      macrotask = bind(macrotask, globalThis2);
      notify = function() {
        macrotask(flush);
      };
    }
    microtask = function(fn) {
      if (!queue2.head) notify();
      queue2.add(fn);
    };
  }
  microtask_1 = microtask;
  return microtask_1;
}
var hostReportErrors;
var hasRequiredHostReportErrors;
function requireHostReportErrors() {
  if (hasRequiredHostReportErrors) return hostReportErrors;
  hasRequiredHostReportErrors = 1;
  hostReportErrors = function(a2, b) {
    try {
      arguments.length === 1 ? console.error(a2) : console.error(a2, b);
    } catch (error) {
    }
  };
  return hostReportErrors;
}
var perform;
var hasRequiredPerform;
function requirePerform() {
  if (hasRequiredPerform) return perform;
  hasRequiredPerform = 1;
  perform = function(exec) {
    try {
      return { error: false, value: exec() };
    } catch (error) {
      return { error: true, value: error };
    }
  };
  return perform;
}
var promiseNativeConstructor;
var hasRequiredPromiseNativeConstructor;
function requirePromiseNativeConstructor() {
  if (hasRequiredPromiseNativeConstructor) return promiseNativeConstructor;
  hasRequiredPromiseNativeConstructor = 1;
  var globalThis2 = requireGlobalThis();
  promiseNativeConstructor = globalThis2.Promise;
  return promiseNativeConstructor;
}
var promiseConstructorDetection;
var hasRequiredPromiseConstructorDetection;
function requirePromiseConstructorDetection() {
  if (hasRequiredPromiseConstructorDetection) return promiseConstructorDetection;
  hasRequiredPromiseConstructorDetection = 1;
  var globalThis2 = requireGlobalThis();
  var NativePromiseConstructor = requirePromiseNativeConstructor();
  var isCallable2 = requireIsCallable();
  var isForced = requireIsForced();
  var inspectSource2 = requireInspectSource();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var ENVIRONMENT = requireEnvironment();
  var IS_PURE = requireIsPure();
  var V8_VERSION = requireEnvironmentV8Version();
  var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
  var SPECIES = wellKnownSymbol2("species");
  var SUBCLASSING = false;
  var NATIVE_PROMISE_REJECTION_EVENT = isCallable2(globalThis2.PromiseRejectionEvent);
  var FORCED_PROMISE_CONSTRUCTOR = isForced("Promise", function() {
    var PROMISE_CONSTRUCTOR_SOURCE = inspectSource2(NativePromiseConstructor);
    var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor);
    if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
    if (IS_PURE && !(NativePromisePrototype["catch"] && NativePromisePrototype["finally"])) return true;
    if (!V8_VERSION || V8_VERSION < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
      var promise = new NativePromiseConstructor(function(resolve) {
        resolve(1);
      });
      var FakePromise = function(exec) {
        exec(function() {
        }, function() {
        });
      };
      var constructor = promise.constructor = {};
      constructor[SPECIES] = FakePromise;
      SUBCLASSING = promise.then(function() {
      }) instanceof FakePromise;
      if (!SUBCLASSING) return true;
    }
    return !GLOBAL_CORE_JS_PROMISE && (ENVIRONMENT === "BROWSER" || ENVIRONMENT === "DENO") && !NATIVE_PROMISE_REJECTION_EVENT;
  });
  promiseConstructorDetection = {
    CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
    REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
    SUBCLASSING
  };
  return promiseConstructorDetection;
}
var newPromiseCapability = {};
var hasRequiredNewPromiseCapability;
function requireNewPromiseCapability() {
  if (hasRequiredNewPromiseCapability) return newPromiseCapability;
  hasRequiredNewPromiseCapability = 1;
  var aCallable2 = requireACallable();
  var $TypeError = TypeError;
  var PromiseCapability = function(C) {
    var resolve, reject;
    this.promise = new C(function($$resolve, $$reject) {
      if (resolve !== void 0 || reject !== void 0) throw new $TypeError("Bad Promise constructor");
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = aCallable2(resolve);
    this.reject = aCallable2(reject);
  };
  newPromiseCapability.f = function(C) {
    return new PromiseCapability(C);
  };
  return newPromiseCapability;
}
var hasRequiredEs_promise_constructor;
function requireEs_promise_constructor() {
  if (hasRequiredEs_promise_constructor) return es_promise_constructor;
  hasRequiredEs_promise_constructor = 1;
  var $ = require_export();
  var IS_PURE = requireIsPure();
  var IS_NODE = requireEnvironmentIsNode();
  var globalThis2 = requireGlobalThis();
  var path2 = requirePath();
  var call = requireFunctionCall();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var setPrototypeOf = requireObjectSetPrototypeOf();
  var setToStringTag2 = requireSetToStringTag();
  var setSpecies2 = requireSetSpecies();
  var aCallable2 = requireACallable();
  var isCallable2 = requireIsCallable();
  var isObject2 = requireIsObject();
  var anInstance2 = requireAnInstance();
  var speciesConstructor2 = requireSpeciesConstructor();
  var task2 = requireTask().set;
  var microtask = requireMicrotask();
  var hostReportErrors2 = requireHostReportErrors();
  var perform2 = requirePerform();
  var Queue = requireQueue();
  var InternalStateModule = requireInternalState();
  var NativePromiseConstructor = requirePromiseNativeConstructor();
  var PromiseConstructorDetection = requirePromiseConstructorDetection();
  var newPromiseCapabilityModule = requireNewPromiseCapability();
  var PROMISE = "Promise";
  var FORCED_PROMISE_CONSTRUCTOR = PromiseConstructorDetection.CONSTRUCTOR;
  var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
  var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
  var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
  var setInternalState = InternalStateModule.set;
  var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
  var PromiseConstructor = NativePromiseConstructor;
  var PromisePrototype = NativePromisePrototype;
  var TypeError2 = globalThis2.TypeError;
  var document2 = globalThis2.document;
  var process2 = globalThis2.process;
  var newPromiseCapability2 = newPromiseCapabilityModule.f;
  var newGenericPromiseCapability = newPromiseCapability2;
  var DISPATCH_EVENT = !!(document2 && document2.createEvent && globalThis2.dispatchEvent);
  var UNHANDLED_REJECTION = "unhandledrejection";
  var REJECTION_HANDLED = "rejectionhandled";
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;
  var HANDLED = 1;
  var UNHANDLED = 2;
  var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
  var isThenable = function(it) {
    var then;
    return isObject2(it) && isCallable2(then = it.then) ? then : false;
  };
  var callReaction = function(reaction, state) {
    var value = state.value;
    var ok = state.state === FULFILLED;
    var handler = ok ? reaction.ok : reaction.fail;
    var resolve = reaction.resolve;
    var reject = reaction.reject;
    var domain = reaction.domain;
    var result, then, exited;
    try {
      if (handler) {
        if (!ok) {
          if (state.rejection === UNHANDLED) onHandleUnhandled(state);
          state.rejection = HANDLED;
        }
        if (handler === true) result = value;
        else {
          if (domain) domain.enter();
          result = handler(value);
          if (domain) {
            domain.exit();
            exited = true;
          }
        }
        if (result === reaction.promise) {
          reject(new TypeError2("Promise-chain cycle"));
        } else if (then = isThenable(result)) {
          call(then, result, resolve, reject);
        } else resolve(result);
      } else reject(value);
    } catch (error) {
      if (domain && !exited) domain.exit();
      reject(error);
    }
  };
  var notify = function(state, isReject) {
    if (state.notified) return;
    state.notified = true;
    microtask(function() {
      var reactions = state.reactions;
      var reaction;
      while (reaction = reactions.get()) {
        callReaction(reaction, state);
      }
      state.notified = false;
      if (isReject && !state.rejection) onUnhandled(state);
    });
  };
  var dispatchEvent = function(name, promise, reason) {
    var event, handler;
    if (DISPATCH_EVENT) {
      event = document2.createEvent("Event");
      event.promise = promise;
      event.reason = reason;
      event.initEvent(name, false, true);
      globalThis2.dispatchEvent(event);
    } else event = { promise, reason };
    if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = globalThis2["on" + name])) handler(event);
    else if (name === UNHANDLED_REJECTION) hostReportErrors2("Unhandled promise rejection", reason);
  };
  var onUnhandled = function(state) {
    call(task2, globalThis2, function() {
      var promise = state.facade;
      var value = state.value;
      var IS_UNHANDLED = isUnhandled(state);
      var result;
      if (IS_UNHANDLED) {
        result = perform2(function() {
          if (IS_NODE) {
            process2.emit("unhandledRejection", value, promise);
          } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
        });
        state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
        if (result.error) throw result.value;
      }
    });
  };
  var isUnhandled = function(state) {
    return state.rejection !== HANDLED && !state.parent;
  };
  var onHandleUnhandled = function(state) {
    call(task2, globalThis2, function() {
      var promise = state.facade;
      if (IS_NODE) {
        process2.emit("rejectionHandled", promise);
      } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
    });
  };
  var bind = function(fn, state, unwrap) {
    return function(value) {
      fn(state, value, unwrap);
    };
  };
  var internalReject = function(state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    state.value = value;
    state.state = REJECTED;
    notify(state, true);
  };
  var internalResolve = function(state, value, unwrap) {
    if (state.done) return;
    state.done = true;
    if (unwrap) state = unwrap;
    try {
      if (state.facade === value) throw new TypeError2("Promise can't be resolved itself");
      var then = isThenable(value);
      if (then) {
        microtask(function() {
          var wrapper = { done: false };
          try {
            call(
              then,
              value,
              bind(internalResolve, wrapper, state),
              bind(internalReject, wrapper, state)
            );
          } catch (error) {
            internalReject(wrapper, error, state);
          }
        });
      } else {
        state.value = value;
        state.state = FULFILLED;
        notify(state, false);
      }
    } catch (error) {
      internalReject({ done: false }, error, state);
    }
  };
  if (FORCED_PROMISE_CONSTRUCTOR) {
    PromiseConstructor = function Promise2(executor) {
      anInstance2(this, PromisePrototype);
      aCallable2(executor);
      call(Internal, this);
      var state = getInternalPromiseState(this);
      try {
        executor(bind(internalResolve, state), bind(internalReject, state));
      } catch (error) {
        internalReject(state, error);
      }
    };
    PromisePrototype = PromiseConstructor.prototype;
    Internal = function Promise2(executor) {
      setInternalState(this, {
        type: PROMISE,
        done: false,
        notified: false,
        parent: false,
        reactions: new Queue(),
        rejection: false,
        state: PENDING,
        value: null
      });
    };
    Internal.prototype = defineBuiltIn2(PromisePrototype, "then", function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability2(speciesConstructor2(this, PromiseConstructor));
      state.parent = true;
      reaction.ok = isCallable2(onFulfilled) ? onFulfilled : true;
      reaction.fail = isCallable2(onRejected) && onRejected;
      reaction.domain = IS_NODE ? process2.domain : void 0;
      if (state.state === PENDING) state.reactions.add(reaction);
      else microtask(function() {
        callReaction(reaction, state);
      });
      return reaction.promise;
    });
    OwnPromiseCapability = function() {
      var promise = new Internal();
      var state = getInternalPromiseState(promise);
      this.promise = promise;
      this.resolve = bind(internalResolve, state);
      this.reject = bind(internalReject, state);
    };
    newPromiseCapabilityModule.f = newPromiseCapability2 = function(C) {
      return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
    };
    if (!IS_PURE && isCallable2(NativePromiseConstructor) && NativePromisePrototype !== Object.prototype) {
      nativeThen = NativePromisePrototype.then;
      if (!NATIVE_PROMISE_SUBCLASSING) {
        defineBuiltIn2(NativePromisePrototype, "then", function then(onFulfilled, onRejected) {
          var that = this;
          return new PromiseConstructor(function(resolve, reject) {
            call(nativeThen, that, resolve, reject);
          }).then(onFulfilled, onRejected);
        }, { unsafe: true });
      }
      try {
        delete NativePromisePrototype.constructor;
      } catch (error) {
      }
      if (setPrototypeOf) {
        setPrototypeOf(NativePromisePrototype, PromisePrototype);
      }
    }
  }
  $({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
    Promise: PromiseConstructor
  });
  PromiseWrapper = path2.Promise;
  setToStringTag2(PromiseConstructor, PROMISE, false, true);
  setSpecies2(PROMISE);
  return es_promise_constructor;
}
var es_promise_all = {};
var iterators;
var hasRequiredIterators;
function requireIterators() {
  if (hasRequiredIterators) return iterators;
  hasRequiredIterators = 1;
  iterators = {};
  return iterators;
}
var isArrayIteratorMethod;
var hasRequiredIsArrayIteratorMethod;
function requireIsArrayIteratorMethod() {
  if (hasRequiredIsArrayIteratorMethod) return isArrayIteratorMethod;
  hasRequiredIsArrayIteratorMethod = 1;
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var Iterators = requireIterators();
  var ITERATOR = wellKnownSymbol2("iterator");
  var ArrayPrototype = Array.prototype;
  isArrayIteratorMethod = function(it) {
    return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
  };
  return isArrayIteratorMethod;
}
var getIteratorMethod;
var hasRequiredGetIteratorMethod;
function requireGetIteratorMethod() {
  if (hasRequiredGetIteratorMethod) return getIteratorMethod;
  hasRequiredGetIteratorMethod = 1;
  var classof2 = requireClassof();
  var getMethod2 = requireGetMethod();
  var isNullOrUndefined2 = requireIsNullOrUndefined();
  var Iterators = requireIterators();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var ITERATOR = wellKnownSymbol2("iterator");
  getIteratorMethod = function(it) {
    if (!isNullOrUndefined2(it)) return getMethod2(it, ITERATOR) || getMethod2(it, "@@iterator") || Iterators[classof2(it)];
  };
  return getIteratorMethod;
}
var getIterator;
var hasRequiredGetIterator;
function requireGetIterator() {
  if (hasRequiredGetIterator) return getIterator;
  hasRequiredGetIterator = 1;
  var call = requireFunctionCall();
  var aCallable2 = requireACallable();
  var anObject2 = requireAnObject();
  var tryToString2 = requireTryToString();
  var getIteratorMethod2 = requireGetIteratorMethod();
  var $TypeError = TypeError;
  getIterator = function(argument, usingIterator) {
    var iteratorMethod = arguments.length < 2 ? getIteratorMethod2(argument) : usingIterator;
    if (aCallable2(iteratorMethod)) return anObject2(call(iteratorMethod, argument));
    throw new $TypeError(tryToString2(argument) + " is not iterable");
  };
  return getIterator;
}
var iteratorClose;
var hasRequiredIteratorClose;
function requireIteratorClose() {
  if (hasRequiredIteratorClose) return iteratorClose;
  hasRequiredIteratorClose = 1;
  var call = requireFunctionCall();
  var anObject2 = requireAnObject();
  var getMethod2 = requireGetMethod();
  iteratorClose = function(iterator, kind, value) {
    var innerResult, innerError;
    anObject2(iterator);
    try {
      innerResult = getMethod2(iterator, "return");
      if (!innerResult) {
        if (kind === "throw") throw value;
        return value;
      }
      innerResult = call(innerResult, iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === "throw") throw value;
    if (innerError) throw innerResult;
    anObject2(innerResult);
    return value;
  };
  return iteratorClose;
}
var iterate;
var hasRequiredIterate;
function requireIterate() {
  if (hasRequiredIterate) return iterate;
  hasRequiredIterate = 1;
  var bind = requireFunctionBindContext();
  var call = requireFunctionCall();
  var anObject2 = requireAnObject();
  var tryToString2 = requireTryToString();
  var isArrayIteratorMethod2 = requireIsArrayIteratorMethod();
  var lengthOfArrayLike2 = requireLengthOfArrayLike();
  var isPrototypeOf = requireObjectIsPrototypeOf();
  var getIterator2 = requireGetIterator();
  var getIteratorMethod2 = requireGetIteratorMethod();
  var iteratorClose2 = requireIteratorClose();
  var $TypeError = TypeError;
  var Result = function(stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };
  var ResultPrototype = Result.prototype;
  iterate = function(iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_RECORD = !!(options && options.IS_RECORD);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = bind(unboundFunction, that);
    var iterator, iterFn, index2, length, result, next, step;
    var stop = function(condition) {
      if (iterator) iteratorClose2(iterator, "normal");
      return new Result(true, condition);
    };
    var callFn = function(value) {
      if (AS_ENTRIES) {
        anObject2(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      }
      return INTERRUPTED ? fn(value, stop) : fn(value);
    };
    if (IS_RECORD) {
      iterator = iterable.iterator;
    } else if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod2(iterable);
      if (!iterFn) throw new $TypeError(tryToString2(iterable) + " is not iterable");
      if (isArrayIteratorMethod2(iterFn)) {
        for (index2 = 0, length = lengthOfArrayLike2(iterable); length > index2; index2++) {
          result = callFn(iterable[index2]);
          if (result && isPrototypeOf(ResultPrototype, result)) return result;
        }
        return new Result(false);
      }
      iterator = getIterator2(iterable, iterFn);
    }
    next = IS_RECORD ? iterable.next : iterator.next;
    while (!(step = call(next, iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose2(iterator, "throw", error);
      }
      if (typeof result == "object" && result && isPrototypeOf(ResultPrototype, result)) return result;
    }
    return new Result(false);
  };
  return iterate;
}
var checkCorrectnessOfIteration;
var hasRequiredCheckCorrectnessOfIteration;
function requireCheckCorrectnessOfIteration() {
  if (hasRequiredCheckCorrectnessOfIteration) return checkCorrectnessOfIteration;
  hasRequiredCheckCorrectnessOfIteration = 1;
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var ITERATOR = wellKnownSymbol2("iterator");
  var SAFE_CLOSING = false;
  try {
    var called = 0;
    var iteratorWithReturn = {
      next: function() {
        return { done: !!called++ };
      },
      "return": function() {
        SAFE_CLOSING = true;
      }
    };
    iteratorWithReturn[ITERATOR] = function() {
      return this;
    };
    Array.from(iteratorWithReturn, function() {
      throw 2;
    });
  } catch (error) {
  }
  checkCorrectnessOfIteration = function(exec, SKIP_CLOSING) {
    try {
      if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
    } catch (error) {
      return false;
    }
    var ITERATION_SUPPORT = false;
    try {
      var object = {};
      object[ITERATOR] = function() {
        return {
          next: function() {
            return { done: ITERATION_SUPPORT = true };
          }
        };
      };
      exec(object);
    } catch (error) {
    }
    return ITERATION_SUPPORT;
  };
  return checkCorrectnessOfIteration;
}
var promiseStaticsIncorrectIteration;
var hasRequiredPromiseStaticsIncorrectIteration;
function requirePromiseStaticsIncorrectIteration() {
  if (hasRequiredPromiseStaticsIncorrectIteration) return promiseStaticsIncorrectIteration;
  hasRequiredPromiseStaticsIncorrectIteration = 1;
  var NativePromiseConstructor = requirePromiseNativeConstructor();
  var checkCorrectnessOfIteration2 = requireCheckCorrectnessOfIteration();
  var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
  promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR || !checkCorrectnessOfIteration2(function(iterable) {
    NativePromiseConstructor.all(iterable).then(void 0, function() {
    });
  });
  return promiseStaticsIncorrectIteration;
}
var hasRequiredEs_promise_all;
function requireEs_promise_all() {
  if (hasRequiredEs_promise_all) return es_promise_all;
  hasRequiredEs_promise_all = 1;
  var $ = require_export();
  var call = requireFunctionCall();
  var aCallable2 = requireACallable();
  var newPromiseCapabilityModule = requireNewPromiseCapability();
  var perform2 = requirePerform();
  var iterate2 = requireIterate();
  var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();
  $({ target: "Promise", stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule.f(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = perform2(function() {
        var $promiseResolve = aCallable2(C.resolve);
        var values = [];
        var counter = 0;
        var remaining = 1;
        iterate2(iterable, function(promise) {
          var index2 = counter++;
          var alreadyCalled = false;
          remaining++;
          call($promiseResolve, C, promise).then(function(value) {
            if (alreadyCalled) return;
            alreadyCalled = true;
            values[index2] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });
  return es_promise_all;
}
var es_promise_catch = {};
var hasRequiredEs_promise_catch;
function requireEs_promise_catch() {
  if (hasRequiredEs_promise_catch) return es_promise_catch;
  hasRequiredEs_promise_catch = 1;
  var $ = require_export();
  var IS_PURE = requireIsPure();
  var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
  var NativePromiseConstructor = requirePromiseNativeConstructor();
  var getBuiltIn2 = requireGetBuiltIn();
  var isCallable2 = requireIsCallable();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;
  $({ target: "Promise", proto: true, forced: FORCED_PROMISE_CONSTRUCTOR, real: true }, {
    "catch": function(onRejected) {
      return this.then(void 0, onRejected);
    }
  });
  if (!IS_PURE && isCallable2(NativePromiseConstructor)) {
    var method = getBuiltIn2("Promise").prototype["catch"];
    if (NativePromisePrototype["catch"] !== method) {
      defineBuiltIn2(NativePromisePrototype, "catch", method, { unsafe: true });
    }
  }
  return es_promise_catch;
}
var es_promise_race = {};
var hasRequiredEs_promise_race;
function requireEs_promise_race() {
  if (hasRequiredEs_promise_race) return es_promise_race;
  hasRequiredEs_promise_race = 1;
  var $ = require_export();
  var call = requireFunctionCall();
  var aCallable2 = requireACallable();
  var newPromiseCapabilityModule = requireNewPromiseCapability();
  var perform2 = requirePerform();
  var iterate2 = requireIterate();
  var PROMISE_STATICS_INCORRECT_ITERATION = requirePromiseStaticsIncorrectIteration();
  $({ target: "Promise", stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapabilityModule.f(C);
      var reject = capability.reject;
      var result = perform2(function() {
        var $promiseResolve = aCallable2(C.resolve);
        iterate2(iterable, function(promise) {
          call($promiseResolve, C, promise).then(capability.resolve, reject);
        });
      });
      if (result.error) reject(result.value);
      return capability.promise;
    }
  });
  return es_promise_race;
}
var es_promise_reject = {};
var hasRequiredEs_promise_reject;
function requireEs_promise_reject() {
  if (hasRequiredEs_promise_reject) return es_promise_reject;
  hasRequiredEs_promise_reject = 1;
  var $ = require_export();
  var newPromiseCapabilityModule = requireNewPromiseCapability();
  var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
  $({ target: "Promise", stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
    reject: function reject(r2) {
      var capability = newPromiseCapabilityModule.f(this);
      var capabilityReject = capability.reject;
      capabilityReject(r2);
      return capability.promise;
    }
  });
  return es_promise_reject;
}
var es_promise_resolve = {};
var promiseResolve;
var hasRequiredPromiseResolve;
function requirePromiseResolve() {
  if (hasRequiredPromiseResolve) return promiseResolve;
  hasRequiredPromiseResolve = 1;
  var anObject2 = requireAnObject();
  var isObject2 = requireIsObject();
  var newPromiseCapability2 = requireNewPromiseCapability();
  promiseResolve = function(C, x) {
    anObject2(C);
    if (isObject2(x) && x.constructor === C) return x;
    var promiseCapability = newPromiseCapability2.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };
  return promiseResolve;
}
var hasRequiredEs_promise_resolve;
function requireEs_promise_resolve() {
  if (hasRequiredEs_promise_resolve) return es_promise_resolve;
  hasRequiredEs_promise_resolve = 1;
  var $ = require_export();
  var getBuiltIn2 = requireGetBuiltIn();
  var IS_PURE = requireIsPure();
  var NativePromiseConstructor = requirePromiseNativeConstructor();
  var FORCED_PROMISE_CONSTRUCTOR = requirePromiseConstructorDetection().CONSTRUCTOR;
  var promiseResolve2 = requirePromiseResolve();
  var PromiseConstructorWrapper = getBuiltIn2("Promise");
  var CHECK_WRAPPER = IS_PURE && !FORCED_PROMISE_CONSTRUCTOR;
  $({ target: "Promise", stat: true, forced: IS_PURE || FORCED_PROMISE_CONSTRUCTOR }, {
    resolve: function resolve(x) {
      return promiseResolve2(CHECK_WRAPPER && this === PromiseConstructorWrapper ? NativePromiseConstructor : this, x);
    }
  });
  return es_promise_resolve;
}
var hasRequiredEs_promise;
function requireEs_promise() {
  if (hasRequiredEs_promise) return es_promise;
  hasRequiredEs_promise = 1;
  requireEs_promise_constructor();
  requireEs_promise_all();
  requireEs_promise_catch();
  requireEs_promise_race();
  requireEs_promise_reject();
  requireEs_promise_resolve();
  return es_promise;
}
requireEs_promise();
function asyncGeneratorStep(n2, t2, e2, r2, o2, a2, c2) {
  try {
    var i2 = n2[a2](c2), u2 = i2.value;
  } catch (n3) {
    return void e2(n3);
  }
  i2.done ? t2(u2) : Promise.resolve(u2).then(r2, o2);
}
function _asyncToGenerator(n2) {
  return function() {
    var t2 = this, e2 = arguments;
    return new Promise(function(r2, o2) {
      var a2 = n2.apply(t2, e2);
      function _next(n3) {
        asyncGeneratorStep(a2, r2, o2, _next, _throw, "next", n3);
      }
      function _throw(n3) {
        asyncGeneratorStep(a2, r2, o2, _next, _throw, "throw", n3);
      }
      _next(void 0);
    });
  };
}
var es_string_match = {};
var es_regexp_exec = {};
var toString;
var hasRequiredToString;
function requireToString() {
  if (hasRequiredToString) return toString;
  hasRequiredToString = 1;
  var classof2 = requireClassof();
  var $String = String;
  toString = function(argument) {
    if (classof2(argument) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return $String(argument);
  };
  return toString;
}
var regexpFlags;
var hasRequiredRegexpFlags;
function requireRegexpFlags() {
  if (hasRequiredRegexpFlags) return regexpFlags;
  hasRequiredRegexpFlags = 1;
  var anObject2 = requireAnObject();
  regexpFlags = function() {
    var that = anObject2(this);
    var result = "";
    if (that.hasIndices) result += "d";
    if (that.global) result += "g";
    if (that.ignoreCase) result += "i";
    if (that.multiline) result += "m";
    if (that.dotAll) result += "s";
    if (that.unicode) result += "u";
    if (that.unicodeSets) result += "v";
    if (that.sticky) result += "y";
    return result;
  };
  return regexpFlags;
}
var regexpStickyHelpers;
var hasRequiredRegexpStickyHelpers;
function requireRegexpStickyHelpers() {
  if (hasRequiredRegexpStickyHelpers) return regexpStickyHelpers;
  hasRequiredRegexpStickyHelpers = 1;
  var fails2 = requireFails();
  var globalThis2 = requireGlobalThis();
  var $RegExp = globalThis2.RegExp;
  var UNSUPPORTED_Y = fails2(function() {
    var re = $RegExp("a", "y");
    re.lastIndex = 2;
    return re.exec("abcd") !== null;
  });
  var MISSED_STICKY = UNSUPPORTED_Y || fails2(function() {
    return !$RegExp("a", "y").sticky;
  });
  var BROKEN_CARET = UNSUPPORTED_Y || fails2(function() {
    var re = $RegExp("^r", "gy");
    re.lastIndex = 2;
    return re.exec("str") !== null;
  });
  regexpStickyHelpers = {
    BROKEN_CARET,
    MISSED_STICKY,
    UNSUPPORTED_Y
  };
  return regexpStickyHelpers;
}
var objectDefineProperties = {};
var objectKeys;
var hasRequiredObjectKeys;
function requireObjectKeys() {
  if (hasRequiredObjectKeys) return objectKeys;
  hasRequiredObjectKeys = 1;
  var internalObjectKeys = requireObjectKeysInternal();
  var enumBugKeys2 = requireEnumBugKeys();
  objectKeys = Object.keys || function keys(O2) {
    return internalObjectKeys(O2, enumBugKeys2);
  };
  return objectKeys;
}
var hasRequiredObjectDefineProperties;
function requireObjectDefineProperties() {
  if (hasRequiredObjectDefineProperties) return objectDefineProperties;
  hasRequiredObjectDefineProperties = 1;
  var DESCRIPTORS = requireDescriptors();
  var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
  var definePropertyModule = requireObjectDefineProperty();
  var anObject2 = requireAnObject();
  var toIndexedObject2 = requireToIndexedObject();
  var objectKeys2 = requireObjectKeys();
  objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O2, Properties) {
    anObject2(O2);
    var props = toIndexedObject2(Properties);
    var keys = objectKeys2(Properties);
    var length = keys.length;
    var index2 = 0;
    var key;
    while (length > index2) definePropertyModule.f(O2, key = keys[index2++], props[key]);
    return O2;
  };
  return objectDefineProperties;
}
var objectCreate;
var hasRequiredObjectCreate;
function requireObjectCreate() {
  if (hasRequiredObjectCreate) return objectCreate;
  hasRequiredObjectCreate = 1;
  var anObject2 = requireAnObject();
  var definePropertiesModule = requireObjectDefineProperties();
  var enumBugKeys2 = requireEnumBugKeys();
  var hiddenKeys2 = requireHiddenKeys();
  var html2 = requireHtml();
  var documentCreateElement2 = requireDocumentCreateElement();
  var sharedKey2 = requireSharedKey();
  var GT = ">";
  var LT = "<";
  var PROTOTYPE = "prototype";
  var SCRIPT = "script";
  var IE_PROTO = sharedKey2("IE_PROTO");
  var EmptyConstructor = function() {
  };
  var scriptTag = function(content) {
    return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
  };
  var NullProtoObjectViaActiveX = function(activeXDocument2) {
    activeXDocument2.write(scriptTag(""));
    activeXDocument2.close();
    var temp = activeXDocument2.parentWindow.Object;
    activeXDocument2 = null;
    return temp;
  };
  var NullProtoObjectViaIFrame = function() {
    var iframe = documentCreateElement2("iframe");
    var JS = "java" + SCRIPT + ":";
    var iframeDocument;
    iframe.style.display = "none";
    html2.appendChild(iframe);
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag("document.F=Object"));
    iframeDocument.close();
    return iframeDocument.F;
  };
  var activeXDocument;
  var NullProtoObject = function() {
    try {
      activeXDocument = new ActiveXObject("htmlfile");
    } catch (error) {
    }
    NullProtoObject = typeof document != "undefined" ? document.domain && activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame() : NullProtoObjectViaActiveX(activeXDocument);
    var length = enumBugKeys2.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys2[length]];
    return NullProtoObject();
  };
  hiddenKeys2[IE_PROTO] = true;
  objectCreate = Object.create || function create(O2, Properties) {
    var result;
    if (O2 !== null) {
      EmptyConstructor[PROTOTYPE] = anObject2(O2);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      result[IE_PROTO] = O2;
    } else result = NullProtoObject();
    return Properties === void 0 ? result : definePropertiesModule.f(result, Properties);
  };
  return objectCreate;
}
var regexpUnsupportedDotAll;
var hasRequiredRegexpUnsupportedDotAll;
function requireRegexpUnsupportedDotAll() {
  if (hasRequiredRegexpUnsupportedDotAll) return regexpUnsupportedDotAll;
  hasRequiredRegexpUnsupportedDotAll = 1;
  var fails2 = requireFails();
  var globalThis2 = requireGlobalThis();
  var $RegExp = globalThis2.RegExp;
  regexpUnsupportedDotAll = fails2(function() {
    var re = $RegExp(".", "s");
    return !(re.dotAll && re.test("\n") && re.flags === "s");
  });
  return regexpUnsupportedDotAll;
}
var regexpUnsupportedNcg;
var hasRequiredRegexpUnsupportedNcg;
function requireRegexpUnsupportedNcg() {
  if (hasRequiredRegexpUnsupportedNcg) return regexpUnsupportedNcg;
  hasRequiredRegexpUnsupportedNcg = 1;
  var fails2 = requireFails();
  var globalThis2 = requireGlobalThis();
  var $RegExp = globalThis2.RegExp;
  regexpUnsupportedNcg = fails2(function() {
    var re = $RegExp("(?<a>b)", "g");
    return re.exec("b").groups.a !== "b" || "b".replace(re, "$<a>c") !== "bc";
  });
  return regexpUnsupportedNcg;
}
var regexpExec;
var hasRequiredRegexpExec;
function requireRegexpExec() {
  if (hasRequiredRegexpExec) return regexpExec;
  hasRequiredRegexpExec = 1;
  var call = requireFunctionCall();
  var uncurryThis = requireFunctionUncurryThis();
  var toString2 = requireToString();
  var regexpFlags2 = requireRegexpFlags();
  var stickyHelpers = requireRegexpStickyHelpers();
  var shared2 = requireShared();
  var create = requireObjectCreate();
  var getInternalState = requireInternalState().get;
  var UNSUPPORTED_DOT_ALL = requireRegexpUnsupportedDotAll();
  var UNSUPPORTED_NCG = requireRegexpUnsupportedNcg();
  var nativeReplace = shared2("native-string-replace", String.prototype.replace);
  var nativeExec = RegExp.prototype.exec;
  var patchedExec = nativeExec;
  var charAt = uncurryThis("".charAt);
  var indexOf = uncurryThis("".indexOf);
  var replace = uncurryThis("".replace);
  var stringSlice = uncurryThis("".slice);
  var UPDATES_LAST_INDEX_WRONG = (function() {
    var re1 = /a/;
    var re2 = /b*/g;
    call(nativeExec, re1, "a");
    call(nativeExec, re2, "a");
    return re1.lastIndex !== 0 || re2.lastIndex !== 0;
  })();
  var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;
  var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;
  if (PATCH) {
    patchedExec = function exec(string) {
      var re = this;
      var state = getInternalState(re);
      var str = toString2(string);
      var raw = state.raw;
      var result, reCopy, lastIndex, match, i2, object, group;
      if (raw) {
        raw.lastIndex = re.lastIndex;
        result = call(patchedExec, raw, str);
        re.lastIndex = raw.lastIndex;
        return result;
      }
      var groups = state.groups;
      var sticky = UNSUPPORTED_Y && re.sticky;
      var flags = call(regexpFlags2, re);
      var source = re.source;
      var charsAdded = 0;
      var strCopy = str;
      if (sticky) {
        flags = replace(flags, "y", "");
        if (indexOf(flags, "g") === -1) {
          flags += "g";
        }
        strCopy = stringSlice(str, re.lastIndex);
        if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== "\n")) {
          source = "(?: " + source + ")";
          strCopy = " " + strCopy;
          charsAdded++;
        }
        reCopy = new RegExp("^(?:" + source + ")", flags);
      }
      if (NPCG_INCLUDED) {
        reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
      match = call(nativeExec, sticky ? reCopy : re, strCopy);
      if (sticky) {
        if (match) {
          match.input = stringSlice(match.input, charsAdded);
          match[0] = stringSlice(match[0], charsAdded);
          match.index = re.lastIndex;
          re.lastIndex += match[0].length;
        } else re.lastIndex = 0;
      } else if (UPDATES_LAST_INDEX_WRONG && match) {
        re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        call(nativeReplace, match[0], reCopy, function() {
          for (i2 = 1; i2 < arguments.length - 2; i2++) {
            if (arguments[i2] === void 0) match[i2] = void 0;
          }
        });
      }
      if (match && groups) {
        match.groups = object = create(null);
        for (i2 = 0; i2 < groups.length; i2++) {
          group = groups[i2];
          object[group[0]] = match[group[1]];
        }
      }
      return match;
    };
  }
  regexpExec = patchedExec;
  return regexpExec;
}
var hasRequiredEs_regexp_exec;
function requireEs_regexp_exec() {
  if (hasRequiredEs_regexp_exec) return es_regexp_exec;
  hasRequiredEs_regexp_exec = 1;
  var $ = require_export();
  var exec = requireRegexpExec();
  $({ target: "RegExp", proto: true, forced: /./.exec !== exec }, {
    exec
  });
  return es_regexp_exec;
}
var fixRegexpWellKnownSymbolLogic;
var hasRequiredFixRegexpWellKnownSymbolLogic;
function requireFixRegexpWellKnownSymbolLogic() {
  if (hasRequiredFixRegexpWellKnownSymbolLogic) return fixRegexpWellKnownSymbolLogic;
  hasRequiredFixRegexpWellKnownSymbolLogic = 1;
  requireEs_regexp_exec();
  var call = requireFunctionCall();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var regexpExec2 = requireRegexpExec();
  var fails2 = requireFails();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var createNonEnumerableProperty2 = requireCreateNonEnumerableProperty();
  var SPECIES = wellKnownSymbol2("species");
  var RegExpPrototype = RegExp.prototype;
  fixRegexpWellKnownSymbolLogic = function(KEY, exec, FORCED, SHAM) {
    var SYMBOL = wellKnownSymbol2(KEY);
    var DELEGATES_TO_SYMBOL = !fails2(function() {
      var O2 = {};
      O2[SYMBOL] = function() {
        return 7;
      };
      return ""[KEY](O2) !== 7;
    });
    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails2(function() {
      var execCalled = false;
      var re = /a/;
      if (KEY === "split") {
        re = {};
        re.constructor = {};
        re.constructor[SPECIES] = function() {
          return re;
        };
        re.flags = "";
        re[SYMBOL] = /./[SYMBOL];
      }
      re.exec = function() {
        execCalled = true;
        return null;
      };
      re[SYMBOL]("");
      return !execCalled;
    });
    if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || FORCED) {
      var nativeRegExpMethod = /./[SYMBOL];
      var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
        var $exec = regexp.exec;
        if ($exec === regexpExec2 || $exec === RegExpPrototype.exec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            return { done: true, value: call(nativeRegExpMethod, regexp, str, arg2) };
          }
          return { done: true, value: call(nativeMethod, str, regexp, arg2) };
        }
        return { done: false };
      });
      defineBuiltIn2(String.prototype, KEY, methods[0]);
      defineBuiltIn2(RegExpPrototype, SYMBOL, methods[1]);
    }
    if (SHAM) createNonEnumerableProperty2(RegExpPrototype[SYMBOL], "sham", true);
  };
  return fixRegexpWellKnownSymbolLogic;
}
var stringMultibyte;
var hasRequiredStringMultibyte;
function requireStringMultibyte() {
  if (hasRequiredStringMultibyte) return stringMultibyte;
  hasRequiredStringMultibyte = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var toIntegerOrInfinity2 = requireToIntegerOrInfinity();
  var toString2 = requireToString();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var charAt = uncurryThis("".charAt);
  var charCodeAt = uncurryThis("".charCodeAt);
  var stringSlice = uncurryThis("".slice);
  var createMethod = function(CONVERT_TO_STRING) {
    return function($this, pos) {
      var S = toString2(requireObjectCoercible2($this));
      var position = toIntegerOrInfinity2(pos);
      var size = S.length;
      var first, second;
      if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
      first = charCodeAt(S, position);
      return first < 55296 || first > 56319 || position + 1 === size || (second = charCodeAt(S, position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? charAt(S, position) : first : CONVERT_TO_STRING ? stringSlice(S, position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
    };
  };
  stringMultibyte = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true)
  };
  return stringMultibyte;
}
var advanceStringIndex;
var hasRequiredAdvanceStringIndex;
function requireAdvanceStringIndex() {
  if (hasRequiredAdvanceStringIndex) return advanceStringIndex;
  hasRequiredAdvanceStringIndex = 1;
  var charAt = requireStringMultibyte().charAt;
  advanceStringIndex = function(S, index2, unicode) {
    return index2 + (unicode ? charAt(S, index2).length : 1);
  };
  return advanceStringIndex;
}
var regexpFlagsDetection;
var hasRequiredRegexpFlagsDetection;
function requireRegexpFlagsDetection() {
  if (hasRequiredRegexpFlagsDetection) return regexpFlagsDetection;
  hasRequiredRegexpFlagsDetection = 1;
  var globalThis2 = requireGlobalThis();
  var fails2 = requireFails();
  var RegExp2 = globalThis2.RegExp;
  var FLAGS_GETTER_IS_CORRECT = !fails2(function() {
    var INDICES_SUPPORT = true;
    try {
      RegExp2(".", "d");
    } catch (error) {
      INDICES_SUPPORT = false;
    }
    var O2 = {};
    var calls = "";
    var expected = INDICES_SUPPORT ? "dgimsy" : "gimsy";
    var addGetter = function(key2, chr) {
      Object.defineProperty(O2, key2, { get: function() {
        calls += chr;
        return true;
      } });
    };
    var pairs = {
      dotAll: "s",
      global: "g",
      ignoreCase: "i",
      multiline: "m",
      sticky: "y"
    };
    if (INDICES_SUPPORT) pairs.hasIndices = "d";
    for (var key in pairs) addGetter(key, pairs[key]);
    var result = Object.getOwnPropertyDescriptor(RegExp2.prototype, "flags").get.call(O2);
    return result !== expected || calls !== expected;
  });
  regexpFlagsDetection = { correct: FLAGS_GETTER_IS_CORRECT };
  return regexpFlagsDetection;
}
var regexpGetFlags;
var hasRequiredRegexpGetFlags;
function requireRegexpGetFlags() {
  if (hasRequiredRegexpGetFlags) return regexpGetFlags;
  hasRequiredRegexpGetFlags = 1;
  var call = requireFunctionCall();
  var hasOwn = requireHasOwnProperty();
  var isPrototypeOf = requireObjectIsPrototypeOf();
  var regExpFlagsDetection = requireRegexpFlagsDetection();
  var regExpFlagsGetterImplementation = requireRegexpFlags();
  var RegExpPrototype = RegExp.prototype;
  regexpGetFlags = regExpFlagsDetection.correct ? function(it) {
    return it.flags;
  } : function(it) {
    return !regExpFlagsDetection.correct && isPrototypeOf(RegExpPrototype, it) && !hasOwn(it, "flags") ? call(regExpFlagsGetterImplementation, it) : it.flags;
  };
  return regexpGetFlags;
}
var regexpExecAbstract;
var hasRequiredRegexpExecAbstract;
function requireRegexpExecAbstract() {
  if (hasRequiredRegexpExecAbstract) return regexpExecAbstract;
  hasRequiredRegexpExecAbstract = 1;
  var call = requireFunctionCall();
  var anObject2 = requireAnObject();
  var isCallable2 = requireIsCallable();
  var classof2 = requireClassofRaw();
  var regexpExec2 = requireRegexpExec();
  var $TypeError = TypeError;
  regexpExecAbstract = function(R, S) {
    var exec = R.exec;
    if (isCallable2(exec)) {
      var result = call(exec, R, S);
      if (result !== null) anObject2(result);
      return result;
    }
    if (classof2(R) === "RegExp") return call(regexpExec2, R, S);
    throw new $TypeError("RegExp#exec called on incompatible receiver");
  };
  return regexpExecAbstract;
}
var hasRequiredEs_string_match;
function requireEs_string_match() {
  if (hasRequiredEs_string_match) return es_string_match;
  hasRequiredEs_string_match = 1;
  var call = requireFunctionCall();
  var uncurryThis = requireFunctionUncurryThis();
  var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
  var anObject2 = requireAnObject();
  var isObject2 = requireIsObject();
  var toLength2 = requireToLength();
  var toString2 = requireToString();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var getMethod2 = requireGetMethod();
  var advanceStringIndex2 = requireAdvanceStringIndex();
  var getRegExpFlags = requireRegexpGetFlags();
  var regExpExec = requireRegexpExecAbstract();
  var stringIndexOf = uncurryThis("".indexOf);
  fixRegExpWellKnownSymbolLogic("match", function(MATCH, nativeMatch, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.es/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O2 = requireObjectCoercible2(this);
        var matcher = isObject2(regexp) ? getMethod2(regexp, MATCH) : void 0;
        return matcher ? call(matcher, regexp, O2) : new RegExp(regexp)[MATCH](toString2(O2));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
      function(string) {
        var rx = anObject2(this);
        var S = toString2(string);
        var res = maybeCallNative(nativeMatch, rx, S);
        if (res.done) return res.value;
        var flags = toString2(getRegExpFlags(rx));
        if (stringIndexOf(flags, "g") === -1) return regExpExec(rx, S);
        var fullUnicode = stringIndexOf(flags, "u") !== -1;
        rx.lastIndex = 0;
        var A = [];
        var n2 = 0;
        var result;
        while ((result = regExpExec(rx, S)) !== null) {
          var matchStr = toString2(result[0]);
          A[n2] = matchStr;
          if (matchStr === "") rx.lastIndex = advanceStringIndex2(S, toLength2(rx.lastIndex), fullUnicode);
          n2++;
        }
        return n2 === 0 ? null : A;
      }
    ];
  });
  return es_string_match;
}
requireEs_string_match();
var es_string_replace = {};
var getSubstitution;
var hasRequiredGetSubstitution;
function requireGetSubstitution() {
  if (hasRequiredGetSubstitution) return getSubstitution;
  hasRequiredGetSubstitution = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var toObject2 = requireToObject();
  var floor = Math.floor;
  var charAt = uncurryThis("".charAt);
  var replace = uncurryThis("".replace);
  var stringSlice = uncurryThis("".slice);
  var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;
  getSubstitution = function(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m2 = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== void 0) {
      namedCaptures = toObject2(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return replace(replacement, symbols, function(match, ch) {
      var capture;
      switch (charAt(ch, 0)) {
        case "$":
          return "$";
        case "&":
          return matched;
        case "`":
          return stringSlice(str, 0, position);
        case "'":
          return stringSlice(str, tailPos);
        case "<":
          capture = namedCaptures[stringSlice(ch, 1, -1)];
          break;
        default:
          var n2 = +ch;
          if (n2 === 0) return match;
          if (n2 > m2) {
            var f2 = floor(n2 / 10);
            if (f2 === 0) return match;
            if (f2 <= m2) return captures[f2 - 1] === void 0 ? charAt(ch, 1) : captures[f2 - 1] + charAt(ch, 1);
            return match;
          }
          capture = captures[n2 - 1];
      }
      return capture === void 0 ? "" : capture;
    });
  };
  return getSubstitution;
}
var hasRequiredEs_string_replace;
function requireEs_string_replace() {
  if (hasRequiredEs_string_replace) return es_string_replace;
  hasRequiredEs_string_replace = 1;
  var apply = requireFunctionApply();
  var call = requireFunctionCall();
  var uncurryThis = requireFunctionUncurryThis();
  var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
  var fails2 = requireFails();
  var anObject2 = requireAnObject();
  var isCallable2 = requireIsCallable();
  var isObject2 = requireIsObject();
  var toIntegerOrInfinity2 = requireToIntegerOrInfinity();
  var toLength2 = requireToLength();
  var toString2 = requireToString();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var advanceStringIndex2 = requireAdvanceStringIndex();
  var getMethod2 = requireGetMethod();
  var getSubstitution2 = requireGetSubstitution();
  var getRegExpFlags = requireRegexpGetFlags();
  var regExpExec = requireRegexpExecAbstract();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var REPLACE = wellKnownSymbol2("replace");
  var max = Math.max;
  var min = Math.min;
  var concat = uncurryThis([].concat);
  var push = uncurryThis([].push);
  var stringIndexOf = uncurryThis("".indexOf);
  var stringSlice = uncurryThis("".slice);
  var maybeToString = function(it) {
    return it === void 0 ? it : String(it);
  };
  var REPLACE_KEEPS_$0 = (function() {
    return "a".replace(/./, "$0") === "$0";
  })();
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function() {
    if (/./[REPLACE]) {
      return /./[REPLACE]("a", "$0") === "";
    }
    return false;
  })();
  var REPLACE_SUPPORTS_NAMED_GROUPS = !fails2(function() {
    var re = /./;
    re.exec = function() {
      var result = [];
      result.groups = { a: "7" };
      return result;
    };
    return "".replace(re, "$<a>") !== "7";
  });
  fixRegExpWellKnownSymbolLogic("replace", function(_2, nativeReplace, maybeCallNative) {
    var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O2 = requireObjectCoercible2(this);
        var replacer = isObject2(searchValue) ? getMethod2(searchValue, REPLACE) : void 0;
        return replacer ? call(replacer, searchValue, O2, replaceValue) : call(nativeReplace, toString2(O2), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function(string, replaceValue) {
        var rx = anObject2(this);
        var S = toString2(string);
        if (typeof replaceValue == "string" && stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 && stringIndexOf(replaceValue, "$<") === -1) {
          var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
          if (res.done) return res.value;
        }
        var functionalReplace = isCallable2(replaceValue);
        if (!functionalReplace) replaceValue = toString2(replaceValue);
        var flags = toString2(getRegExpFlags(rx));
        var global = stringIndexOf(flags, "g") !== -1;
        var fullUnicode;
        if (global) {
          fullUnicode = stringIndexOf(flags, "u") !== -1;
          rx.lastIndex = 0;
        }
        var results = [];
        var result;
        while (true) {
          result = regExpExec(rx, S);
          if (result === null) break;
          push(results, result);
          if (!global) break;
          var matchStr = toString2(result[0]);
          if (matchStr === "") rx.lastIndex = advanceStringIndex2(S, toLength2(rx.lastIndex), fullUnicode);
        }
        var accumulatedResult = "";
        var nextSourcePosition = 0;
        for (var i2 = 0; i2 < results.length; i2++) {
          result = results[i2];
          var matched = toString2(result[0]);
          var position = max(min(toIntegerOrInfinity2(result.index), S.length), 0);
          var captures = [];
          var replacement;
          for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = concat([matched], captures, position, S);
            if (namedCaptures !== void 0) push(replacerArgs, namedCaptures);
            replacement = toString2(apply(replaceValue, void 0, replacerArgs));
          } else {
            replacement = getSubstitution2(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + stringSlice(S, nextSourcePosition);
      }
    ];
  }, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);
  return es_string_replace;
}
requireEs_string_replace();
var es_string_startsWith = {};
var isRegexp;
var hasRequiredIsRegexp;
function requireIsRegexp() {
  if (hasRequiredIsRegexp) return isRegexp;
  hasRequiredIsRegexp = 1;
  var isObject2 = requireIsObject();
  var classof2 = requireClassofRaw();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var MATCH = wellKnownSymbol2("match");
  isRegexp = function(it) {
    var isRegExp;
    return isObject2(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof2(it) === "RegExp");
  };
  return isRegexp;
}
var notARegexp;
var hasRequiredNotARegexp;
function requireNotARegexp() {
  if (hasRequiredNotARegexp) return notARegexp;
  hasRequiredNotARegexp = 1;
  var isRegExp = requireIsRegexp();
  var $TypeError = TypeError;
  notARegexp = function(it) {
    if (isRegExp(it)) {
      throw new $TypeError("The method doesn't accept regular expressions");
    }
    return it;
  };
  return notARegexp;
}
var correctIsRegexpLogic;
var hasRequiredCorrectIsRegexpLogic;
function requireCorrectIsRegexpLogic() {
  if (hasRequiredCorrectIsRegexpLogic) return correctIsRegexpLogic;
  hasRequiredCorrectIsRegexpLogic = 1;
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var MATCH = wellKnownSymbol2("match");
  correctIsRegexpLogic = function(METHOD_NAME) {
    var regexp = /./;
    try {
      "/./"[METHOD_NAME](regexp);
    } catch (error1) {
      try {
        regexp[MATCH] = false;
        return "/./"[METHOD_NAME](regexp);
      } catch (error2) {
      }
    }
    return false;
  };
  return correctIsRegexpLogic;
}
var hasRequiredEs_string_startsWith;
function requireEs_string_startsWith() {
  if (hasRequiredEs_string_startsWith) return es_string_startsWith;
  hasRequiredEs_string_startsWith = 1;
  var $ = require_export();
  var uncurryThis = requireFunctionUncurryThisClause();
  var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
  var toLength2 = requireToLength();
  var toString2 = requireToString();
  var notARegExp = requireNotARegexp();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
  var IS_PURE = requireIsPure();
  var stringSlice = uncurryThis("".slice);
  var min = Math.min;
  var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
  var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!(function() {
    var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
    return descriptor && !descriptor.writable;
  })();
  $({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    startsWith: function startsWith(searchString) {
      var that = toString2(requireObjectCoercible2(this));
      notARegExp(searchString);
      var index2 = toLength2(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
      var search = toString2(searchString);
      return stringSlice(that, index2, index2 + search.length) === search;
    }
  });
  return es_string_startsWith;
}
requireEs_string_startsWith();
var addToUnscopables;
var hasRequiredAddToUnscopables;
function requireAddToUnscopables() {
  if (hasRequiredAddToUnscopables) return addToUnscopables;
  hasRequiredAddToUnscopables = 1;
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var create = requireObjectCreate();
  var defineProperty = requireObjectDefineProperty().f;
  var UNSCOPABLES = wellKnownSymbol2("unscopables");
  var ArrayPrototype = Array.prototype;
  if (ArrayPrototype[UNSCOPABLES] === void 0) {
    defineProperty(ArrayPrototype, UNSCOPABLES, {
      configurable: true,
      value: create(null)
    });
  }
  addToUnscopables = function(key) {
    ArrayPrototype[UNSCOPABLES][key] = true;
  };
  return addToUnscopables;
}
var correctPrototypeGetter;
var hasRequiredCorrectPrototypeGetter;
function requireCorrectPrototypeGetter() {
  if (hasRequiredCorrectPrototypeGetter) return correctPrototypeGetter;
  hasRequiredCorrectPrototypeGetter = 1;
  var fails2 = requireFails();
  correctPrototypeGetter = !fails2(function() {
    function F() {
    }
    F.prototype.constructor = null;
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });
  return correctPrototypeGetter;
}
var objectGetPrototypeOf;
var hasRequiredObjectGetPrototypeOf;
function requireObjectGetPrototypeOf() {
  if (hasRequiredObjectGetPrototypeOf) return objectGetPrototypeOf;
  hasRequiredObjectGetPrototypeOf = 1;
  var hasOwn = requireHasOwnProperty();
  var isCallable2 = requireIsCallable();
  var toObject2 = requireToObject();
  var sharedKey2 = requireSharedKey();
  var CORRECT_PROTOTYPE_GETTER = requireCorrectPrototypeGetter();
  var IE_PROTO = sharedKey2("IE_PROTO");
  var $Object = Object;
  var ObjectPrototype = $Object.prototype;
  objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function(O2) {
    var object = toObject2(O2);
    if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable2(constructor) && object instanceof constructor) {
      return constructor.prototype;
    }
    return object instanceof $Object ? ObjectPrototype : null;
  };
  return objectGetPrototypeOf;
}
var iteratorsCore;
var hasRequiredIteratorsCore;
function requireIteratorsCore() {
  if (hasRequiredIteratorsCore) return iteratorsCore;
  hasRequiredIteratorsCore = 1;
  var fails2 = requireFails();
  var isCallable2 = requireIsCallable();
  var isObject2 = requireIsObject();
  var create = requireObjectCreate();
  var getPrototypeOf = requireObjectGetPrototypeOf();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var IS_PURE = requireIsPure();
  var ITERATOR = wellKnownSymbol2("iterator");
  var BUGGY_SAFARI_ITERATORS = false;
  var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
  if ([].keys) {
    arrayIterator = [].keys();
    if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
    }
  }
  var NEW_ITERATOR_PROTOTYPE = !isObject2(IteratorPrototype) || fails2(function() {
    var test = {};
    return IteratorPrototype[ITERATOR].call(test) !== test;
  });
  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
  else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);
  if (!isCallable2(IteratorPrototype[ITERATOR])) {
    defineBuiltIn2(IteratorPrototype, ITERATOR, function() {
      return this;
    });
  }
  iteratorsCore = {
    IteratorPrototype,
    BUGGY_SAFARI_ITERATORS
  };
  return iteratorsCore;
}
var iteratorCreateConstructor;
var hasRequiredIteratorCreateConstructor;
function requireIteratorCreateConstructor() {
  if (hasRequiredIteratorCreateConstructor) return iteratorCreateConstructor;
  hasRequiredIteratorCreateConstructor = 1;
  var IteratorPrototype = requireIteratorsCore().IteratorPrototype;
  var create = requireObjectCreate();
  var createPropertyDescriptor2 = requireCreatePropertyDescriptor();
  var setToStringTag2 = requireSetToStringTag();
  var Iterators = requireIterators();
  var returnThis = function() {
    return this;
  };
  iteratorCreateConstructor = function(IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
    var TO_STRING_TAG = NAME + " Iterator";
    IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor2(+!ENUMERABLE_NEXT, next) });
    setToStringTag2(IteratorConstructor, TO_STRING_TAG, false, true);
    Iterators[TO_STRING_TAG] = returnThis;
    return IteratorConstructor;
  };
  return iteratorCreateConstructor;
}
var iteratorDefine;
var hasRequiredIteratorDefine;
function requireIteratorDefine() {
  if (hasRequiredIteratorDefine) return iteratorDefine;
  hasRequiredIteratorDefine = 1;
  var $ = require_export();
  var call = requireFunctionCall();
  var IS_PURE = requireIsPure();
  var FunctionName = requireFunctionName();
  var isCallable2 = requireIsCallable();
  var createIteratorConstructor = requireIteratorCreateConstructor();
  var getPrototypeOf = requireObjectGetPrototypeOf();
  var setPrototypeOf = requireObjectSetPrototypeOf();
  var setToStringTag2 = requireSetToStringTag();
  var createNonEnumerableProperty2 = requireCreateNonEnumerableProperty();
  var defineBuiltIn2 = requireDefineBuiltIn();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var Iterators = requireIterators();
  var IteratorsCore = requireIteratorsCore();
  var PROPER_FUNCTION_NAME = FunctionName.PROPER;
  var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
  var IteratorPrototype = IteratorsCore.IteratorPrototype;
  var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
  var ITERATOR = wellKnownSymbol2("iterator");
  var KEYS = "keys";
  var VALUES = "values";
  var ENTRIES = "entries";
  var returnThis = function() {
    return this;
  };
  iteratorDefine = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
    createIteratorConstructor(IteratorConstructor, NAME, next);
    var getIterationMethod = function(KIND) {
      if (KIND === DEFAULT && defaultIterator) return defaultIterator;
      if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];
      switch (KIND) {
        case KEYS:
          return function keys() {
            return new IteratorConstructor(this, KIND);
          };
        case VALUES:
          return function values() {
            return new IteratorConstructor(this, KIND);
          };
        case ENTRIES:
          return function entries() {
            return new IteratorConstructor(this, KIND);
          };
      }
      return function() {
        return new IteratorConstructor(this);
      };
    };
    var TO_STRING_TAG = NAME + " Iterator";
    var INCORRECT_VALUES_NAME = false;
    var IterablePrototype = Iterable.prototype;
    var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
    var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
    var anyNativeIterator = NAME === "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
    var CurrentIteratorPrototype, methods, KEY;
    if (anyNativeIterator) {
      CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
      if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
        if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
          if (setPrototypeOf) {
            setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
          } else if (!isCallable2(CurrentIteratorPrototype[ITERATOR])) {
            defineBuiltIn2(CurrentIteratorPrototype, ITERATOR, returnThis);
          }
        }
        setToStringTag2(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
        if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
      }
    }
    if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
      if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
        createNonEnumerableProperty2(IterablePrototype, "name", VALUES);
      } else {
        INCORRECT_VALUES_NAME = true;
        defaultIterator = function values() {
          return call(nativeIterator, this);
        };
      }
    }
    if (DEFAULT) {
      methods = {
        values: getIterationMethod(VALUES),
        keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
        entries: getIterationMethod(ENTRIES)
      };
      if (FORCED) for (KEY in methods) {
        if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
          defineBuiltIn2(IterablePrototype, KEY, methods[KEY]);
        }
      }
      else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
    }
    if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
      defineBuiltIn2(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
    }
    Iterators[NAME] = defaultIterator;
    return methods;
  };
  return iteratorDefine;
}
var createIterResultObject;
var hasRequiredCreateIterResultObject;
function requireCreateIterResultObject() {
  if (hasRequiredCreateIterResultObject) return createIterResultObject;
  hasRequiredCreateIterResultObject = 1;
  createIterResultObject = function(value, done) {
    return { value, done };
  };
  return createIterResultObject;
}
var es_array_iterator;
var hasRequiredEs_array_iterator;
function requireEs_array_iterator() {
  if (hasRequiredEs_array_iterator) return es_array_iterator;
  hasRequiredEs_array_iterator = 1;
  var toIndexedObject2 = requireToIndexedObject();
  var addToUnscopables2 = requireAddToUnscopables();
  var Iterators = requireIterators();
  var InternalStateModule = requireInternalState();
  var defineProperty = requireObjectDefineProperty().f;
  var defineIterator = requireIteratorDefine();
  var createIterResultObject2 = requireCreateIterResultObject();
  var IS_PURE = requireIsPure();
  var DESCRIPTORS = requireDescriptors();
  var ARRAY_ITERATOR = "Array Iterator";
  var setInternalState = InternalStateModule.set;
  var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
  es_array_iterator = defineIterator(Array, "Array", function(iterated, kind) {
    setInternalState(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject2(iterated),
      // target
      index: 0,
      // next index
      kind
      // kind
    });
  }, function() {
    var state = getInternalState(this);
    var target = state.target;
    var index2 = state.index++;
    if (!target || index2 >= target.length) {
      state.target = null;
      return createIterResultObject2(void 0, true);
    }
    switch (state.kind) {
      case "keys":
        return createIterResultObject2(index2, false);
      case "values":
        return createIterResultObject2(target[index2], false);
    }
    return createIterResultObject2([index2, target[index2]], false);
  }, "values");
  var values = Iterators.Arguments = Iterators.Array;
  addToUnscopables2("keys");
  addToUnscopables2("values");
  addToUnscopables2("entries");
  if (!IS_PURE && DESCRIPTORS && values.name !== "values") try {
    defineProperty(values, "name", { value: "values" });
  } catch (error) {
  }
  return es_array_iterator;
}
requireEs_array_iterator();
var web_domCollections_iterator = {};
var domIterables;
var hasRequiredDomIterables;
function requireDomIterables() {
  if (hasRequiredDomIterables) return domIterables;
  hasRequiredDomIterables = 1;
  domIterables = {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0
  };
  return domIterables;
}
var domTokenListPrototype;
var hasRequiredDomTokenListPrototype;
function requireDomTokenListPrototype() {
  if (hasRequiredDomTokenListPrototype) return domTokenListPrototype;
  hasRequiredDomTokenListPrototype = 1;
  var documentCreateElement2 = requireDocumentCreateElement();
  var classList = documentCreateElement2("span").classList;
  var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;
  domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? void 0 : DOMTokenListPrototype;
  return domTokenListPrototype;
}
var hasRequiredWeb_domCollections_iterator;
function requireWeb_domCollections_iterator() {
  if (hasRequiredWeb_domCollections_iterator) return web_domCollections_iterator;
  hasRequiredWeb_domCollections_iterator = 1;
  var globalThis2 = requireGlobalThis();
  var DOMIterables = requireDomIterables();
  var DOMTokenListPrototype = requireDomTokenListPrototype();
  var ArrayIteratorMethods = requireEs_array_iterator();
  var createNonEnumerableProperty2 = requireCreateNonEnumerableProperty();
  var setToStringTag2 = requireSetToStringTag();
  var wellKnownSymbol2 = requireWellKnownSymbol();
  var ITERATOR = wellKnownSymbol2("iterator");
  var ArrayValues = ArrayIteratorMethods.values;
  var handlePrototype = function(CollectionPrototype, COLLECTION_NAME2) {
    if (CollectionPrototype) {
      if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
        createNonEnumerableProperty2(CollectionPrototype, ITERATOR, ArrayValues);
      } catch (error) {
        CollectionPrototype[ITERATOR] = ArrayValues;
      }
      setToStringTag2(CollectionPrototype, COLLECTION_NAME2, true);
      if (DOMIterables[COLLECTION_NAME2]) for (var METHOD_NAME in ArrayIteratorMethods) {
        if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
          createNonEnumerableProperty2(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
        } catch (error) {
          CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
        }
      }
    }
  };
  for (var COLLECTION_NAME in DOMIterables) {
    handlePrototype(globalThis2[COLLECTION_NAME] && globalThis2[COLLECTION_NAME].prototype, COLLECTION_NAME);
  }
  handlePrototype(DOMTokenListPrototype, "DOMTokenList");
  return web_domCollections_iterator;
}
requireWeb_domCollections_iterator();
var es_array_reduce = {};
var arrayReduce;
var hasRequiredArrayReduce;
function requireArrayReduce() {
  if (hasRequiredArrayReduce) return arrayReduce;
  hasRequiredArrayReduce = 1;
  var aCallable2 = requireACallable();
  var toObject2 = requireToObject();
  var IndexedObject = requireIndexedObject();
  var lengthOfArrayLike2 = requireLengthOfArrayLike();
  var $TypeError = TypeError;
  var REDUCE_EMPTY = "Reduce of empty array with no initial value";
  var createMethod = function(IS_RIGHT) {
    return function(that, callbackfn, argumentsLength, memo) {
      var O2 = toObject2(that);
      var self2 = IndexedObject(O2);
      var length = lengthOfArrayLike2(O2);
      aCallable2(callbackfn);
      if (length === 0 && argumentsLength < 2) throw new $TypeError(REDUCE_EMPTY);
      var index2 = IS_RIGHT ? length - 1 : 0;
      var i2 = IS_RIGHT ? -1 : 1;
      if (argumentsLength < 2) while (true) {
        if (index2 in self2) {
          memo = self2[index2];
          index2 += i2;
          break;
        }
        index2 += i2;
        if (IS_RIGHT ? index2 < 0 : length <= index2) {
          throw new $TypeError(REDUCE_EMPTY);
        }
      }
      for (; IS_RIGHT ? index2 >= 0 : length > index2; index2 += i2) if (index2 in self2) {
        memo = callbackfn(memo, self2[index2], index2, O2);
      }
      return memo;
    };
  };
  arrayReduce = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: createMethod(false),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: createMethod(true)
  };
  return arrayReduce;
}
var arrayMethodIsStrict;
var hasRequiredArrayMethodIsStrict;
function requireArrayMethodIsStrict() {
  if (hasRequiredArrayMethodIsStrict) return arrayMethodIsStrict;
  hasRequiredArrayMethodIsStrict = 1;
  var fails2 = requireFails();
  arrayMethodIsStrict = function(METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails2(function() {
      method.call(null, argument || function() {
        return 1;
      }, 1);
    });
  };
  return arrayMethodIsStrict;
}
var hasRequiredEs_array_reduce;
function requireEs_array_reduce() {
  if (hasRequiredEs_array_reduce) return es_array_reduce;
  hasRequiredEs_array_reduce = 1;
  var $ = require_export();
  var $reduce = requireArrayReduce().left;
  var arrayMethodIsStrict2 = requireArrayMethodIsStrict();
  var CHROME_VERSION = requireEnvironmentV8Version();
  var IS_NODE = requireEnvironmentIsNode();
  var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;
  var FORCED = CHROME_BUG || !arrayMethodIsStrict2("reduce");
  $({ target: "Array", proto: true, forced: FORCED }, {
    reduce: function reduce(callbackfn) {
      var length = arguments.length;
      return $reduce(this, callbackfn, length, length > 1 ? arguments[1] : void 0);
    }
  });
  return es_array_reduce;
}
requireEs_array_reduce();
var es_string_endsWith = {};
var hasRequiredEs_string_endsWith;
function requireEs_string_endsWith() {
  if (hasRequiredEs_string_endsWith) return es_string_endsWith;
  hasRequiredEs_string_endsWith = 1;
  var $ = require_export();
  var uncurryThis = requireFunctionUncurryThisClause();
  var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
  var toLength2 = requireToLength();
  var toString2 = requireToString();
  var notARegExp = requireNotARegexp();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
  var IS_PURE = requireIsPure();
  var slice = uncurryThis("".slice);
  var min = Math.min;
  var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("endsWith");
  var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!(function() {
    var descriptor = getOwnPropertyDescriptor(String.prototype, "endsWith");
    return descriptor && !descriptor.writable;
  })();
  $({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
    endsWith: function endsWith(searchString) {
      var that = toString2(requireObjectCoercible2(this));
      notARegExp(searchString);
      var endPosition = arguments.length > 1 ? arguments[1] : void 0;
      var len = that.length;
      var end = endPosition === void 0 ? len : min(toLength2(endPosition), len);
      var search = toString2(searchString);
      return slice(that, end - search.length, end) === search;
    }
  });
  return es_string_endsWith;
}
requireEs_string_endsWith();
var es_string_split = {};
var hasRequiredEs_string_split;
function requireEs_string_split() {
  if (hasRequiredEs_string_split) return es_string_split;
  hasRequiredEs_string_split = 1;
  var call = requireFunctionCall();
  var uncurryThis = requireFunctionUncurryThis();
  var fixRegExpWellKnownSymbolLogic = requireFixRegexpWellKnownSymbolLogic();
  var anObject2 = requireAnObject();
  var isObject2 = requireIsObject();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var speciesConstructor2 = requireSpeciesConstructor();
  var advanceStringIndex2 = requireAdvanceStringIndex();
  var toLength2 = requireToLength();
  var toString2 = requireToString();
  var getMethod2 = requireGetMethod();
  var regExpExec = requireRegexpExecAbstract();
  var stickyHelpers = requireRegexpStickyHelpers();
  var fails2 = requireFails();
  var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;
  var MAX_UINT32 = 4294967295;
  var min = Math.min;
  var push = uncurryThis([].push);
  var stringSlice = uncurryThis("".slice);
  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails2(function() {
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function() {
      return originalExec.apply(this, arguments);
    };
    var result = "ab".split(re);
    return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
  });
  var BUGGY = "abbc".split(/(b)*/)[1] === "c" || // eslint-disable-next-line regexp/no-empty-group -- required for testing
  "test".split(/(?:)/, -1).length !== 4 || "ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
  ".".split(/()()/).length > 1 || "".split(/.?/).length;
  fixRegExpWellKnownSymbolLogic("split", function(SPLIT, nativeSplit, maybeCallNative) {
    var internalSplit = "0".split(void 0, 0).length ? function(separator, limit) {
      return separator === void 0 && limit === 0 ? [] : call(nativeSplit, this, separator, limit);
    } : nativeSplit;
    return [
      // `String.prototype.split` method
      // https://tc39.es/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O2 = requireObjectCoercible2(this);
        var splitter = isObject2(separator) ? getMethod2(separator, SPLIT) : void 0;
        return splitter ? call(splitter, separator, O2, limit) : call(internalSplit, toString2(O2), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function(string, limit) {
        var rx = anObject2(this);
        var S = toString2(string);
        if (!BUGGY) {
          var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);
          if (res.done) return res.value;
        }
        var C = speciesConstructor2(rx, RegExp);
        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? "i" : "") + (rx.multiline ? "m" : "") + (rx.unicode ? "u" : "") + (UNSUPPORTED_Y ? "g" : "y");
        var splitter = new C(UNSUPPORTED_Y ? "^(?:" + rx.source + ")" : rx, flags);
        var lim = limit === void 0 ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return regExpExec(splitter, S) === null ? [S] : [];
        var p2 = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = UNSUPPORTED_Y ? 0 : q;
          var z = regExpExec(splitter, UNSUPPORTED_Y ? stringSlice(S, q) : S);
          var e2;
          if (z === null || (e2 = min(toLength2(splitter.lastIndex + (UNSUPPORTED_Y ? q : 0)), S.length)) === p2) {
            q = advanceStringIndex2(S, q, unicodeMatching);
          } else {
            push(A, stringSlice(S, p2, q));
            if (A.length === lim) return A;
            for (var i2 = 1; i2 <= z.length - 1; i2++) {
              push(A, z[i2]);
              if (A.length === lim) return A;
            }
            q = p2 = e2;
          }
        }
        push(A, stringSlice(S, p2));
        return A;
      }
    ];
  }, BUGGY || !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y);
  return es_string_split;
}
requireEs_string_split();
var raf = { exports: {} };
var performanceNow$1 = { exports: {} };
var performanceNow = performanceNow$1.exports;
var hasRequiredPerformanceNow;
function requirePerformanceNow() {
  if (hasRequiredPerformanceNow) return performanceNow$1.exports;
  hasRequiredPerformanceNow = 1;
  (function() {
    var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;
    if (typeof performance !== "undefined" && performance !== null && performance.now) {
      performanceNow$1.exports = function() {
        return performance.now();
      };
    } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
      performanceNow$1.exports = function() {
        return (getNanoSeconds() - nodeLoadTime) / 1e6;
      };
      hrtime = process.hrtime;
      getNanoSeconds = function() {
        var hr;
        hr = hrtime();
        return hr[0] * 1e9 + hr[1];
      };
      moduleLoadTime = getNanoSeconds();
      upTime = process.uptime() * 1e9;
      nodeLoadTime = moduleLoadTime - upTime;
    } else if (Date.now) {
      performanceNow$1.exports = function() {
        return Date.now() - loadTime;
      };
      loadTime = Date.now();
    } else {
      performanceNow$1.exports = function() {
        return (/* @__PURE__ */ new Date()).getTime() - loadTime;
      };
      loadTime = (/* @__PURE__ */ new Date()).getTime();
    }
  }).call(performanceNow);
  return performanceNow$1.exports;
}
var hasRequiredRaf;
function requireRaf() {
  if (hasRequiredRaf) return raf.exports;
  hasRequiredRaf = 1;
  var now = requirePerformanceNow(), root = typeof window === "undefined" ? commonjsGlobal : window, vendors = ["moz", "webkit"], suffix = "AnimationFrame", raf$1 = root["request" + suffix], caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
  for (var i2 = 0; !raf$1 && i2 < vendors.length; i2++) {
    raf$1 = root[vendors[i2] + "Request" + suffix];
    caf = root[vendors[i2] + "Cancel" + suffix] || root[vendors[i2] + "CancelRequest" + suffix];
  }
  if (!raf$1 || !caf) {
    var last = 0, id = 0, queue2 = [], frameDuration = 1e3 / 60;
    raf$1 = function(callback) {
      if (queue2.length === 0) {
        var _now = now(), next = Math.max(0, frameDuration - (_now - last));
        last = next + _now;
        setTimeout(function() {
          var cp = queue2.slice(0);
          queue2.length = 0;
          for (var i3 = 0; i3 < cp.length; i3++) {
            if (!cp[i3].cancelled) {
              try {
                cp[i3].callback(last);
              } catch (e2) {
                setTimeout(function() {
                  throw e2;
                }, 0);
              }
            }
          }
        }, Math.round(next));
      }
      queue2.push({
        handle: ++id,
        callback,
        cancelled: false
      });
      return id;
    };
    caf = function(handle) {
      for (var i3 = 0; i3 < queue2.length; i3++) {
        if (queue2[i3].handle === handle) {
          queue2[i3].cancelled = true;
        }
      }
    };
  }
  raf.exports = function(fn) {
    return raf$1.call(root, fn);
  };
  raf.exports.cancel = function() {
    caf.apply(root, arguments);
  };
  raf.exports.polyfill = function(object) {
    if (!object) {
      object = root;
    }
    object.requestAnimationFrame = raf$1;
    object.cancelAnimationFrame = caf;
  };
  return raf.exports;
}
var rafExports = requireRaf();
const requestAnimationFrame = /* @__PURE__ */ getDefaultExportFromCjs(rafExports);
var es_string_trim = {};
var whitespaces;
var hasRequiredWhitespaces;
function requireWhitespaces() {
  if (hasRequiredWhitespaces) return whitespaces;
  hasRequiredWhitespaces = 1;
  whitespaces = "	\n\v\f\r                　\u2028\u2029\uFEFF";
  return whitespaces;
}
var stringTrim;
var hasRequiredStringTrim;
function requireStringTrim() {
  if (hasRequiredStringTrim) return stringTrim;
  hasRequiredStringTrim = 1;
  var uncurryThis = requireFunctionUncurryThis();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var toString2 = requireToString();
  var whitespaces2 = requireWhitespaces();
  var replace = uncurryThis("".replace);
  var ltrim = RegExp("^[" + whitespaces2 + "]+");
  var rtrim = RegExp("(^|[^" + whitespaces2 + "])[" + whitespaces2 + "]+$");
  var createMethod = function(TYPE) {
    return function($this) {
      var string = toString2(requireObjectCoercible2($this));
      if (TYPE & 1) string = replace(string, ltrim, "");
      if (TYPE & 2) string = replace(string, rtrim, "$1");
      return string;
    };
  };
  stringTrim = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: createMethod(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: createMethod(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: createMethod(3)
  };
  return stringTrim;
}
var stringTrimForced;
var hasRequiredStringTrimForced;
function requireStringTrimForced() {
  if (hasRequiredStringTrimForced) return stringTrimForced;
  hasRequiredStringTrimForced = 1;
  var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
  var fails2 = requireFails();
  var whitespaces2 = requireWhitespaces();
  var non = "​᠎";
  stringTrimForced = function(METHOD_NAME) {
    return fails2(function() {
      return !!whitespaces2[METHOD_NAME]() || non[METHOD_NAME]() !== non || PROPER_FUNCTION_NAME && whitespaces2[METHOD_NAME].name !== METHOD_NAME;
    });
  };
  return stringTrimForced;
}
var hasRequiredEs_string_trim;
function requireEs_string_trim() {
  if (hasRequiredEs_string_trim) return es_string_trim;
  hasRequiredEs_string_trim = 1;
  var $ = require_export();
  var $trim = requireStringTrim().trim;
  var forcedStringTrimMethod = requireStringTrimForced();
  $({ target: "String", proto: true, forced: forcedStringTrimMethod("trim") }, {
    trim: function trim() {
      return $trim(this);
    }
  });
  return es_string_trim;
}
requireEs_string_trim();
var rgbcolor;
var hasRequiredRgbcolor;
function requireRgbcolor() {
  if (hasRequiredRgbcolor) return rgbcolor;
  hasRequiredRgbcolor = 1;
  rgbcolor = function(color_string) {
    this.ok = false;
    this.alpha = 1;
    if (color_string.charAt(0) == "#") {
      color_string = color_string.substr(1, 6);
    }
    color_string = color_string.replace(/ /g, "");
    color_string = color_string.toLowerCase();
    var simple_colors = {
      aliceblue: "f0f8ff",
      antiquewhite: "faebd7",
      aqua: "00ffff",
      aquamarine: "7fffd4",
      azure: "f0ffff",
      beige: "f5f5dc",
      bisque: "ffe4c4",
      black: "000000",
      blanchedalmond: "ffebcd",
      blue: "0000ff",
      blueviolet: "8a2be2",
      brown: "a52a2a",
      burlywood: "deb887",
      cadetblue: "5f9ea0",
      chartreuse: "7fff00",
      chocolate: "d2691e",
      coral: "ff7f50",
      cornflowerblue: "6495ed",
      cornsilk: "fff8dc",
      crimson: "dc143c",
      cyan: "00ffff",
      darkblue: "00008b",
      darkcyan: "008b8b",
      darkgoldenrod: "b8860b",
      darkgray: "a9a9a9",
      darkgreen: "006400",
      darkkhaki: "bdb76b",
      darkmagenta: "8b008b",
      darkolivegreen: "556b2f",
      darkorange: "ff8c00",
      darkorchid: "9932cc",
      darkred: "8b0000",
      darksalmon: "e9967a",
      darkseagreen: "8fbc8f",
      darkslateblue: "483d8b",
      darkslategray: "2f4f4f",
      darkturquoise: "00ced1",
      darkviolet: "9400d3",
      deeppink: "ff1493",
      deepskyblue: "00bfff",
      dimgray: "696969",
      dodgerblue: "1e90ff",
      feldspar: "d19275",
      firebrick: "b22222",
      floralwhite: "fffaf0",
      forestgreen: "228b22",
      fuchsia: "ff00ff",
      gainsboro: "dcdcdc",
      ghostwhite: "f8f8ff",
      gold: "ffd700",
      goldenrod: "daa520",
      gray: "808080",
      green: "008000",
      greenyellow: "adff2f",
      honeydew: "f0fff0",
      hotpink: "ff69b4",
      indianred: "cd5c5c",
      indigo: "4b0082",
      ivory: "fffff0",
      khaki: "f0e68c",
      lavender: "e6e6fa",
      lavenderblush: "fff0f5",
      lawngreen: "7cfc00",
      lemonchiffon: "fffacd",
      lightblue: "add8e6",
      lightcoral: "f08080",
      lightcyan: "e0ffff",
      lightgoldenrodyellow: "fafad2",
      lightgrey: "d3d3d3",
      lightgreen: "90ee90",
      lightpink: "ffb6c1",
      lightsalmon: "ffa07a",
      lightseagreen: "20b2aa",
      lightskyblue: "87cefa",
      lightslateblue: "8470ff",
      lightslategray: "778899",
      lightsteelblue: "b0c4de",
      lightyellow: "ffffe0",
      lime: "00ff00",
      limegreen: "32cd32",
      linen: "faf0e6",
      magenta: "ff00ff",
      maroon: "800000",
      mediumaquamarine: "66cdaa",
      mediumblue: "0000cd",
      mediumorchid: "ba55d3",
      mediumpurple: "9370d8",
      mediumseagreen: "3cb371",
      mediumslateblue: "7b68ee",
      mediumspringgreen: "00fa9a",
      mediumturquoise: "48d1cc",
      mediumvioletred: "c71585",
      midnightblue: "191970",
      mintcream: "f5fffa",
      mistyrose: "ffe4e1",
      moccasin: "ffe4b5",
      navajowhite: "ffdead",
      navy: "000080",
      oldlace: "fdf5e6",
      olive: "808000",
      olivedrab: "6b8e23",
      orange: "ffa500",
      orangered: "ff4500",
      orchid: "da70d6",
      palegoldenrod: "eee8aa",
      palegreen: "98fb98",
      paleturquoise: "afeeee",
      palevioletred: "d87093",
      papayawhip: "ffefd5",
      peachpuff: "ffdab9",
      peru: "cd853f",
      pink: "ffc0cb",
      plum: "dda0dd",
      powderblue: "b0e0e6",
      purple: "800080",
      rebeccapurple: "663399",
      red: "ff0000",
      rosybrown: "bc8f8f",
      royalblue: "4169e1",
      saddlebrown: "8b4513",
      salmon: "fa8072",
      sandybrown: "f4a460",
      seagreen: "2e8b57",
      seashell: "fff5ee",
      sienna: "a0522d",
      silver: "c0c0c0",
      skyblue: "87ceeb",
      slateblue: "6a5acd",
      slategray: "708090",
      snow: "fffafa",
      springgreen: "00ff7f",
      steelblue: "4682b4",
      tan: "d2b48c",
      teal: "008080",
      thistle: "d8bfd8",
      tomato: "ff6347",
      turquoise: "40e0d0",
      violet: "ee82ee",
      violetred: "d02090",
      wheat: "f5deb3",
      white: "ffffff",
      whitesmoke: "f5f5f5",
      yellow: "ffff00",
      yellowgreen: "9acd32"
    };
    color_string = simple_colors[color_string] || color_string;
    var color_defs = [
      {
        re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
        example: ["rgba(123, 234, 45, 0.8)", "rgba(255,234,245,1.0)"],
        process: function(bits2) {
          return [
            parseInt(bits2[1]),
            parseInt(bits2[2]),
            parseInt(bits2[3]),
            parseFloat(bits2[4])
          ];
        }
      },
      {
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function(bits2) {
          return [
            parseInt(bits2[1]),
            parseInt(bits2[2]),
            parseInt(bits2[3])
          ];
        }
      },
      {
        re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        example: ["#00ff00", "336699"],
        process: function(bits2) {
          return [
            parseInt(bits2[1], 16),
            parseInt(bits2[2], 16),
            parseInt(bits2[3], 16)
          ];
        }
      },
      {
        re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        example: ["#fb0", "f0f"],
        process: function(bits2) {
          return [
            parseInt(bits2[1] + bits2[1], 16),
            parseInt(bits2[2] + bits2[2], 16),
            parseInt(bits2[3] + bits2[3], 16)
          ];
        }
      }
    ];
    for (var i2 = 0; i2 < color_defs.length; i2++) {
      var re = color_defs[i2].re;
      var processor = color_defs[i2].process;
      var bits = re.exec(color_string);
      if (bits) {
        var channels = processor(bits);
        this.r = channels[0];
        this.g = channels[1];
        this.b = channels[2];
        if (channels.length > 3) {
          this.alpha = channels[3];
        }
        this.ok = true;
      }
    }
    this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
    this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
    this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
    this.alpha = this.alpha < 0 ? 0 : this.alpha > 1 || isNaN(this.alpha) ? 1 : this.alpha;
    this.toRGB = function() {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };
    this.toRGBA = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
    };
    this.toHex = function() {
      var r2 = this.r.toString(16);
      var g = this.g.toString(16);
      var b = this.b.toString(16);
      if (r2.length == 1) r2 = "0" + r2;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;
      return "#" + r2 + g + b;
    };
    this.getHelpXML = function() {
      var examples = new Array();
      for (var i3 = 0; i3 < color_defs.length; i3++) {
        var example = color_defs[i3].example;
        for (var j = 0; j < example.length; j++) {
          examples[examples.length] = example[j];
        }
      }
      for (var sc in simple_colors) {
        examples[examples.length] = sc;
      }
      var xml = document.createElement("ul");
      xml.setAttribute("id", "rgbcolor-examples");
      for (var i3 = 0; i3 < examples.length; i3++) {
        try {
          var list_item = document.createElement("li");
          var list_color = new RGBColor(examples[i3]);
          var example_div = document.createElement("div");
          example_div.style.cssText = "margin: 3px; border: 1px solid black; background:" + list_color.toHex() + "; color:" + list_color.toHex();
          example_div.appendChild(document.createTextNode("test"));
          var list_item_value = document.createTextNode(
            " " + examples[i3] + " -> " + list_color.toRGB() + " -> " + list_color.toHex()
          );
          list_item.appendChild(example_div);
          list_item.appendChild(list_item_value);
          xml.appendChild(list_item);
        } catch (e2) {
        }
      }
      return xml;
    };
  };
  return rgbcolor;
}
var rgbcolorExports = requireRgbcolor();
const RGBColor$1 = /* @__PURE__ */ getDefaultExportFromCjs(rgbcolorExports);
var es_array_indexOf = {};
var hasRequiredEs_array_indexOf;
function requireEs_array_indexOf() {
  if (hasRequiredEs_array_indexOf) return es_array_indexOf;
  hasRequiredEs_array_indexOf = 1;
  var $ = require_export();
  var uncurryThis = requireFunctionUncurryThisClause();
  var $indexOf = requireArrayIncludes().indexOf;
  var arrayMethodIsStrict2 = requireArrayMethodIsStrict();
  var nativeIndexOf = uncurryThis([].indexOf);
  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / nativeIndexOf([1], 1, -0) < 0;
  var FORCED = NEGATIVE_ZERO || !arrayMethodIsStrict2("indexOf");
  $({ target: "Array", proto: true, forced: FORCED }, {
    indexOf: function indexOf(searchElement) {
      var fromIndex = arguments.length > 1 ? arguments[1] : void 0;
      return NEGATIVE_ZERO ? nativeIndexOf(this, searchElement, fromIndex) || 0 : $indexOf(this, searchElement, fromIndex);
    }
  });
  return es_array_indexOf;
}
requireEs_array_indexOf();
var es_string_includes = {};
var hasRequiredEs_string_includes;
function requireEs_string_includes() {
  if (hasRequiredEs_string_includes) return es_string_includes;
  hasRequiredEs_string_includes = 1;
  var $ = require_export();
  var uncurryThis = requireFunctionUncurryThis();
  var notARegExp = requireNotARegexp();
  var requireObjectCoercible2 = requireRequireObjectCoercible();
  var toString2 = requireToString();
  var correctIsRegExpLogic = requireCorrectIsRegexpLogic();
  var stringIndexOf = uncurryThis("".indexOf);
  $({ target: "String", proto: true, forced: !correctIsRegExpLogic("includes") }, {
    includes: function includes(searchString) {
      return !!~stringIndexOf(
        toString2(requireObjectCoercible2(this)),
        toString2(notARegExp(searchString)),
        arguments.length > 1 ? arguments[1] : void 0
      );
    }
  });
  return es_string_includes;
}
requireEs_string_includes();
var es_array_reverse = {};
var isArray;
var hasRequiredIsArray;
function requireIsArray() {
  if (hasRequiredIsArray) return isArray;
  hasRequiredIsArray = 1;
  var classof2 = requireClassofRaw();
  isArray = Array.isArray || function isArray2(argument) {
    return classof2(argument) === "Array";
  };
  return isArray;
}
var hasRequiredEs_array_reverse;
function requireEs_array_reverse() {
  if (hasRequiredEs_array_reverse) return es_array_reverse;
  hasRequiredEs_array_reverse = 1;
  var $ = require_export();
  var uncurryThis = requireFunctionUncurryThis();
  var isArray2 = requireIsArray();
  var nativeReverse = uncurryThis([].reverse);
  var test = [1, 2];
  $({ target: "Array", proto: true, forced: String(test) === String(test.reverse()) }, {
    reverse: function reverse() {
      if (isArray2(this)) this.length = this.length;
      return nativeReverse(this);
    }
  });
  return es_array_reverse;
}
requireEs_array_reverse();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var t = function(r2, e2) {
  return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t2, r3) {
    t2.__proto__ = r3;
  } || function(t2, r3) {
    for (var e3 in r3) Object.prototype.hasOwnProperty.call(r3, e3) && (t2[e3] = r3[e3]);
  })(r2, e2);
};
function r(r2, e2) {
  if ("function" != typeof e2 && null !== e2) throw new TypeError("Class extends value " + String(e2) + " is not a constructor or null");
  function i2() {
    this.constructor = r2;
  }
  t(r2, e2), r2.prototype = null === e2 ? Object.create(e2) : (i2.prototype = e2.prototype, new i2());
}
function e(t2) {
  var r2 = "";
  Array.isArray(t2) || (t2 = [t2]);
  for (var e2 = 0; e2 < t2.length; e2++) {
    var i2 = t2[e2];
    if (i2.type === _.CLOSE_PATH) r2 += "z";
    else if (i2.type === _.HORIZ_LINE_TO) r2 += (i2.relative ? "h" : "H") + i2.x;
    else if (i2.type === _.VERT_LINE_TO) r2 += (i2.relative ? "v" : "V") + i2.y;
    else if (i2.type === _.MOVE_TO) r2 += (i2.relative ? "m" : "M") + i2.x + " " + i2.y;
    else if (i2.type === _.LINE_TO) r2 += (i2.relative ? "l" : "L") + i2.x + " " + i2.y;
    else if (i2.type === _.CURVE_TO) r2 += (i2.relative ? "c" : "C") + i2.x1 + " " + i2.y1 + " " + i2.x2 + " " + i2.y2 + " " + i2.x + " " + i2.y;
    else if (i2.type === _.SMOOTH_CURVE_TO) r2 += (i2.relative ? "s" : "S") + i2.x2 + " " + i2.y2 + " " + i2.x + " " + i2.y;
    else if (i2.type === _.QUAD_TO) r2 += (i2.relative ? "q" : "Q") + i2.x1 + " " + i2.y1 + " " + i2.x + " " + i2.y;
    else if (i2.type === _.SMOOTH_QUAD_TO) r2 += (i2.relative ? "t" : "T") + i2.x + " " + i2.y;
    else {
      if (i2.type !== _.ARC) throw new Error('Unexpected command type "' + i2.type + '" at index ' + e2 + ".");
      r2 += (i2.relative ? "a" : "A") + i2.rX + " " + i2.rY + " " + i2.xRot + " " + +i2.lArcFlag + " " + +i2.sweepFlag + " " + i2.x + " " + i2.y;
    }
  }
  return r2;
}
function i(t2, r2) {
  var e2 = t2[0], i2 = t2[1];
  return [e2 * Math.cos(r2) - i2 * Math.sin(r2), e2 * Math.sin(r2) + i2 * Math.cos(r2)];
}
function a() {
  for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
  for (var e2 = 0; e2 < t2.length; e2++) if ("number" != typeof t2[e2]) throw new Error("assertNumbers arguments[" + e2 + "] is not a number. " + typeof t2[e2] + " == typeof " + t2[e2]);
  return true;
}
var n = Math.PI;
function o(t2, r2, e2) {
  t2.lArcFlag = 0 === t2.lArcFlag ? 0 : 1, t2.sweepFlag = 0 === t2.sweepFlag ? 0 : 1;
  var a2 = t2.rX, o2 = t2.rY, s2 = t2.x, u2 = t2.y;
  a2 = Math.abs(t2.rX), o2 = Math.abs(t2.rY);
  var h2 = i([(r2 - s2) / 2, (e2 - u2) / 2], -t2.xRot / 180 * n), c2 = h2[0], y2 = h2[1], p2 = Math.pow(c2, 2) / Math.pow(a2, 2) + Math.pow(y2, 2) / Math.pow(o2, 2);
  1 < p2 && (a2 *= Math.sqrt(p2), o2 *= Math.sqrt(p2)), t2.rX = a2, t2.rY = o2;
  var m2 = Math.pow(a2, 2) * Math.pow(y2, 2) + Math.pow(o2, 2) * Math.pow(c2, 2), O2 = (t2.lArcFlag !== t2.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(a2, 2) * Math.pow(o2, 2) - m2) / m2)), l2 = a2 * y2 / o2 * O2, T2 = -o2 * c2 / a2 * O2, v2 = i([l2, T2], t2.xRot / 180 * n);
  t2.cX = v2[0] + (r2 + s2) / 2, t2.cY = v2[1] + (e2 + u2) / 2, t2.phi1 = Math.atan2((y2 - T2) / o2, (c2 - l2) / a2), t2.phi2 = Math.atan2((-y2 - T2) / o2, (-c2 - l2) / a2), 0 === t2.sweepFlag && t2.phi2 > t2.phi1 && (t2.phi2 -= 2 * n), 1 === t2.sweepFlag && t2.phi2 < t2.phi1 && (t2.phi2 += 2 * n), t2.phi1 *= 180 / n, t2.phi2 *= 180 / n;
}
function s(t2, r2, e2) {
  a(t2, r2, e2);
  var i2 = t2 * t2 + r2 * r2 - e2 * e2;
  if (0 > i2) return [];
  if (0 === i2) return [[t2 * e2 / (t2 * t2 + r2 * r2), r2 * e2 / (t2 * t2 + r2 * r2)]];
  var n2 = Math.sqrt(i2);
  return [[(t2 * e2 + r2 * n2) / (t2 * t2 + r2 * r2), (r2 * e2 - t2 * n2) / (t2 * t2 + r2 * r2)], [(t2 * e2 - r2 * n2) / (t2 * t2 + r2 * r2), (r2 * e2 + t2 * n2) / (t2 * t2 + r2 * r2)]];
}
var u, h = Math.PI / 180;
function c$1(t2, r2, e2) {
  return (1 - e2) * t2 + e2 * r2;
}
function y(t2, r2, e2, i2) {
  return t2 + Math.cos(i2 / 180 * n) * r2 + Math.sin(i2 / 180 * n) * e2;
}
function p(t2, r2, e2, i2) {
  var a2 = 1e-6, n2 = r2 - t2, o2 = e2 - r2, s2 = 3 * n2 + 3 * (i2 - e2) - 6 * o2, u2 = 6 * (o2 - n2), h2 = 3 * n2;
  return Math.abs(s2) < a2 ? [-h2 / u2] : (function(t3, r3, e3) {
    var i3 = t3 * t3 / 4 - r3;
    if (i3 < -e3) return [];
    if (i3 <= e3) return [-t3 / 2];
    var a3 = Math.sqrt(i3);
    return [-t3 / 2 - a3, -t3 / 2 + a3];
  })(u2 / s2, h2 / s2, a2);
}
function m$1(t2, r2, e2, i2, a2) {
  var n2 = 1 - a2;
  return t2 * (n2 * n2 * n2) + r2 * (3 * n2 * n2 * a2) + e2 * (3 * n2 * a2 * a2) + i2 * (a2 * a2 * a2);
}
!(function(t2) {
  function r2() {
    return u2((function(t3, r3, e3) {
      return t3.relative && (void 0 !== t3.x1 && (t3.x1 += r3), void 0 !== t3.y1 && (t3.y1 += e3), void 0 !== t3.x2 && (t3.x2 += r3), void 0 !== t3.y2 && (t3.y2 += e3), void 0 !== t3.x && (t3.x += r3), void 0 !== t3.y && (t3.y += e3), t3.relative = false), t3;
    }));
  }
  function e2() {
    var t3 = NaN, r3 = NaN, e3 = NaN, i2 = NaN;
    return u2((function(a2, n3, o2) {
      return a2.type & _.SMOOTH_CURVE_TO && (a2.type = _.CURVE_TO, t3 = isNaN(t3) ? n3 : t3, r3 = isNaN(r3) ? o2 : r3, a2.x1 = a2.relative ? n3 - t3 : 2 * n3 - t3, a2.y1 = a2.relative ? o2 - r3 : 2 * o2 - r3), a2.type & _.CURVE_TO ? (t3 = a2.relative ? n3 + a2.x2 : a2.x2, r3 = a2.relative ? o2 + a2.y2 : a2.y2) : (t3 = NaN, r3 = NaN), a2.type & _.SMOOTH_QUAD_TO && (a2.type = _.QUAD_TO, e3 = isNaN(e3) ? n3 : e3, i2 = isNaN(i2) ? o2 : i2, a2.x1 = a2.relative ? n3 - e3 : 2 * n3 - e3, a2.y1 = a2.relative ? o2 - i2 : 2 * o2 - i2), a2.type & _.QUAD_TO ? (e3 = a2.relative ? n3 + a2.x1 : a2.x1, i2 = a2.relative ? o2 + a2.y1 : a2.y1) : (e3 = NaN, i2 = NaN), a2;
    }));
  }
  function n2() {
    var t3 = NaN, r3 = NaN;
    return u2((function(e3, i2, a2) {
      if (e3.type & _.SMOOTH_QUAD_TO && (e3.type = _.QUAD_TO, t3 = isNaN(t3) ? i2 : t3, r3 = isNaN(r3) ? a2 : r3, e3.x1 = e3.relative ? i2 - t3 : 2 * i2 - t3, e3.y1 = e3.relative ? a2 - r3 : 2 * a2 - r3), e3.type & _.QUAD_TO) {
        t3 = e3.relative ? i2 + e3.x1 : e3.x1, r3 = e3.relative ? a2 + e3.y1 : e3.y1;
        var n3 = e3.x1, o2 = e3.y1;
        e3.type = _.CURVE_TO, e3.x1 = ((e3.relative ? 0 : i2) + 2 * n3) / 3, e3.y1 = ((e3.relative ? 0 : a2) + 2 * o2) / 3, e3.x2 = (e3.x + 2 * n3) / 3, e3.y2 = (e3.y + 2 * o2) / 3;
      } else t3 = NaN, r3 = NaN;
      return e3;
    }));
  }
  function u2(t3) {
    var r3 = 0, e3 = 0, i2 = NaN, a2 = NaN;
    return function(n3) {
      if (isNaN(i2) && !(n3.type & _.MOVE_TO)) throw new Error("path must start with moveto");
      var o2 = t3(n3, r3, e3, i2, a2);
      return n3.type & _.CLOSE_PATH && (r3 = i2, e3 = a2), void 0 !== n3.x && (r3 = n3.relative ? r3 + n3.x : n3.x), void 0 !== n3.y && (e3 = n3.relative ? e3 + n3.y : n3.y), n3.type & _.MOVE_TO && (i2 = r3, a2 = e3), o2;
    };
  }
  function O2(t3, r3, e3, i2, n3, o2) {
    return a(t3, r3, e3, i2, n3, o2), u2((function(a2, s2, u3, h2) {
      var c2 = a2.x1, y2 = a2.x2, p2 = a2.relative && !isNaN(h2), m2 = void 0 !== a2.x ? a2.x : p2 ? 0 : s2, O3 = void 0 !== a2.y ? a2.y : p2 ? 0 : u3;
      function l3(t4) {
        return t4 * t4;
      }
      a2.type & _.HORIZ_LINE_TO && 0 !== r3 && (a2.type = _.LINE_TO, a2.y = a2.relative ? 0 : u3), a2.type & _.VERT_LINE_TO && 0 !== e3 && (a2.type = _.LINE_TO, a2.x = a2.relative ? 0 : s2), void 0 !== a2.x && (a2.x = a2.x * t3 + O3 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y && (a2.y = m2 * r3 + a2.y * i2 + (p2 ? 0 : o2)), void 0 !== a2.x1 && (a2.x1 = a2.x1 * t3 + a2.y1 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y1 && (a2.y1 = c2 * r3 + a2.y1 * i2 + (p2 ? 0 : o2)), void 0 !== a2.x2 && (a2.x2 = a2.x2 * t3 + a2.y2 * e3 + (p2 ? 0 : n3)), void 0 !== a2.y2 && (a2.y2 = y2 * r3 + a2.y2 * i2 + (p2 ? 0 : o2));
      var T2 = t3 * i2 - r3 * e3;
      if (void 0 !== a2.xRot && (1 !== t3 || 0 !== r3 || 0 !== e3 || 1 !== i2)) if (0 === T2) delete a2.rX, delete a2.rY, delete a2.xRot, delete a2.lArcFlag, delete a2.sweepFlag, a2.type = _.LINE_TO;
      else {
        var v2 = a2.xRot * Math.PI / 180, f2 = Math.sin(v2), N2 = Math.cos(v2), x = 1 / l3(a2.rX), d = 1 / l3(a2.rY), E = l3(N2) * x + l3(f2) * d, A = 2 * f2 * N2 * (x - d), C = l3(f2) * x + l3(N2) * d, M = E * i2 * i2 - A * r3 * i2 + C * r3 * r3, R = A * (t3 * i2 + r3 * e3) - 2 * (E * e3 * i2 + C * t3 * r3), g = E * e3 * e3 - A * t3 * e3 + C * t3 * t3, I = (Math.atan2(R, M - g) + Math.PI) % Math.PI / 2, S = Math.sin(I), L = Math.cos(I);
        a2.rX = Math.abs(T2) / Math.sqrt(M * l3(L) + R * S * L + g * l3(S)), a2.rY = Math.abs(T2) / Math.sqrt(M * l3(S) - R * S * L + g * l3(L)), a2.xRot = 180 * I / Math.PI;
      }
      return void 0 !== a2.sweepFlag && 0 > T2 && (a2.sweepFlag = +!a2.sweepFlag), a2;
    }));
  }
  function l2() {
    return function(t3) {
      var r3 = {};
      for (var e3 in t3) r3[e3] = t3[e3];
      return r3;
    };
  }
  t2.ROUND = function(t3) {
    function r3(r4) {
      return Math.round(r4 * t3) / t3;
    }
    return void 0 === t3 && (t3 = 1e13), a(t3), function(t4) {
      return void 0 !== t4.x1 && (t4.x1 = r3(t4.x1)), void 0 !== t4.y1 && (t4.y1 = r3(t4.y1)), void 0 !== t4.x2 && (t4.x2 = r3(t4.x2)), void 0 !== t4.y2 && (t4.y2 = r3(t4.y2)), void 0 !== t4.x && (t4.x = r3(t4.x)), void 0 !== t4.y && (t4.y = r3(t4.y)), void 0 !== t4.rX && (t4.rX = r3(t4.rX)), void 0 !== t4.rY && (t4.rY = r3(t4.rY)), t4;
    };
  }, t2.TO_ABS = r2, t2.TO_REL = function() {
    return u2((function(t3, r3, e3) {
      return t3.relative || (void 0 !== t3.x1 && (t3.x1 -= r3), void 0 !== t3.y1 && (t3.y1 -= e3), void 0 !== t3.x2 && (t3.x2 -= r3), void 0 !== t3.y2 && (t3.y2 -= e3), void 0 !== t3.x && (t3.x -= r3), void 0 !== t3.y && (t3.y -= e3), t3.relative = true), t3;
    }));
  }, t2.NORMALIZE_HVZ = function(t3, r3, e3) {
    return void 0 === t3 && (t3 = true), void 0 === r3 && (r3 = true), void 0 === e3 && (e3 = true), u2((function(i2, a2, n3, o2, s2) {
      if (isNaN(o2) && !(i2.type & _.MOVE_TO)) throw new Error("path must start with moveto");
      return r3 && i2.type & _.HORIZ_LINE_TO && (i2.type = _.LINE_TO, i2.y = i2.relative ? 0 : n3), e3 && i2.type & _.VERT_LINE_TO && (i2.type = _.LINE_TO, i2.x = i2.relative ? 0 : a2), t3 && i2.type & _.CLOSE_PATH && (i2.type = _.LINE_TO, i2.x = i2.relative ? o2 - a2 : o2, i2.y = i2.relative ? s2 - n3 : s2), i2.type & _.ARC && (0 === i2.rX || 0 === i2.rY) && (i2.type = _.LINE_TO, delete i2.rX, delete i2.rY, delete i2.xRot, delete i2.lArcFlag, delete i2.sweepFlag), i2;
    }));
  }, t2.NORMALIZE_ST = e2, t2.QT_TO_C = n2, t2.INFO = u2, t2.SANITIZE = function(t3) {
    void 0 === t3 && (t3 = 0), a(t3);
    var r3 = NaN, e3 = NaN, i2 = NaN, n3 = NaN;
    return u2((function(a2, o2, s2, u3, h2) {
      var c2 = Math.abs, y2 = false, p2 = 0, m2 = 0;
      if (a2.type & _.SMOOTH_CURVE_TO && (p2 = isNaN(r3) ? 0 : o2 - r3, m2 = isNaN(e3) ? 0 : s2 - e3), a2.type & (_.CURVE_TO | _.SMOOTH_CURVE_TO) ? (r3 = a2.relative ? o2 + a2.x2 : a2.x2, e3 = a2.relative ? s2 + a2.y2 : a2.y2) : (r3 = NaN, e3 = NaN), a2.type & _.SMOOTH_QUAD_TO ? (i2 = isNaN(i2) ? o2 : 2 * o2 - i2, n3 = isNaN(n3) ? s2 : 2 * s2 - n3) : a2.type & _.QUAD_TO ? (i2 = a2.relative ? o2 + a2.x1 : a2.x1, n3 = a2.relative ? s2 + a2.y1 : a2.y2) : (i2 = NaN, n3 = NaN), a2.type & _.LINE_COMMANDS || a2.type & _.ARC && (0 === a2.rX || 0 === a2.rY || !a2.lArcFlag) || a2.type & _.CURVE_TO || a2.type & _.SMOOTH_CURVE_TO || a2.type & _.QUAD_TO || a2.type & _.SMOOTH_QUAD_TO) {
        var O3 = void 0 === a2.x ? 0 : a2.relative ? a2.x : a2.x - o2, l3 = void 0 === a2.y ? 0 : a2.relative ? a2.y : a2.y - s2;
        p2 = isNaN(i2) ? void 0 === a2.x1 ? p2 : a2.relative ? a2.x : a2.x1 - o2 : i2 - o2, m2 = isNaN(n3) ? void 0 === a2.y1 ? m2 : a2.relative ? a2.y : a2.y1 - s2 : n3 - s2;
        var T2 = void 0 === a2.x2 ? 0 : a2.relative ? a2.x : a2.x2 - o2, v2 = void 0 === a2.y2 ? 0 : a2.relative ? a2.y : a2.y2 - s2;
        c2(O3) <= t3 && c2(l3) <= t3 && c2(p2) <= t3 && c2(m2) <= t3 && c2(T2) <= t3 && c2(v2) <= t3 && (y2 = true);
      }
      return a2.type & _.CLOSE_PATH && c2(o2 - u3) <= t3 && c2(s2 - h2) <= t3 && (y2 = true), y2 ? [] : a2;
    }));
  }, t2.MATRIX = O2, t2.ROTATE = function(t3, r3, e3) {
    void 0 === r3 && (r3 = 0), void 0 === e3 && (e3 = 0), a(t3, r3, e3);
    var i2 = Math.sin(t3), n3 = Math.cos(t3);
    return O2(n3, i2, -i2, n3, r3 - r3 * n3 + e3 * i2, e3 - r3 * i2 - e3 * n3);
  }, t2.TRANSLATE = function(t3, r3) {
    return void 0 === r3 && (r3 = 0), a(t3, r3), O2(1, 0, 0, 1, t3, r3);
  }, t2.SCALE = function(t3, r3) {
    return void 0 === r3 && (r3 = t3), a(t3, r3), O2(t3, 0, 0, r3, 0, 0);
  }, t2.SKEW_X = function(t3) {
    return a(t3), O2(1, 0, Math.atan(t3), 1, 0, 0);
  }, t2.SKEW_Y = function(t3) {
    return a(t3), O2(1, Math.atan(t3), 0, 1, 0, 0);
  }, t2.X_AXIS_SYMMETRY = function(t3) {
    return void 0 === t3 && (t3 = 0), a(t3), O2(-1, 0, 0, 1, t3, 0);
  }, t2.Y_AXIS_SYMMETRY = function(t3) {
    return void 0 === t3 && (t3 = 0), a(t3), O2(1, 0, 0, -1, 0, t3);
  }, t2.A_TO_C = function() {
    return u2((function(t3, r3, e3) {
      return _.ARC === t3.type ? (function(t4, r4, e4) {
        var a2, n3, s2, u3;
        t4.cX || o(t4, r4, e4);
        for (var y2 = Math.min(t4.phi1, t4.phi2), p2 = Math.max(t4.phi1, t4.phi2) - y2, m2 = Math.ceil(p2 / 90), O3 = new Array(m2), l3 = r4, T2 = e4, v2 = 0; v2 < m2; v2++) {
          var f2 = c$1(t4.phi1, t4.phi2, v2 / m2), N2 = c$1(t4.phi1, t4.phi2, (v2 + 1) / m2), x = N2 - f2, d = 4 / 3 * Math.tan(x * h / 4), E = [Math.cos(f2 * h) - d * Math.sin(f2 * h), Math.sin(f2 * h) + d * Math.cos(f2 * h)], A = E[0], C = E[1], M = [Math.cos(N2 * h), Math.sin(N2 * h)], R = M[0], g = M[1], I = [R + d * Math.sin(N2 * h), g - d * Math.cos(N2 * h)], S = I[0], L = I[1];
          O3[v2] = { relative: t4.relative, type: _.CURVE_TO };
          var H = function(r5, e5) {
            var a3 = i([r5 * t4.rX, e5 * t4.rY], t4.xRot), n4 = a3[0], o2 = a3[1];
            return [t4.cX + n4, t4.cY + o2];
          };
          a2 = H(A, C), O3[v2].x1 = a2[0], O3[v2].y1 = a2[1], n3 = H(S, L), O3[v2].x2 = n3[0], O3[v2].y2 = n3[1], s2 = H(R, g), O3[v2].x = s2[0], O3[v2].y = s2[1], t4.relative && (O3[v2].x1 -= l3, O3[v2].y1 -= T2, O3[v2].x2 -= l3, O3[v2].y2 -= T2, O3[v2].x -= l3, O3[v2].y -= T2), l3 = (u3 = [O3[v2].x, O3[v2].y])[0], T2 = u3[1];
        }
        return O3;
      })(t3, t3.relative ? 0 : r3, t3.relative ? 0 : e3) : t3;
    }));
  }, t2.ANNOTATE_ARCS = function() {
    return u2((function(t3, r3, e3) {
      return t3.relative && (r3 = 0, e3 = 0), _.ARC === t3.type && o(t3, r3, e3), t3;
    }));
  }, t2.CLONE = l2, t2.CALCULATE_BOUNDS = function() {
    var t3 = function(t4) {
      var r3 = {};
      for (var e3 in t4) r3[e3] = t4[e3];
      return r3;
    }, i2 = r2(), a2 = n2(), h2 = e2(), c2 = u2((function(r3, e3, n3) {
      var u3 = h2(a2(i2(t3(r3))));
      function O3(t4) {
        t4 > c2.maxX && (c2.maxX = t4), t4 < c2.minX && (c2.minX = t4);
      }
      function l3(t4) {
        t4 > c2.maxY && (c2.maxY = t4), t4 < c2.minY && (c2.minY = t4);
      }
      if (u3.type & _.DRAWING_COMMANDS && (O3(e3), l3(n3)), u3.type & _.HORIZ_LINE_TO && O3(u3.x), u3.type & _.VERT_LINE_TO && l3(u3.y), u3.type & _.LINE_TO && (O3(u3.x), l3(u3.y)), u3.type & _.CURVE_TO) {
        O3(u3.x), l3(u3.y);
        for (var T2 = 0, v2 = p(e3, u3.x1, u3.x2, u3.x); T2 < v2.length; T2++) {
          0 < (w = v2[T2]) && 1 > w && O3(m$1(e3, u3.x1, u3.x2, u3.x, w));
        }
        for (var f2 = 0, N2 = p(n3, u3.y1, u3.y2, u3.y); f2 < N2.length; f2++) {
          0 < (w = N2[f2]) && 1 > w && l3(m$1(n3, u3.y1, u3.y2, u3.y, w));
        }
      }
      if (u3.type & _.ARC) {
        O3(u3.x), l3(u3.y), o(u3, e3, n3);
        for (var x = u3.xRot / 180 * Math.PI, d = Math.cos(x) * u3.rX, E = Math.sin(x) * u3.rX, A = -Math.sin(x) * u3.rY, C = Math.cos(x) * u3.rY, M = u3.phi1 < u3.phi2 ? [u3.phi1, u3.phi2] : -180 > u3.phi2 ? [u3.phi2 + 360, u3.phi1 + 360] : [u3.phi2, u3.phi1], R = M[0], g = M[1], I = function(t4) {
          var r4 = t4[0], e4 = t4[1], i3 = 180 * Math.atan2(e4, r4) / Math.PI;
          return i3 < R ? i3 + 360 : i3;
        }, S = 0, L = s(A, -d, 0).map(I); S < L.length; S++) {
          (w = L[S]) > R && w < g && O3(y(u3.cX, d, A, w));
        }
        for (var H = 0, U = s(C, -E, 0).map(I); H < U.length; H++) {
          var w;
          (w = U[H]) > R && w < g && l3(y(u3.cY, E, C, w));
        }
      }
      return r3;
    }));
    return c2.minX = 1 / 0, c2.maxX = -1 / 0, c2.minY = 1 / 0, c2.maxY = -1 / 0, c2;
  };
})(u || (u = {}));
var O, l = (function() {
  function t2() {
  }
  return t2.prototype.round = function(t3) {
    return this.transform(u.ROUND(t3));
  }, t2.prototype.toAbs = function() {
    return this.transform(u.TO_ABS());
  }, t2.prototype.toRel = function() {
    return this.transform(u.TO_REL());
  }, t2.prototype.normalizeHVZ = function(t3, r2, e2) {
    return this.transform(u.NORMALIZE_HVZ(t3, r2, e2));
  }, t2.prototype.normalizeST = function() {
    return this.transform(u.NORMALIZE_ST());
  }, t2.prototype.qtToC = function() {
    return this.transform(u.QT_TO_C());
  }, t2.prototype.aToC = function() {
    return this.transform(u.A_TO_C());
  }, t2.prototype.sanitize = function(t3) {
    return this.transform(u.SANITIZE(t3));
  }, t2.prototype.translate = function(t3, r2) {
    return this.transform(u.TRANSLATE(t3, r2));
  }, t2.prototype.scale = function(t3, r2) {
    return this.transform(u.SCALE(t3, r2));
  }, t2.prototype.rotate = function(t3, r2, e2) {
    return this.transform(u.ROTATE(t3, r2, e2));
  }, t2.prototype.matrix = function(t3, r2, e2, i2, a2, n2) {
    return this.transform(u.MATRIX(t3, r2, e2, i2, a2, n2));
  }, t2.prototype.skewX = function(t3) {
    return this.transform(u.SKEW_X(t3));
  }, t2.prototype.skewY = function(t3) {
    return this.transform(u.SKEW_Y(t3));
  }, t2.prototype.xSymmetry = function(t3) {
    return this.transform(u.X_AXIS_SYMMETRY(t3));
  }, t2.prototype.ySymmetry = function(t3) {
    return this.transform(u.Y_AXIS_SYMMETRY(t3));
  }, t2.prototype.annotateArcs = function() {
    return this.transform(u.ANNOTATE_ARCS());
  }, t2;
})(), T = function(t2) {
  return " " === t2 || "	" === t2 || "\r" === t2 || "\n" === t2;
}, v = function(t2) {
  return "0".charCodeAt(0) <= t2.charCodeAt(0) && t2.charCodeAt(0) <= "9".charCodeAt(0);
}, f = (function(t2) {
  function e2() {
    var r2 = t2.call(this) || this;
    return r2.curNumber = "", r2.curCommandType = -1, r2.curCommandRelative = false, r2.canParseCommandOrComma = true, r2.curNumberHasExp = false, r2.curNumberHasExpDigits = false, r2.curNumberHasDecimal = false, r2.curArgs = [], r2;
  }
  return r(e2, t2), e2.prototype.finish = function(t3) {
    if (void 0 === t3 && (t3 = []), this.parse(" ", t3), 0 !== this.curArgs.length || !this.canParseCommandOrComma) throw new SyntaxError("Unterminated command at the path end.");
    return t3;
  }, e2.prototype.parse = function(t3, r2) {
    var e3 = this;
    void 0 === r2 && (r2 = []);
    for (var i2 = function(t4) {
      r2.push(t4), e3.curArgs.length = 0, e3.canParseCommandOrComma = true;
    }, a2 = 0; a2 < t3.length; a2++) {
      var n2 = t3[a2], o2 = !(this.curCommandType !== _.ARC || 3 !== this.curArgs.length && 4 !== this.curArgs.length || 1 !== this.curNumber.length || "0" !== this.curNumber && "1" !== this.curNumber), s2 = v(n2) && ("0" === this.curNumber && "0" === n2 || o2);
      if (!v(n2) || s2) if ("e" !== n2 && "E" !== n2) if ("-" !== n2 && "+" !== n2 || !this.curNumberHasExp || this.curNumberHasExpDigits) if ("." !== n2 || this.curNumberHasExp || this.curNumberHasDecimal || o2) {
        if (this.curNumber && -1 !== this.curCommandType) {
          var u2 = Number(this.curNumber);
          if (isNaN(u2)) throw new SyntaxError("Invalid number ending at " + a2);
          if (this.curCommandType === _.ARC) {
            if (0 === this.curArgs.length || 1 === this.curArgs.length) {
              if (0 > u2) throw new SyntaxError('Expected positive number, got "' + u2 + '" at index "' + a2 + '"');
            } else if ((3 === this.curArgs.length || 4 === this.curArgs.length) && "0" !== this.curNumber && "1" !== this.curNumber) throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + a2 + '"');
          }
          this.curArgs.push(u2), this.curArgs.length === N[this.curCommandType] && (_.HORIZ_LINE_TO === this.curCommandType ? i2({ type: _.HORIZ_LINE_TO, relative: this.curCommandRelative, x: u2 }) : _.VERT_LINE_TO === this.curCommandType ? i2({ type: _.VERT_LINE_TO, relative: this.curCommandRelative, y: u2 }) : this.curCommandType === _.MOVE_TO || this.curCommandType === _.LINE_TO || this.curCommandType === _.SMOOTH_QUAD_TO ? (i2({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }), _.MOVE_TO === this.curCommandType && (this.curCommandType = _.LINE_TO)) : this.curCommandType === _.CURVE_TO ? i2({ type: _.CURVE_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x2: this.curArgs[2], y2: this.curArgs[3], x: this.curArgs[4], y: this.curArgs[5] }) : this.curCommandType === _.SMOOTH_CURVE_TO ? i2({ type: _.SMOOTH_CURVE_TO, relative: this.curCommandRelative, x2: this.curArgs[0], y2: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _.QUAD_TO ? i2({ type: _.QUAD_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === _.ARC && i2({ type: _.ARC, relative: this.curCommandRelative, rX: this.curArgs[0], rY: this.curArgs[1], xRot: this.curArgs[2], lArcFlag: this.curArgs[3], sweepFlag: this.curArgs[4], x: this.curArgs[5], y: this.curArgs[6] })), this.curNumber = "", this.curNumberHasExpDigits = false, this.curNumberHasExp = false, this.curNumberHasDecimal = false, this.canParseCommandOrComma = true;
        }
        if (!T(n2)) if ("," === n2 && this.canParseCommandOrComma) this.canParseCommandOrComma = false;
        else if ("+" !== n2 && "-" !== n2 && "." !== n2) if (s2) this.curNumber = n2, this.curNumberHasDecimal = false;
        else {
          if (0 !== this.curArgs.length) throw new SyntaxError("Unterminated command at index " + a2 + ".");
          if (!this.canParseCommandOrComma) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + a2 + ". Command cannot follow comma");
          if (this.canParseCommandOrComma = false, "z" !== n2 && "Z" !== n2) if ("h" === n2 || "H" === n2) this.curCommandType = _.HORIZ_LINE_TO, this.curCommandRelative = "h" === n2;
          else if ("v" === n2 || "V" === n2) this.curCommandType = _.VERT_LINE_TO, this.curCommandRelative = "v" === n2;
          else if ("m" === n2 || "M" === n2) this.curCommandType = _.MOVE_TO, this.curCommandRelative = "m" === n2;
          else if ("l" === n2 || "L" === n2) this.curCommandType = _.LINE_TO, this.curCommandRelative = "l" === n2;
          else if ("c" === n2 || "C" === n2) this.curCommandType = _.CURVE_TO, this.curCommandRelative = "c" === n2;
          else if ("s" === n2 || "S" === n2) this.curCommandType = _.SMOOTH_CURVE_TO, this.curCommandRelative = "s" === n2;
          else if ("q" === n2 || "Q" === n2) this.curCommandType = _.QUAD_TO, this.curCommandRelative = "q" === n2;
          else if ("t" === n2 || "T" === n2) this.curCommandType = _.SMOOTH_QUAD_TO, this.curCommandRelative = "t" === n2;
          else {
            if ("a" !== n2 && "A" !== n2) throw new SyntaxError('Unexpected character "' + n2 + '" at index ' + a2 + ".");
            this.curCommandType = _.ARC, this.curCommandRelative = "a" === n2;
          }
          else r2.push({ type: _.CLOSE_PATH }), this.canParseCommandOrComma = true, this.curCommandType = -1;
        }
        else this.curNumber = n2, this.curNumberHasDecimal = "." === n2;
      } else this.curNumber += n2, this.curNumberHasDecimal = true;
      else this.curNumber += n2;
      else this.curNumber += n2, this.curNumberHasExp = true;
      else this.curNumber += n2, this.curNumberHasExpDigits = this.curNumberHasExp;
    }
    return r2;
  }, e2.prototype.transform = function(t3) {
    return Object.create(this, { parse: { value: function(r2, e3) {
      void 0 === e3 && (e3 = []);
      for (var i2 = 0, a2 = Object.getPrototypeOf(this).parse.call(this, r2); i2 < a2.length; i2++) {
        var n2 = a2[i2], o2 = t3(n2);
        Array.isArray(o2) ? e3.push.apply(e3, o2) : e3.push(o2);
      }
      return e3;
    } } });
  }, e2;
})(l), _ = (function(t2) {
  function i2(r2) {
    var e2 = t2.call(this) || this;
    return e2.commands = "string" == typeof r2 ? i2.parse(r2) : r2, e2;
  }
  return r(i2, t2), i2.prototype.encode = function() {
    return i2.encode(this.commands);
  }, i2.prototype.getBounds = function() {
    var t3 = u.CALCULATE_BOUNDS();
    return this.transform(t3), t3;
  }, i2.prototype.transform = function(t3) {
    for (var r2 = [], e2 = 0, i3 = this.commands; e2 < i3.length; e2++) {
      var a2 = t3(i3[e2]);
      Array.isArray(a2) ? r2.push.apply(r2, a2) : r2.push(a2);
    }
    return this.commands = r2, this;
  }, i2.encode = function(t3) {
    return e(t3);
  }, i2.parse = function(t3) {
    var r2 = new f(), e2 = [];
    return r2.parse(t3, e2), r2.finish(e2), e2;
  }, i2.CLOSE_PATH = 1, i2.MOVE_TO = 2, i2.HORIZ_LINE_TO = 4, i2.VERT_LINE_TO = 8, i2.LINE_TO = 16, i2.CURVE_TO = 32, i2.SMOOTH_CURVE_TO = 64, i2.QUAD_TO = 128, i2.SMOOTH_QUAD_TO = 256, i2.ARC = 512, i2.LINE_COMMANDS = i2.LINE_TO | i2.HORIZ_LINE_TO | i2.VERT_LINE_TO, i2.DRAWING_COMMANDS = i2.HORIZ_LINE_TO | i2.VERT_LINE_TO | i2.LINE_TO | i2.CURVE_TO | i2.SMOOTH_CURVE_TO | i2.QUAD_TO | i2.SMOOTH_QUAD_TO | i2.ARC, i2;
})(l), N = ((O = {})[_.MOVE_TO] = 2, O[_.LINE_TO] = 2, O[_.HORIZ_LINE_TO] = 1, O[_.VERT_LINE_TO] = 1, O[_.CLOSE_PATH] = 0, O[_.QUAD_TO] = 4, O[_.SMOOTH_QUAD_TO] = 2, O[_.CURVE_TO] = 6, O[_.SMOOTH_CURVE_TO] = 4, O[_.ARC] = 7, O);
var es_regexp_toString = {};
var hasRequiredEs_regexp_toString;
function requireEs_regexp_toString() {
  if (hasRequiredEs_regexp_toString) return es_regexp_toString;
  hasRequiredEs_regexp_toString = 1;
  var PROPER_FUNCTION_NAME = requireFunctionName().PROPER;
  var defineBuiltIn2 = requireDefineBuiltIn();
  var anObject2 = requireAnObject();
  var $toString = requireToString();
  var fails2 = requireFails();
  var getRegExpFlags = requireRegexpGetFlags();
  var TO_STRING = "toString";
  var RegExpPrototype = RegExp.prototype;
  var nativeToString = RegExpPrototype[TO_STRING];
  var NOT_GENERIC = fails2(function() {
    return nativeToString.call({ source: "a", flags: "b" }) !== "/a/b";
  });
  var INCORRECT_NAME = PROPER_FUNCTION_NAME && nativeToString.name !== TO_STRING;
  if (NOT_GENERIC || INCORRECT_NAME) {
    defineBuiltIn2(RegExpPrototype, TO_STRING, function toString2() {
      var R = anObject2(this);
      var pattern = $toString(R.source);
      var flags = $toString(getRegExpFlags(R));
      return "/" + pattern + "/" + flags;
    }, { unsafe: true });
  }
  return es_regexp_toString;
}
requireEs_regexp_toString();
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
function getImageDataFromCanvas(canvas, topX, topY, width, height) {
  if (typeof canvas === "string") {
    canvas = document.getElementById(canvas);
  }
  if (!canvas || _typeof(canvas) !== "object" || !("getContext" in canvas)) {
    throw new TypeError("Expecting canvas with `getContext` method in processCanvasRGB(A) calls!");
  }
  var context = canvas.getContext("2d");
  try {
    return context.getImageData(topX, topY, width, height);
  } catch (e2) {
    throw new Error("unable to access image data: " + e2);
  }
}
function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
  if (isNaN(radius) || radius < 1) {
    return;
  }
  radius |= 0;
  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
  canvas.getContext("2d").putImageData(imageData, topX, topY);
}
function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
  var pixels = imageData.data;
  var div = 2 * radius + 1;
  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  var stackStart = new BlurStack();
  var stack = stackStart;
  var stackEnd;
  for (var i2 = 1; i2 < div; i2++) {
    stack = stack.next = new BlurStack();
    if (i2 === radiusPlus1) {
      stackEnd = stack;
    }
  }
  stack.next = stackStart;
  var stackIn = null, stackOut = null, yw = 0, yi = 0;
  var mulSum = mulTable[radius];
  var shgSum = shgTable[radius];
  for (var y2 = 0; y2 < height; y2++) {
    stack = stackStart;
    var pr = pixels[yi], pg = pixels[yi + 1], pb = pixels[yi + 2], pa = pixels[yi + 3];
    for (var _i = 0; _i < radiusPlus1; _i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }
    var rInSum = 0, gInSum = 0, bInSum = 0, aInSum = 0, rOutSum = radiusPlus1 * pr, gOutSum = radiusPlus1 * pg, bOutSum = radiusPlus1 * pb, aOutSum = radiusPlus1 * pa, rSum = sumFactor * pr, gSum = sumFactor * pg, bSum = sumFactor * pb, aSum = sumFactor * pa;
    for (var _i2 = 1; _i2 < radiusPlus1; _i2++) {
      var p2 = yi + ((widthMinus1 < _i2 ? widthMinus1 : _i2) << 2);
      var r2 = pixels[p2], g = pixels[p2 + 1], b = pixels[p2 + 2], a2 = pixels[p2 + 3];
      var rbs = radiusPlus1 - _i2;
      rSum += (stack.r = r2) * rbs;
      gSum += (stack.g = g) * rbs;
      bSum += (stack.b = b) * rbs;
      aSum += (stack.a = a2) * rbs;
      rInSum += r2;
      gInSum += g;
      bInSum += b;
      aInSum += a2;
      stack = stack.next;
    }
    stackIn = stackStart;
    stackOut = stackEnd;
    for (var x = 0; x < width; x++) {
      var paInitial = aSum * mulSum >>> shgSum;
      pixels[yi + 3] = paInitial;
      if (paInitial !== 0) {
        var _a2 = 255 / paInitial;
        pixels[yi] = (rSum * mulSum >>> shgSum) * _a2;
        pixels[yi + 1] = (gSum * mulSum >>> shgSum) * _a2;
        pixels[yi + 2] = (bSum * mulSum >>> shgSum) * _a2;
      } else {
        pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
      }
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      var _p = x + radius + 1;
      _p = yw + (_p < widthMinus1 ? _p : widthMinus1) << 2;
      rInSum += stackIn.r = pixels[_p];
      gInSum += stackIn.g = pixels[_p + 1];
      bInSum += stackIn.b = pixels[_p + 2];
      aInSum += stackIn.a = pixels[_p + 3];
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      aSum += aInSum;
      stackIn = stackIn.next;
      var _stackOut = stackOut, _r = _stackOut.r, _g = _stackOut.g, _b = _stackOut.b, _a = _stackOut.a;
      rOutSum += _r;
      gOutSum += _g;
      bOutSum += _b;
      aOutSum += _a;
      rInSum -= _r;
      gInSum -= _g;
      bInSum -= _b;
      aInSum -= _a;
      stackOut = stackOut.next;
      yi += 4;
    }
    yw += width;
  }
  for (var _x = 0; _x < width; _x++) {
    yi = _x << 2;
    var _pr = pixels[yi], _pg = pixels[yi + 1], _pb = pixels[yi + 2], _pa = pixels[yi + 3], _rOutSum = radiusPlus1 * _pr, _gOutSum = radiusPlus1 * _pg, _bOutSum = radiusPlus1 * _pb, _aOutSum = radiusPlus1 * _pa, _rSum = sumFactor * _pr, _gSum = sumFactor * _pg, _bSum = sumFactor * _pb, _aSum = sumFactor * _pa;
    stack = stackStart;
    for (var _i3 = 0; _i3 < radiusPlus1; _i3++) {
      stack.r = _pr;
      stack.g = _pg;
      stack.b = _pb;
      stack.a = _pa;
      stack = stack.next;
    }
    var yp = width;
    var _gInSum = 0, _bInSum = 0, _aInSum = 0, _rInSum = 0;
    for (var _i4 = 1; _i4 <= radius; _i4++) {
      yi = yp + _x << 2;
      var _rbs = radiusPlus1 - _i4;
      _rSum += (stack.r = _pr = pixels[yi]) * _rbs;
      _gSum += (stack.g = _pg = pixels[yi + 1]) * _rbs;
      _bSum += (stack.b = _pb = pixels[yi + 2]) * _rbs;
      _aSum += (stack.a = _pa = pixels[yi + 3]) * _rbs;
      _rInSum += _pr;
      _gInSum += _pg;
      _bInSum += _pb;
      _aInSum += _pa;
      stack = stack.next;
      if (_i4 < heightMinus1) {
        yp += width;
      }
    }
    yi = _x;
    stackIn = stackStart;
    stackOut = stackEnd;
    for (var _y = 0; _y < height; _y++) {
      var _p2 = yi << 2;
      pixels[_p2 + 3] = _pa = _aSum * mulSum >>> shgSum;
      if (_pa > 0) {
        _pa = 255 / _pa;
        pixels[_p2] = (_rSum * mulSum >>> shgSum) * _pa;
        pixels[_p2 + 1] = (_gSum * mulSum >>> shgSum) * _pa;
        pixels[_p2 + 2] = (_bSum * mulSum >>> shgSum) * _pa;
      } else {
        pixels[_p2] = pixels[_p2 + 1] = pixels[_p2 + 2] = 0;
      }
      _rSum -= _rOutSum;
      _gSum -= _gOutSum;
      _bSum -= _bOutSum;
      _aSum -= _aOutSum;
      _rOutSum -= stackIn.r;
      _gOutSum -= stackIn.g;
      _bOutSum -= stackIn.b;
      _aOutSum -= stackIn.a;
      _p2 = _x + ((_p2 = _y + radiusPlus1) < heightMinus1 ? _p2 : heightMinus1) * width << 2;
      _rSum += _rInSum += stackIn.r = pixels[_p2];
      _gSum += _gInSum += stackIn.g = pixels[_p2 + 1];
      _bSum += _bInSum += stackIn.b = pixels[_p2 + 2];
      _aSum += _aInSum += stackIn.a = pixels[_p2 + 3];
      stackIn = stackIn.next;
      _rOutSum += _pr = stackOut.r;
      _gOutSum += _pg = stackOut.g;
      _bOutSum += _pb = stackOut.b;
      _aOutSum += _pa = stackOut.a;
      _rInSum -= _pr;
      _gInSum -= _pg;
      _bInSum -= _pb;
      _aInSum -= _pa;
      stackOut = stackOut.next;
      yi += width;
    }
  }
  return imageData;
}
var BlurStack = (
  /**
   * Set properties.
   */
  function BlurStack2() {
    _classCallCheck(this, BlurStack2);
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
  }
);
function offscreen() {
  var {
    DOMParser: DOMParserFallback
  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var preset = {
    window: null,
    ignoreAnimation: true,
    ignoreMouse: true,
    DOMParser: DOMParserFallback,
    createCanvas(width, height) {
      return new OffscreenCanvas(width, height);
    },
    createImage(url) {
      return _asyncToGenerator(function* () {
        var response = yield fetch(url);
        var blob = yield response.blob();
        var img = yield createImageBitmap(blob);
        return img;
      })();
    }
  };
  if (typeof DOMParser !== "undefined" || typeof DOMParserFallback === "undefined") {
    Reflect.deleteProperty(preset, "DOMParser");
  }
  return preset;
}
function node(_ref) {
  var {
    DOMParser: DOMParser2,
    canvas,
    fetch: fetch2
  } = _ref;
  return {
    window: null,
    ignoreAnimation: true,
    ignoreMouse: true,
    DOMParser: DOMParser2,
    fetch: fetch2,
    createCanvas: canvas.createCanvas,
    createImage: canvas.loadImage
  };
}
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  offscreen,
  node
});
function compressSpaces(str) {
  return str.replace(/(?!\u3000)\s+/gm, " ");
}
function trimLeft(str) {
  return str.replace(/^[\n \t]+/, "");
}
function trimRight(str) {
  return str.replace(/[\n \t]+$/, "");
}
function toNumbers(str) {
  var matches = (str || "").match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm) || [];
  return matches.map(parseFloat);
}
var allUppercase = /^[A-Z-]+$/;
function normalizeAttributeName(name) {
  if (allUppercase.test(name)) {
    return name.toLowerCase();
  }
  return name;
}
function parseExternalUrl(url) {
  var urlMatch = /url\(('([^']+)'|"([^"]+)"|([^'")]+))\)/.exec(url) || [];
  return urlMatch[2] || urlMatch[3] || urlMatch[4];
}
function normalizeColor(color) {
  if (!color.startsWith("rgb")) {
    return color;
  }
  var rgbParts = 3;
  var normalizedColor = color.replace(/\d+(\.\d+)?/g, (num, isFloat) => rgbParts-- && isFloat ? String(Math.round(parseFloat(num))) : num);
  return normalizedColor;
}
var attributeRegex = /(\[[^\]]+\])/g;
var idRegex = /(#[^\s+>~.[:]+)/g;
var classRegex = /(\.[^\s+>~.[:]+)/g;
var pseudoElementRegex = /(::[^\s+>~.[:]+|:first-line|:first-letter|:before|:after)/gi;
var pseudoClassWithBracketsRegex = /(:[\w-]+\([^)]*\))/gi;
var pseudoClassRegex = /(:[^\s+>~.[:]+)/g;
var elementRegex = /([^\s+>~.[:]+)/g;
function findSelectorMatch(selector, regex) {
  var matches = regex.exec(selector);
  if (!matches) {
    return [selector, 0];
  }
  return [selector.replace(regex, " "), matches.length];
}
function getSelectorSpecificity(selector) {
  var specificity = [0, 0, 0];
  var currentSelector = selector.replace(/:not\(([^)]*)\)/g, "     $1 ").replace(/{[\s\S]*/gm, " ");
  var delta = 0;
  [currentSelector, delta] = findSelectorMatch(currentSelector, attributeRegex);
  specificity[1] += delta;
  [currentSelector, delta] = findSelectorMatch(currentSelector, idRegex);
  specificity[0] += delta;
  [currentSelector, delta] = findSelectorMatch(currentSelector, classRegex);
  specificity[1] += delta;
  [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoElementRegex);
  specificity[2] += delta;
  [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassWithBracketsRegex);
  specificity[1] += delta;
  [currentSelector, delta] = findSelectorMatch(currentSelector, pseudoClassRegex);
  specificity[1] += delta;
  currentSelector = currentSelector.replace(/[*\s+>~]/g, " ").replace(/[#.]/g, " ");
  [currentSelector, delta] = findSelectorMatch(currentSelector, elementRegex);
  specificity[2] += delta;
  return specificity.join("");
}
var PSEUDO_ZERO = 1e-8;
function vectorMagnitude(v2) {
  return Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2));
}
function vectorsRatio(u2, v2) {
  return (u2[0] * v2[0] + u2[1] * v2[1]) / (vectorMagnitude(u2) * vectorMagnitude(v2));
}
function vectorsAngle(u2, v2) {
  return (u2[0] * v2[1] < u2[1] * v2[0] ? -1 : 1) * Math.acos(vectorsRatio(u2, v2));
}
function CB1(t2) {
  return t2 * t2 * t2;
}
function CB2(t2) {
  return 3 * t2 * t2 * (1 - t2);
}
function CB3(t2) {
  return 3 * t2 * (1 - t2) * (1 - t2);
}
function CB4(t2) {
  return (1 - t2) * (1 - t2) * (1 - t2);
}
function QB1(t2) {
  return t2 * t2;
}
function QB2(t2) {
  return 2 * t2 * (1 - t2);
}
function QB3(t2) {
  return (1 - t2) * (1 - t2);
}
class Property {
  constructor(document2, name, value) {
    this.document = document2;
    this.name = name;
    this.value = value;
    this.isNormalizedColor = false;
  }
  static empty(document2) {
    return new Property(document2, "EMPTY", "");
  }
  split() {
    var separator = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : " ";
    var {
      document: document2,
      name
    } = this;
    return compressSpaces(this.getString()).trim().split(separator).map((value) => new Property(document2, name, value));
  }
  hasValue(zeroIsValue) {
    var {
      value
    } = this;
    return value !== null && value !== "" && (zeroIsValue || value !== 0) && typeof value !== "undefined";
  }
  isString(regexp) {
    var {
      value
    } = this;
    var result = typeof value === "string";
    if (!result || !regexp) {
      return result;
    }
    return regexp.test(value);
  }
  isUrlDefinition() {
    return this.isString(/^url\(/);
  }
  isPixels() {
    if (!this.hasValue()) {
      return false;
    }
    var asString = this.getString();
    switch (true) {
      case asString.endsWith("px"):
      case /^[0-9]+$/.test(asString):
        return true;
      default:
        return false;
    }
  }
  setValue(value) {
    this.value = value;
    return this;
  }
  getValue(def) {
    if (typeof def === "undefined" || this.hasValue()) {
      return this.value;
    }
    return def;
  }
  getNumber(def) {
    if (!this.hasValue()) {
      if (typeof def === "undefined") {
        return 0;
      }
      return parseFloat(def);
    }
    var {
      value
    } = this;
    var n2 = parseFloat(value);
    if (this.isString(/%$/)) {
      n2 /= 100;
    }
    return n2;
  }
  getString(def) {
    if (typeof def === "undefined" || this.hasValue()) {
      return typeof this.value === "undefined" ? "" : String(this.value);
    }
    return String(def);
  }
  getColor(def) {
    var color = this.getString(def);
    if (this.isNormalizedColor) {
      return color;
    }
    this.isNormalizedColor = true;
    color = normalizeColor(color);
    this.value = color;
    return color;
  }
  getDpi() {
    return 96;
  }
  getRem() {
    return this.document.rootEmSize;
  }
  getEm() {
    return this.document.emSize;
  }
  getUnits() {
    return this.getString().replace(/[0-9.-]/g, "");
  }
  getPixels(axisOrIsFontSize) {
    var processPercent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (!this.hasValue()) {
      return 0;
    }
    var [axis, isFontSize] = typeof axisOrIsFontSize === "boolean" ? [void 0, axisOrIsFontSize] : [axisOrIsFontSize];
    var {
      viewPort
    } = this.document.screen;
    switch (true) {
      case this.isString(/vmin$/):
        return this.getNumber() / 100 * Math.min(viewPort.computeSize("x"), viewPort.computeSize("y"));
      case this.isString(/vmax$/):
        return this.getNumber() / 100 * Math.max(viewPort.computeSize("x"), viewPort.computeSize("y"));
      case this.isString(/vw$/):
        return this.getNumber() / 100 * viewPort.computeSize("x");
      case this.isString(/vh$/):
        return this.getNumber() / 100 * viewPort.computeSize("y");
      case this.isString(/rem$/):
        return this.getNumber() * this.getRem();
      case this.isString(/em$/):
        return this.getNumber() * this.getEm();
      case this.isString(/ex$/):
        return this.getNumber() * this.getEm() / 2;
      case this.isString(/px$/):
        return this.getNumber();
      case this.isString(/pt$/):
        return this.getNumber() * this.getDpi() * (1 / 72);
      case this.isString(/pc$/):
        return this.getNumber() * 15;
      case this.isString(/cm$/):
        return this.getNumber() * this.getDpi() / 2.54;
      case this.isString(/mm$/):
        return this.getNumber() * this.getDpi() / 25.4;
      case this.isString(/in$/):
        return this.getNumber() * this.getDpi();
      case (this.isString(/%$/) && isFontSize):
        return this.getNumber() * this.getEm();
      case this.isString(/%$/):
        return this.getNumber() * viewPort.computeSize(axis);
      default: {
        var n2 = this.getNumber();
        if (processPercent && n2 < 1) {
          return n2 * viewPort.computeSize(axis);
        }
        return n2;
      }
    }
  }
  getMilliseconds() {
    if (!this.hasValue()) {
      return 0;
    }
    if (this.isString(/ms$/)) {
      return this.getNumber();
    }
    return this.getNumber() * 1e3;
  }
  getRadians() {
    if (!this.hasValue()) {
      return 0;
    }
    switch (true) {
      case this.isString(/deg$/):
        return this.getNumber() * (Math.PI / 180);
      case this.isString(/grad$/):
        return this.getNumber() * (Math.PI / 200);
      case this.isString(/rad$/):
        return this.getNumber();
      default:
        return this.getNumber() * (Math.PI / 180);
    }
  }
  getDefinition() {
    var asString = this.getString();
    var name = /#([^)'"]+)/.exec(asString);
    if (name) {
      name = name[1];
    }
    if (!name) {
      name = asString;
    }
    return this.document.definitions[name];
  }
  getFillStyleDefinition(element, opacity) {
    var def = this.getDefinition();
    if (!def) {
      return null;
    }
    if (typeof def.createGradient === "function") {
      return def.createGradient(this.document.ctx, element, opacity);
    }
    if (typeof def.createPattern === "function") {
      if (def.getHrefAttribute().hasValue()) {
        var patternTransform = def.getAttribute("patternTransform");
        def = def.getHrefAttribute().getDefinition();
        if (patternTransform.hasValue()) {
          def.getAttribute("patternTransform", true).setValue(patternTransform.value);
        }
      }
      return def.createPattern(this.document.ctx, element, opacity);
    }
    return null;
  }
  getTextBaseline() {
    if (!this.hasValue()) {
      return null;
    }
    return Property.textBaselineMapping[this.getString()];
  }
  addOpacity(opacity) {
    var value = this.getColor();
    var len = value.length;
    var commas = 0;
    for (var i2 = 0; i2 < len; i2++) {
      if (value[i2] === ",") {
        commas++;
      }
      if (commas === 3) {
        break;
      }
    }
    if (opacity.hasValue() && this.isString() && commas !== 3) {
      var color = new RGBColor$1(value);
      if (color.ok) {
        color.alpha = opacity.getNumber();
        value = color.toRGBA();
      }
    }
    return new Property(this.document, this.name, value);
  }
}
Property.textBaselineMapping = {
  "baseline": "alphabetic",
  "before-edge": "top",
  "text-before-edge": "top",
  "middle": "middle",
  "central": "middle",
  "after-edge": "bottom",
  "text-after-edge": "bottom",
  "ideographic": "ideographic",
  "alphabetic": "alphabetic",
  "hanging": "hanging",
  "mathematical": "alphabetic"
};
class ViewPort {
  constructor() {
    this.viewPorts = [];
  }
  clear() {
    this.viewPorts = [];
  }
  setCurrent(width, height) {
    this.viewPorts.push({
      width,
      height
    });
  }
  removeCurrent() {
    this.viewPorts.pop();
  }
  getCurrent() {
    var {
      viewPorts
    } = this;
    return viewPorts[viewPorts.length - 1];
  }
  get width() {
    return this.getCurrent().width;
  }
  get height() {
    return this.getCurrent().height;
  }
  computeSize(d) {
    if (typeof d === "number") {
      return d;
    }
    if (d === "x") {
      return this.width;
    }
    if (d === "y") {
      return this.height;
    }
    return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / Math.sqrt(2);
  }
}
class Point {
  constructor(x, y2) {
    this.x = x;
    this.y = y2;
  }
  static parse(point) {
    var defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    var [x = defaultValue, y2 = defaultValue] = toNumbers(point);
    return new Point(x, y2);
  }
  static parseScale(scale) {
    var defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    var [x = defaultValue, y2 = x] = toNumbers(scale);
    return new Point(x, y2);
  }
  static parsePath(path2) {
    var points = toNumbers(path2);
    var len = points.length;
    var pathPoints = [];
    for (var i2 = 0; i2 < len; i2 += 2) {
      pathPoints.push(new Point(points[i2], points[i2 + 1]));
    }
    return pathPoints;
  }
  angleTo(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  }
  applyTransform(transform) {
    var {
      x,
      y: y2
    } = this;
    var xp = x * transform[0] + y2 * transform[2] + transform[4];
    var yp = x * transform[1] + y2 * transform[3] + transform[5];
    this.x = xp;
    this.y = yp;
  }
}
class Mouse {
  constructor(screen) {
    this.screen = screen;
    this.working = false;
    this.events = [];
    this.eventElements = [];
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }
  isWorking() {
    return this.working;
  }
  start() {
    if (this.working) {
      return;
    }
    var {
      screen,
      onClick,
      onMouseMove
    } = this;
    var canvas = screen.ctx.canvas;
    canvas.onclick = onClick;
    canvas.onmousemove = onMouseMove;
    this.working = true;
  }
  stop() {
    if (!this.working) {
      return;
    }
    var canvas = this.screen.ctx.canvas;
    this.working = false;
    canvas.onclick = null;
    canvas.onmousemove = null;
  }
  hasEvents() {
    return this.working && this.events.length > 0;
  }
  runEvents() {
    if (!this.working) {
      return;
    }
    var {
      screen: document2,
      events,
      eventElements
    } = this;
    var {
      style
    } = document2.ctx.canvas;
    if (style) {
      style.cursor = "";
    }
    events.forEach((_ref, i2) => {
      var {
        run
      } = _ref;
      var element = eventElements[i2];
      while (element) {
        run(element);
        element = element.parent;
      }
    });
    this.events = [];
    this.eventElements = [];
  }
  checkPath(element, ctx) {
    if (!this.working || !ctx) {
      return;
    }
    var {
      events,
      eventElements
    } = this;
    events.forEach((_ref2, i2) => {
      var {
        x,
        y: y2
      } = _ref2;
      if (!eventElements[i2] && ctx.isPointInPath && ctx.isPointInPath(x, y2)) {
        eventElements[i2] = element;
      }
    });
  }
  checkBoundingBox(element, boundingBox) {
    if (!this.working || !boundingBox) {
      return;
    }
    var {
      events,
      eventElements
    } = this;
    events.forEach((_ref3, i2) => {
      var {
        x,
        y: y2
      } = _ref3;
      if (!eventElements[i2] && boundingBox.isPointInBox(x, y2)) {
        eventElements[i2] = element;
      }
    });
  }
  mapXY(x, y2) {
    var {
      window: window2,
      ctx
    } = this.screen;
    var point = new Point(x, y2);
    var element = ctx.canvas;
    while (element) {
      point.x -= element.offsetLeft;
      point.y -= element.offsetTop;
      element = element.offsetParent;
    }
    if (window2.scrollX) {
      point.x += window2.scrollX;
    }
    if (window2.scrollY) {
      point.y += window2.scrollY;
    }
    return point;
  }
  onClick(event) {
    var {
      x,
      y: y2
    } = this.mapXY(event.clientX, event.clientY);
    this.events.push({
      type: "onclick",
      x,
      y: y2,
      run(eventTarget) {
        if (eventTarget.onClick) {
          eventTarget.onClick();
        }
      }
    });
  }
  onMouseMove(event) {
    var {
      x,
      y: y2
    } = this.mapXY(event.clientX, event.clientY);
    this.events.push({
      type: "onmousemove",
      x,
      y: y2,
      run(eventTarget) {
        if (eventTarget.onMouseMove) {
          eventTarget.onMouseMove();
        }
      }
    });
  }
}
var defaultWindow = typeof window !== "undefined" ? window : null;
var defaultFetch$1 = typeof fetch !== "undefined" ? fetch.bind(void 0) : null;
class Screen {
  constructor(ctx) {
    var {
      fetch: fetch2 = defaultFetch$1,
      window: window2 = defaultWindow
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.ctx = ctx;
    this.FRAMERATE = 30;
    this.MAX_VIRTUAL_PIXELS = 3e4;
    this.CLIENT_WIDTH = 800;
    this.CLIENT_HEIGHT = 600;
    this.viewPort = new ViewPort();
    this.mouse = new Mouse(this);
    this.animations = [];
    this.waits = [];
    this.frameDuration = 0;
    this.isReadyLock = false;
    this.isFirstRender = true;
    this.intervalId = null;
    this.window = window2;
    this.fetch = fetch2;
  }
  wait(checker) {
    this.waits.push(checker);
  }
  ready() {
    if (!this.readyPromise) {
      return Promise.resolve();
    }
    return this.readyPromise;
  }
  isReady() {
    if (this.isReadyLock) {
      return true;
    }
    var isReadyLock = this.waits.every((_2) => _2());
    if (isReadyLock) {
      this.waits = [];
      if (this.resolveReady) {
        this.resolveReady();
      }
    }
    this.isReadyLock = isReadyLock;
    return isReadyLock;
  }
  setDefaults(ctx) {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 4;
  }
  setViewBox(_ref) {
    var {
      document: document2,
      ctx,
      aspectRatio,
      width,
      desiredWidth,
      height,
      desiredHeight,
      minX = 0,
      minY = 0,
      refX,
      refY,
      clip = false,
      clipX = 0,
      clipY = 0
    } = _ref;
    var cleanAspectRatio = compressSpaces(aspectRatio).replace(/^defer\s/, "");
    var [aspectRatioAlign, aspectRatioMeetOrSlice] = cleanAspectRatio.split(" ");
    var align = aspectRatioAlign || "xMidYMid";
    var meetOrSlice = aspectRatioMeetOrSlice || "meet";
    var scaleX = width / desiredWidth;
    var scaleY = height / desiredHeight;
    var scaleMin = Math.min(scaleX, scaleY);
    var scaleMax = Math.max(scaleX, scaleY);
    var finalDesiredWidth = desiredWidth;
    var finalDesiredHeight = desiredHeight;
    if (meetOrSlice === "meet") {
      finalDesiredWidth *= scaleMin;
      finalDesiredHeight *= scaleMin;
    }
    if (meetOrSlice === "slice") {
      finalDesiredWidth *= scaleMax;
      finalDesiredHeight *= scaleMax;
    }
    var refXProp = new Property(document2, "refX", refX);
    var refYProp = new Property(document2, "refY", refY);
    var hasRefs = refXProp.hasValue() && refYProp.hasValue();
    if (hasRefs) {
      ctx.translate(-scaleMin * refXProp.getPixels("x"), -scaleMin * refYProp.getPixels("y"));
    }
    if (clip) {
      var scaledClipX = scaleMin * clipX;
      var scaledClipY = scaleMin * clipY;
      ctx.beginPath();
      ctx.moveTo(scaledClipX, scaledClipY);
      ctx.lineTo(width, scaledClipY);
      ctx.lineTo(width, height);
      ctx.lineTo(scaledClipX, height);
      ctx.closePath();
      ctx.clip();
    }
    if (!hasRefs) {
      var isMeetMinY = meetOrSlice === "meet" && scaleMin === scaleY;
      var isSliceMaxY = meetOrSlice === "slice" && scaleMax === scaleY;
      var isMeetMinX = meetOrSlice === "meet" && scaleMin === scaleX;
      var isSliceMaxX = meetOrSlice === "slice" && scaleMax === scaleX;
      if (align.startsWith("xMid") && (isMeetMinY || isSliceMaxY)) {
        ctx.translate(width / 2 - finalDesiredWidth / 2, 0);
      }
      if (align.endsWith("YMid") && (isMeetMinX || isSliceMaxX)) {
        ctx.translate(0, height / 2 - finalDesiredHeight / 2);
      }
      if (align.startsWith("xMax") && (isMeetMinY || isSliceMaxY)) {
        ctx.translate(width - finalDesiredWidth, 0);
      }
      if (align.endsWith("YMax") && (isMeetMinX || isSliceMaxX)) {
        ctx.translate(0, height - finalDesiredHeight);
      }
    }
    switch (true) {
      case align === "none":
        ctx.scale(scaleX, scaleY);
        break;
      case meetOrSlice === "meet":
        ctx.scale(scaleMin, scaleMin);
        break;
      case meetOrSlice === "slice":
        ctx.scale(scaleMax, scaleMax);
        break;
    }
    ctx.translate(-minX, -minY);
  }
  start(element) {
    var {
      enableRedraw = false,
      ignoreMouse = false,
      ignoreAnimation = false,
      ignoreDimensions = false,
      ignoreClear = false,
      forceRedraw,
      scaleWidth,
      scaleHeight,
      offsetX,
      offsetY
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var {
      FRAMERATE,
      mouse
    } = this;
    var frameDuration = 1e3 / FRAMERATE;
    this.frameDuration = frameDuration;
    this.readyPromise = new Promise((resolve) => {
      this.resolveReady = resolve;
    });
    if (this.isReady()) {
      this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
    }
    if (!enableRedraw) {
      return;
    }
    var now = Date.now();
    var then = now;
    var delta = 0;
    var tick = () => {
      now = Date.now();
      delta = now - then;
      if (delta >= frameDuration) {
        then = now - delta % frameDuration;
        if (this.shouldUpdate(ignoreAnimation, forceRedraw)) {
          this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
          mouse.runEvents();
        }
      }
      this.intervalId = requestAnimationFrame(tick);
    };
    if (!ignoreMouse) {
      mouse.start();
    }
    this.intervalId = requestAnimationFrame(tick);
  }
  stop() {
    if (this.intervalId) {
      requestAnimationFrame.cancel(this.intervalId);
      this.intervalId = null;
    }
    this.mouse.stop();
  }
  shouldUpdate(ignoreAnimation, forceRedraw) {
    if (!ignoreAnimation) {
      var {
        frameDuration
      } = this;
      var shouldUpdate = this.animations.reduce((shouldUpdate2, animation) => animation.update(frameDuration) || shouldUpdate2, false);
      if (shouldUpdate) {
        return true;
      }
    }
    if (typeof forceRedraw === "function" && forceRedraw()) {
      return true;
    }
    if (!this.isReadyLock && this.isReady()) {
      return true;
    }
    if (this.mouse.hasEvents()) {
      return true;
    }
    return false;
  }
  render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY) {
    var {
      CLIENT_WIDTH,
      CLIENT_HEIGHT,
      viewPort,
      ctx,
      isFirstRender
    } = this;
    var canvas = ctx.canvas;
    viewPort.clear();
    if (canvas.width && canvas.height) {
      viewPort.setCurrent(canvas.width, canvas.height);
    } else {
      viewPort.setCurrent(CLIENT_WIDTH, CLIENT_HEIGHT);
    }
    var widthStyle = element.getStyle("width");
    var heightStyle = element.getStyle("height");
    if (!ignoreDimensions && (isFirstRender || typeof scaleWidth !== "number" && typeof scaleHeight !== "number")) {
      if (widthStyle.hasValue()) {
        canvas.width = widthStyle.getPixels("x");
        if (canvas.style) {
          canvas.style.width = "".concat(canvas.width, "px");
        }
      }
      if (heightStyle.hasValue()) {
        canvas.height = heightStyle.getPixels("y");
        if (canvas.style) {
          canvas.style.height = "".concat(canvas.height, "px");
        }
      }
    }
    var cWidth = canvas.clientWidth || canvas.width;
    var cHeight = canvas.clientHeight || canvas.height;
    if (ignoreDimensions && widthStyle.hasValue() && heightStyle.hasValue()) {
      cWidth = widthStyle.getPixels("x");
      cHeight = heightStyle.getPixels("y");
    }
    viewPort.setCurrent(cWidth, cHeight);
    if (typeof offsetX === "number") {
      element.getAttribute("x", true).setValue(offsetX);
    }
    if (typeof offsetY === "number") {
      element.getAttribute("y", true).setValue(offsetY);
    }
    if (typeof scaleWidth === "number" || typeof scaleHeight === "number") {
      var viewBox = toNumbers(element.getAttribute("viewBox").getString());
      var xRatio = 0;
      var yRatio = 0;
      if (typeof scaleWidth === "number") {
        var _widthStyle = element.getStyle("width");
        if (_widthStyle.hasValue()) {
          xRatio = _widthStyle.getPixels("x") / scaleWidth;
        } else if (!isNaN(viewBox[2])) {
          xRatio = viewBox[2] / scaleWidth;
        }
      }
      if (typeof scaleHeight === "number") {
        var _heightStyle = element.getStyle("height");
        if (_heightStyle.hasValue()) {
          yRatio = _heightStyle.getPixels("y") / scaleHeight;
        } else if (!isNaN(viewBox[3])) {
          yRatio = viewBox[3] / scaleHeight;
        }
      }
      if (!xRatio) {
        xRatio = yRatio;
      }
      if (!yRatio) {
        yRatio = xRatio;
      }
      element.getAttribute("width", true).setValue(scaleWidth);
      element.getAttribute("height", true).setValue(scaleHeight);
      var transformStyle = element.getStyle("transform", true, true);
      transformStyle.setValue("".concat(transformStyle.getString(), " scale(").concat(1 / xRatio, ", ").concat(1 / yRatio, ")"));
    }
    if (!ignoreClear) {
      ctx.clearRect(0, 0, cWidth, cHeight);
    }
    element.render(ctx);
    if (isFirstRender) {
      this.isFirstRender = false;
    }
  }
}
Screen.defaultWindow = defaultWindow;
Screen.defaultFetch = defaultFetch$1;
var {
  defaultFetch
} = Screen;
var DefaultDOMParser = typeof DOMParser !== "undefined" ? DOMParser : null;
class Parser {
  constructor() {
    var {
      fetch: fetch2 = defaultFetch,
      DOMParser: DOMParser2 = DefaultDOMParser
    } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.fetch = fetch2;
    this.DOMParser = DOMParser2;
  }
  parse(resource) {
    var _this = this;
    return _asyncToGenerator(function* () {
      if (resource.startsWith("<")) {
        return _this.parseFromString(resource);
      }
      return _this.load(resource);
    })();
  }
  parseFromString(xml) {
    var parser = new this.DOMParser();
    try {
      return this.checkDocument(parser.parseFromString(xml, "image/svg+xml"));
    } catch (err) {
      return this.checkDocument(parser.parseFromString(xml, "text/xml"));
    }
  }
  checkDocument(document2) {
    var parserError = document2.getElementsByTagName("parsererror")[0];
    if (parserError) {
      throw new Error(parserError.textContent);
    }
    return document2;
  }
  load(url) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var response = yield _this2.fetch(url);
      var xml = yield response.text();
      return _this2.parseFromString(xml);
    })();
  }
}
class Translate {
  constructor(_2, point) {
    this.type = "translate";
    this.point = null;
    this.point = Point.parse(point);
  }
  apply(ctx) {
    var {
      x,
      y: y2
    } = this.point;
    ctx.translate(x || 0, y2 || 0);
  }
  unapply(ctx) {
    var {
      x,
      y: y2
    } = this.point;
    ctx.translate(-1 * x || 0, -1 * y2 || 0);
  }
  applyToPoint(point) {
    var {
      x,
      y: y2
    } = this.point;
    point.applyTransform([1, 0, 0, 1, x || 0, y2 || 0]);
  }
}
class Rotate {
  constructor(document2, rotate, transformOrigin) {
    this.type = "rotate";
    this.angle = null;
    this.originX = null;
    this.originY = null;
    this.cx = 0;
    this.cy = 0;
    var numbers = toNumbers(rotate);
    this.angle = new Property(document2, "angle", numbers[0]);
    this.originX = transformOrigin[0];
    this.originY = transformOrigin[1];
    this.cx = numbers[1] || 0;
    this.cy = numbers[2] || 0;
  }
  apply(ctx) {
    var {
      cx,
      cy,
      originX,
      originY,
      angle
    } = this;
    var tx = cx + originX.getPixels("x");
    var ty = cy + originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.rotate(angle.getRadians());
    ctx.translate(-tx, -ty);
  }
  unapply(ctx) {
    var {
      cx,
      cy,
      originX,
      originY,
      angle
    } = this;
    var tx = cx + originX.getPixels("x");
    var ty = cy + originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.rotate(-1 * angle.getRadians());
    ctx.translate(-tx, -ty);
  }
  applyToPoint(point) {
    var {
      cx,
      cy,
      angle
    } = this;
    var rad = angle.getRadians();
    point.applyTransform([
      1,
      0,
      0,
      1,
      cx || 0,
      cy || 0
      // this.p.y
    ]);
    point.applyTransform([Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0]);
    point.applyTransform([
      1,
      0,
      0,
      1,
      -cx || 0,
      -cy || 0
      // -this.p.y
    ]);
  }
}
class Scale {
  constructor(_2, scale, transformOrigin) {
    this.type = "scale";
    this.scale = null;
    this.originX = null;
    this.originY = null;
    var scaleSize = Point.parseScale(scale);
    if (scaleSize.x === 0 || scaleSize.y === 0) {
      scaleSize.x = PSEUDO_ZERO;
      scaleSize.y = PSEUDO_ZERO;
    }
    this.scale = scaleSize;
    this.originX = transformOrigin[0];
    this.originY = transformOrigin[1];
  }
  apply(ctx) {
    var {
      scale: {
        x,
        y: y2
      },
      originX,
      originY
    } = this;
    var tx = originX.getPixels("x");
    var ty = originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.scale(x, y2 || x);
    ctx.translate(-tx, -ty);
  }
  unapply(ctx) {
    var {
      scale: {
        x,
        y: y2
      },
      originX,
      originY
    } = this;
    var tx = originX.getPixels("x");
    var ty = originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.scale(1 / x, 1 / y2 || x);
    ctx.translate(-tx, -ty);
  }
  applyToPoint(point) {
    var {
      x,
      y: y2
    } = this.scale;
    point.applyTransform([x || 0, 0, 0, y2 || 0, 0, 0]);
  }
}
class Matrix {
  constructor(_2, matrix, transformOrigin) {
    this.type = "matrix";
    this.matrix = [];
    this.originX = null;
    this.originY = null;
    this.matrix = toNumbers(matrix);
    this.originX = transformOrigin[0];
    this.originY = transformOrigin[1];
  }
  apply(ctx) {
    var {
      originX,
      originY,
      matrix
    } = this;
    var tx = originX.getPixels("x");
    var ty = originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    ctx.translate(-tx, -ty);
  }
  unapply(ctx) {
    var {
      originX,
      originY,
      matrix
    } = this;
    var a2 = matrix[0];
    var b = matrix[2];
    var c2 = matrix[4];
    var d = matrix[1];
    var e2 = matrix[3];
    var f2 = matrix[5];
    var g = 0;
    var h2 = 0;
    var i2 = 1;
    var det = 1 / (a2 * (e2 * i2 - f2 * h2) - b * (d * i2 - f2 * g) + c2 * (d * h2 - e2 * g));
    var tx = originX.getPixels("x");
    var ty = originY.getPixels("y");
    ctx.translate(tx, ty);
    ctx.transform(det * (e2 * i2 - f2 * h2), det * (f2 * g - d * i2), det * (c2 * h2 - b * i2), det * (a2 * i2 - c2 * g), det * (b * f2 - c2 * e2), det * (c2 * d - a2 * f2));
    ctx.translate(-tx, -ty);
  }
  applyToPoint(point) {
    point.applyTransform(this.matrix);
  }
}
class Skew extends Matrix {
  constructor(document2, skew, transformOrigin) {
    super(document2, skew, transformOrigin);
    this.type = "skew";
    this.angle = null;
    this.angle = new Property(document2, "angle", skew);
  }
}
class SkewX extends Skew {
  constructor(document2, skew, transformOrigin) {
    super(document2, skew, transformOrigin);
    this.type = "skewX";
    this.matrix = [1, 0, Math.tan(this.angle.getRadians()), 1, 0, 0];
  }
}
class SkewY extends Skew {
  constructor(document2, skew, transformOrigin) {
    super(document2, skew, transformOrigin);
    this.type = "skewY";
    this.matrix = [1, Math.tan(this.angle.getRadians()), 0, 1, 0, 0];
  }
}
function parseTransforms(transform) {
  return compressSpaces(transform).trim().replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
}
function parseTransform(transform) {
  var [type, value] = transform.split("(");
  return [type.trim(), value.trim().replace(")", "")];
}
class Transform {
  constructor(document2, transform, transformOrigin) {
    this.document = document2;
    this.transforms = [];
    var data = parseTransforms(transform);
    data.forEach((transform2) => {
      if (transform2 === "none") {
        return;
      }
      var [type, value] = parseTransform(transform2);
      var TransformType = Transform.transformTypes[type];
      if (typeof TransformType !== "undefined") {
        this.transforms.push(new TransformType(this.document, value, transformOrigin));
      }
    });
  }
  static fromElement(document2, element) {
    var transformStyle = element.getStyle("transform", false, true);
    var [transformOriginXProperty, transformOriginYProperty = transformOriginXProperty] = element.getStyle("transform-origin", false, true).split();
    var transformOrigin = [transformOriginXProperty, transformOriginYProperty];
    if (transformStyle.hasValue()) {
      return new Transform(document2, transformStyle.getString(), transformOrigin);
    }
    return null;
  }
  apply(ctx) {
    var {
      transforms
    } = this;
    var len = transforms.length;
    for (var i2 = 0; i2 < len; i2++) {
      transforms[i2].apply(ctx);
    }
  }
  unapply(ctx) {
    var {
      transforms
    } = this;
    var len = transforms.length;
    for (var i2 = len - 1; i2 >= 0; i2--) {
      transforms[i2].unapply(ctx);
    }
  }
  // TODO: applyToPoint unused ... remove?
  applyToPoint(point) {
    var {
      transforms
    } = this;
    var len = transforms.length;
    for (var i2 = 0; i2 < len; i2++) {
      transforms[i2].applyToPoint(point);
    }
  }
}
Transform.transformTypes = {
  translate: Translate,
  rotate: Rotate,
  scale: Scale,
  matrix: Matrix,
  skewX: SkewX,
  skewY: SkewY
};
class Element {
  constructor(document2, node2) {
    var captureTextNodes = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    this.document = document2;
    this.node = node2;
    this.captureTextNodes = captureTextNodes;
    this.attributes = /* @__PURE__ */ Object.create(null);
    this.styles = /* @__PURE__ */ Object.create(null);
    this.stylesSpecificity = /* @__PURE__ */ Object.create(null);
    this.animationFrozen = false;
    this.animationFrozenValue = "";
    this.parent = null;
    this.children = [];
    if (!node2 || node2.nodeType !== 1) {
      return;
    }
    Array.from(node2.attributes).forEach((attribute) => {
      var nodeName = normalizeAttributeName(attribute.nodeName);
      this.attributes[nodeName] = new Property(document2, nodeName, attribute.value);
    });
    this.addStylesFromStyleDefinition();
    if (this.getAttribute("style").hasValue()) {
      var styles = this.getAttribute("style").getString().split(";").map((_2) => _2.trim());
      styles.forEach((style) => {
        if (!style) {
          return;
        }
        var [name, value] = style.split(":").map((_2) => _2.trim());
        this.styles[name] = new Property(document2, name, value);
      });
    }
    var {
      definitions
    } = document2;
    var id = this.getAttribute("id");
    if (id.hasValue()) {
      if (!definitions[id.getString()]) {
        definitions[id.getString()] = this;
      }
    }
    Array.from(node2.childNodes).forEach((childNode) => {
      if (childNode.nodeType === 1) {
        this.addChild(childNode);
      } else if (captureTextNodes && (childNode.nodeType === 3 || childNode.nodeType === 4)) {
        var textNode = document2.createTextNode(childNode);
        if (textNode.getText().length > 0) {
          this.addChild(textNode);
        }
      }
    });
  }
  getAttribute(name) {
    var createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var attr = this.attributes[name];
    if (!attr && createIfNotExists) {
      var _attr = new Property(this.document, name, "");
      this.attributes[name] = _attr;
      return _attr;
    }
    return attr || Property.empty(this.document);
  }
  getHrefAttribute() {
    for (var key in this.attributes) {
      if (key === "href" || key.endsWith(":href")) {
        return this.attributes[key];
      }
    }
    return Property.empty(this.document);
  }
  getStyle(name) {
    var createIfNotExists = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var skipAncestors = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var style = this.styles[name];
    if (style) {
      return style;
    }
    var attr = this.getAttribute(name);
    if (attr !== null && attr !== void 0 && attr.hasValue()) {
      this.styles[name] = attr;
      return attr;
    }
    if (!skipAncestors) {
      var {
        parent
      } = this;
      if (parent) {
        var parentStyle = parent.getStyle(name);
        if (parentStyle !== null && parentStyle !== void 0 && parentStyle.hasValue()) {
          return parentStyle;
        }
      }
    }
    if (createIfNotExists) {
      var _style = new Property(this.document, name, "");
      this.styles[name] = _style;
      return _style;
    }
    return style || Property.empty(this.document);
  }
  render(ctx) {
    if (this.getStyle("display").getString() === "none" || this.getStyle("visibility").getString() === "hidden") {
      return;
    }
    ctx.save();
    if (this.getStyle("mask").hasValue()) {
      var mask = this.getStyle("mask").getDefinition();
      if (mask) {
        this.applyEffects(ctx);
        mask.apply(ctx, this);
      }
    } else if (this.getStyle("filter").getValue("none") !== "none") {
      var filter = this.getStyle("filter").getDefinition();
      if (filter) {
        this.applyEffects(ctx);
        filter.apply(ctx, this);
      }
    } else {
      this.setContext(ctx);
      this.renderChildren(ctx);
      this.clearContext(ctx);
    }
    ctx.restore();
  }
  setContext(_2) {
  }
  applyEffects(ctx) {
    var transform = Transform.fromElement(this.document, this);
    if (transform) {
      transform.apply(ctx);
    }
    var clipPathStyleProp = this.getStyle("clip-path", false, true);
    if (clipPathStyleProp.hasValue()) {
      var clip = clipPathStyleProp.getDefinition();
      if (clip) {
        clip.apply(ctx);
      }
    }
  }
  clearContext(_2) {
  }
  renderChildren(ctx) {
    this.children.forEach((child) => {
      child.render(ctx);
    });
  }
  addChild(childNode) {
    var child = childNode instanceof Element ? childNode : this.document.createElement(childNode);
    child.parent = this;
    if (!Element.ignoreChildTypes.includes(child.type)) {
      this.children.push(child);
    }
  }
  matchesSelector(selector) {
    var _node$getAttribute;
    var {
      node: node2
    } = this;
    if (typeof node2.matches === "function") {
      return node2.matches(selector);
    }
    var styleClasses = (_node$getAttribute = node2.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node2, "class");
    if (!styleClasses || styleClasses === "") {
      return false;
    }
    return styleClasses.split(" ").some((styleClass) => ".".concat(styleClass) === selector);
  }
  addStylesFromStyleDefinition() {
    var {
      styles,
      stylesSpecificity
    } = this.document;
    for (var selector in styles) {
      if (!selector.startsWith("@") && this.matchesSelector(selector)) {
        var style = styles[selector];
        var specificity = stylesSpecificity[selector];
        if (style) {
          for (var name in style) {
            var existingSpecificity = this.stylesSpecificity[name];
            if (typeof existingSpecificity === "undefined") {
              existingSpecificity = "000";
            }
            if (specificity >= existingSpecificity) {
              this.styles[name] = style[name];
              this.stylesSpecificity[name] = specificity;
            }
          }
        }
      }
    }
  }
  removeStyles(element, ignoreStyles) {
    var toRestore = ignoreStyles.reduce((toRestore2, name) => {
      var styleProp = element.getStyle(name);
      if (!styleProp.hasValue()) {
        return toRestore2;
      }
      var value = styleProp.getString();
      styleProp.setValue("");
      return [...toRestore2, [name, value]];
    }, []);
    return toRestore;
  }
  restoreStyles(element, styles) {
    styles.forEach((_ref) => {
      var [name, value] = _ref;
      element.getStyle(name, true).setValue(value);
    });
  }
  isFirstChild() {
    var _this$parent;
    return ((_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.children.indexOf(this)) === 0;
  }
}
Element.ignoreChildTypes = ["title"];
class UnknownElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
  }
}
function wrapFontFamily(fontFamily) {
  var trimmed = fontFamily.trim();
  return /^('|")/.test(trimmed) ? trimmed : '"'.concat(trimmed, '"');
}
function prepareFontFamily(fontFamily) {
  return typeof process === "undefined" ? fontFamily : fontFamily.trim().split(",").map(wrapFontFamily).join(",");
}
function prepareFontStyle(fontStyle) {
  if (!fontStyle) {
    return "";
  }
  var targetFontStyle = fontStyle.trim().toLowerCase();
  switch (targetFontStyle) {
    case "normal":
    case "italic":
    case "oblique":
    case "inherit":
    case "initial":
    case "unset":
      return targetFontStyle;
    default:
      if (/^oblique\s+(-|)\d+deg$/.test(targetFontStyle)) {
        return targetFontStyle;
      }
      return "";
  }
}
function prepareFontWeight(fontWeight) {
  if (!fontWeight) {
    return "";
  }
  var targetFontWeight = fontWeight.trim().toLowerCase();
  switch (targetFontWeight) {
    case "normal":
    case "bold":
    case "lighter":
    case "bolder":
    case "inherit":
    case "initial":
    case "unset":
      return targetFontWeight;
    default:
      if (/^[\d.]+$/.test(targetFontWeight)) {
        return targetFontWeight;
      }
      return "";
  }
}
class Font {
  constructor(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
    var inheritFont = inherit ? typeof inherit === "string" ? Font.parse(inherit) : inherit : {};
    this.fontFamily = fontFamily || inheritFont.fontFamily;
    this.fontSize = fontSize || inheritFont.fontSize;
    this.fontStyle = fontStyle || inheritFont.fontStyle;
    this.fontWeight = fontWeight || inheritFont.fontWeight;
    this.fontVariant = fontVariant || inheritFont.fontVariant;
  }
  static parse() {
    var font = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    var inherit = arguments.length > 1 ? arguments[1] : void 0;
    var fontStyle = "";
    var fontVariant = "";
    var fontWeight = "";
    var fontSize = "";
    var fontFamily = "";
    var parts = compressSpaces(font).trim().split(" ");
    var set = {
      fontSize: false,
      fontStyle: false,
      fontWeight: false,
      fontVariant: false
    };
    parts.forEach((part) => {
      switch (true) {
        case (!set.fontStyle && Font.styles.includes(part)):
          if (part !== "inherit") {
            fontStyle = part;
          }
          set.fontStyle = true;
          break;
        case (!set.fontVariant && Font.variants.includes(part)):
          if (part !== "inherit") {
            fontVariant = part;
          }
          set.fontStyle = true;
          set.fontVariant = true;
          break;
        case (!set.fontWeight && Font.weights.includes(part)):
          if (part !== "inherit") {
            fontWeight = part;
          }
          set.fontStyle = true;
          set.fontVariant = true;
          set.fontWeight = true;
          break;
        case !set.fontSize:
          if (part !== "inherit") {
            [fontSize] = part.split("/");
          }
          set.fontStyle = true;
          set.fontVariant = true;
          set.fontWeight = true;
          set.fontSize = true;
          break;
        default:
          if (part !== "inherit") {
            fontFamily += part;
          }
      }
    });
    return new Font(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit);
  }
  toString() {
    return [
      prepareFontStyle(this.fontStyle),
      this.fontVariant,
      prepareFontWeight(this.fontWeight),
      this.fontSize,
      // Wrap fontFamily only on nodejs and only for canvas.ctx
      prepareFontFamily(this.fontFamily)
    ].join(" ").trim();
  }
}
Font.styles = "normal|italic|oblique|inherit";
Font.variants = "normal|small-caps|inherit";
Font.weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";
class BoundingBox {
  constructor() {
    var x1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Number.NaN;
    var y1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.NaN;
    var x2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Number.NaN;
    var y2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Number.NaN;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.addPoint(x1, y1);
    this.addPoint(x2, y2);
  }
  get x() {
    return this.x1;
  }
  get y() {
    return this.y1;
  }
  get width() {
    return this.x2 - this.x1;
  }
  get height() {
    return this.y2 - this.y1;
  }
  addPoint(x, y2) {
    if (typeof x !== "undefined") {
      if (isNaN(this.x1) || isNaN(this.x2)) {
        this.x1 = x;
        this.x2 = x;
      }
      if (x < this.x1) {
        this.x1 = x;
      }
      if (x > this.x2) {
        this.x2 = x;
      }
    }
    if (typeof y2 !== "undefined") {
      if (isNaN(this.y1) || isNaN(this.y2)) {
        this.y1 = y2;
        this.y2 = y2;
      }
      if (y2 < this.y1) {
        this.y1 = y2;
      }
      if (y2 > this.y2) {
        this.y2 = y2;
      }
    }
  }
  addX(x) {
    this.addPoint(x, null);
  }
  addY(y2) {
    this.addPoint(null, y2);
  }
  addBoundingBox(boundingBox) {
    if (!boundingBox) {
      return;
    }
    var {
      x1,
      y1,
      x2,
      y2
    } = boundingBox;
    this.addPoint(x1, y1);
    this.addPoint(x2, y2);
  }
  sumCubic(t2, p0, p1, p2, p3) {
    return Math.pow(1 - t2, 3) * p0 + 3 * Math.pow(1 - t2, 2) * t2 * p1 + 3 * (1 - t2) * Math.pow(t2, 2) * p2 + Math.pow(t2, 3) * p3;
  }
  bezierCurveAdd(forX, p0, p1, p2, p3) {
    var b = 6 * p0 - 12 * p1 + 6 * p2;
    var a2 = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
    var c2 = 3 * p1 - 3 * p0;
    if (a2 === 0) {
      if (b === 0) {
        return;
      }
      var t2 = -c2 / b;
      if (0 < t2 && t2 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t2, p0, p1, p2, p3));
        } else {
          this.addY(this.sumCubic(t2, p0, p1, p2, p3));
        }
      }
      return;
    }
    var b2ac = Math.pow(b, 2) - 4 * c2 * a2;
    if (b2ac < 0) {
      return;
    }
    var t1 = (-b + Math.sqrt(b2ac)) / (2 * a2);
    if (0 < t1 && t1 < 1) {
      if (forX) {
        this.addX(this.sumCubic(t1, p0, p1, p2, p3));
      } else {
        this.addY(this.sumCubic(t1, p0, p1, p2, p3));
      }
    }
    var t22 = (-b - Math.sqrt(b2ac)) / (2 * a2);
    if (0 < t22 && t22 < 1) {
      if (forX) {
        this.addX(this.sumCubic(t22, p0, p1, p2, p3));
      } else {
        this.addY(this.sumCubic(t22, p0, p1, p2, p3));
      }
    }
  }
  // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
  addBezierCurve(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
    this.addPoint(p0x, p0y);
    this.addPoint(p3x, p3y);
    this.bezierCurveAdd(true, p0x, p1x, p2x, p3x);
    this.bezierCurveAdd(false, p0y, p1y, p2y, p3y);
  }
  addQuadraticCurve(p0x, p0y, p1x, p1y, p2x, p2y) {
    var cp1x = p0x + 2 / 3 * (p1x - p0x);
    var cp1y = p0y + 2 / 3 * (p1y - p0y);
    var cp2x = cp1x + 1 / 3 * (p2x - p0x);
    var cp2y = cp1y + 1 / 3 * (p2y - p0y);
    this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
  }
  isPointInBox(x, y2) {
    var {
      x1,
      y1,
      x2,
      y2: y22
    } = this;
    return x1 <= x && x <= x2 && y1 <= y2 && y2 <= y22;
  }
}
class PathParser extends _ {
  constructor(path2) {
    super(path2.replace(/([+\-.])\s+/gm, "$1").replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g, ""));
    this.control = null;
    this.start = null;
    this.current = null;
    this.command = null;
    this.commands = this.commands;
    this.i = -1;
    this.previousCommand = null;
    this.points = [];
    this.angles = [];
  }
  reset() {
    this.i = -1;
    this.command = null;
    this.previousCommand = null;
    this.start = new Point(0, 0);
    this.control = new Point(0, 0);
    this.current = new Point(0, 0);
    this.points = [];
    this.angles = [];
  }
  isEnd() {
    var {
      i: i2,
      commands
    } = this;
    return i2 >= commands.length - 1;
  }
  next() {
    var command = this.commands[++this.i];
    this.previousCommand = this.command;
    this.command = command;
    return command;
  }
  getPoint() {
    var xProp = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "x";
    var yProp = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y";
    var point = new Point(this.command[xProp], this.command[yProp]);
    return this.makeAbsolute(point);
  }
  getAsControlPoint(xProp, yProp) {
    var point = this.getPoint(xProp, yProp);
    this.control = point;
    return point;
  }
  getAsCurrentPoint(xProp, yProp) {
    var point = this.getPoint(xProp, yProp);
    this.current = point;
    return point;
  }
  getReflectedControlPoint() {
    var previousCommand = this.previousCommand.type;
    if (previousCommand !== _.CURVE_TO && previousCommand !== _.SMOOTH_CURVE_TO && previousCommand !== _.QUAD_TO && previousCommand !== _.SMOOTH_QUAD_TO) {
      return this.current;
    }
    var {
      current: {
        x: cx,
        y: cy
      },
      control: {
        x: ox,
        y: oy
      }
    } = this;
    var point = new Point(2 * cx - ox, 2 * cy - oy);
    return point;
  }
  makeAbsolute(point) {
    if (this.command.relative) {
      var {
        x,
        y: y2
      } = this.current;
      point.x += x;
      point.y += y2;
    }
    return point;
  }
  addMarker(point, from, priorTo) {
    var {
      points,
      angles
    } = this;
    if (priorTo && angles.length > 0 && !angles[angles.length - 1]) {
      angles[angles.length - 1] = points[points.length - 1].angleTo(priorTo);
    }
    this.addMarkerAngle(point, from ? from.angleTo(point) : null);
  }
  addMarkerAngle(point, angle) {
    this.points.push(point);
    this.angles.push(angle);
  }
  getMarkerPoints() {
    return this.points;
  }
  getMarkerAngles() {
    var {
      angles
    } = this;
    var len = angles.length;
    for (var i2 = 0; i2 < len; i2++) {
      if (!angles[i2]) {
        for (var j = i2 + 1; j < len; j++) {
          if (angles[j]) {
            angles[i2] = angles[j];
            break;
          }
        }
      }
    }
    return angles;
  }
}
class RenderedElement extends Element {
  constructor() {
    super(...arguments);
    this.modifiedEmSizeStack = false;
  }
  calculateOpacity() {
    var opacity = 1;
    var element = this;
    while (element) {
      var opacityStyle = element.getStyle("opacity", false, true);
      if (opacityStyle.hasValue(true)) {
        opacity *= opacityStyle.getNumber();
      }
      element = element.parent;
    }
    return opacity;
  }
  setContext(ctx) {
    var fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (!fromMeasure) {
      var fillStyleProp = this.getStyle("fill");
      var fillOpacityStyleProp = this.getStyle("fill-opacity");
      var strokeStyleProp = this.getStyle("stroke");
      var strokeOpacityProp = this.getStyle("stroke-opacity");
      if (fillStyleProp.isUrlDefinition()) {
        var fillStyle = fillStyleProp.getFillStyleDefinition(this, fillOpacityStyleProp);
        if (fillStyle) {
          ctx.fillStyle = fillStyle;
        }
      } else if (fillStyleProp.hasValue()) {
        if (fillStyleProp.getString() === "currentColor") {
          fillStyleProp.setValue(this.getStyle("color").getColor());
        }
        var _fillStyle = fillStyleProp.getColor();
        if (_fillStyle !== "inherit") {
          ctx.fillStyle = _fillStyle === "none" ? "rgba(0,0,0,0)" : _fillStyle;
        }
      }
      if (fillOpacityStyleProp.hasValue()) {
        var _fillStyle2 = new Property(this.document, "fill", ctx.fillStyle).addOpacity(fillOpacityStyleProp).getColor();
        ctx.fillStyle = _fillStyle2;
      }
      if (strokeStyleProp.isUrlDefinition()) {
        var strokeStyle = strokeStyleProp.getFillStyleDefinition(this, strokeOpacityProp);
        if (strokeStyle) {
          ctx.strokeStyle = strokeStyle;
        }
      } else if (strokeStyleProp.hasValue()) {
        if (strokeStyleProp.getString() === "currentColor") {
          strokeStyleProp.setValue(this.getStyle("color").getColor());
        }
        var _strokeStyle = strokeStyleProp.getString();
        if (_strokeStyle !== "inherit") {
          ctx.strokeStyle = _strokeStyle === "none" ? "rgba(0,0,0,0)" : _strokeStyle;
        }
      }
      if (strokeOpacityProp.hasValue()) {
        var _strokeStyle2 = new Property(this.document, "stroke", ctx.strokeStyle).addOpacity(strokeOpacityProp).getString();
        ctx.strokeStyle = _strokeStyle2;
      }
      var strokeWidthStyleProp = this.getStyle("stroke-width");
      if (strokeWidthStyleProp.hasValue()) {
        var newLineWidth = strokeWidthStyleProp.getPixels();
        ctx.lineWidth = !newLineWidth ? PSEUDO_ZERO : newLineWidth;
      }
      var strokeLinecapStyleProp = this.getStyle("stroke-linecap");
      var strokeLinejoinStyleProp = this.getStyle("stroke-linejoin");
      var strokeMiterlimitProp = this.getStyle("stroke-miterlimit");
      var strokeDasharrayStyleProp = this.getStyle("stroke-dasharray");
      var strokeDashoffsetProp = this.getStyle("stroke-dashoffset");
      if (strokeLinecapStyleProp.hasValue()) {
        ctx.lineCap = strokeLinecapStyleProp.getString();
      }
      if (strokeLinejoinStyleProp.hasValue()) {
        ctx.lineJoin = strokeLinejoinStyleProp.getString();
      }
      if (strokeMiterlimitProp.hasValue()) {
        ctx.miterLimit = strokeMiterlimitProp.getNumber();
      }
      if (strokeDasharrayStyleProp.hasValue() && strokeDasharrayStyleProp.getString() !== "none") {
        var gaps = toNumbers(strokeDasharrayStyleProp.getString());
        if (typeof ctx.setLineDash !== "undefined") {
          ctx.setLineDash(gaps);
        } else if (typeof ctx.webkitLineDash !== "undefined") {
          ctx.webkitLineDash = gaps;
        } else if (typeof ctx.mozDash !== "undefined" && !(gaps.length === 1 && gaps[0] === 0)) {
          ctx.mozDash = gaps;
        }
        var offset = strokeDashoffsetProp.getPixels();
        if (typeof ctx.lineDashOffset !== "undefined") {
          ctx.lineDashOffset = offset;
        } else if (typeof ctx.webkitLineDashOffset !== "undefined") {
          ctx.webkitLineDashOffset = offset;
        } else if (typeof ctx.mozDashOffset !== "undefined") {
          ctx.mozDashOffset = offset;
        }
      }
    }
    this.modifiedEmSizeStack = false;
    if (typeof ctx.font !== "undefined") {
      var fontStyleProp = this.getStyle("font");
      var fontStyleStyleProp = this.getStyle("font-style");
      var fontVariantStyleProp = this.getStyle("font-variant");
      var fontWeightStyleProp = this.getStyle("font-weight");
      var fontSizeStyleProp = this.getStyle("font-size");
      var fontFamilyStyleProp = this.getStyle("font-family");
      var font = new Font(fontStyleStyleProp.getString(), fontVariantStyleProp.getString(), fontWeightStyleProp.getString(), fontSizeStyleProp.hasValue() ? "".concat(fontSizeStyleProp.getPixels(true), "px") : "", fontFamilyStyleProp.getString(), Font.parse(fontStyleProp.getString(), ctx.font));
      fontStyleStyleProp.setValue(font.fontStyle);
      fontVariantStyleProp.setValue(font.fontVariant);
      fontWeightStyleProp.setValue(font.fontWeight);
      fontSizeStyleProp.setValue(font.fontSize);
      fontFamilyStyleProp.setValue(font.fontFamily);
      ctx.font = font.toString();
      if (fontSizeStyleProp.isPixels()) {
        this.document.emSize = fontSizeStyleProp.getPixels();
        this.modifiedEmSizeStack = true;
      }
    }
    if (!fromMeasure) {
      this.applyEffects(ctx);
      ctx.globalAlpha = this.calculateOpacity();
    }
  }
  clearContext(ctx) {
    super.clearContext(ctx);
    if (this.modifiedEmSizeStack) {
      this.document.popEmSize();
    }
  }
}
class PathElement extends RenderedElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "path";
    this.pathParser = null;
    this.pathParser = new PathParser(this.getAttribute("d").getString());
  }
  path(ctx) {
    var {
      pathParser
    } = this;
    var boundingBox = new BoundingBox();
    pathParser.reset();
    if (ctx) {
      ctx.beginPath();
    }
    while (!pathParser.isEnd()) {
      switch (pathParser.next().type) {
        case PathParser.MOVE_TO:
          this.pathM(ctx, boundingBox);
          break;
        case PathParser.LINE_TO:
          this.pathL(ctx, boundingBox);
          break;
        case PathParser.HORIZ_LINE_TO:
          this.pathH(ctx, boundingBox);
          break;
        case PathParser.VERT_LINE_TO:
          this.pathV(ctx, boundingBox);
          break;
        case PathParser.CURVE_TO:
          this.pathC(ctx, boundingBox);
          break;
        case PathParser.SMOOTH_CURVE_TO:
          this.pathS(ctx, boundingBox);
          break;
        case PathParser.QUAD_TO:
          this.pathQ(ctx, boundingBox);
          break;
        case PathParser.SMOOTH_QUAD_TO:
          this.pathT(ctx, boundingBox);
          break;
        case PathParser.ARC:
          this.pathA(ctx, boundingBox);
          break;
        case PathParser.CLOSE_PATH:
          this.pathZ(ctx, boundingBox);
          break;
      }
    }
    return boundingBox;
  }
  getBoundingBox(_2) {
    return this.path();
  }
  getMarkers() {
    var {
      pathParser
    } = this;
    var points = pathParser.getMarkerPoints();
    var angles = pathParser.getMarkerAngles();
    var markers = points.map((point, i2) => [point, angles[i2]]);
    return markers;
  }
  renderChildren(ctx) {
    this.path(ctx);
    this.document.screen.mouse.checkPath(this, ctx);
    var fillRuleStyleProp = this.getStyle("fill-rule");
    if (ctx.fillStyle !== "") {
      if (fillRuleStyleProp.getString("inherit") !== "inherit") {
        ctx.fill(fillRuleStyleProp.getString());
      } else {
        ctx.fill();
      }
    }
    if (ctx.strokeStyle !== "") {
      if (this.getAttribute("vector-effect").getString() === "non-scaling-stroke") {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.stroke();
      }
    }
    var markers = this.getMarkers();
    if (markers) {
      var markersLastIndex = markers.length - 1;
      var markerStartStyleProp = this.getStyle("marker-start");
      var markerMidStyleProp = this.getStyle("marker-mid");
      var markerEndStyleProp = this.getStyle("marker-end");
      if (markerStartStyleProp.isUrlDefinition()) {
        var marker = markerStartStyleProp.getDefinition();
        var [point, angle] = markers[0];
        marker.render(ctx, point, angle);
      }
      if (markerMidStyleProp.isUrlDefinition()) {
        var _marker = markerMidStyleProp.getDefinition();
        for (var i2 = 1; i2 < markersLastIndex; i2++) {
          var [_point, _angle] = markers[i2];
          _marker.render(ctx, _point, _angle);
        }
      }
      if (markerEndStyleProp.isUrlDefinition()) {
        var _marker2 = markerEndStyleProp.getDefinition();
        var [_point2, _angle2] = markers[markersLastIndex];
        _marker2.render(ctx, _point2, _angle2);
      }
    }
  }
  static pathM(pathParser) {
    var point = pathParser.getAsCurrentPoint();
    pathParser.start = pathParser.current;
    return {
      point
    };
  }
  pathM(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      point
    } = PathElement.pathM(pathParser);
    var {
      x,
      y: y2
    } = point;
    pathParser.addMarker(point);
    boundingBox.addPoint(x, y2);
    if (ctx) {
      ctx.moveTo(x, y2);
    }
  }
  static pathL(pathParser) {
    var {
      current
    } = pathParser;
    var point = pathParser.getAsCurrentPoint();
    return {
      current,
      point
    };
  }
  pathL(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      point
    } = PathElement.pathL(pathParser);
    var {
      x,
      y: y2
    } = point;
    pathParser.addMarker(point, current);
    boundingBox.addPoint(x, y2);
    if (ctx) {
      ctx.lineTo(x, y2);
    }
  }
  static pathH(pathParser) {
    var {
      current,
      command
    } = pathParser;
    var point = new Point((command.relative ? current.x : 0) + command.x, current.y);
    pathParser.current = point;
    return {
      current,
      point
    };
  }
  pathH(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      point
    } = PathElement.pathH(pathParser);
    var {
      x,
      y: y2
    } = point;
    pathParser.addMarker(point, current);
    boundingBox.addPoint(x, y2);
    if (ctx) {
      ctx.lineTo(x, y2);
    }
  }
  static pathV(pathParser) {
    var {
      current,
      command
    } = pathParser;
    var point = new Point(current.x, (command.relative ? current.y : 0) + command.y);
    pathParser.current = point;
    return {
      current,
      point
    };
  }
  pathV(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      point
    } = PathElement.pathV(pathParser);
    var {
      x,
      y: y2
    } = point;
    pathParser.addMarker(point, current);
    boundingBox.addPoint(x, y2);
    if (ctx) {
      ctx.lineTo(x, y2);
    }
  }
  static pathC(pathParser) {
    var {
      current
    } = pathParser;
    var point = pathParser.getPoint("x1", "y1");
    var controlPoint = pathParser.getAsControlPoint("x2", "y2");
    var currentPoint = pathParser.getAsCurrentPoint();
    return {
      current,
      point,
      controlPoint,
      currentPoint
    };
  }
  pathC(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      point,
      controlPoint,
      currentPoint
    } = PathElement.pathC(pathParser);
    pathParser.addMarker(currentPoint, controlPoint, point);
    boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    if (ctx) {
      ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
  }
  static pathS(pathParser) {
    var {
      current
    } = pathParser;
    var point = pathParser.getReflectedControlPoint();
    var controlPoint = pathParser.getAsControlPoint("x2", "y2");
    var currentPoint = pathParser.getAsCurrentPoint();
    return {
      current,
      point,
      controlPoint,
      currentPoint
    };
  }
  pathS(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      point,
      controlPoint,
      currentPoint
    } = PathElement.pathS(pathParser);
    pathParser.addMarker(currentPoint, controlPoint, point);
    boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    if (ctx) {
      ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
  }
  static pathQ(pathParser) {
    var {
      current
    } = pathParser;
    var controlPoint = pathParser.getAsControlPoint("x1", "y1");
    var currentPoint = pathParser.getAsCurrentPoint();
    return {
      current,
      controlPoint,
      currentPoint
    };
  }
  pathQ(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      controlPoint,
      currentPoint
    } = PathElement.pathQ(pathParser);
    pathParser.addMarker(currentPoint, controlPoint, controlPoint);
    boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    if (ctx) {
      ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
  }
  static pathT(pathParser) {
    var {
      current
    } = pathParser;
    var controlPoint = pathParser.getReflectedControlPoint();
    pathParser.control = controlPoint;
    var currentPoint = pathParser.getAsCurrentPoint();
    return {
      current,
      controlPoint,
      currentPoint
    };
  }
  pathT(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      current,
      controlPoint,
      currentPoint
    } = PathElement.pathT(pathParser);
    pathParser.addMarker(currentPoint, controlPoint, controlPoint);
    boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    if (ctx) {
      ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    }
  }
  static pathA(pathParser) {
    var {
      current,
      command
    } = pathParser;
    var {
      rX,
      rY,
      xRot,
      lArcFlag,
      sweepFlag
    } = command;
    var xAxisRotation = xRot * (Math.PI / 180);
    var currentPoint = pathParser.getAsCurrentPoint();
    var currp = new Point(Math.cos(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.sin(xAxisRotation) * (current.y - currentPoint.y) / 2, -Math.sin(xAxisRotation) * (current.x - currentPoint.x) / 2 + Math.cos(xAxisRotation) * (current.y - currentPoint.y) / 2);
    var l2 = Math.pow(currp.x, 2) / Math.pow(rX, 2) + Math.pow(currp.y, 2) / Math.pow(rY, 2);
    if (l2 > 1) {
      rX *= Math.sqrt(l2);
      rY *= Math.sqrt(l2);
    }
    var s2 = (lArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rX, 2) * Math.pow(rY, 2) - Math.pow(rX, 2) * Math.pow(currp.y, 2) - Math.pow(rY, 2) * Math.pow(currp.x, 2)) / (Math.pow(rX, 2) * Math.pow(currp.y, 2) + Math.pow(rY, 2) * Math.pow(currp.x, 2)));
    if (isNaN(s2)) {
      s2 = 0;
    }
    var cpp = new Point(s2 * rX * currp.y / rY, s2 * -rY * currp.x / rX);
    var centp = new Point((current.x + currentPoint.x) / 2 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (current.y + currentPoint.y) / 2 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y);
    var a1 = vectorsAngle([1, 0], [(currp.x - cpp.x) / rX, (currp.y - cpp.y) / rY]);
    var u2 = [(currp.x - cpp.x) / rX, (currp.y - cpp.y) / rY];
    var v2 = [(-currp.x - cpp.x) / rX, (-currp.y - cpp.y) / rY];
    var ad = vectorsAngle(u2, v2);
    if (vectorsRatio(u2, v2) <= -1) {
      ad = Math.PI;
    }
    if (vectorsRatio(u2, v2) >= 1) {
      ad = 0;
    }
    return {
      currentPoint,
      rX,
      rY,
      sweepFlag,
      xAxisRotation,
      centp,
      a1,
      ad
    };
  }
  pathA(ctx, boundingBox) {
    var {
      pathParser
    } = this;
    var {
      currentPoint,
      rX,
      rY,
      sweepFlag,
      xAxisRotation,
      centp,
      a1,
      ad
    } = PathElement.pathA(pathParser);
    var dir = 1 - sweepFlag ? 1 : -1;
    var ah = a1 + dir * (ad / 2);
    var halfWay = new Point(centp.x + rX * Math.cos(ah), centp.y + rY * Math.sin(ah));
    pathParser.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
    pathParser.addMarkerAngle(currentPoint, ah - dir * Math.PI);
    boundingBox.addPoint(currentPoint.x, currentPoint.y);
    if (ctx && !isNaN(a1) && !isNaN(ad)) {
      var r2 = rX > rY ? rX : rY;
      var sx = rX > rY ? 1 : rX / rY;
      var sy = rX > rY ? rY / rX : 1;
      ctx.translate(centp.x, centp.y);
      ctx.rotate(xAxisRotation);
      ctx.scale(sx, sy);
      ctx.arc(0, 0, r2, a1, a1 + ad, Boolean(1 - sweepFlag));
      ctx.scale(1 / sx, 1 / sy);
      ctx.rotate(-xAxisRotation);
      ctx.translate(-centp.x, -centp.y);
    }
  }
  static pathZ(pathParser) {
    pathParser.current = pathParser.start;
  }
  pathZ(ctx, boundingBox) {
    PathElement.pathZ(this.pathParser);
    if (ctx) {
      if (boundingBox.x1 !== boundingBox.x2 && boundingBox.y1 !== boundingBox.y2) {
        ctx.closePath();
      }
    }
  }
}
class GlyphElement extends PathElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "glyph";
    this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
    this.unicode = this.getAttribute("unicode").getString();
    this.arabicForm = this.getAttribute("arabic-form").getString();
  }
}
class TextElement extends RenderedElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, new.target === TextElement ? true : captureTextNodes);
    this.type = "text";
    this.x = 0;
    this.y = 0;
    this.measureCache = -1;
  }
  setContext(ctx) {
    var fromMeasure = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    super.setContext(ctx, fromMeasure);
    var textBaseline = this.getStyle("dominant-baseline").getTextBaseline() || this.getStyle("alignment-baseline").getTextBaseline();
    if (textBaseline) {
      ctx.textBaseline = textBaseline;
    }
  }
  initializeCoordinates() {
    this.x = 0;
    this.y = 0;
    this.leafTexts = [];
    this.textChunkStart = 0;
    this.minX = Number.POSITIVE_INFINITY;
    this.maxX = Number.NEGATIVE_INFINITY;
  }
  getBoundingBox(ctx) {
    if (this.type !== "text") {
      return this.getTElementBoundingBox(ctx);
    }
    this.initializeCoordinates();
    this.adjustChildCoordinatesRecursive(ctx);
    var boundingBox = null;
    this.children.forEach((_2, i2) => {
      var childBoundingBox = this.getChildBoundingBox(ctx, this, this, i2);
      if (!boundingBox) {
        boundingBox = childBoundingBox;
      } else {
        boundingBox.addBoundingBox(childBoundingBox);
      }
    });
    return boundingBox;
  }
  getFontSize() {
    var {
      document: document2,
      parent
    } = this;
    var inheritFontSize = Font.parse(document2.ctx.font).fontSize;
    var fontSize = parent.getStyle("font-size").getNumber(inheritFontSize);
    return fontSize;
  }
  getTElementBoundingBox(ctx) {
    var fontSize = this.getFontSize();
    return new BoundingBox(this.x, this.y - fontSize, this.x + this.measureText(ctx), this.y);
  }
  getGlyph(font, text, i2) {
    var char = text[i2];
    var glyph = null;
    if (font.isArabic) {
      var len = text.length;
      var prevChar = text[i2 - 1];
      var nextChar = text[i2 + 1];
      var arabicForm = "isolated";
      if ((i2 === 0 || prevChar === " ") && i2 < len - 1 && nextChar !== " ") {
        arabicForm = "terminal";
      }
      if (i2 > 0 && prevChar !== " " && i2 < len - 1 && nextChar !== " ") {
        arabicForm = "medial";
      }
      if (i2 > 0 && prevChar !== " " && (i2 === len - 1 || nextChar === " ")) {
        arabicForm = "initial";
      }
      if (typeof font.glyphs[char] !== "undefined") {
        var maybeGlyph = font.glyphs[char];
        glyph = maybeGlyph instanceof GlyphElement ? maybeGlyph : maybeGlyph[arabicForm];
      }
    } else {
      glyph = font.glyphs[char];
    }
    if (!glyph) {
      glyph = font.missingGlyph;
    }
    return glyph;
  }
  getText() {
    return "";
  }
  getTextFromNode(node2) {
    var textNode = node2 || this.node;
    var childNodes = Array.from(textNode.parentNode.childNodes);
    var index2 = childNodes.indexOf(textNode);
    var lastIndex = childNodes.length - 1;
    var text = compressSpaces(
      // textNode.value
      // || textNode.text
      textNode.textContent || ""
    );
    if (index2 === 0) {
      text = trimLeft(text);
    }
    if (index2 === lastIndex) {
      text = trimRight(text);
    }
    return text;
  }
  renderChildren(ctx) {
    if (this.type !== "text") {
      this.renderTElementChildren(ctx);
      return;
    }
    this.initializeCoordinates();
    this.adjustChildCoordinatesRecursive(ctx);
    this.children.forEach((_2, i2) => {
      this.renderChild(ctx, this, this, i2);
    });
    var {
      mouse
    } = this.document.screen;
    if (mouse.isWorking()) {
      mouse.checkBoundingBox(this, this.getBoundingBox(ctx));
    }
  }
  renderTElementChildren(ctx) {
    var {
      document: document2,
      parent
    } = this;
    var renderText = this.getText();
    var customFont = parent.getStyle("font-family").getDefinition();
    if (customFont) {
      var {
        unitsPerEm
      } = customFont.fontFace;
      var ctxFont = Font.parse(document2.ctx.font);
      var fontSize = parent.getStyle("font-size").getNumber(ctxFont.fontSize);
      var fontStyle = parent.getStyle("font-style").getString(ctxFont.fontStyle);
      var scale = fontSize / unitsPerEm;
      var text = customFont.isRTL ? renderText.split("").reverse().join("") : renderText;
      var dx = toNumbers(parent.getAttribute("dx").getString());
      var len = text.length;
      for (var i2 = 0; i2 < len; i2++) {
        var glyph = this.getGlyph(customFont, text, i2);
        ctx.translate(this.x, this.y);
        ctx.scale(scale, -scale);
        var lw = ctx.lineWidth;
        ctx.lineWidth = ctx.lineWidth * unitsPerEm / fontSize;
        if (fontStyle === "italic") {
          ctx.transform(1, 0, 0.4, 1, 0, 0);
        }
        glyph.render(ctx);
        if (fontStyle === "italic") {
          ctx.transform(1, 0, -0.4, 1, 0, 0);
        }
        ctx.lineWidth = lw;
        ctx.scale(1 / scale, -1 / scale);
        ctx.translate(-this.x, -this.y);
        this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / unitsPerEm;
        if (typeof dx[i2] !== "undefined" && !isNaN(dx[i2])) {
          this.x += dx[i2];
        }
      }
      return;
    }
    var {
      x,
      y: y2
    } = this;
    if (ctx.fillStyle) {
      ctx.fillText(renderText, x, y2);
    }
    if (ctx.strokeStyle) {
      ctx.strokeText(renderText, x, y2);
    }
  }
  applyAnchoring() {
    if (this.textChunkStart >= this.leafTexts.length) {
      return;
    }
    var firstElement = this.leafTexts[this.textChunkStart];
    var textAnchor = firstElement.getStyle("text-anchor").getString("start");
    var isRTL = false;
    var shift = 0;
    if (textAnchor === "start" && !isRTL || textAnchor === "end" && isRTL) {
      shift = firstElement.x - this.minX;
    } else if (textAnchor === "end" && !isRTL || textAnchor === "start" && isRTL) {
      shift = firstElement.x - this.maxX;
    } else {
      shift = firstElement.x - (this.minX + this.maxX) / 2;
    }
    for (var i2 = this.textChunkStart; i2 < this.leafTexts.length; i2++) {
      this.leafTexts[i2].x += shift;
    }
    this.minX = Number.POSITIVE_INFINITY;
    this.maxX = Number.NEGATIVE_INFINITY;
    this.textChunkStart = this.leafTexts.length;
  }
  adjustChildCoordinatesRecursive(ctx) {
    this.children.forEach((_2, i2) => {
      this.adjustChildCoordinatesRecursiveCore(ctx, this, this, i2);
    });
    this.applyAnchoring();
  }
  adjustChildCoordinatesRecursiveCore(ctx, textParent, parent, i2) {
    var child = parent.children[i2];
    if (child.children.length > 0) {
      child.children.forEach((_2, i3) => {
        textParent.adjustChildCoordinatesRecursiveCore(ctx, textParent, child, i3);
      });
    } else {
      this.adjustChildCoordinates(ctx, textParent, parent, i2);
    }
  }
  adjustChildCoordinates(ctx, textParent, parent, i2) {
    var child = parent.children[i2];
    if (typeof child.measureText !== "function") {
      return child;
    }
    ctx.save();
    child.setContext(ctx, true);
    var xAttr = child.getAttribute("x");
    var yAttr = child.getAttribute("y");
    var dxAttr = child.getAttribute("dx");
    var dyAttr = child.getAttribute("dy");
    var customFont = child.getStyle("font-family").getDefinition();
    var isRTL = Boolean(customFont) && customFont.isRTL;
    if (i2 === 0) {
      if (!xAttr.hasValue()) {
        xAttr.setValue(child.getInheritedAttribute("x"));
      }
      if (!yAttr.hasValue()) {
        yAttr.setValue(child.getInheritedAttribute("y"));
      }
      if (!dxAttr.hasValue()) {
        dxAttr.setValue(child.getInheritedAttribute("dx"));
      }
      if (!dyAttr.hasValue()) {
        dyAttr.setValue(child.getInheritedAttribute("dy"));
      }
    }
    var width = child.measureText(ctx);
    if (isRTL) {
      textParent.x -= width;
    }
    if (xAttr.hasValue()) {
      textParent.applyAnchoring();
      child.x = xAttr.getPixels("x");
      if (dxAttr.hasValue()) {
        child.x += dxAttr.getPixels("x");
      }
    } else {
      if (dxAttr.hasValue()) {
        textParent.x += dxAttr.getPixels("x");
      }
      child.x = textParent.x;
    }
    textParent.x = child.x;
    if (!isRTL) {
      textParent.x += width;
    }
    if (yAttr.hasValue()) {
      child.y = yAttr.getPixels("y");
      if (dyAttr.hasValue()) {
        child.y += dyAttr.getPixels("y");
      }
    } else {
      if (dyAttr.hasValue()) {
        textParent.y += dyAttr.getPixels("y");
      }
      child.y = textParent.y;
    }
    textParent.y = child.y;
    textParent.leafTexts.push(child);
    textParent.minX = Math.min(textParent.minX, child.x, child.x + width);
    textParent.maxX = Math.max(textParent.maxX, child.x, child.x + width);
    child.clearContext(ctx);
    ctx.restore();
    return child;
  }
  getChildBoundingBox(ctx, textParent, parent, i2) {
    var child = parent.children[i2];
    if (typeof child.getBoundingBox !== "function") {
      return null;
    }
    var boundingBox = child.getBoundingBox(ctx);
    if (!boundingBox) {
      return null;
    }
    child.children.forEach((_2, i3) => {
      var childBoundingBox = textParent.getChildBoundingBox(ctx, textParent, child, i3);
      boundingBox.addBoundingBox(childBoundingBox);
    });
    return boundingBox;
  }
  renderChild(ctx, textParent, parent, i2) {
    var child = parent.children[i2];
    child.render(ctx);
    child.children.forEach((_2, i3) => {
      textParent.renderChild(ctx, textParent, child, i3);
    });
  }
  measureText(ctx) {
    var {
      measureCache
    } = this;
    if (~measureCache) {
      return measureCache;
    }
    var renderText = this.getText();
    var measure = this.measureTargetText(ctx, renderText);
    this.measureCache = measure;
    return measure;
  }
  measureTargetText(ctx, targetText) {
    if (!targetText.length) {
      return 0;
    }
    var {
      parent
    } = this;
    var customFont = parent.getStyle("font-family").getDefinition();
    if (customFont) {
      var fontSize = this.getFontSize();
      var text = customFont.isRTL ? targetText.split("").reverse().join("") : targetText;
      var dx = toNumbers(parent.getAttribute("dx").getString());
      var len = text.length;
      var _measure = 0;
      for (var i2 = 0; i2 < len; i2++) {
        var glyph = this.getGlyph(customFont, text, i2);
        _measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
        if (typeof dx[i2] !== "undefined" && !isNaN(dx[i2])) {
          _measure += dx[i2];
        }
      }
      return _measure;
    }
    if (!ctx.measureText) {
      return targetText.length * 10;
    }
    ctx.save();
    this.setContext(ctx, true);
    var {
      width: measure
    } = ctx.measureText(targetText);
    this.clearContext(ctx);
    ctx.restore();
    return measure;
  }
  /**
   * Inherits positional attributes from {@link TextElement} parent(s). Attributes
   * are only inherited from a parent to its first child.
   * @param name - The attribute name.
   * @returns The attribute value or null.
   */
  getInheritedAttribute(name) {
    var current = this;
    while (current instanceof TextElement && current.isFirstChild()) {
      var parentAttr = current.parent.getAttribute(name);
      if (parentAttr.hasValue(true)) {
        return parentAttr.getValue("0");
      }
      current = current.parent;
    }
    return null;
  }
}
class TSpanElement extends TextElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, new.target === TSpanElement ? true : captureTextNodes);
    this.type = "tspan";
    this.text = this.children.length > 0 ? "" : this.getTextFromNode();
  }
  getText() {
    return this.text;
  }
}
class TextNode extends TSpanElement {
  constructor() {
    super(...arguments);
    this.type = "textNode";
  }
}
class SVGElement extends RenderedElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.root = false;
  }
  setContext(ctx) {
    var _this$node$parentNode;
    var {
      document: document2
    } = this;
    var {
      screen,
      window: window2
    } = document2;
    var canvas = ctx.canvas;
    screen.setDefaults(ctx);
    if (canvas.style && typeof ctx.font !== "undefined" && window2 && typeof window2.getComputedStyle !== "undefined") {
      ctx.font = window2.getComputedStyle(canvas).getPropertyValue("font");
      var fontSizeProp = new Property(document2, "fontSize", Font.parse(ctx.font).fontSize);
      if (fontSizeProp.hasValue()) {
        document2.rootEmSize = fontSizeProp.getPixels("y");
        document2.emSize = document2.rootEmSize;
      }
    }
    if (!this.getAttribute("x").hasValue()) {
      this.getAttribute("x", true).setValue(0);
    }
    if (!this.getAttribute("y").hasValue()) {
      this.getAttribute("y", true).setValue(0);
    }
    var {
      width,
      height
    } = screen.viewPort;
    if (!this.getStyle("width").hasValue()) {
      this.getStyle("width", true).setValue("100%");
    }
    if (!this.getStyle("height").hasValue()) {
      this.getStyle("height", true).setValue("100%");
    }
    if (!this.getStyle("color").hasValue()) {
      this.getStyle("color", true).setValue("black");
    }
    var refXAttr = this.getAttribute("refX");
    var refYAttr = this.getAttribute("refY");
    var viewBoxAttr = this.getAttribute("viewBox");
    var viewBox = viewBoxAttr.hasValue() ? toNumbers(viewBoxAttr.getString()) : null;
    var clip = !this.root && this.getStyle("overflow").getValue("hidden") !== "visible";
    var minX = 0;
    var minY = 0;
    var clipX = 0;
    var clipY = 0;
    if (viewBox) {
      minX = viewBox[0];
      minY = viewBox[1];
    }
    if (!this.root) {
      width = this.getStyle("width").getPixels("x");
      height = this.getStyle("height").getPixels("y");
      if (this.type === "marker") {
        clipX = minX;
        clipY = minY;
        minX = 0;
        minY = 0;
      }
    }
    screen.viewPort.setCurrent(width, height);
    if (this.node && (!this.parent || ((_this$node$parentNode = this.node.parentNode) === null || _this$node$parentNode === void 0 ? void 0 : _this$node$parentNode.nodeName) === "foreignObject") && this.getStyle("transform", false, true).hasValue() && !this.getStyle("transform-origin", false, true).hasValue()) {
      this.getStyle("transform-origin", true, true).setValue("50% 50%");
    }
    super.setContext(ctx);
    ctx.translate(this.getAttribute("x").getPixels("x"), this.getAttribute("y").getPixels("y"));
    if (viewBox) {
      width = viewBox[2];
      height = viewBox[3];
    }
    document2.setViewBox({
      ctx,
      aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
      width: screen.viewPort.width,
      desiredWidth: width,
      height: screen.viewPort.height,
      desiredHeight: height,
      minX,
      minY,
      refX: refXAttr.getValue(),
      refY: refYAttr.getValue(),
      clip,
      clipX,
      clipY
    });
    if (viewBox) {
      screen.viewPort.removeCurrent();
      screen.viewPort.setCurrent(width, height);
    }
  }
  clearContext(ctx) {
    super.clearContext(ctx);
    this.document.screen.viewPort.removeCurrent();
  }
  /**
   * Resize SVG to fit in given size.
   * @param width
   * @param height
   * @param preserveAspectRatio
   */
  resize(width) {
    var height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width;
    var preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    var widthAttr = this.getAttribute("width", true);
    var heightAttr = this.getAttribute("height", true);
    var viewBoxAttr = this.getAttribute("viewBox");
    var styleAttr = this.getAttribute("style");
    var originWidth = widthAttr.getNumber(0);
    var originHeight = heightAttr.getNumber(0);
    if (preserveAspectRatio) {
      if (typeof preserveAspectRatio === "string") {
        this.getAttribute("preserveAspectRatio", true).setValue(preserveAspectRatio);
      } else {
        var preserveAspectRatioAttr = this.getAttribute("preserveAspectRatio");
        if (preserveAspectRatioAttr.hasValue()) {
          preserveAspectRatioAttr.setValue(preserveAspectRatioAttr.getString().replace(/^\s*(\S.*\S)\s*$/, "$1"));
        }
      }
    }
    widthAttr.setValue(width);
    heightAttr.setValue(height);
    if (!viewBoxAttr.hasValue()) {
      viewBoxAttr.setValue("0 0 ".concat(originWidth || width, " ").concat(originHeight || height));
    }
    if (styleAttr.hasValue()) {
      var widthStyle = this.getStyle("width");
      var heightStyle = this.getStyle("height");
      if (widthStyle.hasValue()) {
        widthStyle.setValue("".concat(width, "px"));
      }
      if (heightStyle.hasValue()) {
        heightStyle.setValue("".concat(height, "px"));
      }
    }
  }
}
class RectElement extends PathElement {
  constructor() {
    super(...arguments);
    this.type = "rect";
  }
  path(ctx) {
    var x = this.getAttribute("x").getPixels("x");
    var y2 = this.getAttribute("y").getPixels("y");
    var width = this.getStyle("width", false, true).getPixels("x");
    var height = this.getStyle("height", false, true).getPixels("y");
    var rxAttr = this.getAttribute("rx");
    var ryAttr = this.getAttribute("ry");
    var rx = rxAttr.getPixels("x");
    var ry = ryAttr.getPixels("y");
    if (rxAttr.hasValue() && !ryAttr.hasValue()) {
      ry = rx;
    }
    if (ryAttr.hasValue() && !rxAttr.hasValue()) {
      rx = ry;
    }
    rx = Math.min(rx, width / 2);
    ry = Math.min(ry, height / 2);
    if (ctx) {
      var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
      ctx.beginPath();
      if (height > 0 && width > 0) {
        ctx.moveTo(x + rx, y2);
        ctx.lineTo(x + width - rx, y2);
        ctx.bezierCurveTo(x + width - rx + KAPPA * rx, y2, x + width, y2 + ry - KAPPA * ry, x + width, y2 + ry);
        ctx.lineTo(x + width, y2 + height - ry);
        ctx.bezierCurveTo(x + width, y2 + height - ry + KAPPA * ry, x + width - rx + KAPPA * rx, y2 + height, x + width - rx, y2 + height);
        ctx.lineTo(x + rx, y2 + height);
        ctx.bezierCurveTo(x + rx - KAPPA * rx, y2 + height, x, y2 + height - ry + KAPPA * ry, x, y2 + height - ry);
        ctx.lineTo(x, y2 + ry);
        ctx.bezierCurveTo(x, y2 + ry - KAPPA * ry, x + rx - KAPPA * rx, y2, x + rx, y2);
        ctx.closePath();
      }
    }
    return new BoundingBox(x, y2, x + width, y2 + height);
  }
  getMarkers() {
    return null;
  }
}
class CircleElement extends PathElement {
  constructor() {
    super(...arguments);
    this.type = "circle";
  }
  path(ctx) {
    var cx = this.getAttribute("cx").getPixels("x");
    var cy = this.getAttribute("cy").getPixels("y");
    var r2 = this.getAttribute("r").getPixels();
    if (ctx && r2 > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r2, 0, Math.PI * 2, false);
      ctx.closePath();
    }
    return new BoundingBox(cx - r2, cy - r2, cx + r2, cy + r2);
  }
  getMarkers() {
    return null;
  }
}
class EllipseElement extends PathElement {
  constructor() {
    super(...arguments);
    this.type = "ellipse";
  }
  path(ctx) {
    var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
    var rx = this.getAttribute("rx").getPixels("x");
    var ry = this.getAttribute("ry").getPixels("y");
    var cx = this.getAttribute("cx").getPixels("x");
    var cy = this.getAttribute("cy").getPixels("y");
    if (ctx && rx > 0 && ry > 0) {
      ctx.beginPath();
      ctx.moveTo(cx + rx, cy);
      ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
      ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
      ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
      ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
      ctx.closePath();
    }
    return new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
  }
  getMarkers() {
    return null;
  }
}
class LineElement extends PathElement {
  constructor() {
    super(...arguments);
    this.type = "line";
  }
  getPoints() {
    return [new Point(this.getAttribute("x1").getPixels("x"), this.getAttribute("y1").getPixels("y")), new Point(this.getAttribute("x2").getPixels("x"), this.getAttribute("y2").getPixels("y"))];
  }
  path(ctx) {
    var [{
      x: x0,
      y: y0
    }, {
      x: x1,
      y: y1
    }] = this.getPoints();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    return new BoundingBox(x0, y0, x1, y1);
  }
  getMarkers() {
    var [p0, p1] = this.getPoints();
    var a2 = p0.angleTo(p1);
    return [[p0, a2], [p1, a2]];
  }
}
class PolylineElement extends PathElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "polyline";
    this.points = [];
    this.points = Point.parsePath(this.getAttribute("points").getString());
  }
  path(ctx) {
    var {
      points
    } = this;
    var [{
      x: x0,
      y: y0
    }] = points;
    var boundingBox = new BoundingBox(x0, y0);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
    }
    points.forEach((_ref) => {
      var {
        x,
        y: y2
      } = _ref;
      boundingBox.addPoint(x, y2);
      if (ctx) {
        ctx.lineTo(x, y2);
      }
    });
    return boundingBox;
  }
  getMarkers() {
    var {
      points
    } = this;
    var lastIndex = points.length - 1;
    var markers = [];
    points.forEach((point, i2) => {
      if (i2 === lastIndex) {
        return;
      }
      markers.push([point, point.angleTo(points[i2 + 1])]);
    });
    if (markers.length > 0) {
      markers.push([points[points.length - 1], markers[markers.length - 1][1]]);
    }
    return markers;
  }
}
class PolygonElement extends PolylineElement {
  constructor() {
    super(...arguments);
    this.type = "polygon";
  }
  path(ctx) {
    var boundingBox = super.path(ctx);
    var [{
      x,
      y: y2
    }] = this.points;
    if (ctx) {
      ctx.lineTo(x, y2);
      ctx.closePath();
    }
    return boundingBox;
  }
}
class PatternElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "pattern";
  }
  createPattern(ctx, _2, parentOpacityProp) {
    var width = this.getStyle("width").getPixels("x", true);
    var height = this.getStyle("height").getPixels("y", true);
    var patternSvg = new SVGElement(this.document, null);
    patternSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
    patternSvg.attributes.width = new Property(this.document, "width", "".concat(width, "px"));
    patternSvg.attributes.height = new Property(this.document, "height", "".concat(height, "px"));
    patternSvg.attributes.transform = new Property(this.document, "transform", this.getAttribute("patternTransform").getValue());
    patternSvg.children = this.children;
    var patternCanvas = this.document.createCanvas(width, height);
    var patternCtx = patternCanvas.getContext("2d");
    var xAttr = this.getAttribute("x");
    var yAttr = this.getAttribute("y");
    if (xAttr.hasValue() && yAttr.hasValue()) {
      patternCtx.translate(xAttr.getPixels("x", true), yAttr.getPixels("y", true));
    }
    if (parentOpacityProp.hasValue()) {
      this.styles["fill-opacity"] = parentOpacityProp;
    } else {
      Reflect.deleteProperty(this.styles, "fill-opacity");
    }
    for (var x = -1; x <= 1; x++) {
      for (var y2 = -1; y2 <= 1; y2++) {
        patternCtx.save();
        patternSvg.attributes.x = new Property(this.document, "x", x * patternCanvas.width);
        patternSvg.attributes.y = new Property(this.document, "y", y2 * patternCanvas.height);
        patternSvg.render(patternCtx);
        patternCtx.restore();
      }
    }
    var pattern = ctx.createPattern(patternCanvas, "repeat");
    return pattern;
  }
}
class MarkerElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "marker";
  }
  render(ctx, point, angle) {
    if (!point) {
      return;
    }
    var {
      x,
      y: y2
    } = point;
    var orient = this.getAttribute("orient").getString("auto");
    var markerUnits = this.getAttribute("markerUnits").getString("strokeWidth");
    ctx.translate(x, y2);
    if (orient === "auto") {
      ctx.rotate(angle);
    }
    if (markerUnits === "strokeWidth") {
      ctx.scale(ctx.lineWidth, ctx.lineWidth);
    }
    ctx.save();
    var markerSvg = new SVGElement(this.document, null);
    markerSvg.type = this.type;
    markerSvg.attributes.viewBox = new Property(this.document, "viewBox", this.getAttribute("viewBox").getValue());
    markerSvg.attributes.refX = new Property(this.document, "refX", this.getAttribute("refX").getValue());
    markerSvg.attributes.refY = new Property(this.document, "refY", this.getAttribute("refY").getValue());
    markerSvg.attributes.width = new Property(this.document, "width", this.getAttribute("markerWidth").getValue());
    markerSvg.attributes.height = new Property(this.document, "height", this.getAttribute("markerHeight").getValue());
    markerSvg.attributes.overflow = new Property(this.document, "overflow", this.getAttribute("overflow").getValue());
    markerSvg.attributes.fill = new Property(this.document, "fill", this.getAttribute("fill").getColor("black"));
    markerSvg.attributes.stroke = new Property(this.document, "stroke", this.getAttribute("stroke").getValue("none"));
    markerSvg.children = this.children;
    markerSvg.render(ctx);
    ctx.restore();
    if (markerUnits === "strokeWidth") {
      ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
    }
    if (orient === "auto") {
      ctx.rotate(-angle);
    }
    ctx.translate(-x, -y2);
  }
}
class DefsElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "defs";
  }
  render() {
  }
}
class GElement extends RenderedElement {
  constructor() {
    super(...arguments);
    this.type = "g";
  }
  getBoundingBox(ctx) {
    var boundingBox = new BoundingBox();
    this.children.forEach((child) => {
      boundingBox.addBoundingBox(child.getBoundingBox(ctx));
    });
    return boundingBox;
  }
}
class GradientElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.attributesToInherit = ["gradientUnits"];
    this.stops = [];
    var {
      stops,
      children
    } = this;
    children.forEach((child) => {
      if (child.type === "stop") {
        stops.push(child);
      }
    });
  }
  getGradientUnits() {
    return this.getAttribute("gradientUnits").getString("objectBoundingBox");
  }
  createGradient(ctx, element, parentOpacityProp) {
    var stopsContainer = this;
    if (this.getHrefAttribute().hasValue()) {
      stopsContainer = this.getHrefAttribute().getDefinition();
      this.inheritStopContainer(stopsContainer);
    }
    var {
      stops
    } = stopsContainer;
    var gradient = this.getGradient(ctx, element);
    if (!gradient) {
      return this.addParentOpacity(parentOpacityProp, stops[stops.length - 1].color);
    }
    stops.forEach((stop) => {
      gradient.addColorStop(stop.offset, this.addParentOpacity(parentOpacityProp, stop.color));
    });
    if (this.getAttribute("gradientTransform").hasValue()) {
      var {
        document: document2
      } = this;
      var {
        MAX_VIRTUAL_PIXELS,
        viewPort
      } = document2.screen;
      var [rootView] = viewPort.viewPorts;
      var rect = new RectElement(document2, null);
      rect.attributes.x = new Property(document2, "x", -MAX_VIRTUAL_PIXELS / 3);
      rect.attributes.y = new Property(document2, "y", -MAX_VIRTUAL_PIXELS / 3);
      rect.attributes.width = new Property(document2, "width", MAX_VIRTUAL_PIXELS);
      rect.attributes.height = new Property(document2, "height", MAX_VIRTUAL_PIXELS);
      var group = new GElement(document2, null);
      group.attributes.transform = new Property(document2, "transform", this.getAttribute("gradientTransform").getValue());
      group.children = [rect];
      var patternSvg = new SVGElement(document2, null);
      patternSvg.attributes.x = new Property(document2, "x", 0);
      patternSvg.attributes.y = new Property(document2, "y", 0);
      patternSvg.attributes.width = new Property(document2, "width", rootView.width);
      patternSvg.attributes.height = new Property(document2, "height", rootView.height);
      patternSvg.children = [group];
      var patternCanvas = document2.createCanvas(rootView.width, rootView.height);
      var patternCtx = patternCanvas.getContext("2d");
      patternCtx.fillStyle = gradient;
      patternSvg.render(patternCtx);
      return patternCtx.createPattern(patternCanvas, "no-repeat");
    }
    return gradient;
  }
  inheritStopContainer(stopsContainer) {
    this.attributesToInherit.forEach((attributeToInherit) => {
      if (!this.getAttribute(attributeToInherit).hasValue() && stopsContainer.getAttribute(attributeToInherit).hasValue()) {
        this.getAttribute(attributeToInherit, true).setValue(stopsContainer.getAttribute(attributeToInherit).getValue());
      }
    });
  }
  addParentOpacity(parentOpacityProp, color) {
    if (parentOpacityProp.hasValue()) {
      var colorProp = new Property(this.document, "color", color);
      return colorProp.addOpacity(parentOpacityProp).getColor();
    }
    return color;
  }
}
class LinearGradientElement extends GradientElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "linearGradient";
    this.attributesToInherit.push("x1", "y1", "x2", "y2");
  }
  getGradient(ctx, element) {
    var isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
    var boundingBox = isBoundingBoxUnits ? element.getBoundingBox(ctx) : null;
    if (isBoundingBoxUnits && !boundingBox) {
      return null;
    }
    if (!this.getAttribute("x1").hasValue() && !this.getAttribute("y1").hasValue() && !this.getAttribute("x2").hasValue() && !this.getAttribute("y2").hasValue()) {
      this.getAttribute("x1", true).setValue(0);
      this.getAttribute("y1", true).setValue(0);
      this.getAttribute("x2", true).setValue(1);
      this.getAttribute("y2", true).setValue(0);
    }
    var x1 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x1").getNumber() : this.getAttribute("x1").getPixels("x");
    var y1 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y1").getNumber() : this.getAttribute("y1").getPixels("y");
    var x2 = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("x2").getNumber() : this.getAttribute("x2").getPixels("x");
    var y2 = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("y2").getNumber() : this.getAttribute("y2").getPixels("y");
    if (x1 === x2 && y1 === y2) {
      return null;
    }
    return ctx.createLinearGradient(x1, y1, x2, y2);
  }
}
class RadialGradientElement extends GradientElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "radialGradient";
    this.attributesToInherit.push("cx", "cy", "r", "fx", "fy", "fr");
  }
  getGradient(ctx, element) {
    var isBoundingBoxUnits = this.getGradientUnits() === "objectBoundingBox";
    var boundingBox = element.getBoundingBox(ctx);
    if (isBoundingBoxUnits && !boundingBox) {
      return null;
    }
    if (!this.getAttribute("cx").hasValue()) {
      this.getAttribute("cx", true).setValue("50%");
    }
    if (!this.getAttribute("cy").hasValue()) {
      this.getAttribute("cy", true).setValue("50%");
    }
    if (!this.getAttribute("r").hasValue()) {
      this.getAttribute("r", true).setValue("50%");
    }
    var cx = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("cx").getNumber() : this.getAttribute("cx").getPixels("x");
    var cy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("cy").getNumber() : this.getAttribute("cy").getPixels("y");
    var fx = cx;
    var fy = cy;
    if (this.getAttribute("fx").hasValue()) {
      fx = isBoundingBoxUnits ? boundingBox.x + boundingBox.width * this.getAttribute("fx").getNumber() : this.getAttribute("fx").getPixels("x");
    }
    if (this.getAttribute("fy").hasValue()) {
      fy = isBoundingBoxUnits ? boundingBox.y + boundingBox.height * this.getAttribute("fy").getNumber() : this.getAttribute("fy").getPixels("y");
    }
    var r2 = isBoundingBoxUnits ? (boundingBox.width + boundingBox.height) / 2 * this.getAttribute("r").getNumber() : this.getAttribute("r").getPixels();
    var fr = this.getAttribute("fr").getPixels();
    return ctx.createRadialGradient(fx, fy, fr, cx, cy, r2);
  }
}
class StopElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "stop";
    var offset = Math.max(0, Math.min(1, this.getAttribute("offset").getNumber()));
    var stopOpacity = this.getStyle("stop-opacity");
    var stopColor = this.getStyle("stop-color", true);
    if (stopColor.getString() === "") {
      stopColor.setValue("#000");
    }
    if (stopOpacity.hasValue()) {
      stopColor = stopColor.addOpacity(stopOpacity);
    }
    this.offset = offset;
    this.color = stopColor.getColor();
  }
}
class AnimateElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "animate";
    this.duration = 0;
    this.initialValue = null;
    this.initialUnits = "";
    this.removed = false;
    this.frozen = false;
    document2.screen.animations.push(this);
    this.begin = this.getAttribute("begin").getMilliseconds();
    this.maxDuration = this.begin + this.getAttribute("dur").getMilliseconds();
    this.from = this.getAttribute("from");
    this.to = this.getAttribute("to");
    this.values = new Property(document2, "values", null);
    var valuesAttr = this.getAttribute("values");
    if (valuesAttr.hasValue()) {
      this.values.setValue(valuesAttr.getString().split(";"));
    }
  }
  getProperty() {
    var attributeType = this.getAttribute("attributeType").getString();
    var attributeName = this.getAttribute("attributeName").getString();
    if (attributeType === "CSS") {
      return this.parent.getStyle(attributeName, true);
    }
    return this.parent.getAttribute(attributeName, true);
  }
  calcValue() {
    var {
      initialUnits
    } = this;
    var {
      progress,
      from,
      to
    } = this.getProgress();
    var newValue = from.getNumber() + (to.getNumber() - from.getNumber()) * progress;
    if (initialUnits === "%") {
      newValue *= 100;
    }
    return "".concat(newValue).concat(initialUnits);
  }
  update(delta) {
    var {
      parent
    } = this;
    var prop = this.getProperty();
    if (!this.initialValue) {
      this.initialValue = prop.getString();
      this.initialUnits = prop.getUnits();
    }
    if (this.duration > this.maxDuration) {
      var fill = this.getAttribute("fill").getString("remove");
      if (this.getAttribute("repeatCount").getString() === "indefinite" || this.getAttribute("repeatDur").getString() === "indefinite") {
        this.duration = 0;
      } else if (fill === "freeze" && !this.frozen) {
        this.frozen = true;
        parent.animationFrozen = true;
        parent.animationFrozenValue = prop.getString();
      } else if (fill === "remove" && !this.removed) {
        this.removed = true;
        prop.setValue(parent.animationFrozen ? parent.animationFrozenValue : this.initialValue);
        return true;
      }
      return false;
    }
    this.duration += delta;
    var updated = false;
    if (this.begin < this.duration) {
      var newValue = this.calcValue();
      var typeAttr = this.getAttribute("type");
      if (typeAttr.hasValue()) {
        var type = typeAttr.getString();
        newValue = "".concat(type, "(").concat(newValue, ")");
      }
      prop.setValue(newValue);
      updated = true;
    }
    return updated;
  }
  getProgress() {
    var {
      document: document2,
      values
    } = this;
    var result = {
      progress: (this.duration - this.begin) / (this.maxDuration - this.begin)
    };
    if (values.hasValue()) {
      var p2 = result.progress * (values.getValue().length - 1);
      var lb = Math.floor(p2);
      var ub = Math.ceil(p2);
      result.from = new Property(document2, "from", parseFloat(values.getValue()[lb]));
      result.to = new Property(document2, "to", parseFloat(values.getValue()[ub]));
      result.progress = (p2 - lb) / (ub - lb);
    } else {
      result.from = this.from;
      result.to = this.to;
    }
    return result;
  }
}
class AnimateColorElement extends AnimateElement {
  constructor() {
    super(...arguments);
    this.type = "animateColor";
  }
  calcValue() {
    var {
      progress,
      from,
      to
    } = this.getProgress();
    var colorFrom = new RGBColor$1(from.getColor());
    var colorTo = new RGBColor$1(to.getColor());
    if (colorFrom.ok && colorTo.ok) {
      var r2 = colorFrom.r + (colorTo.r - colorFrom.r) * progress;
      var g = colorFrom.g + (colorTo.g - colorFrom.g) * progress;
      var b = colorFrom.b + (colorTo.b - colorFrom.b) * progress;
      return "rgb(".concat(Math.floor(r2), ", ").concat(Math.floor(g), ", ").concat(Math.floor(b), ")");
    }
    return this.getAttribute("from").getColor();
  }
}
class AnimateTransformElement extends AnimateElement {
  constructor() {
    super(...arguments);
    this.type = "animateTransform";
  }
  calcValue() {
    var {
      progress,
      from,
      to
    } = this.getProgress();
    var transformFrom = toNumbers(from.getString());
    var transformTo = toNumbers(to.getString());
    var newValue = transformFrom.map((from2, i2) => {
      var to2 = transformTo[i2];
      return from2 + (to2 - from2) * progress;
    }).join(" ");
    return newValue;
  }
}
class FontElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "font";
    this.glyphs = /* @__PURE__ */ Object.create(null);
    this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
    var {
      definitions
    } = document2;
    var {
      children
    } = this;
    for (var child of children) {
      switch (child.type) {
        case "font-face": {
          this.fontFace = child;
          var fontFamilyStyle = child.getStyle("font-family");
          if (fontFamilyStyle.hasValue()) {
            definitions[fontFamilyStyle.getString()] = this;
          }
          break;
        }
        case "missing-glyph":
          this.missingGlyph = child;
          break;
        case "glyph": {
          var glyph = child;
          if (glyph.arabicForm) {
            this.isRTL = true;
            this.isArabic = true;
            if (typeof this.glyphs[glyph.unicode] === "undefined") {
              this.glyphs[glyph.unicode] = /* @__PURE__ */ Object.create(null);
            }
            this.glyphs[glyph.unicode][glyph.arabicForm] = glyph;
          } else {
            this.glyphs[glyph.unicode] = glyph;
          }
          break;
        }
      }
    }
  }
  render() {
  }
}
class FontFaceElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "font-face";
    this.ascent = this.getAttribute("ascent").getNumber();
    this.descent = this.getAttribute("descent").getNumber();
    this.unitsPerEm = this.getAttribute("units-per-em").getNumber();
  }
}
class MissingGlyphElement extends PathElement {
  constructor() {
    super(...arguments);
    this.type = "missing-glyph";
    this.horizAdvX = 0;
  }
}
class TRefElement extends TextElement {
  constructor() {
    super(...arguments);
    this.type = "tref";
  }
  getText() {
    var element = this.getHrefAttribute().getDefinition();
    if (element) {
      var firstChild = element.children[0];
      if (firstChild) {
        return firstChild.getText();
      }
    }
    return "";
  }
}
class AElement extends TextElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "a";
    var {
      childNodes
    } = node2;
    var firstChild = childNodes[0];
    var hasText = childNodes.length > 0 && Array.from(childNodes).every((node3) => node3.nodeType === 3);
    this.hasText = hasText;
    this.text = hasText ? this.getTextFromNode(firstChild) : "";
  }
  getText() {
    return this.text;
  }
  renderChildren(ctx) {
    if (this.hasText) {
      super.renderChildren(ctx);
      var {
        document: document2,
        x,
        y: y2
      } = this;
      var {
        mouse
      } = document2.screen;
      var fontSize = new Property(document2, "fontSize", Font.parse(document2.ctx.font).fontSize);
      if (mouse.isWorking()) {
        mouse.checkBoundingBox(this, new BoundingBox(x, y2 - fontSize.getPixels("y"), x + this.measureText(ctx), y2));
      }
    } else if (this.children.length > 0) {
      var g = new GElement(this.document, null);
      g.children = this.children;
      g.parent = this;
      g.render(ctx);
    }
  }
  onClick() {
    var {
      window: window2
    } = this.document;
    if (window2) {
      window2.open(this.getHrefAttribute().getString());
    }
  }
  onMouseMove() {
    var ctx = this.document.ctx;
    ctx.canvas.style.cursor = "pointer";
  }
}
function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$2(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = arguments[i2] != null ? arguments[i2] : {};
    if (i2 % 2) {
      ownKeys$2(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$2(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
class TextPathElement extends TextElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "textPath";
    this.textWidth = 0;
    this.textHeight = 0;
    this.pathLength = -1;
    this.glyphInfo = null;
    this.letterSpacingCache = [];
    this.measuresCache = /* @__PURE__ */ new Map([["", 0]]);
    var pathElement = this.getHrefAttribute().getDefinition();
    this.text = this.getTextFromNode();
    this.dataArray = this.parsePathData(pathElement);
  }
  getText() {
    return this.text;
  }
  path(ctx) {
    var {
      dataArray
    } = this;
    if (ctx) {
      ctx.beginPath();
    }
    dataArray.forEach((_ref) => {
      var {
        type,
        points
      } = _ref;
      switch (type) {
        case PathParser.LINE_TO:
          if (ctx) {
            ctx.lineTo(points[0], points[1]);
          }
          break;
        case PathParser.MOVE_TO:
          if (ctx) {
            ctx.moveTo(points[0], points[1]);
          }
          break;
        case PathParser.CURVE_TO:
          if (ctx) {
            ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
          }
          break;
        case PathParser.QUAD_TO:
          if (ctx) {
            ctx.quadraticCurveTo(points[0], points[1], points[2], points[3]);
          }
          break;
        case PathParser.ARC: {
          var [cx, cy, rx, ry, theta, dTheta, psi, fs] = points;
          var r2 = rx > ry ? rx : ry;
          var scaleX = rx > ry ? 1 : rx / ry;
          var scaleY = rx > ry ? ry / rx : 1;
          if (ctx) {
            ctx.translate(cx, cy);
            ctx.rotate(psi);
            ctx.scale(scaleX, scaleY);
            ctx.arc(0, 0, r2, theta, theta + dTheta, Boolean(1 - fs));
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.rotate(-psi);
            ctx.translate(-cx, -cy);
          }
          break;
        }
        case PathParser.CLOSE_PATH:
          if (ctx) {
            ctx.closePath();
          }
          break;
      }
    });
  }
  renderChildren(ctx) {
    this.setTextData(ctx);
    ctx.save();
    var textDecoration = this.parent.getStyle("text-decoration").getString();
    var fontSize = this.getFontSize();
    var {
      glyphInfo
    } = this;
    var fill = ctx.fillStyle;
    if (textDecoration === "underline") {
      ctx.beginPath();
    }
    glyphInfo.forEach((glyph, i2) => {
      var {
        p0,
        p1,
        rotation,
        text: partialText
      } = glyph;
      ctx.save();
      ctx.translate(p0.x, p0.y);
      ctx.rotate(rotation);
      if (ctx.fillStyle) {
        ctx.fillText(partialText, 0, 0);
      }
      if (ctx.strokeStyle) {
        ctx.strokeText(partialText, 0, 0);
      }
      ctx.restore();
      if (textDecoration === "underline") {
        if (i2 === 0) {
          ctx.moveTo(p0.x, p0.y + fontSize / 8);
        }
        ctx.lineTo(p1.x, p1.y + fontSize / 5);
      }
    });
    if (textDecoration === "underline") {
      ctx.lineWidth = fontSize / 20;
      ctx.strokeStyle = fill;
      ctx.stroke();
      ctx.closePath();
    }
    ctx.restore();
  }
  getLetterSpacingAt() {
    var idx = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    return this.letterSpacingCache[idx] || 0;
  }
  findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, inputOffset, dy, c2, charI) {
    var offset = inputOffset;
    var glyphWidth = this.measureText(ctx, c2);
    if (c2 === " " && anchor === "justify" && textFullWidth < fullPathWidth) {
      glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
    }
    if (charI > -1) {
      offset += this.getLetterSpacingAt(charI);
    }
    var splineStep = this.textHeight / 20;
    var p0 = this.getEquidistantPointOnPath(offset, splineStep, 0);
    var p1 = this.getEquidistantPointOnPath(offset + glyphWidth, splineStep, 0);
    var segment = {
      p0,
      p1
    };
    var rotation = p0 && p1 ? Math.atan2(p1.y - p0.y, p1.x - p0.x) : 0;
    if (dy) {
      var dyX = Math.cos(Math.PI / 2 + rotation) * dy;
      var dyY = Math.cos(-rotation) * dy;
      segment.p0 = _objectSpread$2(_objectSpread$2({}, p0), {}, {
        x: p0.x + dyX,
        y: p0.y + dyY
      });
      segment.p1 = _objectSpread$2(_objectSpread$2({}, p1), {}, {
        x: p1.x + dyX,
        y: p1.y + dyY
      });
    }
    offset += glyphWidth;
    return {
      offset,
      segment,
      rotation
    };
  }
  measureText(ctx, text) {
    var {
      measuresCache
    } = this;
    var targetText = text || this.getText();
    if (measuresCache.has(targetText)) {
      return measuresCache.get(targetText);
    }
    var measure = this.measureTargetText(ctx, targetText);
    measuresCache.set(targetText, measure);
    return measure;
  }
  // This method supposes what all custom fonts already loaded.
  // If some font will be loaded after this method call, <textPath> will not be rendered correctly.
  // You need to call this method manually to update glyphs cache.
  setTextData(ctx) {
    if (this.glyphInfo) {
      return;
    }
    var renderText = this.getText();
    var chars = renderText.split("");
    var spacesNumber = renderText.split(" ").length - 1;
    var dx = this.parent.getAttribute("dx").split().map((_2) => _2.getPixels("x"));
    var dy = this.parent.getAttribute("dy").getPixels("y");
    var anchor = this.parent.getStyle("text-anchor").getString("start");
    var thisSpacing = this.getStyle("letter-spacing");
    var parentSpacing = this.parent.getStyle("letter-spacing");
    var letterSpacing = 0;
    if (!thisSpacing.hasValue() || thisSpacing.getValue() === "inherit") {
      letterSpacing = parentSpacing.getPixels();
    } else if (thisSpacing.hasValue()) {
      if (thisSpacing.getValue() !== "initial" && thisSpacing.getValue() !== "unset") {
        letterSpacing = thisSpacing.getPixels();
      }
    }
    var letterSpacingCache = [];
    var textLen = renderText.length;
    this.letterSpacingCache = letterSpacingCache;
    for (var i2 = 0; i2 < textLen; i2++) {
      letterSpacingCache.push(typeof dx[i2] !== "undefined" ? dx[i2] : letterSpacing);
    }
    var dxSum = letterSpacingCache.reduce((acc, cur, i3) => i3 === 0 ? 0 : acc + cur || 0, 0);
    var textWidth = this.measureText(ctx);
    var textFullWidth = Math.max(textWidth + dxSum, 0);
    this.textWidth = textWidth;
    this.textHeight = this.getFontSize();
    this.glyphInfo = [];
    var fullPathWidth = this.getPathLength();
    var startOffset = this.getStyle("startOffset").getNumber(0) * fullPathWidth;
    var offset = 0;
    if (anchor === "middle" || anchor === "center") {
      offset = -textFullWidth / 2;
    }
    if (anchor === "end" || anchor === "right") {
      offset = -textFullWidth;
    }
    offset += startOffset;
    chars.forEach((char, i3) => {
      var {
        offset: nextOffset,
        segment,
        rotation
      } = this.findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, offset, dy, char, i3);
      offset = nextOffset;
      if (!segment.p0 || !segment.p1) {
        return;
      }
      this.glyphInfo.push({
        // transposeX: midpoint.x,
        // transposeY: midpoint.y,
        text: chars[i3],
        p0: segment.p0,
        p1: segment.p1,
        rotation
      });
    });
  }
  parsePathData(path2) {
    this.pathLength = -1;
    if (!path2) {
      return [];
    }
    var pathCommands = [];
    var {
      pathParser
    } = path2;
    pathParser.reset();
    while (!pathParser.isEnd()) {
      var {
        current
      } = pathParser;
      var startX = current ? current.x : 0;
      var startY = current ? current.y : 0;
      var command = pathParser.next();
      var nextCommandType = command.type;
      var points = [];
      switch (command.type) {
        case PathParser.MOVE_TO:
          this.pathM(pathParser, points);
          break;
        case PathParser.LINE_TO:
          nextCommandType = this.pathL(pathParser, points);
          break;
        case PathParser.HORIZ_LINE_TO:
          nextCommandType = this.pathH(pathParser, points);
          break;
        case PathParser.VERT_LINE_TO:
          nextCommandType = this.pathV(pathParser, points);
          break;
        case PathParser.CURVE_TO:
          this.pathC(pathParser, points);
          break;
        case PathParser.SMOOTH_CURVE_TO:
          nextCommandType = this.pathS(pathParser, points);
          break;
        case PathParser.QUAD_TO:
          this.pathQ(pathParser, points);
          break;
        case PathParser.SMOOTH_QUAD_TO:
          nextCommandType = this.pathT(pathParser, points);
          break;
        case PathParser.ARC:
          points = this.pathA(pathParser);
          break;
        case PathParser.CLOSE_PATH:
          PathElement.pathZ(pathParser);
          break;
      }
      if (command.type !== PathParser.CLOSE_PATH) {
        pathCommands.push({
          type: nextCommandType,
          points,
          start: {
            x: startX,
            y: startY
          },
          pathLength: this.calcLength(startX, startY, nextCommandType, points)
        });
      } else {
        pathCommands.push({
          type: PathParser.CLOSE_PATH,
          points: [],
          pathLength: 0
        });
      }
    }
    return pathCommands;
  }
  pathM(pathParser, points) {
    var {
      x,
      y: y2
    } = PathElement.pathM(pathParser).point;
    points.push(x, y2);
  }
  pathL(pathParser, points) {
    var {
      x,
      y: y2
    } = PathElement.pathL(pathParser).point;
    points.push(x, y2);
    return PathParser.LINE_TO;
  }
  pathH(pathParser, points) {
    var {
      x,
      y: y2
    } = PathElement.pathH(pathParser).point;
    points.push(x, y2);
    return PathParser.LINE_TO;
  }
  pathV(pathParser, points) {
    var {
      x,
      y: y2
    } = PathElement.pathV(pathParser).point;
    points.push(x, y2);
    return PathParser.LINE_TO;
  }
  pathC(pathParser, points) {
    var {
      point,
      controlPoint,
      currentPoint
    } = PathElement.pathC(pathParser);
    points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
  }
  pathS(pathParser, points) {
    var {
      point,
      controlPoint,
      currentPoint
    } = PathElement.pathS(pathParser);
    points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    return PathParser.CURVE_TO;
  }
  pathQ(pathParser, points) {
    var {
      controlPoint,
      currentPoint
    } = PathElement.pathQ(pathParser);
    points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
  }
  pathT(pathParser, points) {
    var {
      controlPoint,
      currentPoint
    } = PathElement.pathT(pathParser);
    points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
    return PathParser.QUAD_TO;
  }
  pathA(pathParser) {
    var {
      rX,
      rY,
      sweepFlag,
      xAxisRotation,
      centp,
      a1,
      ad
    } = PathElement.pathA(pathParser);
    if (sweepFlag === 0 && ad > 0) {
      ad -= 2 * Math.PI;
    }
    if (sweepFlag === 1 && ad < 0) {
      ad += 2 * Math.PI;
    }
    return [centp.x, centp.y, rX, rY, a1, ad, xAxisRotation, sweepFlag];
  }
  calcLength(x, y2, commandType, points) {
    var len = 0;
    var p1 = null;
    var p2 = null;
    var t2 = 0;
    switch (commandType) {
      case PathParser.LINE_TO:
        return this.getLineLength(x, y2, points[0], points[1]);
      case PathParser.CURVE_TO:
        len = 0;
        p1 = this.getPointOnCubicBezier(0, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
        for (t2 = 0.01; t2 <= 1; t2 += 0.01) {
          p2 = this.getPointOnCubicBezier(t2, x, y2, points[0], points[1], points[2], points[3], points[4], points[5]);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
        return len;
      case PathParser.QUAD_TO:
        len = 0;
        p1 = this.getPointOnQuadraticBezier(0, x, y2, points[0], points[1], points[2], points[3]);
        for (t2 = 0.01; t2 <= 1; t2 += 0.01) {
          p2 = this.getPointOnQuadraticBezier(t2, x, y2, points[0], points[1], points[2], points[3]);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          p1 = p2;
        }
        return len;
      case PathParser.ARC: {
        len = 0;
        var start = points[4];
        var dTheta = points[5];
        var end = points[4] + dTheta;
        var inc = Math.PI / 180;
        if (Math.abs(start - end) < inc) {
          inc = Math.abs(start - end);
        }
        p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
        if (dTheta < 0) {
          for (t2 = start - inc; t2 > end; t2 -= inc) {
            p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t2, 0);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        } else {
          for (t2 = start + inc; t2 < end; t2 += inc) {
            p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t2, 0);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }
        }
        p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
        len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
        return len;
      }
    }
    return 0;
  }
  getPointOnLine(dist, p1x, p1y, p2x, p2y) {
    var fromX = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : p1x;
    var fromY = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : p1y;
    var m2 = (p2y - p1y) / (p2x - p1x + PSEUDO_ZERO);
    var run = Math.sqrt(dist * dist / (1 + m2 * m2));
    if (p2x < p1x) {
      run *= -1;
    }
    var rise = m2 * run;
    var pt = null;
    if (p2x === p1x) {
      pt = {
        x: fromX,
        y: fromY + rise
      };
    } else if ((fromY - p1y) / (fromX - p1x + PSEUDO_ZERO) === m2) {
      pt = {
        x: fromX + run,
        y: fromY + rise
      };
    } else {
      var ix = 0;
      var iy = 0;
      var len = this.getLineLength(p1x, p1y, p2x, p2y);
      if (len < PSEUDO_ZERO) {
        return null;
      }
      var u2 = (fromX - p1x) * (p2x - p1x) + (fromY - p1y) * (p2y - p1y);
      u2 /= len * len;
      ix = p1x + u2 * (p2x - p1x);
      iy = p1y + u2 * (p2y - p1y);
      var pRise = this.getLineLength(fromX, fromY, ix, iy);
      var pRun = Math.sqrt(dist * dist - pRise * pRise);
      run = Math.sqrt(pRun * pRun / (1 + m2 * m2));
      if (p2x < p1x) {
        run *= -1;
      }
      rise = m2 * run;
      pt = {
        x: ix + run,
        y: iy + rise
      };
    }
    return pt;
  }
  getPointOnPath(distance) {
    var fullLen = this.getPathLength();
    var cumulativePathLength = 0;
    var p2 = null;
    if (distance < -5e-5 || distance - 5e-5 > fullLen) {
      return null;
    }
    var {
      dataArray
    } = this;
    for (var command of dataArray) {
      if (command && (command.pathLength < 5e-5 || cumulativePathLength + command.pathLength + 5e-5 < distance)) {
        cumulativePathLength += command.pathLength;
        continue;
      }
      var delta = distance - cumulativePathLength;
      var currentT = 0;
      switch (command.type) {
        case PathParser.LINE_TO:
          p2 = this.getPointOnLine(delta, command.start.x, command.start.y, command.points[0], command.points[1], command.start.x, command.start.y);
          break;
        case PathParser.ARC: {
          var start = command.points[4];
          var dTheta = command.points[5];
          var end = command.points[4] + dTheta;
          currentT = start + delta / command.pathLength * dTheta;
          if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
            break;
          }
          p2 = this.getPointOnEllipticalArc(command.points[0], command.points[1], command.points[2], command.points[3], currentT, command.points[6]);
          break;
        }
        case PathParser.CURVE_TO:
          currentT = delta / command.pathLength;
          if (currentT > 1) {
            currentT = 1;
          }
          p2 = this.getPointOnCubicBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3], command.points[4], command.points[5]);
          break;
        case PathParser.QUAD_TO:
          currentT = delta / command.pathLength;
          if (currentT > 1) {
            currentT = 1;
          }
          p2 = this.getPointOnQuadraticBezier(currentT, command.start.x, command.start.y, command.points[0], command.points[1], command.points[2], command.points[3]);
          break;
      }
      if (p2) {
        return p2;
      }
      break;
    }
    return null;
  }
  getLineLength(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }
  getPathLength() {
    if (this.pathLength === -1) {
      this.pathLength = this.dataArray.reduce((length, command) => command.pathLength > 0 ? length + command.pathLength : length, 0);
    }
    return this.pathLength;
  }
  getPointOnCubicBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
    var x = p4x * CB1(pct) + p3x * CB2(pct) + p2x * CB3(pct) + p1x * CB4(pct);
    var y2 = p4y * CB1(pct) + p3y * CB2(pct) + p2y * CB3(pct) + p1y * CB4(pct);
    return {
      x,
      y: y2
    };
  }
  getPointOnQuadraticBezier(pct, p1x, p1y, p2x, p2y, p3x, p3y) {
    var x = p3x * QB1(pct) + p2x * QB2(pct) + p1x * QB3(pct);
    var y2 = p3y * QB1(pct) + p2y * QB2(pct) + p1y * QB3(pct);
    return {
      x,
      y: y2
    };
  }
  getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
    var cosPsi = Math.cos(psi);
    var sinPsi = Math.sin(psi);
    var pt = {
      x: rx * Math.cos(theta),
      y: ry * Math.sin(theta)
    };
    return {
      x: cx + (pt.x * cosPsi - pt.y * sinPsi),
      y: cy + (pt.x * sinPsi + pt.y * cosPsi)
    };
  }
  // TODO need some optimisations. possibly build cache only for curved segments?
  buildEquidistantCache(inputStep, inputPrecision) {
    var fullLen = this.getPathLength();
    var precision = inputPrecision || 0.25;
    var step = inputStep || fullLen / 100;
    if (!this.equidistantCache || this.equidistantCache.step !== step || this.equidistantCache.precision !== precision) {
      this.equidistantCache = {
        step,
        precision,
        points: []
      };
      var s2 = 0;
      for (var l2 = 0; l2 <= fullLen; l2 += precision) {
        var p0 = this.getPointOnPath(l2);
        var p1 = this.getPointOnPath(l2 + precision);
        if (!p0 || !p1) {
          continue;
        }
        s2 += this.getLineLength(p0.x, p0.y, p1.x, p1.y);
        if (s2 >= step) {
          this.equidistantCache.points.push({
            x: p0.x,
            y: p0.y,
            distance: l2
          });
          s2 -= step;
        }
      }
    }
  }
  getEquidistantPointOnPath(targetDistance, step, precision) {
    this.buildEquidistantCache(step, precision);
    if (targetDistance < 0 || targetDistance - this.getPathLength() > 5e-5) {
      return null;
    }
    var idx = Math.round(targetDistance / this.getPathLength() * (this.equidistantCache.points.length - 1));
    return this.equidistantCache.points[idx] || null;
  }
}
var dataUriRegex = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*)$/i;
class ImageElement extends RenderedElement {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "image";
    this.loaded = false;
    var href = this.getHrefAttribute().getString();
    if (!href) {
      return;
    }
    var isSvg = href.endsWith(".svg") || /^\s*data:image\/svg\+xml/i.test(href);
    document2.images.push(this);
    if (!isSvg) {
      void this.loadImage(href);
    } else {
      void this.loadSvg(href);
    }
    this.isSvg = isSvg;
  }
  loadImage(href) {
    var _this = this;
    return _asyncToGenerator(function* () {
      try {
        var image = yield _this.document.createImage(href);
        _this.image = image;
      } catch (err) {
        console.error('Error while loading image "'.concat(href, '":'), err);
      }
      _this.loaded = true;
    })();
  }
  loadSvg(href) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      var match = dataUriRegex.exec(href);
      if (match) {
        var data = match[5];
        if (match[4] === "base64") {
          _this2.image = atob(data);
        } else {
          _this2.image = decodeURIComponent(data);
        }
      } else {
        try {
          var response = yield _this2.document.fetch(href);
          var svg = yield response.text();
          _this2.image = svg;
        } catch (err) {
          console.error('Error while loading image "'.concat(href, '":'), err);
        }
      }
      _this2.loaded = true;
    })();
  }
  renderChildren(ctx) {
    var {
      document: document2,
      image,
      loaded
    } = this;
    var x = this.getAttribute("x").getPixels("x");
    var y2 = this.getAttribute("y").getPixels("y");
    var width = this.getStyle("width").getPixels("x");
    var height = this.getStyle("height").getPixels("y");
    if (!loaded || !image || !width || !height) {
      return;
    }
    ctx.save();
    ctx.translate(x, y2);
    if (this.isSvg) {
      var subDocument = document2.canvg.forkString(ctx, this.image, {
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        offsetX: 0,
        offsetY: 0,
        scaleWidth: width,
        scaleHeight: height
      });
      subDocument.document.documentElement.parent = this;
      void subDocument.render();
    } else {
      var _image = this.image;
      document2.setViewBox({
        ctx,
        aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
        width,
        desiredWidth: _image.width,
        height,
        desiredHeight: _image.height
      });
      if (this.loaded) {
        if (typeof _image.complete === "undefined" || _image.complete) {
          ctx.drawImage(_image, 0, 0);
        }
      }
    }
    ctx.restore();
  }
  getBoundingBox() {
    var x = this.getAttribute("x").getPixels("x");
    var y2 = this.getAttribute("y").getPixels("y");
    var width = this.getStyle("width").getPixels("x");
    var height = this.getStyle("height").getPixels("y");
    return new BoundingBox(x, y2, x + width, y2 + height);
  }
}
class SymbolElement extends RenderedElement {
  constructor() {
    super(...arguments);
    this.type = "symbol";
  }
  render(_2) {
  }
}
class SVGFontLoader {
  constructor(document2) {
    this.document = document2;
    this.loaded = false;
    document2.fonts.push(this);
  }
  load(fontFamily, url) {
    var _this = this;
    return _asyncToGenerator(function* () {
      try {
        var {
          document: document2
        } = _this;
        var svgDocument = yield document2.canvg.parser.load(url);
        var fonts = svgDocument.getElementsByTagName("font");
        Array.from(fonts).forEach((fontNode) => {
          var font = document2.createElement(fontNode);
          document2.definitions[fontFamily] = font;
        });
      } catch (err) {
        console.error('Error while loading font "'.concat(url, '":'), err);
      }
      _this.loaded = true;
    })();
  }
}
class StyleElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "style";
    var css = compressSpaces(
      Array.from(node2.childNodes).map((_2) => _2.textContent).join("").replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "").replace(/@import.*;/g, "")
      // remove imports
    );
    var cssDefs = css.split("}");
    cssDefs.forEach((_2) => {
      var def = _2.trim();
      if (!def) {
        return;
      }
      var cssParts = def.split("{");
      var cssClasses = cssParts[0].split(",");
      var cssProps = cssParts[1].split(";");
      cssClasses.forEach((_3) => {
        var cssClass = _3.trim();
        if (!cssClass) {
          return;
        }
        var props = document2.styles[cssClass] || {};
        cssProps.forEach((cssProp) => {
          var prop = cssProp.indexOf(":");
          var name = cssProp.substr(0, prop).trim();
          var value = cssProp.substr(prop + 1, cssProp.length - prop).trim();
          if (name && value) {
            props[name] = new Property(document2, name, value);
          }
        });
        document2.styles[cssClass] = props;
        document2.stylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
        if (cssClass === "@font-face") {
          var fontFamily = props["font-family"].getString().replace(/"|'/g, "");
          var srcs = props.src.getString().split(",");
          srcs.forEach((src) => {
            if (src.indexOf('format("svg")') > 0) {
              var url = parseExternalUrl(src);
              if (url) {
                void new SVGFontLoader(document2).load(fontFamily, url);
              }
            }
          });
        }
      });
    });
  }
}
StyleElement.parseExternalUrl = parseExternalUrl;
class UseElement extends RenderedElement {
  constructor() {
    super(...arguments);
    this.type = "use";
  }
  setContext(ctx) {
    super.setContext(ctx);
    var xAttr = this.getAttribute("x");
    var yAttr = this.getAttribute("y");
    if (xAttr.hasValue()) {
      ctx.translate(xAttr.getPixels("x"), 0);
    }
    if (yAttr.hasValue()) {
      ctx.translate(0, yAttr.getPixels("y"));
    }
  }
  path(ctx) {
    var {
      element
    } = this;
    if (element) {
      element.path(ctx);
    }
  }
  renderChildren(ctx) {
    var {
      document: document2,
      element
    } = this;
    if (element) {
      var tempSvg = element;
      if (element.type === "symbol") {
        tempSvg = new SVGElement(document2, null);
        tempSvg.attributes.viewBox = new Property(document2, "viewBox", element.getAttribute("viewBox").getString());
        tempSvg.attributes.preserveAspectRatio = new Property(document2, "preserveAspectRatio", element.getAttribute("preserveAspectRatio").getString());
        tempSvg.attributes.overflow = new Property(document2, "overflow", element.getAttribute("overflow").getString());
        tempSvg.children = element.children;
        element.styles.opacity = new Property(document2, "opacity", this.calculateOpacity());
      }
      if (tempSvg.type === "svg") {
        var widthStyle = this.getStyle("width", false, true);
        var heightStyle = this.getStyle("height", false, true);
        if (widthStyle.hasValue()) {
          tempSvg.attributes.width = new Property(document2, "width", widthStyle.getString());
        }
        if (heightStyle.hasValue()) {
          tempSvg.attributes.height = new Property(document2, "height", heightStyle.getString());
        }
      }
      var oldParent = tempSvg.parent;
      tempSvg.parent = this;
      tempSvg.render(ctx);
      tempSvg.parent = oldParent;
    }
  }
  getBoundingBox(ctx) {
    var {
      element
    } = this;
    if (element) {
      return element.getBoundingBox(ctx);
    }
    return null;
  }
  elementTransform() {
    var {
      document: document2,
      element
    } = this;
    return Transform.fromElement(document2, element);
  }
  get element() {
    if (!this.cachedElement) {
      this.cachedElement = this.getHrefAttribute().getDefinition();
    }
    return this.cachedElement;
  }
}
function imGet(img, x, y2, width, _height, rgba) {
  return img[y2 * width * 4 + x * 4 + rgba];
}
function imSet(img, x, y2, width, _height, rgba, val) {
  img[y2 * width * 4 + x * 4 + rgba] = val;
}
function m(matrix, i2, v2) {
  var mi = matrix[i2];
  return mi * v2;
}
function c(a2, m1, m2, m3) {
  return m1 + Math.cos(a2) * m2 + Math.sin(a2) * m3;
}
class FeColorMatrixElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "feColorMatrix";
    var matrix = toNumbers(this.getAttribute("values").getString());
    switch (this.getAttribute("type").getString("matrix")) {
      // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      case "saturate": {
        var s2 = matrix[0];
        matrix = [0.213 + 0.787 * s2, 0.715 - 0.715 * s2, 0.072 - 0.072 * s2, 0, 0, 0.213 - 0.213 * s2, 0.715 + 0.285 * s2, 0.072 - 0.072 * s2, 0, 0, 0.213 - 0.213 * s2, 0.715 - 0.715 * s2, 0.072 + 0.928 * s2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
        break;
      }
      case "hueRotate": {
        var a2 = matrix[0] * Math.PI / 180;
        matrix = [c(a2, 0.213, 0.787, -0.213), c(a2, 0.715, -0.715, -0.715), c(a2, 0.072, -0.072, 0.928), 0, 0, c(a2, 0.213, -0.213, 0.143), c(a2, 0.715, 0.285, 0.14), c(a2, 0.072, -0.072, -0.283), 0, 0, c(a2, 0.213, -0.213, -0.787), c(a2, 0.715, -0.715, 0.715), c(a2, 0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
        break;
      }
      case "luminanceToAlpha":
        matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
        break;
    }
    this.matrix = matrix;
    this.includeOpacity = this.getAttribute("includeOpacity").hasValue();
  }
  apply(ctx, _x, _y, width, height) {
    var {
      includeOpacity,
      matrix
    } = this;
    var srcData = ctx.getImageData(0, 0, width, height);
    for (var y2 = 0; y2 < height; y2++) {
      for (var x = 0; x < width; x++) {
        var r2 = imGet(srcData.data, x, y2, width, height, 0);
        var g = imGet(srcData.data, x, y2, width, height, 1);
        var b = imGet(srcData.data, x, y2, width, height, 2);
        var a2 = imGet(srcData.data, x, y2, width, height, 3);
        var nr = m(matrix, 0, r2) + m(matrix, 1, g) + m(matrix, 2, b) + m(matrix, 3, a2) + m(matrix, 4, 1);
        var ng = m(matrix, 5, r2) + m(matrix, 6, g) + m(matrix, 7, b) + m(matrix, 8, a2) + m(matrix, 9, 1);
        var nb = m(matrix, 10, r2) + m(matrix, 11, g) + m(matrix, 12, b) + m(matrix, 13, a2) + m(matrix, 14, 1);
        var na = m(matrix, 15, r2) + m(matrix, 16, g) + m(matrix, 17, b) + m(matrix, 18, a2) + m(matrix, 19, 1);
        if (includeOpacity) {
          nr = 0;
          ng = 0;
          nb = 0;
          na *= a2 / 255;
        }
        imSet(srcData.data, x, y2, width, height, 0, nr);
        imSet(srcData.data, x, y2, width, height, 1, ng);
        imSet(srcData.data, x, y2, width, height, 2, nb);
        imSet(srcData.data, x, y2, width, height, 3, na);
      }
    }
    ctx.clearRect(0, 0, width, height);
    ctx.putImageData(srcData, 0, 0);
  }
}
class MaskElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "mask";
  }
  apply(ctx, element) {
    var {
      document: document2
    } = this;
    var x = this.getAttribute("x").getPixels("x");
    var y2 = this.getAttribute("y").getPixels("y");
    var width = this.getStyle("width").getPixels("x");
    var height = this.getStyle("height").getPixels("y");
    if (!width && !height) {
      var boundingBox = new BoundingBox();
      this.children.forEach((child) => {
        boundingBox.addBoundingBox(child.getBoundingBox(ctx));
      });
      x = Math.floor(boundingBox.x1);
      y2 = Math.floor(boundingBox.y1);
      width = Math.floor(boundingBox.width);
      height = Math.floor(boundingBox.height);
    }
    var ignoredStyles = this.removeStyles(element, MaskElement.ignoreStyles);
    var maskCanvas = document2.createCanvas(x + width, y2 + height);
    var maskCtx = maskCanvas.getContext("2d");
    document2.screen.setDefaults(maskCtx);
    this.renderChildren(maskCtx);
    new FeColorMatrixElement(document2, {
      nodeType: 1,
      childNodes: [],
      attributes: [{
        nodeName: "type",
        value: "luminanceToAlpha"
      }, {
        nodeName: "includeOpacity",
        value: "true"
      }]
    }).apply(maskCtx, 0, 0, x + width, y2 + height);
    var tmpCanvas = document2.createCanvas(x + width, y2 + height);
    var tmpCtx = tmpCanvas.getContext("2d");
    document2.screen.setDefaults(tmpCtx);
    element.render(tmpCtx);
    tmpCtx.globalCompositeOperation = "destination-in";
    tmpCtx.fillStyle = maskCtx.createPattern(maskCanvas, "no-repeat");
    tmpCtx.fillRect(0, 0, x + width, y2 + height);
    ctx.fillStyle = tmpCtx.createPattern(tmpCanvas, "no-repeat");
    ctx.fillRect(0, 0, x + width, y2 + height);
    this.restoreStyles(element, ignoredStyles);
  }
  render(_2) {
  }
}
MaskElement.ignoreStyles = ["mask", "transform", "clip-path"];
var noop = () => {
};
class ClipPathElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "clipPath";
  }
  apply(ctx) {
    var {
      document: document2
    } = this;
    var contextProto = Reflect.getPrototypeOf(ctx);
    var {
      beginPath,
      closePath
    } = ctx;
    if (contextProto) {
      contextProto.beginPath = noop;
      contextProto.closePath = noop;
    }
    Reflect.apply(beginPath, ctx, []);
    this.children.forEach((child) => {
      if (typeof child.path === "undefined") {
        return;
      }
      var transform = typeof child.elementTransform !== "undefined" ? child.elementTransform() : null;
      if (!transform) {
        transform = Transform.fromElement(document2, child);
      }
      if (transform) {
        transform.apply(ctx);
      }
      child.path(ctx);
      if (contextProto) {
        contextProto.closePath = closePath;
      }
      if (transform) {
        transform.unapply(ctx);
      }
    });
    Reflect.apply(closePath, ctx, []);
    ctx.clip();
    if (contextProto) {
      contextProto.beginPath = beginPath;
      contextProto.closePath = closePath;
    }
  }
  render(_2) {
  }
}
class FilterElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "filter";
  }
  apply(ctx, element) {
    var {
      document: document2,
      children
    } = this;
    var boundingBox = element.getBoundingBox(ctx);
    if (!boundingBox) {
      return;
    }
    var px = 0;
    var py = 0;
    children.forEach((child) => {
      var efd = child.extraFilterDistance || 0;
      px = Math.max(px, efd);
      py = Math.max(py, efd);
    });
    var width = Math.floor(boundingBox.width);
    var height = Math.floor(boundingBox.height);
    var tmpCanvasWidth = width + 2 * px;
    var tmpCanvasHeight = height + 2 * py;
    if (tmpCanvasWidth < 1 || tmpCanvasHeight < 1) {
      return;
    }
    var x = Math.floor(boundingBox.x);
    var y2 = Math.floor(boundingBox.y);
    var ignoredStyles = this.removeStyles(element, FilterElement.ignoreStyles);
    var tmpCanvas = document2.createCanvas(tmpCanvasWidth, tmpCanvasHeight);
    var tmpCtx = tmpCanvas.getContext("2d");
    document2.screen.setDefaults(tmpCtx);
    tmpCtx.translate(-x + px, -y2 + py);
    element.render(tmpCtx);
    children.forEach((child) => {
      if (typeof child.apply === "function") {
        child.apply(tmpCtx, 0, 0, tmpCanvasWidth, tmpCanvasHeight);
      }
    });
    ctx.drawImage(tmpCanvas, 0, 0, tmpCanvasWidth, tmpCanvasHeight, x - px, y2 - py, tmpCanvasWidth, tmpCanvasHeight);
    this.restoreStyles(element, ignoredStyles);
  }
  render(_2) {
  }
}
FilterElement.ignoreStyles = ["filter", "transform", "clip-path"];
class FeDropShadowElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "feDropShadow";
    this.addStylesFromStyleDefinition();
  }
  apply(_2, _x, _y, _width, _height) {
  }
}
class FeMorphologyElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "feMorphology";
  }
  apply(_2, _x, _y, _width, _height) {
  }
}
class FeCompositeElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "feComposite";
  }
  apply(_2, _x, _y, _width, _height) {
  }
}
class FeGaussianBlurElement extends Element {
  constructor(document2, node2, captureTextNodes) {
    super(document2, node2, captureTextNodes);
    this.type = "feGaussianBlur";
    this.blurRadius = Math.floor(this.getAttribute("stdDeviation").getNumber());
    this.extraFilterDistance = this.blurRadius;
  }
  apply(ctx, x, y2, width, height) {
    var {
      document: document2,
      blurRadius
    } = this;
    var body = document2.window ? document2.window.document.body : null;
    var canvas = ctx.canvas;
    canvas.id = document2.getUniqueId();
    if (body) {
      canvas.style.display = "none";
      body.appendChild(canvas);
    }
    processCanvasRGBA(canvas, x, y2, width, height, blurRadius);
    if (body) {
      body.removeChild(canvas);
    }
  }
}
class TitleElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "title";
  }
}
class DescElement extends Element {
  constructor() {
    super(...arguments);
    this.type = "desc";
  }
}
var elements = {
  "svg": SVGElement,
  "rect": RectElement,
  "circle": CircleElement,
  "ellipse": EllipseElement,
  "line": LineElement,
  "polyline": PolylineElement,
  "polygon": PolygonElement,
  "path": PathElement,
  "pattern": PatternElement,
  "marker": MarkerElement,
  "defs": DefsElement,
  "linearGradient": LinearGradientElement,
  "radialGradient": RadialGradientElement,
  "stop": StopElement,
  "animate": AnimateElement,
  "animateColor": AnimateColorElement,
  "animateTransform": AnimateTransformElement,
  "font": FontElement,
  "font-face": FontFaceElement,
  "missing-glyph": MissingGlyphElement,
  "glyph": GlyphElement,
  "text": TextElement,
  "tspan": TSpanElement,
  "tref": TRefElement,
  "a": AElement,
  "textPath": TextPathElement,
  "image": ImageElement,
  "g": GElement,
  "symbol": SymbolElement,
  "style": StyleElement,
  "use": UseElement,
  "mask": MaskElement,
  "clipPath": ClipPathElement,
  "filter": FilterElement,
  "feDropShadow": FeDropShadowElement,
  "feMorphology": FeMorphologyElement,
  "feComposite": FeCompositeElement,
  "feColorMatrix": FeColorMatrixElement,
  "feGaussianBlur": FeGaussianBlurElement,
  "title": TitleElement,
  "desc": DescElement
};
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = arguments[i2] != null ? arguments[i2] : {};
    if (i2 % 2) {
      ownKeys$1(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function createCanvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
function createImage(_x) {
  return _createImage.apply(this, arguments);
}
function _createImage() {
  _createImage = _asyncToGenerator(function* (src) {
    var anonymousCrossOrigin = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    var image = document.createElement("img");
    if (anonymousCrossOrigin) {
      image.crossOrigin = "Anonymous";
    }
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (_event, _source, _lineno, _colno, error) => {
        reject(error);
      };
      image.src = src;
    });
  });
  return _createImage.apply(this, arguments);
}
class Document {
  constructor(canvg) {
    var {
      rootEmSize = 12,
      emSize = 12,
      createCanvas: createCanvas2 = Document.createCanvas,
      createImage: createImage2 = Document.createImage,
      anonymousCrossOrigin
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.canvg = canvg;
    this.definitions = /* @__PURE__ */ Object.create(null);
    this.styles = /* @__PURE__ */ Object.create(null);
    this.stylesSpecificity = /* @__PURE__ */ Object.create(null);
    this.images = [];
    this.fonts = [];
    this.emSizeStack = [];
    this.uniqueId = 0;
    this.screen = canvg.screen;
    this.rootEmSize = rootEmSize;
    this.emSize = emSize;
    this.createCanvas = createCanvas2;
    this.createImage = this.bindCreateImage(createImage2, anonymousCrossOrigin);
    this.screen.wait(this.isImagesLoaded.bind(this));
    this.screen.wait(this.isFontsLoaded.bind(this));
  }
  bindCreateImage(createImage2, anonymousCrossOrigin) {
    if (typeof anonymousCrossOrigin === "boolean") {
      return (source, forceAnonymousCrossOrigin) => createImage2(source, typeof forceAnonymousCrossOrigin === "boolean" ? forceAnonymousCrossOrigin : anonymousCrossOrigin);
    }
    return createImage2;
  }
  get window() {
    return this.screen.window;
  }
  get fetch() {
    return this.screen.fetch;
  }
  get ctx() {
    return this.screen.ctx;
  }
  get emSize() {
    var {
      emSizeStack
    } = this;
    return emSizeStack[emSizeStack.length - 1];
  }
  set emSize(value) {
    var {
      emSizeStack
    } = this;
    emSizeStack.push(value);
  }
  popEmSize() {
    var {
      emSizeStack
    } = this;
    emSizeStack.pop();
  }
  getUniqueId() {
    return "canvg".concat(++this.uniqueId);
  }
  isImagesLoaded() {
    return this.images.every((_2) => _2.loaded);
  }
  isFontsLoaded() {
    return this.fonts.every((_2) => _2.loaded);
  }
  createDocumentElement(document2) {
    var documentElement = this.createElement(document2.documentElement);
    documentElement.root = true;
    documentElement.addStylesFromStyleDefinition();
    this.documentElement = documentElement;
    return documentElement;
  }
  createElement(node2) {
    var elementType = node2.nodeName.replace(/^[^:]+:/, "");
    var ElementType = Document.elementTypes[elementType];
    if (typeof ElementType !== "undefined") {
      return new ElementType(this, node2);
    }
    return new UnknownElement(this, node2);
  }
  createTextNode(node2) {
    return new TextNode(this, node2);
  }
  setViewBox(config) {
    this.screen.setViewBox(_objectSpread$1({
      document: this
    }, config));
  }
}
Document.createCanvas = createCanvas;
Document.createImage = createImage;
Document.elementTypes = elements;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i2 = 1; i2 < arguments.length; i2++) {
    var source = arguments[i2] != null ? arguments[i2] : {};
    if (i2 % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
class Canvg {
  /**
   * Main constructor.
   * @param ctx - Rendering context.
   * @param svg - SVG Document.
   * @param options - Rendering options.
   */
  constructor(ctx, svg) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.parser = new Parser(options);
    this.screen = new Screen(ctx, options);
    this.options = options;
    var document2 = new Document(this, options);
    var documentElement = document2.createDocumentElement(svg);
    this.document = document2;
    this.documentElement = documentElement;
  }
  /**
   * Create Canvg instance from SVG source string or URL.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  static from(ctx, svg) {
    var _arguments = arguments;
    return _asyncToGenerator(function* () {
      var options = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : {};
      var parser = new Parser(options);
      var svgDocument = yield parser.parse(svg);
      return new Canvg(ctx, svgDocument, options);
    })();
  }
  /**
   * Create Canvg instance from SVG source string.
   * @param ctx - Rendering context.
   * @param svg - SVG source string.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  static fromString(ctx, svg) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var parser = new Parser(options);
    var svgDocument = parser.parseFromString(svg);
    return new Canvg(ctx, svgDocument, options);
  }
  /**
   * Create new Canvg instance with inherited options.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  fork(ctx, svg) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return Canvg.from(ctx, svg, _objectSpread(_objectSpread({}, this.options), options));
  }
  /**
   * Create new Canvg instance with inherited options.
   * @param ctx - Rendering context.
   * @param svg - SVG source string.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  forkString(ctx, svg) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return Canvg.fromString(ctx, svg, _objectSpread(_objectSpread({}, this.options), options));
  }
  /**
   * Document is ready promise.
   * @returns Ready promise.
   */
  ready() {
    return this.screen.ready();
  }
  /**
   * Document is ready value.
   * @returns Is ready or not.
   */
  isReady() {
    return this.screen.isReady();
  }
  /**
   * Render only first frame, ignoring animations and mouse.
   * @param options - Rendering options.
   */
  render() {
    var _arguments2 = arguments, _this = this;
    return _asyncToGenerator(function* () {
      var options = _arguments2.length > 0 && _arguments2[0] !== void 0 ? _arguments2[0] : {};
      _this.start(_objectSpread({
        enableRedraw: true,
        ignoreAnimation: true,
        ignoreMouse: true
      }, options));
      yield _this.ready();
      _this.stop();
    })();
  }
  /**
   * Start rendering.
   * @param options - Render options.
   */
  start() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var {
      documentElement,
      screen,
      options: baseOptions
    } = this;
    screen.start(documentElement, _objectSpread(_objectSpread({
      enableRedraw: true
    }, baseOptions), options));
  }
  /**
   * Stop rendering.
   */
  stop() {
    this.screen.stop();
  }
  /**
   * Resize SVG to fit in given size.
   * @param width
   * @param height
   * @param preserveAspectRatio
   */
  resize(width) {
    var height = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : width;
    var preserveAspectRatio = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    this.documentElement.resize(width, height, preserveAspectRatio);
  }
}
export {
  AElement,
  AnimateColorElement,
  AnimateElement,
  AnimateTransformElement,
  BoundingBox,
  CB1,
  CB2,
  CB3,
  CB4,
  Canvg,
  CircleElement,
  ClipPathElement,
  DefsElement,
  DescElement,
  Document,
  Element,
  EllipseElement,
  FeColorMatrixElement,
  FeCompositeElement,
  FeDropShadowElement,
  FeGaussianBlurElement,
  FeMorphologyElement,
  FilterElement,
  Font,
  FontElement,
  FontFaceElement,
  GElement,
  GlyphElement,
  GradientElement,
  ImageElement,
  LineElement,
  LinearGradientElement,
  MarkerElement,
  MaskElement,
  Matrix,
  MissingGlyphElement,
  Mouse,
  PSEUDO_ZERO,
  Parser,
  PathElement,
  PathParser,
  PatternElement,
  Point,
  PolygonElement,
  PolylineElement,
  Property,
  QB1,
  QB2,
  QB3,
  RadialGradientElement,
  RectElement,
  RenderedElement,
  Rotate,
  SVGElement,
  SVGFontLoader,
  Scale,
  Screen,
  Skew,
  SkewX,
  SkewY,
  StopElement,
  StyleElement,
  SymbolElement,
  TRefElement,
  TSpanElement,
  TextElement,
  TextPathElement,
  TitleElement,
  Transform,
  Translate,
  UnknownElement,
  UseElement,
  ViewPort,
  compressSpaces,
  Canvg as default,
  getSelectorSpecificity,
  normalizeAttributeName,
  normalizeColor,
  parseExternalUrl,
  index as presets,
  toNumbers,
  trimLeft,
  trimRight,
  vectorMagnitude,
  vectorsAngle,
  vectorsRatio
};
//# sourceMappingURL=index.es-KHPMj4sZ.js.map
