var UTIL = UTIL || {
  /**
   * @param {Object} elem
   * @param {string} el
   * @param {Function} callback
   * @param {?} bool
   * @return {undefined}
   */
  addDomEvent : function(elem, el, callback, bool) {
    /** @type {string} */
    var e = el;
    if (elem.addEventListener) {
      elem.addEventListener(e, callback, bool);
    } else {
      if (elem.attachEvent) {
        /** @type {string} */
        e = "on" + e;
        elem.attachEvent(e, function() {
          callback.call(elem, arguments[0]);
        });
      }
    }
  },
  /**
   * @param {HTMLDocument} obj
   * @param {string} evType
   * @param {?} f
   * @return {undefined}
   */
  removeDomEvent : function(obj, evType, f) {
    if (obj.removeEventListener) {
      obj.removeEventListener(evType, f);
    } else {
      if (obj.detachEvent) {
        obj.detachEvent("on" + evType, f);
      }
    }
  },
  /**
   * @param {Object} iteratee
   * @param {?} dataAndEvents
   * @return {?}
   */
  paramsToURIComps : function(iteratee, dataAndEvents) {
    /** @type {Array} */
    var headers = [];
    /** @type {string} */
    var value = "";
    var index;
    for (index in iteratee) {
      value = iteratee[index];
      if (dataAndEvents) {
        /** @type {string} */
        value = encodeURIComponent(value);
      }
      headers.push(index + "=" + value);
    }
    return "?" + headers.join("&");
  },
  /**
   * @param {Object} params
   * @return {undefined}
   */
  paramsToURIEncoding : function(params) {
    var k;
    for (k in params) {
      /** @type {string} */
      params[k] = encodeURIComponent(params[k]);
    }
  },
  /**
   * @param {?} dataAndEvents
   * @return {?}
   */
  copySobject : function(dataAndEvents) {
    var old = {};
    var name;
    for (name in config) {
      old[name] = config[name];
    }
    return old;
  },
  /**
   * @param {Event} e
   * @return {undefined}
   */
  fixedEvent : function(e) {
    if (!e) {
      e = window.event;
    }
    if (!e.target) {
      e.target = e.srcElement;
    }
    if (!e.stopPropagation) {
      /**
       * @return {undefined}
       */
      e.stopPropagation = function() {
        /** @type {boolean} */
        e.cancelBubble = true;
      };
    }
    if (!e.preventDefault) {
      /**
       * @return {?}
       */
      e.preventDefault = function() {
        return e.returnValue = false, false;
      };
    }
  },
  isIEVersion : function() {
    var value = {
      "5.5" : "5.5",
      "5.6" : "6",
      "5.7" : "7",
      "5.8" : "8",
      9 : "9",
      10 : "10",
      11 : "11"
    };
    var method = (new Function("/*@cc_on return @_jscript_version; @*/"))();
    return method ? value[method] : -1;
  }(),
  isIE : function() {
    /** @type {string} */
    var segment = navigator.userAgent.toLowerCase();
    return!(!segment.match(/rv:([\d.]+)\) like gecko/) && !segment.match(/msie ([\d.]+)/));
  }(),
  isIE9 : function() {
    return navigator && (navigator.userAgent.match(/msie/i) && navigator.appVersion.match(/MSIE 9.0/i));
  }(),
  isIE8 : function() {
    return navigator && (navigator.userAgent.match(/msie/i) && navigator.appVersion.match(/MSIE 8.0/i));
  }(),
  isIE7 : function() {
    return navigator && (navigator.userAgent.match(/msie/i) && navigator.appVersion.match(/MSIE 7.0/i));
  }(),
  isIE6 : function() {
    return navigator && (navigator.userAgent.match(/msie/i) && navigator.appVersion.match(/MSIE 6.0/i));
  }(),
  isIE11 : function() {
    return Object.hasOwnProperty.call(window, "ActiveXObject") && !window.ActiveXObject;
  }(),
  isFirefox : function() {
    return navigator && navigator.userAgent.match(/Firefox/i);
  }(),
  /**
   * @return {undefined}
   */
  emptyFunc : function() {
  },
  /**
   * @param {Function} jQuery
   * @param {?} elements
   * @param {number} timeout
   * @return {undefined}
   */
  ensureAfterDomRenderer : function(jQuery, elements, timeout) {
    if (jQuery) {
      setTimeout(function() {
        jQuery.call(elements, elements);
      }, timeout || 0);
    }
  },
  /**
   * @param {Object} obj
   * @return {?}
   */
  cloneObject : function(obj) {
    var newObj = {};
    var key;
    for (key in obj) {
      if ("object" == typeof obj[key]) {
        newObj[key] = UTIL.cloneObject(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  },
  /**
   * @param {Object} source
   * @param {Object} destination
   * @return {undefined}
   */
  copyObject : function(source, destination) {
    var property;
    for (property in source) {
      destination[property] = source[property];
    }
  },
  uuid : function() {
    /** @type {number} */
    var gid = 0;
    return function() {
      return++gid, +new Date + gid;
    };
  }(),
  /**
   * @param {Array} xs
   * @param {?} fn
   * @return {?}
   */
  filter : function(xs, fn) {
    /** @type {Array} */
    var bProperties = [];
    /** @type {number} */
    var i = 0;
    for (;i < xs.length;i++) {
      if (fn(xs[i])) {
        bProperties.push(i);
      }
    }
    return bProperties;
  },
  /**
   * @param {?} list
   * @param {string} template
   * @param {Function} fn
   * @param {Object} context
   * @return {?}
   */
  render : function(list, template, fn, context) {
    return template.replace(/\{[$a-zA-Z0-9_-]*\}/gi, function(headBuffer) {
      var i = headBuffer.substr(1, headBuffer.length - 2);
      var index = list[i] || 0 === list[i] ? list[i] : "";
      return fn && (index = fn.call(context || this, list, i, index)), index;
    });
  },
  /**
   * @param {?} value
   * @param {number} precision
   * @return {?}
   */
  roundDecimal : function(value, precision) {
    return precision = Math.pow(10, precision), Math.round(parseFloat(value) * precision) / precision;
  },
  /**
   * @param {number} dataAndEvents
   * @return {?}
   */
  formatDiskSize : function(dataAndEvents) {
    /** @type {number} */
    var udataCur = dataAndEvents;
    /** @type {Array} */
    var mags = ["B", "KB", "M", "G", "T", "P"];
    /** @type {number} */
    var i = 0;
    for (;udataCur >= 1024;) {
      udataCur /= 1024;
      i++;
    }
    return UTIL.roundDecimal(udataCur, 2) + mags[i];
  }
};
UTIL = UTIL || {};
UTIL.dom = UTIL.dom || {
  /**
   * @param {Node} node
   * @return {?}
   */
  genCurrentStyle : function(node) {
    return document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(node, null) : node && node.currentStyle ? node.currentStyle : null;
  },
  /**
   * @param {Node} root
   * @param {?} tag
   * @param {?} existingFn
   * @return {?}
   */
  filterElemByClass : function(root, tag, existingFn) {
    var values = root.getElementsByTagName(tag) || [];
    /** @type {Array} */
    var eventPath = [];
    var cur = {};
    /** @type {number} */
    var i = 0;
    var valuesLen = values.length;
    for (;i < valuesLen;i++) {
      if (cur = values[i]) {
        if (cur.className) {
          if (cur.className.indexOf(existingFn) > -1) {
            eventPath.push(cur);
          }
        }
      }
    }
    return eventPath;
  },
  /**
   * @param {Node} context
   * @param {string} tag
   * @param {string} name
   * @param {string} existingFn
   * @return {?}
   */
  filterElemByAttrVal : function(context, tag, name, existingFn) {
    var parts = context.getElementsByTagName(tag) || [];
    /** @type {Array} */
    var keysToRemove = [];
    var message = {};
    /** @type {number} */
    var i = 0;
    var len = parts.length;
    for (;i < len;i++) {
      if (message = parts[i]) {
        if (message[name] && message[name].indexOf(existingFn) > -1 || message.getAttribute && (message.getAttribute(name) && message.getAttribute(name).indexOf(existingFn) > -1)) {
          keysToRemove.push(message);
        }
      }
    }
    return keysToRemove;
  },
  /**
   * @param {Element} element
   * @param {string} name
   * @return {undefined}
   */
  addClass : function(element, name) {
    if (!UTIL.dom.hasClass(element, name)) {
      var className = element.className.replace(/^\s+|\s+$/g, "");
      className = className ? className + " " + name : name;
      element.className = className;
    }
  },
  /**
   * @param {?} domElement
   * @param {string} name
   * @return {undefined}
   */
  removeClass : function(domElement, name) {
    /** @type {RegExp} */
    var reg = new RegExp(name, "gi");
    domElement.className = domElement.className.replace(reg, "");
  },
  /**
   * @param {Element} elem
   * @param {string} name
   * @return {?}
   */
  hasClass : function(elem, name) {
    /** @type {RegExp} */
    var exp = new RegExp(name, "gi");
    var nType = elem.className;
    return exp.test(nType);
  },
  /**
   * @param {Element} el
   * @return {?}
   */
  getElemCoordinate : function(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    for (;el = el.offsetParent;) {
      top += el.offsetTop;
      left += el.offsetLeft;
    }
    return{
      width : width,
      height : height,
      top : top,
      left : left,
      bottom : top + height,
      right : left + width
    };
  },
  /**
   * @param {string} str
   * @param {number} fontsize
   * @return {?}
   */
  getDomWidthByText : function(str, fontsize) {
    /** @type {(HTMLElement|null)} */
    var div = document.getElementById("__getwidth");
    if (null == div) {
      /** @type {Element} */
      div = document.createElement("span");
      /** @type {string} */
      div.id = "__getwidth";
      document.body.appendChild(div);
      /** @type {string} */
      div.style.visibility = "hidden";
      /** @type {string} */
      div.style.whiteSpace = "nowrap";
      /** @type {string} */
      div.style.position = "absolute";
    }
    if (UTIL.isFirefox) {
      /** @type {string} */
      div.textContent = str;
    } else {
      /** @type {string} */
      div.innerText = str;
    }
    /** @type {number} */
    div.style.fontSize = fontsize;
    var targetWidth = div.offsetWidth;
    return div.innerHTML = "", targetWidth;
  },
  /**
   * @param {?} el
   * @return {?}
   */
  getScrollTop : function(el) {
    return window.pageYOffset || (document.documentElement.scrollTop || document.body.scrollTop);
  },
  /**
   * @param {?} element
   * @return {?}
   */
  getScrollLeft : function(element) {
    return window.pageXOffset || (document.documentElement.scrollLeft || document.body.scrollLeft);
  }
};
var Util = Util || {};
Util.player = Util.player || {}, Util.player = {
  /**
   * @param {string} messageFormat
   * @param {?} opt_attributes
   * @return {?}
   */
  replaceParams : function(messageFormat, opt_attributes) {
    return messageFormat.replace(/\{([A-Za-z\-\_]+)\}/g, function(dataAndEvents, timeoutKey) {
      return opt_attributes[timeoutKey];
    });
  },
  guid : function() {
    /** @type {Array} */
    var loopedValues = [];
    /**
     * @return {?}
     */
    var S4 = function() {
      return(65536 * (1 + Math.random()) | 0).toString(16).substring(1);
    };
    /**
     * @return {?}
     */
    var getName = function() {
      return(S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    };
    var name = getName();
    return{
      /**
       * @return {?}
       */
      generate : function() {
        for (;loopedValues.indexOf(name) > -1;) {
          name = getName();
        }
        return loopedValues.push(name), name;
      }
    };
  }(),
  /**
   * @param {string} classNames
   * @param {Object} type
   * @param {Object} data
   * @param {string} separator
   * @return {undefined}
   */
  makeNS : function(classNames, type, data, separator) {
    separator = separator || ".";
    type = type || {};
    data = data || window;
    var fields = (classNames || "").split(separator);
    /** @type {number} */
    var n = fields.length - 1;
    /** @type {number} */
    var i = 0;
    /** @type {string} */
    var field = "";
    for (;i < n;) {
      field = fields[i];
      data[field] = data[field] ? data[field] : {};
      data = data[field];
      i++;
    }
    /** @type {Object} */
    data[fields[n]] = type;
    /** @type {null} */
    type = null;
  },
  isMobile : function() {
    /** @type {string} */
    var ua = navigator.userAgent;
    var isMobile = {
      /**
       * @return {?}
       */
      Android : function() {
        return ua.match(/Android/i);
      },
      /**
       * @return {?}
       */
      BlackBerry : function() {
        return ua.match(/BlackBerry/i);
      },
      /**
       * @return {?}
       */
      iOS : function() {
        return ua.match(/iPhone|iPad|iPod/i);
      },
      /**
       * @return {?}
       */
      Opera : function() {
        return ua.match(/Opera Mini/i);
      },
      /**
       * @return {?}
       */
      Windows : function() {
        return ua.match(/IEMobile/i);
      },
      /**
       * @return {?}
       */
      any : function() {
        return isMobile.Android() || (isMobile.BlackBerry() || (isMobile.iOS() || (isMobile.Opera() || isMobile.Windows())));
      }
    };
    return isMobile;
  }(),
  /**
   * @param {number} t
   * @return {?}
   */
  formatTime : function(t) {
    /** @type {number} */
    var ts = 1 * t;
    /** @type {number} */
    var a = Math.floor(ts / 3600);
    /** @type {number} */
    var b = Math.floor(ts % 3600 / 60);
    /** @type {number} */
    var fromIndex = Math.floor(ts % 3600 % 60);
    return a = a < 10 ? "0" + a : a, b = b < 10 ? "0" + b : b, fromIndex = fromIndex < 10 ? "0" + fromIndex : fromIndex, a + ":" + b + ":" + fromIndex;
  },
  /**
   * @param {?} v
   * @return {?}
   */
  covertTime : function(v) {
    /** @type {Date} */
    var d = new Date(v);
    return 3600 * d.getHours() + 60 * d.getMinutes() + d.getSeconds();
  }
}, function() {
  var parent = UTIL.addDomEvent;
  var fun = UTIL.fixedEvent;
  var next = UTIL.dom.filterElemByAttrVal;
  /**
   * @return {undefined}
   */
  var go = function() {
    var testSource = this.actionMap;
    var elem = this.parent;
    /** @type {Array} */
    var k = [];
    /** @type {null} */
    var ret = null;
    var name;
    for (name in testSource) {
      if (k = name.split("."), ret = next(elem, k[0], k[1], k[2]), l = ret.length, l < 1) {
        return;
      }
      /** @type {number} */
      var i = 0;
      for (;i < l;i++) {
        ret[i].setAttribute("data-action", name);
      }
    }
  };
  /**
   * @return {undefined}
   */
  var map = function() {
    var listeners = this.actionMap;
    var failuresLink = this.actiontype;
    if (this.parent) {
      parent(this.parent, failuresLink, function(e) {
        fun(e);
        var button = e.target;
        var action = button.getAttribute("data-action");
        if (action) {
          if (listeners[action]) {
            listeners[action].call(button, button, e);
          }
        }
      });
    }
  };
  /**
   * @param {Window} options
   * @return {undefined}
   */
  var init = function(options) {
    this.parent = options.parent || null;
    this.actiontype = options.actiontype || "click";
    this.actionMap = options.actionMap || {};
    this.init();
  };
  init.prototype = {
    /**
     * @return {undefined}
     */
    init : function() {
      map.call(this);
      go.call(this);
    },
    /**
     * @return {undefined}
     */
    updateActionMap : function() {
      go.call(this);
    }
  };
  window.EventService = window.EventService || init;
}(), function() {
  var e;
  /** @type {number} */
  var PPyunfront = +new Date;
  var isIE = UTIL.isIE;
  var head = document.head ? document.head : document.getElementsByTagName("head")[0];
  /**
   * @param {Object} options
   * @return {undefined}
   */
  var loadScript = function(options) {
    var a;
    if (window.MessageBox) {
      if (!options.isHideLoading) {
        /** @type {boolean} */
        a = true;
        MessageBox.showMsg();
      }
    }
    var elems;
    /** @type {Element} */
    var script = document.createElement("script");
    var callback = options.callBack;
    /** @type {string} */
    var callbackName = "PPyunfront" + ++PPyunfront;
    /**
     * @param {?} e
     * @return {undefined}
     */
    var onload = function(e) {
      if (script.onload) {
        /** @type {null} */
        script.onload = null;
      }
      if (script.onreadystatechange) {
        /** @type {null} */
        script.onreadystatechange = null;
      }
      if (script.onerror) {
        /** @type {null} */
        script.onerror = null;
      }
      if (elems) {
        if (callback) {
          callback(elems[0]);
        }
      }
      if (!elems) {
        error();
      }
      head.removeChild(script);
      /** @type {null} */
      callback = elems = null;
      if (window.MessageBox) {
        if (a) {
          MessageBox.hideMsg();
        }
      }
    };
    /**
     * @return {?}
     */
    var error = function() {
      if (!e) {
        if (options.errorCallback) {
          return void options.errorCallback();
        }
        if (window.MessageBox) {
          if (a) {
            MessageBox.hideMsg();
          }
        }
        alert("\u93c1\u7248\u5d41\u9354\u72ba\u6d47\u6fb6\u8fab\u89e6");
      }
    };
    /** @type {string} */
    script.type = "text/javascript";
    if (isIE && (UTIL.isIEVersion <= 8 && UTIL.isIEVersion >= 5.5)) {
      /**
       * @return {undefined}
       */
      script.onreadystatechange = function() {
        if (!("loaded" != script.readyState && "complete" != script.readyState)) {
          onload();
        }
      };
    } else {
      /** @type {function (?): undefined} */
      script.onload = onload;
    }
    /**
     * @return {undefined}
     */
    window[callbackName] = function() {
      /** @type {Arguments} */
      elems = arguments;
    };
    if (!isIE || UTIL.isIEVersion >= 9) {
      /** @type {function (?): undefined} */
      script.onerror = onload;
    }
    /** @type {string} */
    script.src = options.url + "&cb=" + callbackName;
    head.appendChild(script);
  };
  window.JSONPRequest = window.JSONPRequest || loadScript;
  UTIL.addDomEvent(window, "beforeunload", function() {
    /** @type {boolean} */
    e = true;
  });
}(), function() {
  /**
   * @param {Object} a
   * @param {string} arg
   * @return {?}
   */
  function extend(a, arg) {
    var pre;
    var obj;
    var id = arg[0] ? arg[0].toUpperCase() + arg.slice(1) : "";
    /** @type {number} */
    var i = 0;
    for (;i < vendors.length;) {
      if (pre = vendors[i], (obj = pre ? pre + id : arg) in a) {
        return obj;
      }
      i++;
    }
  }
  /**
   * @param {?} obj
   * @return {?}
   */
  function log(obj) {
    return Array.prototype.slice.call(obj, 0);
  }
  var getter = (UTIL.fixedEvent, UTIL.addDomEvent);
  /** @type {function (*): number} */
  var floor = (UTIL.removeDomEvent, UTIL.ensureAfterDomRenderer, Math.round);
  /** @type {function (*): number} */
  var abs = Math.abs;
  /** @type {Array} */
  var vendors = ["", "webkit", "Moz", "MS", "ms", "o"];
  /** @type {RegExp} */
  var regExp_appleDevice = /mobile|tablet|ip(ad|hone|od)|android/i;
  /** @type {Array} */
  var events = ["touchstart", "touchmove", "touchend", "touchcancel"];
  /** @type {Array} */
  var types = ["pointerdown", "pointermove", "pointerup", "pointercancel"];
  if (!(!window.MSPointerEvent || window.PointerEvent)) {
    /** @type {Array} */
    types = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel"];
  }
  var mouseEvents = {
    touchstart : 1,
    pointerdown : 1,
    MSPointerDown : 1,
    touchmove : 2,
    pointermove : 2,
    MSPointerMove : 2,
    touchend : 3,
    pointerup : 3,
    MSPointerUp : 3,
    touchcancel : 4,
    pointercancel : 4,
    MSPointerCancel : 4
  };
  var methods = {
    userSelect : "none",
    touchSelect : "none",
    touchCallout : "none",
    contentZooming : "none",
    userDrag : "none",
    tapHighlightColor : "rgba(0,0,0,0)"
  };
  /**
   * @param {Node} element
   * @param {Object} attr
   * @return {undefined}
   */
  var fn = function(element, attr) {
    if (element.style) {
      var property;
      for (property in methods) {
        element.style[extend(element.style, property)] = methods[property];
      }
      if (attr) {
        element.style[attr.name] = attr.prop;
      }
    }
  };
  /** @type {boolean} */
  var hasTouch = "ontouchstart" in window;
  /** @type {function (?, Array, Function): undefined} */
  var jQuery = (extend(window, "PointerEvent"), hasTouch && regExp_appleDevice.test(navigator.userAgent), function(elem, tokens, isXML) {
    var nTokens = tokens.length;
    /** @type {number} */
    var camelKey = 0;
    for (;camelKey < nTokens;camelKey++) {
      !function(key) {
        var name = tokens[key];
        getter(elem, name, isXML);
      }(camelKey);
    }
  });
  /**
   * @param {?} name
   * @param {EventTarget} element
   * @param {?} elem
   * @return {undefined}
   */
  var callback = function(name, element, elem) {
    /** @type {(Event|null)} */
    var event = document.createEvent("Event");
    event.initEvent(name, true, true);
    event.passobj = elem;
    element.dispatchEvent(event);
  };
  /**
   * @param {Array} t
   * @return {?}
   */
  var f = function(t) {
    var w = t.length;
    if (1 === w) {
      return{
        x : floor(t[0].clientX),
        y : floor(t[0].clientY)
      };
    }
    /** @type {number} */
    var x = 0;
    /** @type {number} */
    var y = 0;
    /** @type {number} */
    var i = 0;
    for (;i < w;) {
      x += t[i].clientX;
      y += t[i].clientY;
      i++;
    }
    return{
      x : floor(x / w),
      y : floor(y / w)
    };
  };
  /**
   * @param {number} b
   * @param {number} n
   * @param {number} a
   * @return {?}
   */
  var lerp = function(b, n, a) {
    return{
      x : n / b || 0,
      y : a / b || 0
    };
  };
  /**
   * @param {number} z0
   * @param {number} z1
   * @return {?}
   */
  var processChild = function(z0, z1) {
    return Math.sqrt(z0 * z0 + z1 * z1);
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  var onTouchStart = function(event) {
    this.target;
    return[log(event.touches ? event.touches : {
      clientX : event.clientX,
      clientY : event.clientY
    }), log(event.changedTouches ? event.changedTouches : {
      clientX : event.clientX,
      clientY : event.clientY
    })];
  };
  /**
   * @return {?}
   */
  var stop = function() {
    return+new Date;
  };
  /**
   * @param {Event} event
   * @param {?} last
   * @return {?}
   */
  var process = function(event, last) {
    var type = event.type;
    type = mouseEvents[type];
    var src = onTouchStart(event);
    if (1 === type && (this.timestap = stop(), this.session || (this.session = {}), this.session.center = f(src[0]), animate.call(this, function() {
      /** @type {number} */
      this.deltaTime = stop() - this.timestap;
      this.center = f(src[0]);
      /** @type {number} */
      this.deltaX = this.center.x ? this.center.x - this.session.center.x : 0;
      /** @type {number} */
      this.deltaY = this.center.y ? this.center.y - this.session.center.y : 0;
      if (this.deltaTime > 300) {
        if (processChild(this.deltaX, this.deltaY) < 10) {
          callback.call(this, "press", this.elem, {});
        }
      }
    }, this, 300)), 2 === type) {
      return clearTimeout(this.time), this.center = f(src[1]), void callback.call(this, "slider", this.elem, {
        x : this.center.x,
        y : this.center.y
      });
    }
    if (3 === type || 4 === type) {
      if (clearTimeout(this.time), this.deltaTime = stop() - this.timestap, this.center = f(src[1]), this.deltaX = this.center.x ? this.center.x - this.session.center.x : 0, this.deltaY = this.center.y ? this.center.y - this.session.center.y : 0, this.velocity = lerp(this.deltaTime, this.deltaX, this.deltaY), this.session.center = this.center, (abs(this.velocity.x) > 0.3 || abs(this.velocity.y) > 0.3) && processChild(this.deltaX, this.deltaY) > 10) {
        return void callback.call(this, "swipe", this.elem, {
          deltaX : this.deltaX,
          deltaY : this.deltaY
        });
      }
      if (this.deltaTime <= 250) {
        if (processChild(this.deltaX, this.deltaY) < 10) {
          callback.call(this, "tap", this.elem, {});
        }
      }
    }
  };
  /**
   * @param {Function} prop
   * @param {?} node
   * @param {number} duration
   * @return {undefined}
   */
  var animate = function(prop, node, duration) {
    /** @type {number} */
    this.time = setTimeout(function() {
      prop.call(node);
    }, duration || 0);
  };
  /**
   * @return {undefined}
   */
  var _init = function() {
    var ret = this;
    jQuery(this.elem, events.concat(types), function(data) {
      process.call(ret, data, function() {
      });
      if (data.stopPropagation) {
        data.stopPropagation();
      }
    });
  };
  /**
   * @param {Node} elem
   * @param {Object} n
   * @return {undefined}
   */
  var _ = function(elem, n) {
    /** @type {Node} */
    this.elem = elem;
    fn(elem, n);
    _init.call(this);
  };
  _.prototype = {
    /**
     * @param {?} selector
     * @param {Array} opt_attributes
     * @param {Function} fn
     * @return {?}
     */
    addEvent : function(selector, opt_attributes, fn) {
      var elems = this;
      var $ = window.$ || (window.Zepto || void 0);
      if ($ && ($.fn && "tap" in $.fn)) {
        var string = opt_attributes[0];
        return void("slider" === string ? jQuery(selector, opt_attributes, function(Class) {
          fn.call(elems, Class);
        }) : $(selector).bind(string, function(Class) {
          fn.call(elems, Class);
        }));
      }
      jQuery(selector, opt_attributes, function(Class) {
        fn.call(elems, Class);
      });
    },
    /**
     * @param {?} model
     * @param {?} busytime
     * @param {?} deleteAll
     * @return {undefined}
     */
    deleteEvent : function(model, busytime, deleteAll) {
    },
    /**
     * @return {undefined}
     */
    onTap : function() {
    }
  };
  window.Figuer = window.Figuer || _;
}(), function() {
  var mergeOptions = Util.player.makeNS;
  var self = {};
  self.video = {};
  /** @type {string} */
  self.video.NO_PARANT_ID = "\u93c3\u72b3\u6331\u93c0\u60e7\u6ad2\u7039\u7470\u6ad2ID";
  self.videoEvt = {};
  /** @type {string} */
  self.videoEvt.EVENT_INIT_FAILED = "\u9352\u6fc6\ue750\u9356\u6827\u3051\u7490\ufffd";
  /** @type {string} */
  self.videoEvt.VIDEO_OBJECT_NOT_FOUND = "\u7f02\u54c4\u76af\u93be\ue15f\u6581\u9363\u3125\ue1ee\u749e\ufffd";
  /** @type {string} */
  self.videoEvt.UNKOWN_ERROR = "Unkown";
  /** @type {string} */
  self.videoEvt.MEDIA_ERR_ABORTED = "Resource Aborted";
  /** @type {string} */
  self.videoEvt.MEDIA_ERR_NETWORK = "Network Error";
  /** @type {string} */
  self.videoEvt.MEDIA_ERR_DECODE = "Video can not decode";
  /** @type {string} */
  self.videoEvt.MEDIA_ERR_SRC_NOT_SUPPORTED = "Do not support video";
  self.control = {};
  /** @type {string} */
  self.control.PLAY_BUTTON = "\u93be\ue15f\u6581";
  /** @type {string} */
  self.control.PLAYER_NOT_FOUND = "\u7f02\u54c4\u76af\u93be\ue15f\u6581\u7035\u7845\u8584";
  self.sys = {};
  /** @type {string} */
  self.sys.NOT_SUPPORT_WINDOWS_PLATFORM = "\u9429\ue1bc\u58a0\u7459\u55db\ue576\u93cd\u714e\u7d21\u951b\u5c7c\u7b09\u93c0\ue21b\u5bd4windows\u9a9e\u51b2\u5f74";
  /** @type {string} */
  self.sys.ADD = "\u6fa7\u70b2\u59de";
  /** @type {string} */
  self.sys.SUCCESS = "\u93b4\u612c\u59db";
  /** @type {string} */
  self.sys.TRIGGER = "\u7459\ufe40\u5f42";
  mergeOptions("CONST.MESSEAGE.VIDEO", self.video);
  mergeOptions("CONST.MESSEAGE.VIDEOEVT", self.videoEvt);
  mergeOptions("CONST.MESSEAGE.CONTROL", self.control);
  mergeOptions("CONST.MESSEAGE.SYS", self.sys);
}(), function() {
  /** @type {number} */
  var lastTime = 0;
  /** @type {Array} */
  var vendors = ["webkit", "moz"];
  /** @type {number} */
  var x = 0;
  for (;x < vendors.length && !window.requestAnimationFrame;++x) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    /**
     * @param {function (number): ?} callback
     * @return {number}
     */
    window.requestAnimationFrame = function(callback) {
      /** @type {number} */
      var currTime = (new Date).getTime();
      /** @type {number} */
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      /** @type {number} */
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      return lastTime = currTime + timeToCall, id;
    };
  }
  if (!window.cancelAnimationFrame) {
    /**
     * @param {number} id
     * @return {?}
     */
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}(), function(dataAndEvents, done) {
  if ("function" == typeof define && define.amd) {
    define(["exports"], function(err) {
      done(dataAndEvents.TinyAnimate = err);
    });
  } else {
    done("object" == typeof exports ? exports : dataAndEvents.TinyAnimate = {});
  }
}(this, function(self) {
  /**
   * @param {number} id
   * @param {number} value
   * @param {number} delay
   * @param {Function} callback
   * @param {Function} fn
   * @param {Function} cb
   * @return {undefined}
   */
  self.animate = function(id, value, delay, callback, fn, cb) {
    /**
     * @param {number} domEl
     * @return {undefined}
     */
    function loop(domEl) {
      /** @type {number} */
      var time = (domEl || +new Date) - startTime;
      callback(fn(time, id, match, delay));
      if (time >= delay) {
        callback(value);
        cb();
      } else {
        requestAnimationFrame(loop);
      }
    }
    if ("number" == typeof id && ("number" == typeof value && ("number" == typeof delay && "function" == typeof callback))) {
      if ("string" == typeof fn) {
        if ($[fn]) {
          fn = $[fn];
        }
      }
      if ("function" != typeof fn) {
        /** @type {function (number, number, number, number): ?} */
        fn = $.linear;
      }
      if ("function" != typeof cb) {
        /**
         * @return {undefined}
         */
        cb = function() {
        };
      }
      /** @type {function (function (number): ?, (Element|null)=): number} */
      var requestAnimationFrame = window.requestAnimationFrame || function(loop) {
        window.setTimeout(loop, 1E3 / 60);
      };
      /** @type {number} */
      var match = value - id;
      callback(id);
      /** @type {number} */
      var startTime = window.performance && window.performance.now ? window.performance.now() : +new Date;
      requestAnimationFrame(loop);
    }
  };
  /**
   * @param {Element} settings
   * @param {string} prop
   * @param {string} px
   * @param {number} key
   * @param {number} value
   * @param {number} delay
   * @param {?} callback
   * @param {Function} done
   * @return {undefined}
   */
  self.animateCSS = function(settings, prop, px, key, value, delay, callback, done) {
    /**
     * @param {string} val
     * @return {undefined}
     */
    var cb = function(val) {
      settings.style[prop] = val + px;
    };
    self.animate(key, value, delay, cb, callback, done);
  };
  var $ = self.easings = {};
  /**
   * @param {number} d
   * @param {number} n
   * @param {number} x
   * @param {number} c
   * @return {?}
   */
  $.linear = function(d, n, x, c) {
    return x * d / c + n;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInQuad = function(t, b, c, d) {
    return c * (t /= d) * t + b;
  };
  /**
   * @param {number} time
   * @param {number} b
   * @param {?} diff
   * @param {number} dur
   * @return {?}
   */
  $.easeOutQuad = function(time, b, diff, dur) {
    return-diff * (time /= dur) * (time - 2) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutQuad = function(t, b, c, d) {
    return(t /= d / 2) < 1 ? c / 2 * t * t + b : -c / 2 * (--t * (t - 2) - 1) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInCubic = function(t, b, c, d) {
    return c * (t /= d) * t * t + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutCubic = function(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  };
  /**
   * @param {number} time
   * @param {number} beg
   * @param {number} diff
   * @param {number} dur
   * @return {?}
   */
  $.easeInOutCubic = function(time, beg, diff, dur) {
    return(time /= dur / 2) < 1 ? diff / 2 * time * time * time + beg : diff / 2 * ((time -= 2) * time * time + 2) + beg;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInQuart = function(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {?} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutQuart = function(t, b, c, d) {
    return-c * ((t = t / d - 1) * t * t * t - 1) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutQuart = function(t, b, c, d) {
    return(t /= d / 2) < 1 ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  };
  /**
   * @param {number} time
   * @param {number} beg
   * @param {number} diff
   * @param {number} dur
   * @return {?}
   */
  $.easeInQuint = function(time, beg, diff, dur) {
    return diff * (time /= dur) * time * time * time * time + beg;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutQuint = function(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutQuint = function(t, b, c, d) {
    return(t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  };
  /**
   * @param {number} t
   * @param {?} c
   * @param {number} b
   * @param {number} d
   * @return {?}
   */
  $.easeInSine = function(t, c, b, d) {
    return-b * Math.cos(t / d * (Math.PI / 2)) + b + c;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutSine = function(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {?} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutSine = function(t, b, c, d) {
    return-c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInExpo = function(t, b, c, d) {
    return 0 == t ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutExpo = function(t, b, c, d) {
    return t == d ? b + c : c * (1 - Math.pow(2, -10 * t / d)) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutExpo = function(t, b, c, d) {
    return 0 == t ? b : t == d ? b + c : (t /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (t - 1)) + b : c / 2 * (2 - Math.pow(2, -10 * --t)) + b;
  };
  /**
   * @param {number} t
   * @param {number} pos
   * @param {?} b
   * @param {number} d
   * @return {?}
   */
  $.easeInCirc = function(t, pos, b, d) {
    return-b * (Math.sqrt(1 - (t /= d) * t) - 1) + pos;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutCirc = function(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} x
   * @param {number} d
   * @return {?}
   */
  $.easeInOutCirc = function(t, b, x, d) {
    return(t /= d / 2) < 1 ? -x / 2 * (Math.sqrt(1 - t * t) - 1) + b : x / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInElastic = function(t, b, c, d) {
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == t) {
      return b;
    }
    if (1 == (t /= d)) {
      return b + c;
    }
    if (p || (p = 0.3 * d), a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      var s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return-a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutElastic = function(t, b, c, d) {
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == t) {
      return b;
    }
    if (1 == (t /= d)) {
      return b + c;
    }
    if (p || (p = 0.3 * d), a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      var s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutElastic = function(t, b, c, d) {
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var a = c;
    if (0 == t) {
      return b;
    }
    if (2 == (t /= d / 2)) {
      return b + c;
    }
    if (p || (p = d * (0.3 * 1.5)), a < Math.abs(c)) {
      /** @type {number} */
      a = c;
      /** @type {number} */
      var s = p / 4;
    } else {
      /** @type {number} */
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return t < 1 ? a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * -0.5 + b : a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} s
   * @return {?}
   */
  $.easeInBack = function(t, b, c, d, s) {
    return void 0 == s && (s = 1.70158), c * (t /= d) * t * ((s + 1) * t - s) + b;
  };
  /**
   * @param {number} t
   * @param {number} n
   * @param {number} s
   * @param {number} d
   * @param {number} b
   * @return {?}
   */
  $.easeOutBack = function(t, n, s, d, b) {
    return void 0 == b && (b = 1.70158), s * ((t = t / d - 1) * t * ((b + 1) * t + b) + 1) + n;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} d
   * @param {number} x
   * @param {number} s
   * @return {?}
   */
  $.easeInOutBack = function(t, b, d, x, s) {
    return void 0 == s && (s = 1.70158), (t /= x / 2) < 1 ? d / 2 * (t * t * ((1 + (s *= 1.525)) * t - s)) + b : d / 2 * ((t -= 2) * t * ((1 + (s *= 1.525)) * t + s) + 2) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInBounce = function(t, b, c, d) {
    return c - $.easeOutBounce(d - t, 0, c, d) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeOutBounce = function(t, b, c, d) {
    return(t /= d) < 1 / 2.75 ? c * (7.5625 * t * t) + b : t < 2 / 2.75 ? c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b : t < 2.5 / 2.75 ? c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b : c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  };
  /**
   * @param {number} t
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @return {?}
   */
  $.easeInOutBounce = function(t, b, c, d) {
    return t < d / 2 ? 0.5 * $.easeInBounce(2 * t, 0, c, d) + b : 0.5 * $.easeOutBounce(2 * t - d, 0, c, d) + 0.5 * c + b;
  };
}), function() {
  (0, Util.player.makeNS)("H5player.UI.boxTmpl", {
    tpl : '<div id="{id}" class="{cls}"></div>'
  });
}(), function() {
  (0, Util.player.makeNS)("H5player.UI.btnTmpl", {
    tpl : '<span id="{id}" class="{cls}">{name}</span>'
  });
}(), function() {
  (0, Util.player.makeNS)("H5player.UI.processBarTpml", {
    tpl : '<div id="{id}" class="progress"><div id="indicator-{id}" class="indicator"></div><span id="slider-{id}" class="slider"></span></div>'
  });
}(), function() {
  (0, Util.player.makeNS)("H5player.UI.videoTML", {
    tpl : '<video id="{videoId}" style="display: none;" poster="{poster}" class="{cls}" width="{width}" height="{height}" preload="auto" playsinline="true" webkit-playsinline="true" x-webkit-airplay="allow">\u93ae\u3127\u6b91\u5a34\u5fda\ue74d\u9363\u3124\u7b09\u93c0\ue21b\u5bd4HTML5\u951b\u5c7e\u68e4\u5a09\u66e1\ue747\u942a\u5b2b\u579c\u6d60\ue101\u5f41\u6e1a\u6d9a\u6b91\u7459\u55db\ue576\u951b\u4f78\u7f13\u7481\ue1bb\u5a07\u9422\u3129\u73ee\u9417\u581f\u6e70\u5a34\u5fda\ue74d\u9363\u3128\ue747\u942a\ufffd,\u748b\u3223\u963f\u951b\u4e84tracks}</video>'
  });
}(), function() {
  (0, Util.player.makeNS)("H5player.UI.loaderSvgTmpl", {
    tpl : {
      ball : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="stroke: #45a8f2;fill: #45a8f2;"><g><circle cx="16" cy="32" stroke-width="0" r="3"><animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3" repeatCount="indefinite"></animate></circle><circle cx="32" cy="32" stroke-width="0" r="3.94342"><animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4" repeatCount="indefinite"></animate></circle><circle cx="48" cy="32" stroke-width="0" r="4.94342"><animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5" repeatCount="indefinite"></animate></circle></g></svg>',
      circle : '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style="stroke: #45a8f2; fill: #45a8f2;"><g><defs><linearGradient id="sGD" gradientUnits="userSpaceOnUse" x1="55" y1="46" x2="2" y2="46"><stop offset="0.1" style="stop-color: #fff;stop-opacity: 0;"></stop><stop offset="1" style="stop-color: #45a8f2;stop-opacity: 1;"></stop></linearGradient></defs><g stroke-width="4" stroke-linecap="round" fill="none" transform="rotate(249.084 32 32)"><path stroke="url(#sGD)" d="M4,32 c0,15,12,28,28,28c8,0,16-4,21-9"></path><path d="M60,32 C60,16,47.464,4,32,4S4,16,4,32"></path><animateTransform values="0,32,32;360,32,32" attributeName="transform" type="rotate" repeatCount="indefinite" dur="750ms"></animateTransform></g></g></svg>'
    }
  });
}(), function(recurring, dataAndEvents, definition) {
  if ("undefined" != typeof module && module.exports) {
    module.exports = definition();
  } else {
    if ("function" == typeof define && define.amd) {
      define(definition);
    } else {
      dataAndEvents.Fingerprint = definition();
    }
  }
}(0, this, function() {
  /**
   * @param {Object} options
   * @return {undefined}
   */
  var Fingerprint = function(options) {
    var nativeForEach;
    var nativeMap;
    /** @type {function (this:(Array.<T>|string|{length: number}), (function (this:S, T, number, Array.<T>): ?|null), S=): ?} */
    nativeForEach = Array.prototype.forEach;
    /** @type {function (this:(Array.<T>|string|{length: number}), (function (this:S, T, number, Array.<T>): R|null), S=): Array.<R>} */
    nativeMap = Array.prototype.map;
    /**
     * @param {Object} obj
     * @param {Function} iterator
     * @param {?} context
     * @return {undefined}
     */
    this.each = function(obj, iterator, context) {
      if (null !== obj) {
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else {
          if (obj.length === +obj.length) {
            /** @type {number} */
            var i = 0;
            var l = obj.length;
            for (;i < l;i++) {
              if (iterator.call(context, obj[i], i, obj) === {}) {
                return;
              }
            }
          } else {
            var key;
            for (key in obj) {
              if (obj.hasOwnProperty(key) && iterator.call(context, obj[key], key, obj) === {}) {
                return;
              }
            }
          }
        }
      }
    };
    /**
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Function} context
     * @return {?}
     */
    this.map = function(obj, iterator, context) {
      /** @type {Array} */
      var results = [];
      return null == obj ? results : nativeMap && obj.map === nativeMap ? obj.map(iterator, context) : (this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      }), results);
    };
    if ("object" == typeof options) {
      this.hasher = options.hasher;
      this.screen_resolution = options.screen_resolution;
      this.screen_orientation = options.screen_orientation;
      this.canvas = options.canvas;
      this.ie_activex = options.ie_activex;
    } else {
      if ("function" == typeof options) {
        /** @type {Object} */
        this.hasher = options;
      }
    }
  };
  return Fingerprint.prototype = {
    /**
     * @return {?}
     */
    get : function() {
      /** @type {Array} */
      var keys = [];
      if (keys.push(navigator.userAgent), keys.push(navigator.language), keys.push(screen.colorDepth), this.screen_resolution) {
        var acc = this.getScreenResolution();
        if (void 0 !== acc) {
          keys.push(acc.join("x"));
        }
      }
      return keys.push((new Date).getTimezoneOffset()), keys.push(this.hasSessionStorage()), keys.push(this.hasLocalStorage()), keys.push(!!window.indexedDB), document.body ? keys.push(typeof document.body.addBehavior) : keys.push("undefined"), keys.push(typeof window.openDatabase), keys.push(navigator.cpuClass), keys.push(navigator.platform), keys.push(navigator.doNotTrack), keys.push(this.getPluginsString()), this.canvas && (this.isCanvasSupported() && keys.push(this.getCanvasFingerprint())), this.hasher ? 
      this.hasher(keys.join("###"), 31) : this.murmurhash3_32_gc(keys.join("###"), 31);
    },
    /**
     * @param {string} key
     * @param {number} seed
     * @return {?}
     */
    murmurhash3_32_gc : function(key, seed) {
      var remainder;
      var bytes;
      var h1;
      var a;
      var c2;
      var c1;
      var k1;
      var i;
      /** @type {number} */
      remainder = 3 & key.length;
      /** @type {number} */
      bytes = key.length - remainder;
      /** @type {number} */
      h1 = seed;
      /** @type {number} */
      c2 = 3432918353;
      /** @type {number} */
      c1 = 461845907;
      /** @type {number} */
      i = 0;
      for (;i < bytes;) {
        /** @type {number} */
        k1 = 255 & key.charCodeAt(i) | (255 & key.charCodeAt(++i)) << 8 | (255 & key.charCodeAt(++i)) << 16 | (255 & key.charCodeAt(++i)) << 24;
        ++i;
        /** @type {number} */
        k1 = (65535 & k1) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
        /** @type {number} */
        k1 = k1 << 15 | k1 >>> 17;
        /** @type {number} */
        k1 = (65535 & k1) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
        h1 ^= k1;
        /** @type {number} */
        h1 = h1 << 13 | h1 >>> 19;
        /** @type {number} */
        a = 5 * (65535 & h1) + ((5 * (h1 >>> 16) & 65535) << 16) & 4294967295;
        /** @type {number} */
        h1 = 27492 + (65535 & a) + ((58964 + (a >>> 16) & 65535) << 16);
      }
      switch(k1 = 0, remainder) {
        case 3:
          k1 ^= (255 & key.charCodeAt(i + 2)) << 16;
        case 2:
          k1 ^= (255 & key.charCodeAt(i + 1)) << 8;
        case 1:
          k1 ^= 255 & key.charCodeAt(i);
          /** @type {number} */
          k1 = (65535 & k1) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
          /** @type {number} */
          k1 = k1 << 15 | k1 >>> 17;
          /** @type {number} */
          k1 = (65535 & k1) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
          h1 ^= k1;
      }
      return h1 ^= key.length, h1 ^= h1 >>> 16, h1 = 2246822507 * (65535 & h1) + ((2246822507 * (h1 >>> 16) & 65535) << 16) & 4294967295, h1 ^= h1 >>> 13, h1 = 3266489909 * (65535 & h1) + ((3266489909 * (h1 >>> 16) & 65535) << 16) & 4294967295, (h1 ^= h1 >>> 16) >>> 0;
    },
    /**
     * @return {?}
     */
    hasLocalStorage : function() {
      try {
        return!!window.localStorage;
      } catch (e) {
        return true;
      }
    },
    /**
     * @return {?}
     */
    hasSessionStorage : function() {
      try {
        return!!window.sessionStorage;
      } catch (e) {
        return true;
      }
    },
    /**
     * @return {?}
     */
    isCanvasSupported : function() {
      /** @type {Element} */
      var test_canvas = document.createElement("canvas");
      return!(!test_canvas.getContext || !test_canvas.getContext("2d"));
    },
    /**
     * @return {?}
     */
    isIE : function() {
      return "Microsoft Internet Explorer" === navigator.appName || !("Netscape" !== navigator.appName || !/Trident/.test(navigator.userAgent));
    },
    /**
     * @return {?}
     */
    getPluginsString : function() {
      return this.isIE() && this.ie_activex ? this.getIEPluginsString() : this.getRegularPluginsString();
    },
    /**
     * @return {?}
     */
    getRegularPluginsString : function() {
      return this.map(navigator.plugins, function(map) {
        var querystring = this.map(map, function(tree) {
          return[tree.type, tree.suffixes].join("~");
        }).join(",");
        return[map.name, map.description, querystring].join("::");
      }, this).join(";");
    },
    /**
     * @return {?}
     */
    getIEPluginsString : function() {
      if (window.ActiveXObject) {
        /** @type {Array} */
        var names = ["ShockwaveFlash.ShockwaveFlash", "AcroPDF.PDF", "PDF.PdfCtrl", "QuickTime.QuickTime", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "RealPlayer", "SWCtl.SWCtl", "WMPlayer.OCX", "AgControl.AgControl", "Skype.Detection"];
        return this.map(names, function(id) {
          try {
            return new ActiveXObject(id), id;
          } catch (e) {
            return null;
          }
        }).join(";");
      }
      return "";
    },
    /**
     * @return {?}
     */
    getScreenResolution : function() {
      return this.screen_orientation ? screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height] : [screen.height, screen.width];
    },
    /**
     * @return {?}
     */
    getCanvasFingerprint : function() {
      /** @type {Element} */
      var oCanvas = document.createElement("canvas");
      var ctx = oCanvas.getContext("2d");
      /** @type {string} */
      var columnTitle = "http://valve.github.io";
      return ctx.textBaseline = "top", ctx.font = "14px 'Arial'", ctx.textBaseline = "alphabetic", ctx.fillStyle = "#f60", ctx.fillRect(125, 1, 62, 20), ctx.fillStyle = "#069", ctx.fillText(columnTitle, 2, 15), ctx.fillStyle = "rgba(102, 204, 0, 0.7)", ctx.fillText(columnTitle, 4, 17), oCanvas.toDataURL();
    }
  }, Fingerprint;
}), function() {
  /** @type {(Navigator|null)} */
  var nav = navigator;
  /** @type {string} */
  var ua = nav.userAgent;
  /**
   * @return {?}
   */
  var parse = function() {
    /** @type {Array} */
    var p = [/Android/i, /BlackBerry/i, /iPhone|iPad|iPod/i, /Opera Mini/i, /IEMobile/i, /Java/i, /Nokia/i, /J2ME/i];
    /** @type {Array} */
    var allEls = ["Android", "BlackBerry", "IOS", "Opera Mini", "IEMobile", "Java", "Nokia", "J2ME"];
    /** @type {string} */
    var el = "Other";
    /** @type {number} */
    var j = 0;
    /** @type {number} */
    var pl = p.length;
    for (;j < pl;j++) {
      if (ua.match(p[j])) {
        el = allEls[j];
        break;
      }
    }
    return el;
  };
  /**
   * @param {string} failing_message
   * @return {undefined}
   */
  var report = function(failing_message) {
    ua = failing_message || nav.userAgent;
  };
  /**
   * @return {?}
   */
  var detect = function() {
    /** @type {string} */
    var browser = "Other";
    /** @type {string} */
    var version = "Unknown";
    /** @type {null} */
    var match = null;
    if (/MicroMessenger/i.test(ua)) {
      match = ua.match(/MicroMessenger\/[\d.]*/);
      version = match[0] ? match[0].split("/")[1] : "";
      /** @type {string} */
      browser = "MicroMessenger";
    } else {
      if (/QQ/.test(ua)) {
        match = ua.match(/QQ\/[\d.]*/);
        /** @type {string} */
        browser = "QQ";
        if (/QQBrowser/.test(ua)) {
          match = ua.match(/QQBrowser\/[\d.]*/);
          /** @type {string} */
          browser = "QQBrowser";
        }
        if (/MQQBrowser/.test(ua)) {
          match = ua.match(/MQQBrowser\/[\d.]*/);
          /** @type {string} */
          browser = "MQQBrowser";
        }
        version = match[0] ? match[0].split("/")[1] : "";
      } else {
        if (/Opera/.test(ua)) {
          if (match = ua.match(/UCBrowser\/?[\d.]*/i), match || (match = ua.match(/UCWEB\/?[\d.]+/i)), match) {
            if (match[0]) {
              var arr = match[0].split("/");
              /** @type {string} */
              browser = "UC";
              version = arr[1];
            }
          } else {
            match = ua.match(/Opera\/[\d.]*/);
            version = match[0] ? match[0].split("/")[1] : "";
            /** @type {string} */
            browser = "Opera";
          }
        } else {
          if (/UCWEB/i.test(ua)) {
            /** @type {string} */
            var head = "UCWEB";
            if (browser = "UC", ua.length > 20) {
              if (match = ua.match(/UCWEB\/?[\d.]+/i), match || (head = "UCBrowser", match = ua.match(/UCBrowser\/?[\d.]*/i)), match || (head = "UC Browser", match = ua.match(/UC Browser\/?[\d.]*/i)), match || (head = "brew", match = ua.match(/brew\/?[\d.]*/i)), match || (head = "UCWEB ", match = ua.match(/UCWEB\s\/?[\d.]*/i)), match[0]) {
                arr = match[0].split("/");
                version = arr.length > 1 ? arr[1] : match[0].substr(head.length, match[0].length - head.length);
              }
            } else {
              if ((match = ua.match(/UCWEB\/?[\d.]+/i)) && match[0]) {
                arr = match[0].split("/");
                version = arr.length > 1 ? arr[1] : match[0].substr(head.length, match[0].length - head.length);
              }
            }
          } else {
            if (/BIDUBrowser/i.test(ua)) {
              match = ua.match(/BIDUBrowser\/[\d.]*/);
              version = match[0] ? match[0].split("/")[1] : "";
              /** @type {string} */
              browser = "BIDUBrowser";
            } else {
              if (/Firefox/i.test(ua)) {
                match = ua.match(/Firefox\/[\d.]*/);
                version = match[0] ? match[0].split("/")[1] : "";
                /** @type {string} */
                browser = "Firefox";
              } else {
                if (/Chrome/.test(ua) && /Google Inc/.test(nav.vendor)) {
                  match = ua.match(/Chrome\/[\d.]*/);
                  version = match[0] ? match[0].split("/")[1] : "";
                  /** @type {string} */
                  browser = "Chrome";
                } else {
                  if (/Safari/.test(ua)) {
                    if (/Apple Computer/.test(nav.vendor)) {
                      match = ua.match(/Version\/[\d.]*/);
                      version = match[0] ? match[0].split("/")[1] : "";
                      /** @type {string} */
                      browser = "Safari";
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return{
      name : browser,
      version : version
    };
  };
  /**
   * @return {?}
   */
  var compile = function() {
    /** @type {string} */
    var errorName = "Other";
    /** @type {string} */
    var CORDOVA_JS_BUILD_LABEL = "Unkown";
    /** @type {Array} */
    var p = [/[a-zA-Z]*Webkit\/[\d.]*/i, /Gecko\/[\d.]*/, /Trident\/[\d.]*/, /Edge\/[\d.]*/, /Presto\/[\d.]*/, /Blink\/[\d.]*/, /KHIML\/[\d.]*/];
    /** @type {null} */
    var baseName = null;
    /** @type {number} */
    var j = 0;
    /** @type {number} */
    var pl = p.length;
    for (;j < pl;j++) {
      if ((baseName = ua.match(p[j])) && baseName[0]) {
        baseName = baseName[0];
        baseName = baseName.split("/");
        errorName = baseName[0];
        CORDOVA_JS_BUILD_LABEL = baseName[1];
        break;
      }
    }
    return{
      name : errorName,
      version : CORDOVA_JS_BUILD_LABEL
    };
  };
  var p = parse();
  var bowser = detect();
  var element = compile();
  window.deviceInfo = window.deviceInfo || {
    ua : ua,
    platform : p,
    browser : bowser,
    core : element,
    /** @type {function (string): undefined} */
    setUA : report,
    /**
     * @return {undefined}
     */
    reLoad : function() {
      deviceInfo.platform = parse();
      deviceInfo.browser = detect();
      deviceInfo.core = compile();
    }
  };
}(), function() {
  var options = {};
  /** @type {boolean} */
  var t = false;
  /** @type {boolean} */
  var n = false;
  var isIE9 = UTIL.isIE9;
  var data = (window.alert, new Fingerprint);
  /** @type {boolean} */
  var error = false;
  data = data.get();
  /https/i.test("" + window.location);
  /**
   * @return {?}
   */
  var xhr = function() {
    /** @type {XMLHttpRequest} */
    var req = new XMLHttpRequest;
    return isIE9 && (XDomainRequest && (req = new XDomainRequest)), req;
  };
  /**
   * @param {Object} options
   * @return {undefined}
   */
  var ajax = function(options) {
    /** @type {Array} */
    var tagNameArr = [];
    var query = options.params || {};
    var str = options.body || "";
    var part;
    for (part in query) {
      tagNameArr.push(part + "=" + query[part]);
    }
    var self = xhr();
    /**
     * @return {undefined}
     */
    self.onload = function() {
      if (options.callBack) {
        options.callBack.call(self);
      }
    };
    /**
     * @return {undefined}
     */
    self.onError = function() {
    };
    self.open("post", options.url + "?" + tagNameArr.join("&"));
    self.send(str);
  };
  /**
   * @param {string} number
   * @return {?}
   */
  var readString = function(number) {
    /** @type {string} */
    var alphabet = "Hy7Gi*cQPMd19XbgRsMno0dz4^sb#sQ0Unx$s!a158ScTuxPk8n6BksTcB$sc^aP";
    var n = number.length;
    /** @type {number} */
    var length = alphabet.length;
    /** @type {string} */
    var testString = "";
    /** @type {number} */
    var i = 0;
    for (;i < n;i++) {
      testString += String.fromCharCode(number.charAt(i).charCodeAt(0) + alphabet.charAt(i % length).charCodeAt(0));
    }
    if (!/([^\u0000-\u00ff])/.test(testString)) {
      var cur;
      var tmp;
      var chunk;
      /** @type {string} */
      var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      /** @type {number} */
      i = 0;
      /** @type {Array} */
      var tagNameArr = [];
      for (;i < testString.length;) {
        switch(cur = testString.charCodeAt(i), chunk = (i + 1) % 3) {
          case 1:
            tagNameArr.push(digits.charAt(cur >> 2));
            break;
          case 2:
            tagNameArr.push(digits.charAt((3 & tmp) << 4 | cur >> 4));
            break;
          case 0:
            tagNameArr.push(digits.charAt((15 & tmp) << 2 | cur >> 6));
            tagNameArr.push(digits.charAt(63 & cur));
        }
        /** @type {number} */
        tmp = cur;
        i++;
      }
      return 1 == chunk ? (tagNameArr.push(digits.charAt((3 & tmp) << 4)), tagNameArr.push("==")) : 2 == chunk && (tagNameArr.push(digits.charAt((15 & tmp) << 2)), tagNameArr.push("=")), tagNameArr.join("");
    }
  };
  /**
   * @param {Object} d
   * @return {?}
   */
  var end = function(d) {
    if (d.c) {
      if (d.ut || (d.ut = data), options.lists || (options.lists = []), t) {
        return options.tempLists || (options.tempLists = []), void options.tempLists.push(d);
      }
      options.lists.push(d);
    }
  };
  /**
   * @param {Object} object
   * @return {?}
   */
  var getEnumerableProperties = function(object) {
    if (object.c) {
      if (object.ut || (object.ut = data), options.errorLists || (options.errorLists = []), n) {
        return options.tempErrorLists || (options.tempErrorLists = []), void options.tempErrorLists.push(object);
      }
      options.errorLists.push(object);
    }
  };
  /**
   * @return {undefined}
   */
  var init = function() {
    if (!t) {
      /** @type {boolean} */
      t = true;
      /** @type {string} */
      var message = "";
      if (options.lists) {
        if (options.lists.length) {
          message = readString(JSON.stringify(options.lists));
        }
      }
      /** @type {Array} */
      options.lists = [];
      /** @type {Array} */
      options.lists = options.lists.concat(options.tempLists);
      /** @type {Array} */
      options.tempLists = [];
      /** @type {boolean} */
      t = false;
      if (message) {
        ajax({
          url : "http://ppyun.data.pplive.com/1.html",
          body : message,
          /**
           * @return {undefined}
           */
          callBack : function() {
          }
        });
      }
    }
  };
  /**
   * @return {undefined}
   */
  var remove = function() {
    if (!n) {
      /** @type {boolean} */
      n = true;
      /** @type {string} */
      var message = "";
      if (options.errorLists) {
        if (options.errorLists.length) {
          message = readString(JSON.stringify(options.errorLists));
        }
      }
      /** @type {Array} */
      options.errorLists = [];
      /** @type {Array} */
      options.errorLists = options.errorLists.concat(options.tempErrorLists);
      /** @type {Array} */
      options.tempErrorLists = [];
      /** @type {boolean} */
      n = false;
      if (message) {
        ajax({
          url : "http://ppyun.data.pplive.com/1.html",
          body : message,
          /**
           * @return {undefined}
           */
          callBack : function() {
          }
        });
      }
    }
  };
  window.PPPlayerLog = window.PPPlayerLog ? window.PPPlayerLog : {
    /** @type {function (Object): ?} */
    addLog : end,
    /** @type {function (Object): ?} */
    addErrorLog : getEnumerableProperties,
    /** @type {function (): undefined} */
    sendVideoLog : init,
    /** @type {function (): undefined} */
    sendErrorVideoLog : remove,
    vvid : data,
    /**
     * @return {?}
     */
    getList : function() {
      return options.lists;
    },
    /**
     * @param {boolean} err
     * @return {undefined}
     */
    setIsErrorLog : function(err) {
      /** @type {boolean} */
      error = err;
    }
  };
}(), function() {
  /**
   * @param {string} s
   * @return {?}
   */
  var cb = function(s) {
    return document.getElementById(s);
  };
  var as = Util.player.makeNS;
  var guid = Util.player.guid;
  var $ = Util.player.replaceParams;
  var trigger = (window.EventService, UTIL.dom.addClass);
  var fireEvent = UTIL.dom.removeClass;
  var addRender = UTIL.dom.hasClass;
  var data = (UTIL.addDomEvent, CONST.MESSEAGE.CONTROL);
  var opts = window.H5player.UI.btnTmpl;
  var config = window.H5player.UI.boxTmpl;
  var me = window.H5player.UI.processBarTpml;
  var col = window.H5player.UI.loaderSvgTmpl;
  /**
   * @return {undefined}
   */
  var end = function() {
    var e = guid.generate();
    var style = $(opts.tpl, {
      id : e,
      cls : "btn play",
      name : ""
    });
    var d = guid.generate();
    var html = $(config.tpl, {
      id : d,
      cls : "timeBox"
    });
    var id = guid.generate();
    var results = $(opts.tpl, {
      id : id,
      cls : "btn fscreen",
      name : ""
    });
    var url = guid.generate();
    var content = $(me.tpl, {
      id : url
    });
    var pageId = guid.generate();
    var node = $(col.tpl.circle, {
      id : pageId
    });
    var self = this;
    /** @type {DocumentFragment} */
    var fragment = document.createDocumentFragment();
    /** @type {Element} */
    var elem = document.createElement("div");
    /** @type {string} */
    elem.className = "procBar-wrap";
    elem.innerHTML = content;
    fragment.appendChild(elem);
    /** @type {null} */
    elem = null;
    /** @type {Element} */
    var container = document.createElement("div");
    /** @type {string} */
    container.className = "mediaComps";
    /** @type {Element} */
    var clone = document.createElement("div");
    /** @type {string} */
    clone.className = "btn-wrap";
    clone.innerHTML = style;
    container.appendChild(clone);
    /** @type {null} */
    clone = null;
    /** @type {Element} */
    var wrap = document.createElement("div");
    /** @type {string} */
    wrap.className = "time-wrap";
    wrap.innerHTML = html;
    container.appendChild(wrap);
    /** @type {null} */
    wrap = null;
    /** @type {Element} */
    var div = document.createElement("div");
    /** @type {string} */
    div.className = "fscreen-wrap";
    div.innerHTML = results;
    container.appendChild(div);
    /** @type {null} */
    div = null;
    fragment.appendChild(container);
    /** @type {null} */
    container = null;
    this.controlBox.appendChild(fragment);
    /** @type {null} */
    fragment = null;
    /** @type {Element} */
    var el = document.createElement("div");
    /** @type {string} */
    el.className = "loader-wrap";
    el.innerHTML = node;
    /** @type {string} */
    el.style.display = "none";
    this.theTarget.pnode.appendChild(el);
    /** @type {Element} */
    this.loader = el;
    /** @type {null} */
    el = null;
    /** @type {Element} */
    var div2 = document.createElement("div");
    /** @type {string} */
    div2.className = "loader-wrap play";
    this.theTarget.pnode.appendChild(div2);
    /** @type {Element} */
    this.bigBtn = div2;
    /** @type {null} */
    div2 = null;
    setTimeout(function() {
      self.playBtn = cb(e);
      self.timeBox = cb(d);
      self.fscreenBtn = cb(id);
      self.processBar = cb(url);
      self.processBarIndicator = cb("indicator-" + url);
      self.processBarSlider = cb("slider-" + url);
      if (self.theTarget) {
        self.theTarget.updateTimeBar();
      }
      start.call(self);
    }, 0);
  };
  /**
   * @return {undefined}
   */
  var play = function() {
    if (addRender(this.playBtn, "play")) {
      trigger(this.playBtn, "pause");
      fireEvent(this.playBtn, "play");
      this.showLoader();
      this.hideBigBtn();
      if (this.theTarget) {
        this.theTarget.play();
      }
    } else {
      trigger(this.playBtn, "play");
      fireEvent(this.playBtn, "pause");
      this.hideLoader();
      this.showBigBtn();
      if (this.theTarget) {
        this.theTarget.pause();
      }
    }
  };
  /**
   * @param {string} src
   * @return {undefined}
   */
  var run = function(src) {
    this.theTarget.video.src = src || this.theTarget.src;
    this.theTarget.video.pause();
    this.theTarget.video.load();
    this.theTarget.play();
  };
  /**
   * @param {Object} args
   * @param {number} num
   * @return {?}
   */
  var load = function(args, num) {
    args = args || [];
    num = num || 0;
    args = args[0];
    /** @type {string} */
    var result = "";
    /** @type {null} */
    var query = null;
    /** @type {Array} */
    var tagNameArr = [];
    if (args) {
      /** @type {string} */
      result = "http://" + args.host;
      result += "/" + args.channelType;
      result += "/" + args.fileNo;
      result += "/" + (1 * args.delay + 5 * parseInt(num / 5));
      result += "/" + args.ridName;
      query = args.httpParam;
      var part;
      for (part in query) {
        tagNameArr.push(part + "=" + query[part]);
      }
      result += "?" + tagNameArr.join("&");
    }
    return result;
  };
  /**
   * @param {Object} success
   * @param {number} text
   * @return {undefined}
   */
  var callback = function(success, text) {
    var obj = load(success, text);
    run.call(this, obj);
  };
  /**
   * @param {number} points
   * @return {undefined}
   */
  var render = function(points) {
    var that = this;
    if (!this.tempLiveTimeDelta) {
      this.tempLiveTimeDelta = this.theTarget.liveTimeDelta;
      this.delta = this.tempLiveTimeDelta > 36E5 ? 36E5 : this.tempLiveTimeDelta;
    }
    var p1x = this.theTarget.circleRadius;
    var p2x = this.theTarget.processBarWidth;
    /** @type {number} */
    var b = p2x - p1x;
    /** @type {number} */
    var a = points;
    if (a <= 0) {
      /** @type {number} */
      a = 0;
    } else {
      if (a >= b) {
        /** @type {number} */
        a = b;
      }
    }
    /** @type {number} */
    var count = a / b;
    if (2 === this.theTarget.playVideoType) {
      /** @type {number} */
      this.livingDelta = parseInt(this.delta * count);
      if (this.clearCallBackPlayTime) {
        clearTimeout(this.clearCallBackPlayTime);
      }
      /** @type {number} */
      this.clearCallBackPlayTime = setTimeout(function() {
        callback.call(that, that.theTarget.live, parseInt((that.delta - that.livingDelta) / 1E3));
      }, 300);
    } else {
      try {
        /** @type {number} */
        this.theTarget.video.currentTime = parseInt(count * this.theTarget.duration);
      } catch (e) {
      }
    }
    this.theTarget.updateTimeBar(count);
  };
  /**
   * @return {undefined}
   */
  var start = function() {
    var self = this;
    (new Figuer(self.theTarget.video)).addEvent(this.theTarget.video, ["tap"], function(dataAndEvents) {
      play.call(self);
    });
    (new Figuer(self.bigBtn)).addEvent(self.bigBtn, ["tap"], function(dataAndEvents) {
      play.call(self);
    });
    (new Figuer(self.playBtn)).addEvent(self.playBtn, ["tap"], function(dataAndEvents) {
      play.call(self);
    });
    var $ = new Figuer(self.fscreenBtn);
    $.addEvent(self.fscreenBtn, ["tap"], function(dataAndEvents) {
      if (self.theTarget) {
        if (self.theTarget.fullScreen) {
          self.theTarget.fullScreen();
        }
      }
    });
    $ = new Figuer(self.processBar);
    $.addEvent(self.processBar, ["slider"], function(ng2DViewPort) {
      render.call(self, ng2DViewPort.passobj.x);
    });
  };
  /**
   * @param {?} controller
   * @return {?}
   */
  var init = function(controller) {
    if (this.theTarget = controller.theTarget || null, !this.theTarget) {
      return void alert(data.PLAYER_NOT_FOUND);
    }
    /** @type {Element} */
    this.controlBox = document.createElement("div");
    /** @type {string} */
    this.controlBox.className = "control-bar";
    /** @type {string} */
    this.controlBox.style.cssText = "position: absolute;bottom: 0;width: 100%;background: rgba(34, 34, 34, 1);padding: 0;box-sizing: border-box;";
    end.call(this);
  };
  init.prototype = {
    /**
     * @return {undefined}
     */
    showLoader : function() {
      if (this.loader) {
        /** @type {string} */
        this.loader.style.display = "block";
      }
    },
    /**
     * @return {undefined}
     */
    hideLoader : function() {
      if (this.loader) {
        /** @type {string} */
        this.loader.style.display = "none";
      }
    },
    /**
     * @return {undefined}
     */
    hideBigBtn : function() {
      if (this.bigBtn) {
        /** @type {string} */
        this.bigBtn.style.display = "none";
      }
    },
    /**
     * @return {undefined}
     */
    showBigBtn : function() {
      if (this.bigBtn) {
        /** @type {string} */
        this.bigBtn.style.display = "block";
      }
    },
    /**
     * @return {undefined}
     */
    pv : function() {
      play.call(this);
    }
  };
  as("H5player.Control", init);
}(), function() {
  var error = window.CONST.MESSEAGE.VIDEOEVT;
  var state = window.CONST.MESSEAGE.SYS;
  var shim = Util.player.makeNS;
  /**
   * @param {?} controller
   * @return {?}
   */
  var create = function(controller) {
    if (this.theTarget = controller.theTarget || null, !this.theTarget) {
      return fn({
        type : "error",
        msg : error.VIDEO_OBJECT_NOT_FOUND
      }), null;
    }
  };
  /**
   * @param {Event} event
   * @return {?}
   */
  var onError = function(event) {
    var _MediaError = event.target.error ? event.target.error : {
      code : -1
    };
    var ret = {
      type : "unkown",
      msg : error.UNKOWN_ERROR
    };
    switch(_MediaError.code) {
      case _MediaError.MEDIA_ERR_ABORTED:
        ret = {
          type : "MEDIA_ERR_ABORTED",
          msg : error.MEDIA_ERR_ABORTED
        };
        break;
      case _MediaError.MEDIA_ERR_NETWORK:
        ret = {
          type : "MEDIA_ERR_NETWORK",
          msg : error.MEDIA_ERR_NETWORK
        };
        break;
      case _MediaError.MEDIA_ERR_DECODE:
        ret = {
          type : "MEDIA_ERR_DECODE",
          msg : error.MEDIA_ERR_DECODE
        };
        break;
      case _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        ret = {
          type : "MEDIA_ERR_SRC_NOT_SUPPORTED",
          msg : error.MEDIA_ERR_SRC_NOT_SUPPORTED
        };
    }
    return ret;
  };
  /**
   * @param {?} button
   * @return {undefined}
   */
  var fn = function(button) {
    if (this.theTarget) {
      if (this.theTarget.reportVideoEvent) {
        this.theTarget.reportVideoEvent.call(this.theTarget, button);
      }
    }
  };
  create.prototype = {
    /**
     * @param {string} eventType
     * @param {Function} callback
     * @return {?}
     */
    on : function(eventType, callback) {
      var self = this;
      var item = this.theTarget;
      if (!item) {
        return void alert(eventType + error.EVENT_INIT_FAILED);
      }
      item = item.video ? item.video : null;
      if (item.addEventListener) {
        item.addEventListener(eventType, function(event) {
          var data = {
            type : eventType,
            msg : state.TRIGGER + eventType + state.SUCCESS,
            readyState : self.theTarget.video ? self.theTarget.video.readyState : -1
          };
          if ("error" == eventType && (data = onError(event)), callback.call(self, event, data, self.theTarget), self.theTarget.isDebug && self.reportVideoEvent(data), self.theTarget && self.theTarget.origEvents) {
            var inName = eventType.replace(/(^|\s+)\w/g, function(letter) {
              return letter.toUpperCase();
            });
            /** @type {string} */
            inName = "on" + (inName || "");
            var p = self.theTarget.origEvents[inName];
            if (p) {
              p.call(self.theTarget, data);
            }
          }
        }, false);
      }
    },
    /**
     * @param {Object} e
     * @return {undefined}
     */
    reportVideoEvent : function(e) {
      e = e || {
        type : "unkown",
        msg : error.UNKOWN_ERROR
      };
      fn.call(this, e);
    }
  };
  shim("H5player.VideoEvt", create);
}(), function() {
  /**
   * @param {?} id
   * @return {?}
   */
  var getElementById = function(id) {
    return document.getElementById(id);
  };
  /** @type {function (): number} */
  var nativeRandom = Math.random;
  var data = window.CONST.MESSEAGE.VIDEO;
  var $ = Util.player.replaceParams;
  var guid = Util.player.guid;
  var createShape = Util.player.makeNS;
  var callback = Util.player.formatTime;
  var orig_err_func = (Util.player.covertTime, UTIL.dom.addClass);
  var h = UTIL.dom.removeClass;
  var self = window.H5player.UI.videoTML;
  var Dialog = window.H5player.VideoEvt;
  var parent = PPPlayerLog;
  /**
   * @param {(Document|string)} path
   * @return {undefined}
   */
  var update = function(path) {
    this.video.src = path || this.src;
    this.video.load();
    this.play();
  };
  /**
   * @param {?} date
   * @return {?}
   */
  var toInvariantTime = function(date) {
    /** @type {Date} */
    var d = new Date;
    d.setTime(date);
    /** @type {number} */
    var i = d.getHours();
    /** @type {number} */
    var k = d.getMinutes();
    /** @type {number} */
    var second = d.getSeconds();
    return i = i > 9 ? i : "0" + i, k = k > 9 ? k : "0" + k, second = second > 9 ? second : "0" + second, i + ":" + k + ":" + second;
  };
  /**
   * @param {Array} a
   * @return {?}
   */
  var resolve = function(a) {
    /** @type {Array} */
    var assigns = [];
    /** @type {null} */
    var item = null;
    /** @type {string} */
    var vvar = "";
    /** @type {number} */
    var i = 0;
    var aLength = a.length;
    for (;i < aLength;i++) {
      item = a[i];
      /** @type {string} */
      vvar = '<track kind="subtitles" src="' + item.src + '" srclang="' + item.lang + '" label="' + item.label + '" ';
      if (item.isDefault) {
        this.subTitleLanguage = item.lang;
      }
      vvar += ">";
      assigns.push(vvar);
    }
    return assigns.join(" ");
  };
  /**
   * @param {?} task
   * @return {undefined}
   */
  var build = function(task) {
    var control = this.control;
    if (control) {
      /** @type {number} */
      var charCodeToReplace = parseInt(control.controlBox.clientHeight);
      /** @type {number} */
      var camelKey = 0;
      /** @type {number} */
      var udataCur = -charCodeToReplace;
      if (task) {
        /** @type {number} */
        camelKey = -charCodeToReplace;
        /** @type {number} */
        udataCur = 0;
      }
      !function() {
        TinyAnimate.animateCSS(control.controlBox, "bottom", "px", camelKey, udataCur, 750, "easeInOutQuad", function() {
        });
      }();
    }
  };
  /**
   * @param {Object} args
   * @param {number} start
   * @return {?}
   */
  var load = function(args, start) {
    args = args || [];
    start = start || 0;
    args = args[0];
    /** @type {string} */
    var result = "";
    /** @type {null} */
    var query = null;
    /** @type {Array} */
    var tagNameArr = [];
    if (args) {
      /** @type {string} */
      result = "http://" + args.host;
      result += "/" + args.channelType;
      result += "/" + args.fileNo;
      result += "/" + (1 * args.delay + 5 * parseInt(start / 5));
      result += "/" + args.ridName;
      query = args.httpParam;
      var part;
      for (part in query) {
        tagNameArr.push(part + "=" + query[part]);
      }
      result += "?" + tagNameArr.join("&");
    }
    return result;
  };
  /**
   * @param {?} vec0
   * @return {undefined}
   */
  var add = function(vec0) {
    var data = this;
    if (data.liveTime || (data.liveTime = 0), data.control) {
      if (!data.processBarWidth) {
        if (data.control) {
          if (data.control.processBar) {
            /** @type {number} */
            data.processBarWidth = parseInt(data.control.processBar.clientWidth);
          }
        }
      }
      if (!data.circleRadius) {
        if (data.control) {
          if (data.control.processBarSlider) {
            /** @type {number} */
            data.circleRadius = parseInt(data.control.processBarSlider.clientWidth);
          }
        }
      }
      var doc = data.control;
      /** @type {number} */
      var pos = 0;
      /** @type {string} */
      var html = "";
      /** @type {number} */
      var number = 0;
      if (2 === data.playVideoType) {
        /** @type {number} */
        pos = 1;
        if (data.control.livingDelta) {
          /** @type {number} */
          pos = data.control.livingDelta / data.control.delta;
          /** @type {number} */
          data.livingTime = data.tmpLivingTime + data.control.livingDelta - data.control.delta;
          console.log("livingDelta: " + data.control.livingDelta + ", delta: " + data.control.delta + ", livingTime: " + data.livingTime);
        }
        if (pos >= 1) {
          /** @type {number} */
          pos = 1;
        } else {
          if (pos <= 0) {
            /** @type {number} */
            pos = 0;
          }
        }
        html = toInvariantTime(data.livingTime);
      } else {
        data.duration = data.duration ? data.duration : data.video && data.video.duration ? data.video.duration : 0;
        /** @type {number} */
        pos = data.duration ? data.currentTime / data.duration : 0;
        data.currentTime = data.video ? data.video.currentTime : 0;
        html += callback(data.currentTime);
        html += "/";
        html += callback(data.duration);
      }
      /** @type {string} */
      doc.processBarIndicator.style.width = parseInt(100 * pos) + "%";
      /** @type {number} */
      number = pos * data.processBarWidth - data.circleRadius;
      /** @type {number} */
      number = number < 0 ? 0 : number;
      /** @type {string} */
      doc.processBarSlider.style.left = parseInt(number) + "px";
      /** @type {string} */
      doc.timeBox.innerHTML = html;
    }
  };
  /**
   * @return {undefined}
   */
  var error = function() {
    var self = this;
    var vid = new Dialog({
      theTarget : self
    });
    /** @type {number} */
    var data = 0;
    /** @type {number} */
    var freq = 0;
    /** @type {number} */
    var V = 0;
    /** @type {boolean} */
    var o = (navigator.userAgent, false);
    var r = {
      ut : "" + parent.vvid,
      lt : 1,
      os : "",
      v : "h5_player_v5",
      p : 4,
      c : "" + self.clientId,
      md : "",
      et : "",
      du : 0,
      vid : self.channelId,
      pt : self.playVideoType,
      net : 1,
      prt : 2,
      dt : 0,
      fld : -1,
      b : {
        u : deviceInfo.ua,
        v : deviceInfo.browser.version,
        n : deviceInfo.browser.name,
        k : {
          n : deviceInfo.core.name,
          v : deviceInfo.core.version
        },
        p : deviceInfo.platform
      }
    };
    /**
     * @return {undefined}
     */
    var get = function() {
      /** @type {*} */
      var d = JSON.parse(JSON.stringify(r));
      /** @type {number} */
      d.lt = 2;
      /** @type {number} */
      d.et = +new Date;
      /** @type {number} */
      d.fld = 0;
      if (1 == r.pt) {
        /** @type {number} */
        d.skp = parseInt(1E3 * (self.video.currentTime ? self.video.currentTime : 0));
      }
      /** @type {number} */
      d.skd = 20 + parseInt(80 * nativeRandom());
      parent.addLog(d);
      parent.sendVideoLog.call(self);
    };
    /**
     * @param {Object} evt
     * @return {undefined}
     */
    var emit = function(evt) {
      /** @type {*} */
      var m = JSON.parse(JSON.stringify(r));
      /** @type {number} */
      m.lt = 3;
      /** @type {number} */
      m.et = +new Date;
      m.ec = evt.type;
      m.ca = evt.msg;
      /** @type {number} */
      m.fld = 0;
      parent.addErrorLog(m);
      parent.sendErrorVideoLog.call(self);
    };
    /**
     * @return {undefined}
     */
    var update = function() {
      /** @type {*} */
      var d = JSON.parse(JSON.stringify(r));
      /** @type {number} */
      d.lt = 1;
      d.et = V;
      /** @type {number} */
      d.fld = 0;
      if (1 == self.playVideoType) {
        /** @type {number} */
        d.du = parseInt(1E3 * (self.video.currentTime ? self.video.currentTime : 0));
      } else {
        if (2 == self.playVideoType) {
          d.du = data;
        }
      }
      parent.addLog(d);
    };
    /**
     * @return {undefined}
     */
    var callback = function() {
      /** @type {*} */
      var d = JSON.parse(JSON.stringify(r));
      /** @type {number} */
      d.lt = 1;
      d.et = freq;
      /** @type {number} */
      d.fld = +new Date - freq;
      parent.addLog(d);
    };
    if (vid.on("durationchange", function(dataAndEvents) {
      self.duration = self.video.duration || 0;
      self.currentTime = self.video.currentTime;
      if (2 === self.playVideoType) {
        /** @type {number} */
        self.duration = 0;
        /** @type {number} */
        self.currentTime = 0;
      }
    }), vid.on("timeupdate", function(dataAndEvents) {
      if (o || (o = true, callback.call(self), parent.sendVideoLog.call(self)), self.video && (self.video.setAttribute && self.video.setAttribute("poster", "")), self.control) {
        self.control.hideLoader();
      }
      self.updateTimeBar();
      if (!self.livingCT) {
        /** @type {number} */
        self.livingCT = 0;
      }
      /** @type {number} */
      self.livingNT = +new Date;
      /** @type {number} */
      var d = self.livingNT - (self.livingCT ? self.livingCT : self.livingNT);
      /** @type {number} */
      self.livingCT = self.livingNT;
      self.livingTime += d;
      data += d;
    }), vid.on("pause", function(dataAndEvents) {
      if (self.control) {
        self.control;
        build.call(self, true);
        if (self.control.playBtn) {
          orig_err_func(self.control.playBtn, "play");
          h(self.control.playBtn, "pause");
        }
      }
      update.call(self);
      parent.sendVideoLog.call(self);
    }), vid.on("playing", function(dataAndEvents) {
      if (self.control) {
        var control = self.control;
        control.hideLoader();
        control.hideBigBtn();
        build.call(self);
      }
    }), vid.on("seeking", function(dataAndEvents) {
      if (self.control) {
        self.control.showLoader();
      }
    }), vid.on("waiting", function(dataAndEvents) {
      if (self.control) {
        self.control.showLoader();
      }
    }), vid.on("error", function(mapper, request) {
      if (self.control) {
        self.control.hideLoader();
      }
      emit(request);
      if (self.errorCall) {
        self.errorCall.call(self, mapper, request);
      }
    }), vid.on("ended", function(dataAndEvents) {
      parent.setIsErrorLog(false);
      self.updateTimeBar();
    }), vid.on("loadstart", function(dataAndEvents) {
      /** @type {number} */
      V = +new Date;
    }), vid.on("loadeddata", function(dataAndEvents) {
    }), vid.on("loadedmetadata", function(dataAndEvents) {
      /** @type {number} */
      freq = +new Date;
    }), vid.on("canplay", function(dataAndEvents) {
    }), vid.on("abort", function(dataAndEvents) {
    }), vid.on("progress", function(dataAndEvents) {
    }), vid.on("stalled", function(dataAndEvents) {
      get.call(this);
    }), vid.on("suspend", function(dataAndEvents) {
    }), vid.on("seeked", function(dataAndEvents) {
    }), vid.on("ratechange", function(dataAndEvents) {
    }), vid.on("volumechange", function(dataAndEvents) {
    }), vid.on("canplaythrough", function(dataAndEvents) {
    }), vid.on("emptied", function(dataAndEvents) {
    }), vid.on("play", function(dataAndEvents) {
    }), self.subTitles) {
      var video = self.video;
      if (!video) {
        return;
      }
      var codeSegments = video.textTracks;
      if (!codeSegments) {
        return;
      }
      /** @type {null} */
      var rs = null;
      /** @type {number} */
      var ti = 0;
      var nTokens = codeSegments.length;
      for (;ti < nTokens;ti++) {
        !function(i) {
          rs = codeSegments[i];
          /** @type {string} */
          rs.mode = "hidden";
          /**
           * @param {?} dataAndEvents
           * @return {undefined}
           */
          rs.oncuechange = function(dataAndEvents) {
            var line = this.activeCues[0];
            if (line) {
              if (this.language == self.subTitleLanguage) {
                if (self.callLineBack) {
                  self.callLineBack.call(self, +new Date, line.text);
                }
              }
            }
          };
        }(ti);
      }
    }
  };
  /**
   * @param {?} opt_attributes
   * @return {undefined}
   */
  var setup = function(opt_attributes) {
    var _this = this;
    var html = (this.config, $(self.tpl, this));
    /** @type {Element} */
    var container = document.createElement("div");
    container.innerHTML = html;
    setTimeout(function() {
      _this.video = container.querySelector("video");
      _this.pnode.appendChild(_this.video);
      /** @type {boolean} */
      _this.video.controls = false;
      error.call(_this);
      /** @type {null} */
      container = null;
    }, 0);
  };
  /**
   * @return {undefined}
   */
  var init = function() {
    /** @type {Element} */
    var img = document.createElement("img");
    img.src = this.poster;
    /** @type {boolean} */
    img.isErrorOnce = false;
    /**
     * @return {undefined}
     */
    img.onerror = function() {
      if (img.isErrorOnce) {
        if (!img) {
          return;
        }
        /** @type {null} */
        img.onload = null;
        /** @type {null} */
        img.onerror = null;
        /** @type {null} */
        img = null;
      } else {
        /** @type {boolean} */
        img.isErrorOnce = true;
        /** @type {string} */
        img.src = "http://sr2.pplive.cn/cms/18/69/0e7eaa9f7468090ff2fef1ae58742131.png";
      }
    };
    /**
     * @return {undefined}
     */
    img.onload = function() {
      if (img) {
        /** @type {null} */
        img.onload = null;
        /** @type {null} */
        img.onerror = null;
        /** @type {null} */
        img = null;
      }
    };
    this.pnode.appendChild(img);
    this.posterImg = img;
    /** @type {string} */
    img.style.width = "100%";
  };
  /**
   * @return {undefined}
   */
  var _forEach = function() {
    init.call(this);
    setup.call(this);
  };
  /**
   * @param {Object} options
   * @return {?}
   */
  var render = function(options) {
    options = options || {};
    if (!options.id) {
      return void alert(data.NO_PARANT_ID);
    }
    /** @type {number} */
    self.processBarWidth = 0;
    /** @type {number} */
    self.circleRadius = 0;
    /** @type {null} */
    this.control = null;
    /** @type {boolean} */
    this.isVideoRerender = false;
    this.pnode = getElementById(options.id);
    /** @type {null} */
    this.video = null;
    this.poster = options.poster || "";
    this.width = options.width || "100%";
    this.height = options.height || "100%";
    this.cls = options.cls || "ppcloud-player";
    this.events = options.events || {};
    this.origEvents = options.origEvents || {};
    this.reportVideoEvent = options.reportVideoEvent || null;
    this.videoId = options.videoId || guid.generate();
    this.playVideoType = options.playVideoType || 1;
    this.errorCall = options.errorCall || null;
    this.isDebug = options.isDebug || false;
    this.subTitles = options.subTitles || null;
    this.callLineBack = options.callLineBack || null;
    /** @type {string} */
    this.subTitleLanguage = "";
    this.webid = options.webid || "";
    this.channelId = options.channelId || "";
    this.liveStartTime = options.liveStartTime;
    this.livingTime = options.livingTime;
    this.tmpLivingTime = options.livingTime;
    /** @type {number} */
    this.liveTimeDelta = parseInt(this.livingTime - this.liveStartTime);
    this.clientId = options.c || "";
    this.live = options.live || [];
    this.src = options.src || "";
    if (this.src) {
      this.src = this.src;
    }
    if (1 == options.cdnType) {
      if (2 == this.playVideoType) {
        this.src = load(this.live);
      }
    }
    /** @type {string} */
    this.tracks = "";
    if (this.subTitles) {
      this.tracks = resolve.call(this, this.subTitles);
    }
    /** @type {number} */
    this.duration = 0;
    /** @type {number} */
    this.currentTime = 0;
    /** @type {boolean} */
    this.isFirstPlay = true;
    _forEach.call(this);
  };
  render.prototype = {
    /**
     * @return {undefined}
     */
    play : function() {
      if (this.isFirstPlay) {
        /** @type {string} */
        this.video.style.display = "block";
        /** @type {string} */
        this.posterImg.style.display = "none";
        /** @type {boolean} */
        this.isFirstPlay = false;
        this.video.pause();
        this.video.src = this.src;
        this.video.load();
        this.video.play();
      }
      this.video.play();
      if (this.events) {
        if (this.events.onPlay) {
          this.events.onPlay();
        }
      }
    },
    /**
     * @return {undefined}
     */
    pause : function() {
      this.video.pause();
      if (this.events) {
        if (this.events.onPause) {
          this.events.onPause();
        }
      }
    },
    /**
     * @return {undefined}
     */
    replay : function() {
      /** @type {number} */
      this.video.currentTime = 0;
      update.call(this);
    },
    /**
     * @return {undefined}
     */
    end : function() {
      update.call(this, "");
    },
    /**
     * @param {Object} control
     * @return {undefined}
     */
    setControl : function(control) {
      this.control = control || null;
    },
    /**
     * @param {string} dataAndEvents
     * @return {undefined}
     */
    changeSubtitle : function(dataAndEvents) {
      if (this.subTitleLanguage != dataAndEvents) {
        /** @type {string} */
        this.subTitleLanguage = dataAndEvents;
      }
    },
    /**
     * @param {number} args
     * @return {undefined}
     */
    updateTimeBar : function(args) {
      if (this.control) {
        add.call(this, args);
      }
    },
    /**
     * @param {number} deepDataAndEvents
     * @return {undefined}
     */
    setPlayBackRate : function(deepDataAndEvents) {
      if (this.video) {
        if (deepDataAndEvents in this.video) {
          if (deepDataAndEvents >= 2) {
            /** @type {number} */
            deepDataAndEvents = 2;
          }
          if (deepDataAndEvents <= 0.5) {
            /** @type {number} */
            deepDataAndEvents = 0.5;
          }
          /** @type {number} */
          this.video.playbackRate = deepDataAndEvents;
        }
      }
    },
    /**
     * @return {undefined}
     */
    fullScreen : function() {
      var element = this.video;
      if (element) {
        if (element.requestFullScreen) {
          element.requestFullScreen();
        } else {
          if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else {
            if (element.webkitEnterFullscreen) {
              element.webkitEnterFullscreen();
            } else {
              if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
              } else {
                alert("Your browsers doesn't support fullscreen");
              }
            }
          }
        }
      }
    }
  };
  createShape("H5player.Video", render);
}(), function() {
  var data = window.CONST.MESSEAGE.SYS;
  var Grid = window.H5player.Video;
  var Promise = window.H5player.Control;
  var assertThrows = (UTIL.addDomEvent, Util.player.makeNS);
  var isMobile = Util.player.isMobile;
  /**
   * @return {undefined}
   */
  var ostring = function() {
    this.video;
  };
  /**
   * @return {undefined}
   */
  var init = function() {
    var it = this;
    var config = this.config;
    var grid = new Grid({
      id : config.id,
      src : config.playSrc,
      poster : config.poster ? config.poster : "",
      width : "100%",
      height : "100%",
      reportVideoEvent : config.reportVideoEvent || function(packet) {
        console.log("\u6d5c\u5b29\u6b22\u7eeb\u8bf2\u7037: " + packet.type + " , \u5a11\u581f\u4f05\u6d93\ufffd: " + packet.msg);
      },
      errorCall : config.errorCall || null,
      isDebug : config.isDebug || null,
      playVideoType : config.videoType || 1,
      events : config.events || {},
      origEvents : config.origEvents || {},
      isCustomedUI : config.isCustomedUI || false,
      callLineBack : config.callLineBack || null,
      subTitles : config.subTitles,
      liveStartTime : config.liveStartTime || 0,
      livingTime : config.livingTime || 0,
      live : config.live || 0,
      webid : config.webid,
      channelId : config.channelId,
      c : config.c,
      cdnType : config.cdnType
    });
    if (!config.isCustomedUI) {
      var element = new Promise({
        theTarget : grid
      });
      grid.pnode.appendChild(element.controlBox);
      /** @type {string} */
      grid.pnode.style.cssText = "position: relative; overflow: hidden;";
      grid.setControl(element);
    }
    this.video = grid;
    ostring.call(it);
  };
  /**
   * @param {Object} n
   * @return {?}
   */
  var f = function(n) {
    if (isMobile.Windows()) {
      return void alert(data.NOT_SUPPORT_WINDOWS_PLATFORM);
    }
    this.config = n || {};
    init.call(this);
  };
  f.prototype = {};
  assertThrows("H5player", f);
}(), function($, dataAndEvents) {
  var throttledUpdate = Util.player.makeNS;
  /** @type {function (?): ?} */
  var fn = (Util.ensureAfterDomRenderer, function(id) {
    return document.getElementById(id) || document.body;
  });
  /**
   * @return {?}
   */
  var initialize = function() {
    /** @type {boolean} */
    var e = navigator.appVersion.indexOf("MSIE") >= 0;
    /** @type {boolean} */
    var oSelf = true;
    if (e) {
      try {
        new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      } catch (e) {
        /** @type {boolean} */
        oSelf = false;
      }
    } else {
      if (!navigator.plugins["Shockwave Flash"]) {
        /** @type {boolean} */
        oSelf = false;
      }
    }
    return oSelf;
  };
  /**
   * @param {Object} params
   * @return {?}
   */
  var init = function(params) {
    if (params.w = params.w ? params.w : "100%", params.h = params.h ? params.h : "100%", !initialize()) {
      return'<div style="text-align:center;color:#999; padding:100px 0; line-height:2; background:#000;">\u93ae\u3126\u75c5\u93c8\u590a\u7568\u7441\u531clashPlayer <a target="_blank" href="http://get.adobe.com/cn/flashplayer/" style="color:#ff0;">\u7487\u98ce\u5063\u9351\u7ed8\ue11d\u6fb6\u52eb\u5e53\u6d93\u5b2d\u6d47\u7039\u590e\ue5ca\u93c8\u20ac\u93c2\u626e\u6b91FlashPlayer</a><br/>\u7039\u590e\ue5ca\u7039\u5c7e\u762f\u6d94\u5b2a\u6097\u7487\u5cf0\u57db\u93c2\u4f34\u3009\u95c8\u3221\u57a8\u9470\u5474\u5678\u93c2\u677f\u60ce\u9354\u3126\u797b\u7459\u581d\u6ad2\u9286\ufffd</div><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0 width="1" height="1"></object>'
      ;
    }
    /** @type {string} */
    var param = ['<embed name="' + params.playerId + '" class="p-video-player" src="', params.flashURL ? params.flashURL : params.playSrc, '" flashvars="', params.flashvars, '" quality="high" width="', params.w, '" height="', params.h, '" allowScriptAccess="always" allownetworking="all" type="application/x-shockwave-flash" wmode="', params.wmode, '" allowfullscreen="true" align="middle" ></embed>'].join("");
    return get(params, param);
  };
  /**
   * @param {Object} params
   * @param {string} data
   * @return {?}
   */
  var get = function(params, data) {
    /** @type {string} */
    var out = "<object";
    return out += ' data="' + params.playSrc + '"', out += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"', out += ' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0"', out += ' width="' + params.w + '"', out += ' height="' + params.h + '"', out += ' id="' + params.playerId + '"', out += ' align="middle">', out += '<param name="allowScriptAccess" value="always">', out += '<param name="allowFullScreen" value="true">', out += '<param name="movie" value="' + 
    (params.flashURL ? params.flashURL : params.playSrc) + '">', out += '<param name="quality" value="high">', out += '<param name="wmode" value="direct">', out += '<param name="bgcolor" value="#000000">', out += '<param name="flashvars" value="' + params.flashvars + '">', out += data, out += "</object>";
  };
  /**
   * @return {undefined}
   */
  var error = function() {
    var callbacks = this.config.events || null;
    var root = this.config.ppAPIKey;
    var self = this;
    if (callbacks) {
      if (!window[root]) {
        window[root] = {};
      }
      if (!window[root].onPlayStateChanged) {
        /**
         * @param {number} dataAndEvents
         * @return {undefined}
         */
        window[root].onPlayStateChanged = function(dataAndEvents) {
          /** @type {number} */
          dataAndEvents = 1 * dataAndEvents;
          switch(dataAndEvents) {
            case 1:
              /** @type {string} */
              self.stutas = "init";
              break;
            case 2:
              /** @type {string} */
              self.stutas = "ready";
              break;
            case 3:
              /** @type {string} */
              self.stutas = "start";
              break;
            case 4:
              /** @type {string} */
              self.stutas = "buffering";
              callbacks.onBuffer();
              break;
            case 5:
              /** @type {string} */
              self.stutas = "playing";
              callbacks.onPlay();
              break;
            case 6:
              /** @type {string} */
              self.stutas = "paused";
              callbacks.onPause();
              break;
            case 7:
              /** @type {string} */
              self.stutas = "stopped";
              callbacks.onStop();
              break;
            case 8:
              /** @type {string} */
              self.stutas = "ended";
              callbacks.onEnd();
              break;
            default:
              console.log("en..., what is this?");
          }
        };
      }
      if (callbacks.onLoadData) {
        if (!window[root].onProgressChanged) {
          /**
           * @param {?} error
           * @return {undefined}
           */
          window[root].onProgressChanged = function(error) {
            callbacks.onLoadData(error);
          };
        }
      }
      if (!window[root].onModeChanged) {
        /**
         * @param {number} dataAndEvents
         * @return {undefined}
         */
        window[root].onModeChanged = function(dataAndEvents) {
          if (callbacks.onFullScreen && 3 == dataAndEvents) {
            callbacks.onFullScreen();
          } else {
            if (callbacks.onQuitFullScreen) {
              if (4 == dataAndEvents) {
                callbacks.onQuitFullScreen();
              }
            }
          }
        };
      }
    }
  };
  /**
   * @param {Array} value
   * @return {?}
   */
  var innerHTML = function(value) {
    /** @type {Array} */
    var assigns = [];
    /** @type {null} */
    var item = null;
    /** @type {string} */
    var vvar = "";
    /** @type {number} */
    var itemIndex = 0;
    var len = value.length;
    for (;itemIndex < len;itemIndex++) {
      item = value[itemIndex];
      /** @type {string} */
      vvar = '{"src": "' + encodeURIComponent(item.src ? item.src : "") + '"';
      vvar += ', "label": "' + encodeURIComponent(item.label ? item.label : "") + '"';
      vvar += ', "lang": "' + encodeURIComponent(item.lang ? item.lang : "") + '"';
      if (item.isDefault) {
        vvar += ', "isDefault": true';
      } else {
        vvar += ', "isDefault": false';
      }
      vvar += "}";
      assigns.push(vvar);
    }
    return "[" + assigns.join(",") + "]";
  };
  /**
   * @return {undefined}
   */
  var find = function() {
    /** @type {Array} */
    var tagNameArr = [];
    /** @type {string} */
    this.config.ppAPIKey = "play_" + +new Date;
    if (this.config.poster) {
      tagNameArr.push("fimg=" + this.config.poster);
    }
    if ("autoplay" in this.config) {
      this.config.autoplay = this.config.autoplay ? this.config.autoplay : 0;
    }
    if (this.config.flashURL) {
      tagNameArr.push("urlPlay=" + this.config.playSrc);
      /** @type {number} */
      this.config.autoplay = 0;
    }
    if ("autoplay" in this.config) {
      tagNameArr.push("ap=" + this.config.autoplay);
    }
    if (this.config.ydpfut) {
      tagNameArr.push("ydpf_ut=" + this.config.ydpfut);
    }
    if (this.config.playbackrate) {
      tagNameArr.push("playbackrate=" + this.config.playbackrate);
    }
    if (this.config.subTitles) {
      tagNameArr.push("subtitle=" + encodeURIComponent(innerHTML(this.config.subTitles)));
    }
    /** @type {number} */
    this.config.feedback = this.config.feedback ? 1 : 0;
    tagNameArr.push("feedback=" + this.config.feedback);
    if (this.config.isAPI) {
      tagNameArr.push("api=" + this.config.ppAPIKey);
    }
    if (!this.config.flashvars) {
      /** @type {string} */
      this.config.flashvars = "";
    }
    /** @type {string} */
    this.config.flashvars = tagNameArr.join("&");
    error.call(this);
  };
  throttledUpdate("FlashPlayer", function(self) {
    var stream = self.playCode;
    this.config = self || {};
    this.playerbox = fn(self.id);
    if (self.id) {
      if (this.playerbox) {
        if (stream || self.flashURL) {
          find.call(this);
          this.playerbox.innerHTML = init(this.config);
        }
      }
    }
  });
}(window), function() {
  var Message = (window.CONST.MESSEAGE.SYS, window.H5player);
  var App = window.FlashPlayer;
  var getter = Util.player.makeNS;
  var test = Util.player.replaceParams;
  var isMobile = Util.player.isMobile;
  /** @type {string} */
  var _host = window.location.host;
  /** @type {string} */
  var proto = "http";
  if (/https/i.test("" + window.location)) {
    /** @type {string} */
    proto = "https";
  }
  /** @type {string} */
  var rdm = "v.pptvyun.com";
  /** @type {string} */
  var dm = "player.pptvyun.com";
  if (_host.indexOf("v.pptvyun.ppqa.com") > -1) {
    /** @type {string} */
    rdm = "v.pptvyun.ppqa.com";
    /** @type {string} */
    dm = "player.pptvyun.ppqa.com";
  }
  /** @type {Array} */
  var lines = ["m4.pptvyun.com", "douya.live.pptvyun.com"];
  /**
   * @param {string} classNames
   * @return {?}
   */
  var toggleClass = function(classNames) {
    /** @type {string} */
    var line = "";
    classNames = classNames || "";
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var e = lines.length;
    for (;i < e;i++) {
      if (line = lines[i], classNames.indexOf(line) > -1) {
        return true;
      }
    }
  };
  /** @type {string} */
  var message = "{proto}://{dm}/svc/{playerType}/pl/{playCode}.{type}?ydpf_ut={ydpf_ut}";
  /**
   * @param {string} event_data
   * @param {Object} data
   * @return {?}
   */
  var listener = function(event_data, data) {
    var doc = {
      proto : this.proto,
      dm : this.dm,
      playerType : "m3u8player",
      playCode : event_data,
      type : "m3u8",
      ydpf_ut : PPPlayerLog.vvid
    };
    return data && (message = "{proto}://{dm}/svc/{playerType}/pl/{playCode}/token/" + data + ".{type}?ydpf_ut={ydpf_ut}"), isMobile.any() || (doc.playerType = "flashplayer", doc.type = "swf", message = "{proto}://{dm}/svc/{playerType}/pl/{playCode}.{type}", data && (message = "{proto}://{dm}/svc/{playerType}/pl/{playCode}/token/" + data + ".{type}")), test(message, doc);
  };
  /**
   * @param {?} consume
   * @return {?}
   */
  var match = function(consume) {
    var attributes = {
      proto : this.proto,
      rdm : this.rdm,
      playCode : consume,
      ydpf_ut : PPPlayerLog.vvid
    };
    return test("{proto}://{rdm}/player/swf_api/?id={playCode}&ydpf_ut={ydpf_ut}", attributes);
  };
  /**
   * @return {?}
   */
  var init = function() {
    var file = this;
    var config = this.config || {};
    /** @type {null} */
    var msg = null;
    if (this.config.playerId = "PPCLoudplayer" + +new Date, this.proto = config.proto || proto, this.rdm = config.rdm || rdm, this.dm = config.dm || dm, config.flashURL = "", config.isExternalSource = false, config.playSrc && !toggleClass(config.playSrc)) {
      return void(config.notResourceTip && config.notResourceTip.call(file, "Invalid domain name"));
    }
    if (config.playSrc && (config.isExternalSource = true, config.flashURL = this.proto + "://static9.pplive.cn/cloud_platform/fplayer/release/lpf/4.0.2.2/v_20170707140253/PPYLive.swf"), config.playSrc = config.playSrc || listener.call(file, config.playCode, config.clientToken), config.playerId = this.config.playerId, config.ydpfut = PPPlayerLog.vvid, !isMobile.any()) {
      new App(config);
      return void ready(this, config.playerId);
    }
    if (config.isExternalSource) {
      var self = config;
      return self.videoType = self.videoType || 1, self.liveStartTime = 0, self.live = [], self.livingTime = 0, self.webid = "", self.channelId = "", self.c = "", msg = new Message(self), void log(file, msg.video, msg);
    }
    JSONPRequest({
      url : match.call(file, config.playCode),
      /**
       * @param {Object} data
       * @return {?}
       */
      callBack : function(data) {
        if (0 === data.err) {
          var self = config;
          self.poster = data.info.cpimg;
          self.videoType = data.info.videoType;
          self.liveStartTime = data.info.liveStartTime || 0;
          self.live = data.info.live || [];
          self.livingTime = data.info.livingTime || 0;
          self.webid = data.info.web_id;
          self.channelId = data.info.channelId;
          self.c = data.info.c;
          self.cdnType = data.info.cdnType;
          if (self.cdnType > 1) {
            self.playSrc = data.info.mobile_url || self.playSrc;
          }
          msg = new Message(self);
          log(file, msg.video, msg);
        } else {
          if (config.notResourceTip) {
            return void config.notResourceTip.call(file, config.playCode);
          }
          alert("\u8930\u64b3\u58a0\u74a7\u52ec\u7c2e\u6d93\u5d85\u5f72\u6d60\u30e6\u6331\u93c0\ufffd");
        }
      },
      /**
       * @return {?}
       */
      errorCallback : function() {
        if (config.notResourceTip) {
          return void config.notResourceTip.call(file, config.playCode);
        }
        alert("\u8930\u64b3\u58a0\u74a7\u52ec\u7c2e\u6d93\u5d85\u5f72\u6d60\u30e6\u6331\u93c0\ufffd");
      }
    });
  };
  /**
   * @param {Object} config
   * @return {undefined}
   */
  var constructor = function(config) {
    this.config = config || {};
    init.call(this);
  };
  constructor.prototype = {
    /**
     * @param {?} loadingLang
     * @return {undefined}
     */
    load : function(loadingLang) {
    }
  };
  /**
   * @param {string} socket
   * @param {string} name
   * @return {undefined}
   */
  var ready = function(socket, name) {
    setTimeout(function() {
      /** @type {string} */
      var self = socket;
      var player = document[name];
      player = player || document.getElementById(name);
      /**
       * @param {?} direction
       * @return {undefined}
       */
      self.play = function(direction) {
        if (player) {
          if (player.playVideo) {
            if (direction) {
              player.playVideo(direction);
            } else {
              player.playVideo();
            }
          }
        }
      };
      /**
       * @return {undefined}
       */
      self.pause = function() {
        if (player) {
          if (player.pauseVideo) {
            player.pauseVideo();
          }
        }
      };
      /**
       * @return {?}
       */
      self.getStatus = function() {
        return player && player.playState ? player.playState() : self.stutas;
      };
      /**
       * @return {?}
       */
      self.getVolume = function() {
        if (player && player.getVolume) {
          return player.getVolume();
        }
      };
      /**
       * @param {(number|string)} dataAndEvents
       * @return {?}
       */
      self.setVolume = function(dataAndEvents) {
        if (player && player.setVolume) {
          return player.setVolume(dataAndEvents);
        }
      };
      /**
       * @param {?} isMuted
       * @return {?}
       */
      self.setMute = function(isMuted) {
        /** @type {number} */
        var node = +isMuted;
        if (node = node || false, node = node ? 0 : 30, player && player.setVolume) {
          return player.setVolume(node);
        }
      };
      /**
       * @param {?} deepDataAndEvents
       * @return {undefined}
       */
      self.setPlayBackRate = function(deepDataAndEvents) {
        if (player) {
          if (player.setPlayBackRate) {
            player.setPlayBackRate(deepDataAndEvents);
          }
        }
      };
      /**
       * @param {(number|string)} dataAndEvents
       * @return {?}
       */
      self.changeSubtitle = function(dataAndEvents) {
        if (player && player.changeSubtitle) {
          return player.changeSubtitle(dataAndEvents);
        }
      };
      if (self.config) {
        if (self.config.events) {
          if (self.config.events.afterPlayerShow) {
            self.config.events.afterPlayerShow.call(self);
          }
        }
      }
    }, 0);
  };
  /**
   * @param {string} obj
   * @param {Object} v
   * @return {undefined}
   */
  var log = function(obj, v) {
    setTimeout(function() {
      /** @type {string} */
      var me = obj;
      /**
       * @param {?} action
       * @return {undefined}
       */
      me.play = function(action) {
        if (v) {
          if (v.play) {
            v.play();
          }
        }
      };
      /**
       * @return {undefined}
       */
      me.pause = function() {
        if (v) {
          if (v.pause) {
            v.pause();
          }
        }
      };
      /**
       * @param {?} deepDataAndEvents
       * @return {undefined}
       */
      me.setPlayBackRate = function(deepDataAndEvents) {
        if (v) {
          if (v.setPlayBackRate) {
            v.setPlayBackRate(deepDataAndEvents);
          }
        }
      };
      /**
       * @param {(number|string)} dataAndEvents
       * @return {undefined}
       */
      me.changeSubtitle = function(dataAndEvents) {
        if (v) {
          if (v.changeSubtitle) {
            v.changeSubtitle(dataAndEvents);
          }
        }
      };
      if (me.config) {
        if (me.config.events) {
          if (me.config.events.afterPlayerShow) {
            me.config.events.afterPlayerShow.call(me);
          }
        }
      }
    }, 0);
  };
  getter("PPCLoudplayer", constructor);
}();
