/*!
 * jQuery Plugin: Guider v2.0.0
 * http://www.roydukkey.com/
 *
 * Copyright 2012 roydukkey, Attribution to Optimizely (optimizely.com).
 * Dual licensed under the MIT (http://www.roydukkey.com/mit) and GPL Version 2 (http://www.roydukkey.com/gpl) licenses.
 *
 * Date: 2012-03-06 (Tue, 6 March 2012)
 *
 * NOTE: Please report any improvements to guider@roydukkey.com.
 *       There are still many improvements that can me made to this
 *       script. Thanks to all in the open community.
 * 
 * Setting:
 *	{
 *		[name: <string>]?
 * 		[next: <string>]?
 * 		[className: <string>]?
 * 		[title: <string>]?
 * 		[description: <string>]?
 * 		[width: <number> | <string>]?
 * 		[overlay: <boolean> | "light" | "dark" |
 * 			{
 * 				[color: <string>]?
 * 				[opacity: <number> | <string>]?
 * 			}
 * 		]?
 * 		[position: "rightTop" | "right" | "rightBottom" | "bottomRight" | "bottom" | "bottomLeft" | "leftBottom" | "left" | "leftTop" | "topLeft" | "top" | "topRight"]?
 * 		[offset:
 * 			{
 * 				[top: <number>]?
 * 				[left: <number>]?
 * 			}
 * 		]?
 * 		[arrowSize: <number>]?
 * 		[closable: <boolean>]?
 * 		[draggable: <boolean>]?
 * 		[highlight: <boolean>]?
 * 		[hashable: <boolean>]?
 * 		[alignButtons: "left" | "center" | "right"]?
 * 		[buttons: [
 * 			{
 * 				[[ Close | Next | Back | <string> ]: [ <boolean> | <function> |
 * 					{
 * 						[className: <string>]?
 * 						[click: <boolean> | <function>]?
 * 						[disabled: <boolean>]?
 * 					}
 * 				]]?*
 * 			}
 * 		]]?
 * 		[onShow: <function>]?
 * 		[onHide: <function>]?
 * 	}
 */
