var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(a, d, c) {
    if (null == a)
        throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
    if (d instanceof RegExp)
        throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
    return a + ""
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, d, c) {
    a != Array.prototype && a != Object.prototype && (a[d] = c.value)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, d, c, e) {
    if (d) {
        c = $jscomp.global;
        a = a.split(".");
        for (e = 0; e < a.length - 1; e++) {
            var k = a[e];
            k in c || (c[k] = {});
            c = c[k]
        }
        a = a[a.length - 1];
        e = c[a];
        d = d(e);
        d != e && null != d && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: d
        })
    }
}
;
$jscomp.polyfill("String.prototype.startsWith", function(a) {
    return a ? a : function(a, c) {
        var e = $jscomp.checkStringArgs(this, a, "startsWith");
        a += "";
        var d = e.length
          , l = a.length;
        c = Math.max(0, Math.min(c | 0, e.length));
        for (var h = 0; h < l && c < d; )
            if (e[c++] != a[h++])
                return !1;
        return h >= l
    }
}, "es6", "es3");
$jscomp.findInternal = function(a, d, c) {
    a instanceof String && (a = String(a));
    for (var e = a.length, k = 0; k < e; k++) {
        var l = a[k];
        if (d.call(c, l, k, a))
            return {
                i: k,
                v: l
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.polyfill("Array.prototype.find", function(a) {
    return a ? a : function(a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(a) {
    return a ? a : function(a, c) {
        var e = $jscomp.checkStringArgs(this, a, "endsWith");
        a += "";
        void 0 === c && (c = e.length);
        c = Math.max(0, Math.min(c | 0, e.length));
        for (var d = a.length; 0 < d && 0 < c; )
            if (e[--c] != a[--d])
                return !1;
        return 0 >= d
    }
}, "es6", "es3");
(function() {
    function a() {
        l = !0;
        c.removeEventListener("DOMContentLoaded", a);
        e.removeEventListener("load", a);
        k.forEach(function(b) {
            b()
        })
    }
    function d(b) {
        return parseFloat(b ? b : 0)
    }
    var c = document
      , e = window
      , k = []
      , l = !1;
    "complete" === c.readyState ? a() : (c.addEventListener("DOMContentLoaded", a),
    e.addEventListener("load", a));
    var h = Array.prototype.slice;
    String.prototype.startsWith || (String.prototype.startsWith = function(b, f) {
        return this.substr(!f || 0 > f ? 0 : +f, b.length) === b
    }
    );
    String.prototype.endsWith || (String.prototype.endsWith = function(b, f) {
        if (void 0 === f || f > this.length)
            f = this.length;
        return this.substring(f - b.length, f) === b
    }
    );
    e.$ = function(b, f) {
        if (b instanceof Function)
            return l ? b() : k.push(b),
            c;
        if (b instanceof NodeList)
            return new JQLite(h.call(b));
        if (b instanceof Node && 1 === b.nodeType)
            return new JQLite([b]);
        var a;
        if (a = "string" === typeof b)
            a = b.trim(),
            a = "<" === a[0] && ">" === a[a.length - 1] && 3 <= a.length;
        if (a) {
            b = b.trim();
            if (a = b.match(/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/)) {
                f = f || {};
                b = c.createElement(a[1]);
                for (var e in f)
                    f.hasOwnProperty(e) && b.setAttribute(e, f[e]);
                b = [b]
            } else
                b.startsWith("<!DOCTYPE") || b.startsWith("<!doctype") ? b = [(new DOMParser).parseFromString(b, "text/html").documentElement] : (f = c.createElement("div"),
                f.innerHTML = b,
                b = h.call(f.childNodes));
            return new JQLite(b)
        }
        if ("string" === typeof b)
            return new JQLite(h.call(c.querySelectorAll(b)));
        if (b instanceof Document)
            return new JQLite([b.documentElement])
    }
    ;
    e.JQLite = function(b) {
        this.elements = b;
        return this
    }
    ;
    var g = $.fn = JQLite.prototype;
    g.html = function(b) {
        if ("undefined" !== typeof b) {
            var f = "";
            b instanceof JQLite ? b.each(function() {
                f += this.outerHTML
            }) : f = b;
            this.elements.forEach(function(b) {
                b.innerHTML = f
            });
            return this
        }
        return this.elements[0].innerHTML
    }
    ;
    g.empty = function() {
        this.html("");
        return this
    }
    ;
    g.prevSiblings = function() {
        for (var b = [], f = this.get(0); f = f.previousElementSibling; )
            b.push(f);
        return new JQLite(b)
    }
    ;
    g.nextSiblings = function() {
        for (var b = [], f = this.get(0); f = f.nextElementSibling; )
            b.push(f);
        return new JQLite(b)
    }
    ;
    g.siblings = function(b) {
        var f = this.prevSiblings().elements.concat(this.nextSiblings().elements)
          , a = [];
        b ? f.forEach(function(f) {
            $(f).is(b) && a.push(f)
        }) : a = f;
        return new JQLite(a)
    }
    ;
    g.appendToFirst = function(b) {
        this.elements[0].appendChild(b)
    }
    ;
    g.prepend = function(b) {
        b instanceof JQLite ? b.elements.forEach(function(b) {
            this.elements[0].prepend(b)
        }
        .bind(this)) : this.elements[0].prepend(b);
        return this
    }
    ;
    g.append = function(b) {
        b instanceof JQLite ? b.elements.forEach(function(b) {
            this.elements[0].appendChild(b)
        }
        .bind(this)) : b instanceof HTMLElement ? this.elements[0].appendChild(b) : "string" === typeof b && this.elements.forEach(function(a) {
            a.innerHTML += b
        });
        return this
    }
    ;
    g.before = function(b) {
        var a = 1 < this.size();
        this.elements.forEach(function(f) {
            var c = f.parentNode;
            "string" === typeof b && (b = $(b));
            b.each(function() {
                var b = a ? this.cloneNode(!0) : this;
                c.insertBefore(b, f)
            })
        })
    }
    ;
    g.after = function(b) {
        var a = 1 < this.size();
        this.elements.forEach(function(f) {
            var c = f.parentNode
              , e = f.nextSibling;
            "string" === typeof b && (b = $(b));
            b.each(function() {
                var b = a ? this.cloneNode(!0) : this;
                e ? c.insertBefore(b, e) : c.appendChild(b)
            })
        })
    }
    ;
    g.attr = function(b, a) {
        if ("undefined" !== typeof a)
            return this.elements.forEach(function(f) {
                f.setAttribute(b, a)
            }),
            this;
        var f = this.elements[0];
        return f ? f.getAttribute(b) : null
    }
    ;
    g.removeAttr = function(b) {
        this.elements.forEach(function(a) {
            a.removeAttribute(b)
        })
    }
    ;
    g.get = function(b) {
        return this.elements[b]
    }
    ;
    g.hasClass = function(b) {
        var a = this.get(0);
        return (new RegExp(" " + b + " ")).test(" " + a.className + " ")
    }
    ;
    g.addClass = function(b) {
        this.elements.forEach(function(a) {
            a.classList ? a.classList.add(b) : $(a).hasClass(b) || (a.className += " " + b)
        });
        return this
    }
    ;
    g.removeClass = function(b) {
        this.elements.forEach(function(a) {
            if (a.classList)
                a.classList.remove(b);
            else {
                var f = " " + a.className.replace(/[\t\r\n]/g, " ") + " ";
                if ($(a).hasClass(b)) {
                    for (; 0 <= f.indexOf(" " + b + " "); )
                        f = f.replace(" " + b + " ", " ");
                    a.className = f.replace(/^\s+|\s+$/g, "")
                }
            }
        });
        return this
    }
    ;
    g.toggleClass = function(b) {
        this.each(function(a, c) {
            c = $(c);
            c.hasClass(b) ? c.removeClass(b) : c.addClass(b)
        })
    }
    ;
    g.hasClass = function(b) {
        return (new RegExp(" " + b + " ")).test(" " + this.get(0).className + " ")
    }
    ;
    g.children = function() {
        var b = [], a;
        this.elements.forEach(function(f) {
            a = Array.prototype.slice.call(f.children);
            b = b.concat(a)
        });
        return new JQLite(b)
    }
    ;
    g.val = function(b) {
        if (void 0 !== b)
            this.each(function() {
                this.value = b
            });
        else {
            var a = this.get(0);
            return a ? a.value : null
        }
    }
    ;
    g.parent = function() {
        var b = [], a;
        this.elements.forEach(function(c) {
            (a = c.parentElement) && -1 === b.indexOf(a) && b.push(a)
        });
        return new JQLite(b)
    }
    ;
    g.parents = function(b) {
        if (!b)
            return this.parent();
        for (var a = $(this.get(0).parentElement); a.size() && !a.is(b); )
            a = a.parent();
        return a
    }
    ;
    g.find = function(b) {
        var a = [], c, e;
        this.elements.forEach(function(f) {
            c = f.querySelectorAll(b);
            e = Array.prototype.slice.call(c);
            e.forEach(function(b) {
                -1 === a.indexOf(b) && a.push(b)
            })
        });
        return new JQLite(a)
    }
    ;
    g.is = function(b) {
        if (0 === this.elements.length)
            return !1;
        var a = !0;
        this.elements.forEach(function(e) {
            var f = !1;
            if (b.nodeType)
                f = e === b;
            else
                for (var d = "string" === typeof b ? c.querySelectorAll(b) : [b], k = d.length; k--; )
                    d[k] === e && (f = !0);
            a = f && a
        });
        return a
    }
    ;
    g.has = function(b) {
        var a = [];
        b = b instanceof Node ? b : b.get(0);
        this.each(function() {
            this.contains(b) && a.push(this)
        });
        return new JQLite(a)
    }
    ;
    g.remove = function() {
        this.elements.forEach(function(b) {
            try {
                b.remove()
            } catch (f) {
                b.parentNode.removeChild(b)
            }
        })
    }
    ;
    g.on = function(b, a) {
        this.elements.forEach(function(c) {
            c.addEventListener(b, a)
        });
        return this
    }
    ;
    g.delegate = function(b, a, c) {
        this.on(a, function(a) {
            $(a.target).is(b) && c.apply(a.target, arguments)
        })
    }
    ;
    g.off = function(b, a) {
        this.elements.forEach(function(c) {
            c.removeEventListener(b, a)
        });
        return this
    }
    ;
    g.trigger = function(b) {
        try {
            var a = new Event(b)
        } catch (n) {
            a = c.createEvent("Event"),
            a.initCustomEvent(b, !0, !0)
        }
        this.elements.forEach(function(b) {
            b.dispatchEvent(a)
        })
    }
    ;
    g.each = function(b) {
        this.elements.forEach(function(a, c) {
            b.call(a, c, a)
        })
    }
    ;
    g.hide = function() {
        this.originalDisplay = this.css("display");
        this.css("display", "none");
        return this
    }
    ;
    g.show = function() {
        this.css("display", this.originalDisplay && "none" !== this.originalDisplay ? this.originalDisplay : "block");
        return this
    }
    ;
    g.css = function(b, a) {
        if (b && "string" !== typeof b)
            for (var c in b)
                this.elements.forEach(function(a) {
                    a.style[c] = b[c]
                });
        else {
            if ("undefined" === typeof a)
                return this.elements[0].style.getPropertyValue(b);
            this.elements.forEach(function(c) {
                c.style[b] = a
            });
            return this
        }
    }
    ;
    g.outerHeight = function() {
        var a = d(this.css("marginTop")) + d(this.css("marginBottom"));
        return Math.ceil(this.get(0).offsetHeight + a)
    }
    ;
    g.offset = function() {
        var a = this.get(0);
        var c = a && a.ownerDocument;
        var e = c.documentElement;
        a = a.getBoundingClientRect();
        c = c.defaultView;
        return {
            top: a.top + c.pageYOffset - e.clientTop,
            left: a.left + c.pageXOffset - e.clientLeft
        }
    }
    ;
    g.position = function() {
        var a = this.get(0);
        var c = {
            top: 0,
            left: 0
        };
        if ("fixed" === this.css("position"))
            a = a.getBoundingClientRect();
        else {
            var e = new JQLite([a.offsetParent]);
            a = this.offset();
            "html" !== this.get(0).nodeName && (c = e.offset());
            c.top += d(e.css("borderTopWidth"));
            c.left += d(e.css("borderLeftWidth"))
        }
        return {
            top: a.top - c.top - this.css("marginTop"),
            left: a.left - c.left - this.css("marginLeft")
        }
    }
    ;
    g.text = function(a) {
        if ("undefined" !== typeof a)
            return this.elements.forEach(function(b) {
                b.innerText = a
            }),
            this;
        text = "";
        this.elements.forEach(function(a) {
            text += a.innerText
        });
        return text
    }
    ;
    g.size = function() {
        return this.elements.length
    }
    ;
    g.data = function(a, c) {
        var b = this.get(0).dataset;
        b = b || {};
        if (a && c)
            b[a] = c;
        else
            return a ? b[a] : b
    }
    ;
    g.scrollTop = function(a) {
        var b = this.get(0);
        if (!b)
            return null;
        void 0 !== a && (this.get(0).scrollTop = a);
        return b.scrollTop
    }
    ;
    $.extend = function(a) {
        Array.prototype.slice.call(arguments, 1).forEach(function(b) {
            for (var c in b)
                a[c] = b[c]
        })
    }
    ;
    var q = function(a) {
        var b = a.method.toUpperCase().trim()
          , c = a.data
          , d = a.url;
        if (c instanceof JQLite) {
            var k = c.elements;
            c = {};
            k.forEach(function(a) {
                a.name && (c[a.name] = a.value)
            })
        }
        if ("string" !== typeof c && !(e.FormData && c instanceof FormData)) {
            k = [];
            for (var g in c)
                "GET" === b ? d = updateURLVar(d, g, c[g]) : k.push(g + "=" + encodeURIComponent(c[g]));
            c = k.join("&")
        }
        var h = new XMLHttpRequest;
        h.onreadystatechange = function() {
            if (h.readyState === XMLHttpRequest.DONE) {
                if (200 === h.status) {
                    var b = h.response || h.responseText;
                    "json" === a.dataType && (b = JSON.parse(b));
                    a.success(b)
                } else
                    a.error(h, h.status, h.response);
                a.complete()
            }
        }
        ;
        h.open(b, d, !0);
        "GET" !== b && a.contentType && h.setRequestHeader("Content-type", a.contentType);
        a.beforeSend(a);
        h.send(c)
    };
    $.ajax = function(a) {
        var b = {
            success: function() {},
            error: function() {},
            url: e.location.href,
            method: "GET",
            complete: function() {},
            beforeSend: function() {},
            dataType: "html",
            data: "",
            contentType: "application/x-www-form-urlencoded"
        };
        $.extend(b, a);
        q(b)
    }
    ;
    g.load = function(a, c, e) {
        var b, d = this, k = a.indexOf(" ");
        if (-1 < k) {
            var f = a.slice(k).trim();
            a = a.slice(0, k)
        }
        c && "object" === typeof c && (b = "POST");
        $.ajax({
            url: a,
            method: b || "GET",
            dataType: "html",
            data: c,
            success: function(a) {
                d.html(f ? $("<div>").append(a).find(f) : a);
                e && e(a)
            }
        })
    }
    ;
    $.get = function(a, c) {
        $.ajax({
            url: a,
            success: c
        })
    }
    ;
    $.post = function(a, c, e) {
        $.ajax({
            url: a,
            data: c,
            method: "POST",
            success: e
        })
    }
}
)();
Number.prototype.toCommaFormat = function() {
    var a = this.toString().split(".");
    a[0] = a[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return a.join(".")
}
;
String.prototype.replaceAll = function(a, d) {
    return this.replace(new RegExp(a,"g"), d)
}
;
function getURLVar(a) {
    var d = {}
      , c = String(document.location).split("?");
    if (c[1]) {
        c = c[1].split("&");
        for (i = 0; i < c.length; i++) {
            var e = c[i].split("=");
            e[0] && e[1] && (d[e[0]] = e[1])
        }
        if (d[a])
            return d[a]
    }
    return ""
}
function updateURLVar(a, d, c) {
    var e = new RegExp("([?&])" + d + "=.*?(&|$)","i")
      , k = -1 !== a.indexOf("?") ? "&" : "?";
    a.match(e) && c ? a = a.replace(e, "$1" + d + "=" + c + "$2") : a.match(e) && !c ? a = a.replace(e, "$1") : c && (a = a + k + d + "=" + c);
    if (a.endsWith("&") || a.endsWith("?"))
        a = a.substr(0, a.length - 1);
    return a
}
function shareOnSocialMedea(a, d, c, e) {
    switch (a) {
    case "twitter":
        window.open("https://twitter.com/intent/tweet?text=" + c + " " + encodeURIComponent(d), "sharertwt", "toolbar=0,status=0,width=640,height=445");
        break;
    case "facebook":
        window.open("http://www.facebook.com/sharer.php?u=" + d, "sharer", "toolbar=0,status=0,width=660,height=445");
        break;
    case "linkedin":
        window.open("https://www.linkedin.com/shareArticle?mini=true&url=" + d + "title=" + c, "sharer", "toolbar=0,status=0,width=660,height=445");
        break;
    case "google-plus":
        window.open("https://plus.google.com/share?url=" + d, "sharer", "toolbar=0,status=0,width=660,height=445");
        break;
    case "pinterest":
        window.open("http://www.pinterest.com/pin/create/button/?media=" + e + "&url=" + d, "sharerpinterest", "toolbar=0,status=0,width=660,height=445")
    }
}
function isMobile() {
    return 768 > window.innerWidth
}
$(function() {
    $(".text-danger").each(function() {
        $(this).parents(".form-group").addClass("has-error")
    });
    var a = $("#search input[name='search']");
    a.parent().find("button").on("click", function() {
        var c = $("base").attr("href") + "product/search"
          , e = a.val()
          , d = [];
        e && d.push("search=" + encodeURIComponent(e));
        (e = $("#search select[name='category_id']").val()) && d.push("category_id=" + e);
        d && (c = c + "?" + d.join("&"));
        location = c;
        fbq("track", "Search")
    });
    a.on("keydown", function(c) {
        13 === c.keyCode && a.parent().find("button").trigger("click")
    });
    $(document).delegate(".checkout-btn", "click", function() {
        try {
            fbq("track", "InitiateCheckout")
        } catch (c) {}
    });
    var d = $(".cart-toggler");
    d.on("click", function() {
        d.is(".loaded") || (cart.reload(),
        d.addClass("loaded"))
    })
});
var cart = {
    add: function(a, d) {
        var c = this;
        $.ajax({
            url: "checkout/cart/add",
            method: "post",
            data: "product_id=" + a + "&quantity=" + ("undefined" != typeof d ? d : 1),
            dataType: "json",
            beforeSend: function() {
                $("#cart > button").button("loading")
            },
            complete: function() {
                $("#cart > button").button("reset")
            },
            success: function(e) {
                $(".alert, .text-danger").remove();
                e.redirect && (location = e.redirect);
                if (e.success) {
                    var d = $(".container.alert-container");
                    0 == d.size() && (d = $('<div class="container alert-container"></div>'),
                    $(".after-header").after(d));
                    d.append('<div class="alert alert-success">' + e.success + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                    setTimeout(function() {
                        $(".cart-toggler .label").html(e.total);
                        $(".cart-toggler .value").text(e.count);
                        $(".cart-toggler").attr("title", e.total)
                    }, 100);
                    $("body, html").scrollTo(0, 600);
                    c.reload();
                    fbq("track", "AddToCart", {
                        content_ids: [a],
                        content_type: "product",
                        value: e.item_total,
                        currency: "BDT"
                    })
                }
            }
        })
    },
    update: function(a, d) {
        var c = this;
        $.ajax({
            url: "checkout/cart/edit",
            method: "post",
            data: "ajax=true&quantity[" + encodeURIComponent(a) + "]=" + ("undefined" != typeof d ? d : 1),
            dataType: "json",
            beforeSend: function() {
                $("#cart > button").button("loading")
            },
            complete: function() {
                $("#cart > button").button("reset")
            },
            success: function(a) {
                "checkout/cart" == getURLVar("route") || "checkout/checkout" == getURLVar("route") ? location = "checkout/cart" : ($(".cart-toggler .label").html(a.total),
                $(".cart-toggler .value").text(a.count),
                $(".cart-toggler").attr("title", a.total),
                c.reload())
            }
        })
    },
    remove: function(a, d) {
        var c = this;
        $.ajax({
            url: "checkout/cart/remove",
            method: "post",
            data: "key=" + a,
            dataType: "json",
            beforeSend: function() {
                $("#cart > button").button("loading")
            },
            complete: function() {
                $("#cart > button").button("reset")
            },
            success: function(a) {
                setTimeout(function() {
                    $(".cart-toggler .label").html(a.total);
                    $(".cart-toggler .value").text(a.count);
                    $(".cart-toggler").attr("title", a.total)
                }, 100);
                d ? location = "checkout/cart" : c.reload()
            }
        })
    },
    reload: function() {
        $(".mini-cart").load("common/cart/info")
    }
}
  , voucher = {
    add: function() {},
    remove: function(a) {
        $.ajax({
            url: "checkout/cart/remove",
            method: "post",
            data: "key=" + a,
            dataType: "json",
            beforeSend: function() {
                $("#cart > button").button("loading")
            },
            complete: function() {
                $("#cart > button").button("reset")
            },
            success: function(a) {
                setTimeout(function() {
                    $("#cart > button").html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + a.total + "</span>")
                }, 100);
                "checkout/cart" == getURLVar("route") || "checkout/checkout" == getURLVar("route") ? location = "checkout/cart" : cart.reload()
            }
        })
    }
}
  , wishlist = {
    add: function(a) {
        $.ajax({
            url: "account/wishlist/add",
            method: "post",
            data: "product_id=" + a,
            dataType: "json",
            success: function(a) {
                $(".alert").remove();
                if (a.success) {
                    var c = $(".container.alert-container");
                    0 == c.size() && (c = $('<div class="container alert-container"></div>').insertAfter($(".after-header")));
                    c.append('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + a.success + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>')
                }
                a.info && (c = $(".container.alert-container"),
                0 == c.size() && (c = $('<div class="container alert-container"></div>').insertAfter($(".after-header"))),
                c.append('<div class="alert alert-info"><i class="fa fa-info-circle"></i> ' + a.info + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>'));
                $("#wishlist-total span").html(a.total);
                $("#wishlist-total").attr("title", a.total);
                $("html, body").scrollTo(0, 600);
                fbq("track", "AddToWishlist")
            }
        })
    },
    remove: function() {}
}
  , compare = {
    add: function(a) {
        $.ajax({
            url: "product/compare/add",
            method: "post",
            data: "product_id=" + a,
            dataType: "json",
            success: function(a) {
                $(".alert").remove();
                if (a.success) {
                    var c = $(".container.alert-container");
                    0 == c.size() && (c = $('<div class="container alert-container"></div>'),
                    $(".after-header").after(c));
                    c.append('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + a.success + '<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                    $("#compare-total").html(a.total);
                    $("#compare .value").text(a.count);
                    $("html, body").scrollTo(0, 600)
                }
            }
        })
    },
    remove: function() {}
}
  , restock_request = {
    add: function(a) {
        $.ajax({
            url: "checkout/restock_request/add",
            method: "post",
            data: {
                product_id: a,
                referrer: location.href
            },
            dataType: "json",
            beforeSend: function() {},
            complete: function() {},
            success: function(a) {
                a.redirect && (location = a.redirect);
                a.success && showMessage(a.success, "success");
                a.error && showMessage(a.error, "error")
            }
        })
    }
};
$(document).delegate(".agree", "click", function(a) {
    a.preventDefault();
    $("#modal-agree").remove();
    var d = this;
    $.ajax({
        url: $(d).attr("href"),
        method: "get",
        dataType: "html",
        success: function(a) {
            html = '<div id="modal-agree" class="modal">';
            html += '  <div class="modal-dialog">';
            html += '    <div class="modal-content">';
            html += '      <div class="modal-header">';
            html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
            html += '        <h4 class="modal-title">' + $(d).text() + "</h4>";
            html += "      </div>";
            html += '      <div class="modal-body">' + a + "</div>";
            html += "    </div";
            html += "  </div>";
            html += "</div>";
            $("body").append(html);
            $("#modal-agree").modal("show")
        }
    })
});
$.fn.autocomplete = function(a) {
    return this.each(function() {
        var d = $(this)
          , c = this;
        this.timer = null;
        this.items = [];
        $.extend(this, a);
        d.attr("autocomplete", "off");
        d.on("focus", function() {
            c.request()
        });
        d.on("blur", function() {
            setTimeout(function(a) {
                a.hide()
            }, 200, this)
        });
        d.on("keydown", function(a) {
            switch (a.keyCode) {
            case 27:
                c.hide();
                break;
            default:
                c.request()
            }
        });
        c.click = function(a) {
            (value = $(a.target).parent().attr("data-value")) && this.items[value] && (a.preventDefault(),
            this.select(this.items[value]))
        }
        ;
        c.show = function() {
            var a = d.position()
              , c = d.siblings(".dropdown-menu");
            c.css({
                top: a.top + d.outerHeight() + "px",
                left: a.left + "px"
            });
            c.show()
        }
        ;
        c.hide = function() {
            d.siblings("ul.dropdown-menu").hide()
        }
        ;
        this.request = function() {
            clearTimeout(this.timer);
            c.timer = setTimeout(function(a) {
                a.source($(a).val(), a.response.bind(a))
            }, 200, this)
        }
        ;
        c.response = function(a) {
            var e = "";
            if (a.length) {
                for (i = 0; i < a.length; i++)
                    c.items[a[i].value] = a[i];
                for (i = 0; i < a.length; i++)
                    a[i].category || (e += '<li data-value="' + a[i].value + '"><a href="#">' + a[i].label + "</a></li>");
                var l = [];
                for (i = 0; i < a.length; i++)
                    a[i].category && (l[a[i].category] || (l[a[i].category] = [],
                    l[a[i].category].name = a[i].category,
                    l[a[i].category].item = []),
                    l[a[i].category].item.push(a[i]));
                for (i in l)
                    for (e += '<li class="dropdown-header">' + l[i].name + "</li>",
                    j = 0; j < l[i].item.length; j++)
                        e += '<li data-value="' + l[i].item[j].value + '"><a href="#">&nbsp;&nbsp;&nbsp;' + l[i].item[j].label + "</a></li>"
            }
            e ? c.show() : c.hide();
            d.siblings("ul.dropdown-menu").html(e)
        }
        ;
        d.after('<ul class="dropdown-menu"></ul>');
        d.siblings("ul.dropdown-menu").delegate("a", "click", this.click.bind(this))
    })
}
;
$.fn.button = function(a) {
    0 !== this.size() && ("loading" === a ? (this.addClass("disabled"),
    this.attr("disabled", ""),
    this.data("old_text", this.text()),
    this.text("Loading...")) : (this.removeClass("disabled"),
    this.removeAttr("disabled"),
    this.text(this.data("old_text"))))
}
;
$.fn._scrollTo = function(a, d) {
    var c = this
      , e = null;
    if (1 < c.size()) {
        for (var k = 0; k < c.size(); k++) {
            var l = c.elements[k];
            if (l.scrollHeight > l.clientHeight) {
                e = l;
                break
            }
        }
        e && (c = $(e))
    } else
        e = c.get(0);
    if (null == e)
        this.each(function() {
            this.scrollTop = a
        });
    else if (!(0 >= d || 0 === c.size())) {
        var h = (a - e.scrollTop) / d * 10;
        setTimeout(function() {
            e.scrollTop += h;
            e.scrollTop !== a && this._scrollTo(a, d - 10)
        }
        .bind(c), 10)
    }
}
;
$.fn.scrollTo = function(a, d) {
    try {
        window.scroll({
            top: a,
            behavior: "smooth"
        })
    } catch (c) {
        window.scroll(0, a)
    }
}
;
function Popup(a) {
    var d = this;
    this.el = a = $('<div class="popup"><div class="popup-inner">' + a + '<span class="popup-close" href="#"></span></div></div>');
    a.find(".popup-close").on("click", function() {
        d.close()
    });
    a.on("click", function(a) {
        $(a.target).is(".popup") && d.close()
    })
}
var _p = Popup.prototype;
_p.render = function() {
    this.timer && clearTimeout(this.timer);
    this.el.addClass("f-in").removeClass("f-out");
    $("body").append(this.el)
}
;
_p.close = function() {
    var a = this;
    a.el.addClass("f-out").removeClass("f-in");
    a.timer = setTimeout(function() {
        a.el.remove()
    }, 2E3)
}
;
function Tab(a) {
    var d = this;
    d.headers = a.find("li");
    var c = null;
    d.headers.each(function() {
        var a = $(this);
        $("#" + a.attr("data-tab")).hide();
        a.on("click", function() {
            d.activate(a)
        });
        a.is(".active") && (c = a)
    });
    null == c && (c = $(d.headers.get(0)));
    d.activate(c)
}
var _t = Tab.prototype;
_t.activate = function(a) {
    this.active && (this.active.removeClass("active"),
    $("#" + this.active.attr("data-tab")).hide());
    $("#" + a.attr("data-tab")).show();
    a.addClass("active");
    this.active = a
}
;
(function() {
    function a(a, c) {
        var d = new Image
          , e = a.getAttribute("data-src");
        d.onload = function() {
            a.parent ? a.parent.replaceChild(d, a) : a.src = e;
            c ? c() : null
        }
        ;
        d.src = e
    }
    function d(a) {
        a = a.getBoundingClientRect();
        return 0 <= a.top && 0 <= a.left && a.top <= (window.innerHeight || document.documentElement.clientHeight)
    }
    var c = []
      , e = function() {
        for (var e = [], l = 0; l < c.length; l++)
            d(c[l]) && (a(c[l]),
            e.push(c[l]));
        e.forEach(function(a) {
            a = c.indexOf(a);
            -1 < a && c.splice(a, 1)
        })
    };
    $(function() {
        $("img.lazy").each(function() {
            c.push(this)
        });
        e();
        window.addEventListener("scroll", e)
    })
}
)();
$(function() {
    var a = $('#search input[name="search"]');
    a.autocomplete({
        source: function(a, e) {
            var c = this;
            a ? $.ajax({
                url: "module/search_suggestion/ajax?keyword=" + encodeURIComponent(a),
                dataType: "json",
                success: function(a) {
                    var e = "";
                    a.forEach(function(a) {
                        e = "remainder_cnt" == a.type ? e + ('<li class="search-item remainder-count"><a href="' + a.href + '">' + a.label + "</a></li>") : e + ('<li class="search-item"><a href="' + a.href + '"><div class="image"><img src="' + a.thumb + '"></div><div class="name">' + a.label + '</div><div class="price">' + a.price + "</div></a></li>")
                    });
                    e ? c.show() : c.hide();
                    $(c).siblings("ul.dropdown-menu").html(e);
                    d.scrollTop(0)
                }
            }) : c.hide()
        },
        select: function(a) {}
    });
    var d = a.siblings("ul.dropdown-menu")
});
$(function() {
    function a(a) {
        var b = this;
        a.forEach(function(a) {
            var c = $(a.toggle);
            c.on("click", function() {
                c.hasClass("close") ? b.hide(a) : b.show(a)
            })
        })
    }
    function d(a) {
        var b = this;
        b.elm = a;
        b.slides = [];
        b.dots = [];
        var c = $("<div>", {
            "class": "slider-dot"
        });
        a.find(".mySlides").each(function(a, d) {
            d = $(d);
            b.slides[a] = d;
            var e = $("<span>", {
                "class": "dot"
            });
            c.append(e);
            b.dots[a] = e;
            d.hide();
            e.on("click", function() {
                b.showSlides(a)
            })
        });
        a.append(c);
        b.index = 0;
        b.showSlides(0)
    }
    function c(a) {
        var b = a.position
          , c = '<a href="' + a.url + '"><img src="' + a.image + '" alt="' + a.title + '" class="img-responsive"></a>';
        1 == b ? setTimeout(function() {
            var a = new Popup(c);
            a.render();
            localStorage.showed = n;
            setTimeout(function() {
                a.close()
            }, 14E3)
        }, 6E3) : $(".ads-pos-" + b).html(c)
    }
    var e = $("html")
      , k = $("body")
      , l = $(".overlay")
      , h = a.prototype;
    h.show = function(a) {
        this.active && this.hide(this.active);
        var b = $(a.target)
          , c = $(a.toggle);
        a.overlay && l.addClass("open");
        a.no_scroll && $("body").addClass("no-scroll");
        c.addClass("close");
        b.addClass("open");
        this.active = a
    }
    ;
    h.hide = function(a) {
        if (a = a || this.active) {
            var b = $(a.target);
            $(a.toggle).removeClass("close");
            b.removeClass("open");
            l.removeClass("open");
            $("body").removeClass("no-scroll");
            this.active = a
        }
    }
    ;
    var g = new a([{
        toggle: "#nav-toggler",
        target: "#main-nav",
        overlay: !0,
        no_scroll: !0
    }, {
        toggle: ".search-toggle",
        target: ".search-wrap"
    }, {
        toggle: ".cart-toggler",
        target: "#cart"
    }, {
        toggle: "#lc-toggle, .lc-close",
        target: "#column-left",
        overlay: !0,
        no_scroll: !0
    }]);
    l.on("click", function() {
        g.hide()
    });
    var q = $("#cart");
    $(document).on("click", function(a) {
        a = $(a.target);
        0 === q.has(a).size() && g.active && ".cart-toggler" === g.active.toggle && g.hide();
        a.data("dismiss") && a.parents("." + a.data("dismiss")).remove()
    });
    $(".has-child a").on("click", function(a) {
        $(this).parent().toggleClass("open");
        var b = $(a.target);
        (isMobile() && b.is(".has-child > a") || b.is(".responsive-menu > .has-child > a")) && a.preventDefault()
    });
    "" == $(".category-description").text() && $(".category-description").remove();
    window.addClearFix = function() {
        var a = $("#column-right, #column-left").size();
        2 == a ? $("#content .product-layout:nth-child(2n+2)").after('<div class="clearfix visible-md visible-sm"></div>') : 1 == a ? $("#content .product-layout:nth-child(3n+3)").after('<div class="clearfix visible-lg"></div>') : $("#content .product-layout:nth-child(4n+4)").after('<div class="clearfix"></div>')
    }
    ;
    addClearFix();
    var b = $("#list-view")
      , f = $("#grid-view");
    h = {
        list: function() {
            b.addClass("active");
            f.removeClass("active");
            $("#content .row > .product-layout").attr("class", "col-xs-12 col-md-12 product-layout list");
            localStorage.setItem("display", "list")
        },
        grid: function() {
            $(this).addClass("active");
            $("#list-view").removeClass("active");
            cols = $("#column-right, #column-left").size();
            2 == cols ? $("#content .product-layout").attr("class", "col-xs-12 col-md-6 product-layout grid") : 1 == cols ? $("#content .product-layout").attr("class", "col-xs-12 col-md-4 product-layout grid") : $("#content .product-layout").attr("class", "col-xs-12 col-md-3 product-layout grid");
            localStorage.setItem("display", "gird")
        }
    };
    b.on("click", h.list);
    f.on("click", h.grid);
    b.size() && "list" === localStorage.getItem("display") && h.list();
    d.prototype.showSlides = function(a) {
        this.timer && clearTimeout(this.timer);
        a >= this.slides.length && (a = 0);
        this.slides[this.index].hide();
        this.slides[a].show();
        this.dots[this.index].removeClass("active");
        this.dots[a].addClass("active");
        this.index = a;
        this.timer = setTimeout(this.showSlides.bind(this, ++a), 5E3)
    }
    ;
    $(".banner-slider").each(function() {
        new d($(this))
    });
    window.addEventListener("scroll", function() {
        165 < e.scrollTop() ? k.addClass("on-scroll") : k.removeClass("on-scroll")
    });
    $(".to-top").on("click", function(a) {
        a.preventDefault();
        $("html").scrollTo(0, 600)
    });
    var n = (new Date).getTime();
    h = localStorage.showed;
    var m = localStorage.lastVisited
      , p = [];
    h = parseInt(h);
    h = isNaN(h) ? null : h;
    m = parseInt(m);
    m = isNaN(m) ? null : m;
    var t = app.popupDuration ? app.popupDuration : 12;
    app.enablePopup && m && 36E4 > n - m && (!h || n - h > 36E5 * t) && p.push(1);
    $(".ads").each(function() {
        p.push($(this).attr("data-position"))
    });
    if (p.length) {
        var r = "device_type=" + (isMobile() ? 1 : 3);
        p.forEach(function(a) {
            r += "&ads_position[]=" + a
        });
        $.ajax({
            url: "api/ads",
            data: r,
            method: "post",
            dataType: "json",
            success: function(a) {
                a.forEach(function(a) {
                    c(a)
                });
                (a = a[1]) && a.image && c(a.image, a.title, a.url)
            }
        })
    }
    h = (new Date).getHours();
    9 <= h && 21 >= h && $(".svg-icon svg").show();
    localStorage.lastVisited = n
});