(function($){
//--
// A: Internal Data and Defaults
	var q = {
		// Defaults Settings
		s: {
			title: "This is a very generic title.",
			description: "Did you forget a description?",
			width: 530,
			position: "rightTop",
			alignButtons: "left",
			overlay: false, 
			hashable: false,
			closable: false,
			draggable: true,
			arrowSize: 30
		},

		// Base HTML
		b: '<div class="jGuider" style="display:none;"><div class="jgContent"><div class="jgTitle" /><div class="jgNoDrag"><div class="jgClose" /><div class="jgDesc" /><div class="jgButtons" /></div></div><span class="jgArrow"><span /></span></div>',

		h: "guider=", // Hash Key
		g: [], // All Instantiated of Guiders
		c: 0, // Current Guider
		l: 0, // Last Guider

		o: false, // Omit Hiding Overlay
		z: $('<div id="jgOverlay" />'), // Overlay HTML

		e: 10, // = arrow's error width and height
		
		p: "topLeft,top,topRight,rightTop,right,rightBottom,bottomRight,bottom,bottomLeft,leftBottom,left,leftTop".split(","), // Position Options

		// Get guider by name
		n: function( name ){
			if( q.g[name] == undefined ) throw "Guider " + p.version + ": Cannot find guider with name '" + name + "'";
			return q.g[name];
		},
		// Causes element to appear above overlay
		i: function( g ){
			g.clone().css({
				width: g.width(),
				height: g.height(),
				margin: 0,
				position: "absolute",
				top: g.offset().top,
				left: g.offset().left
			}).addClass("jGuiderHighlight").appendTo("body")
			g.addClass("jGuiderHidden")
		},
		d: function( g ){
			g.removeClass("jGuiderHidden")
			$(".jGuiderHighlight").remove();
		}
	},
// A: End
//--
//--
// B: Main Pluging Function
	p = ($.guider = function(s){
		
		var h // Url Hash
			, i = 0 // for Iterator
			, b // Buttons
			, g = $.extend(true, {}, q.s, s) // Extend those settings with s

		// Ensure Correct Values
		if(g.name == "length") throw "Guider " + p.version + ": Guider names must !== 'length'.";
		
		g.position = (g.position = ((function(){
			for (; i < q.p.length; i++) if(q.p[i].toLowerCase() == g.position.toLowerCase()) return q.p[i];
		})() || q.s.position)).replace(/(.*)[A-Z].*/, "$1," + g.position).split(",")

		if(g.alignButtons != "left" && g.alignButtons != "center" && g.alignButtons != "right") g.alignButtons = "left";

		// Button Container and Configure g.e
		b = (g.e = $(q.b))
			.attr("id", "jGuider_" + (g.name || q.g.length))
			.addClass(g.className)
			.css("width", g.width)
			.find(".jgTitle")
				.html(g.title)
				.end()
			.find(".jgDesc")
				.html(g.description)
				.end()
			// Add Close Button
			.find(".jgClose")
				.toggleClass("active", !!g.closable)
				.click(p.hideAll)
				.end()
			.find(".jgButtons").addClass("jgAlign" + g.alignButtons.substr(0, 1).toUpperCase() + g.alignButtons.substr(1));

		g.e.draggable && !!g.draggable && (g.attachTo == undefined || g.attachTo.length == 0) && g.e.draggable({ cancel: ".jgNoDrag" })

		// Add Buttons
		for( i in g.buttons )
			b.append(
				$('<button>' + i + '</button>').addClass(g.buttons[i].className).attr("disabled", !!g.buttons[i].disabled)
					.click({
						guider: $.isFunction(g.buttons[i]) ? g.buttons[i] : $.isFunction(g.buttons[i].click) ? g.buttons[i].click : -1
					},
						typeof g.buttons[i] == "boolean" || typeof g.buttons[i].click == "boolean" ?
							i.toLowerCase() == "close" &&
								p.hideAll
							|| i.toLowerCase() == "next" &&
								p.next
							|| i.toLowerCase() == "back" &&
								p.prev
						:
							function(e){ return ~e.data.guider && e.data.guider.call(g.e, e) }
					)
			)

		// Add to list of guiders
		q.g[ q.l = g.name || q.g.length || 0 ] = g;
    
		// If the URL of the current window is of the form http://www.myurl.com/mypage.html#guider=id then show this guider.
		g.hashable &&
			~(h = window.location.hash.indexOf(q.h)) &&
				g.name.toLowerCase() == window.location.hash.substr(h + q.h.length).toLowerCase() &&
					p.show(g.name);

		return p;
	})
// B: End
//--
//--
// C: External Data and Functions
	$.each({
		version: "2.0.0",

		next: function(){ var c = q.g[q.c], n
			
			if( typeof c == undefined ) return false
			n = c.next || null

			if( n !== null && n !== "" ){
				
				q.o = !!q.n(n).overlay
				p.hideAll(true);

				c.highlight && q.d(c.attachTo);

				p.show(n);
			}
			return true
		},
		
		hideAll: function(){ var g; // Where is Next Guider
			
			$(".jGuider").filter(":visible").each(function(i, e){
				g = q.n($(e).attr("id").replace("jGuider_", ""))
				g.onHide && g.onHide.call(g)
			}).end()
				.remove()
			
			g = q.g[q.c]
			g.highlight && q.d(g.attachTo)

			// Hide Overlay
			!q.o && q.z.remove()
			q.o = !q.o

			return p;
		},

		// n = name
		show: function(n){var g = q.n(n = n || q.l), h, w, b, t, l;
			
			if( g.overlay ){
				$("#jgOverlay").length === 0 && q.z.appendTo("body");

				q.z
					.toggleClass("jgLight", g.overlay == "light" || g.overlay === true)
					.toggleClass("jgDark", g.overlay == "dark")

					g.overlay.color != undefined ? q.z.css("backgroundColor", g.overlay.color) : q.z[0].style.removeProperty ? q.z[0].style.removeProperty("background-color") : q.z[0].style.removeAttribute("backgroundColor");
					g.overlay.opacity != undefined ? q.z.css("opacity", g.overlay.opacity) : q.z[0].style.removeProperty ? q.z[0].style.removeProperty("opacity") : q.z[0].style.removeAttribute("filter");

				// if guider is attached to an element, make sure it's visible
				g.highlight && q.i(g.attachTo);
			}
			
			g.e.appendTo("body")
  
			// You can use an onShow function to take some action before the guider is shown.
			g.onShow && g.onShow(g);
			
			h = g.e.innerHeight()
			w = g.e.innerWidth()

			// Not Attached
			if( g.attachTo == undefined || g.attachTo.length == 0 ){
				t = ($(window).height() - h) / 3 + $(window).scrollTop()
				l = ($(window).width() - w) / 2 + $(window).scrollLeft()
			}
			// Attached
			else {

				// Style Arrow
				var arrow = g.e.find(".jgArrow")
					.addClass("jg-" + g.position[g.position.length-1])

				switch (g.position[0]) {
					case "top":
						arrow.find("span").add(arrow)
							.css("borderWidth", g.arrowSize + "px " + g.arrowSize + "px 0 " + g.arrowSize + "px").end()
							.css("left", -g.arrowSize)
						break
					case "right":
						arrow.find("span").add(arrow)
							.css("borderWidth", g.arrowSize + "px " + g.arrowSize + "px " + g.arrowSize + "px 0").end()
							.css("top", -g.arrowSize)
						break
					case "bottom":
						arrow.find("span").add(arrow)
							.css("borderWidth", "0 " + g.arrowSize + "px " + g.arrowSize + "px " + g.arrowSize + "px").end()
							.css("left", -g.arrowSize)
						break
					//case "left":
					default:
						arrow.find("span").add(arrow)
							.css("borderWidth", g.arrowSize + "px 0 " + g.arrowSize + "px " + g.arrowSize + "px").end()
							.css("top", -g.arrowSize)
						break
				}

				b = g.attachTo.offset();
				t = b.top;
				l = b.left;

				switch (g.position[g.position.length-1]) {
					case "top":
					case "bottom":
						arrow.css("marginLeft", -g.arrowSize)
						l += (g.attachTo.innerWidth() - w)/2;
						break
					case "right":
					case "left":
						arrow.css("marginTop", -g.arrowSize)
						t += (g.attachTo.innerHeight() - h)/2;
						break
					case "rightTop":
					case "leftTop":
						arrow.css("top", g.arrowSize / 1.5)
						break
					case "topRight":
					case "bottomRight":
						arrow.css("right", g.arrowSize / 1.5)
						l += g.attachTo.innerWidth() - w;
						break
					case "rightBottom":
					case "leftBottom":
						arrow.css("bottom", g.arrowSize / 1.5)
						t += g.attachTo.innerHeight() - h;
						break
					/*case "topLeft":
					case "bottomLeft":*/
					default:
						arrow.css("left", g.arrowSize / 1.5)
						break
				}

				switch (g.position[g.position.length-1]) {
					case "top":
					case "topRight":
					case "topLeft":
						t += - q.e - g.arrowSize - h;
						break
					case "right":
					case "rightTop":
					case "rightBottom":
						l += q.e + g.arrowSize + g.attachTo.innerWidth();
						break
					case "bottom":
					case "bottomRight":
					case "bottomLeft":
						t += q.e + g.arrowSize + g.attachTo.innerHeight();
						break
					/*case "left":
					case "leftTop":
					case "leftBottom":*/
					default:
						l += - q.e + (-w) - g.arrowSize;
						break
				}
    
				if( g.offset != undefined ){
					t += ~~g.offset.top;
					l += ~~g.offset.left;
				}

			}
    
			g.e.css({
				position: g.attachTo ? "absolute" : "fixed",
				top: t,
				left: l,
				display: "block"
			});
  
			// Scroll to Guider if bound viewable area
			window.scrollTo(
				(
					b = g.e.offset()
				).left - (
					w = $(window).scrollLeft()
				) < 0 || b.left + (
					t = g.e.width()
				) > w + (
					h = $(window).width()
				)
					? Math.max(b.left + (t - h) / 2, 0)
					: w
				,
				b.top - (
					w = $(window).scrollTop()
				) < 0 || b.top + (
					t = g.e.height()
				) > w + (
					h = $(window).height()
				)
					? Math.max(b.top + (t - h) / 2, 0)
					: w
			);
			
			q.c = n;

			return p;
		}

	}, function(k, v){p[k] = v});
// C: End
//--
//--
// D: Selectable Plugin Function
	$.fn.guider = function(s){
		s.attachTo = this.eq(0)
		p(s)
		return this;
	}
// D: End
//--
})(jQuery);