Guider.js (version 2.0.3)
==========================

Guider is a user experience design pattern for introducing users to a web application. Guider was built to model the way guides have been implemented at Google.

Demo
-------

You can also check out `README.htm` for guiders in action!

[http://www.roydukkey.com/guider/](http://www.roydukkey.com/guider/)


Setup
--------

Here is sample code for initializing a couple of guiders. Guiders are hidden when created, unless `.show()` is method chained immediately after `$.guider`. Also note that `$("#hoawrd").guider` is a guider attachment. Because this call returns a jQuery selection, chaining `.show()` here will invoke the jQuery show method.

~~~ javascript
$.guider({
  next: "second",
  title: "Welcome to Guiders.js!",
  description: "Guider are a user interface design pattern for introducing features of software. This dialog box, for example, is the first in a series of guiders that together make up a guide.",
  overlay: true,
  buttons: {
		Next: true
	}
}).show();
/* .show() means that this guider will get shown immediately after creation. */

$("#howard").guider({
	name: "second",
	next: "third",
	title: "Guiders are typically attached to an element on the page.",
	description: "<p>For example, this guider is attached to Howard. The Guider.js API uses a two-key positional model to determine where the guider should be placed.</p>\
	Attaching a guider to an element focuses the user on the area of interest.",
	width: 600,
	position: "top",
	alignButtons: "right",
	closable: true,
	buttons: {
		Close: true,
		Next: {
			click: true,
			className: "primary"
		}
	}
});
~~~

The parameters for creating guiders are:

~~~
{
	[name: <string>]?
	[next: <string>]?
	[className: <string>]?
	[title: <string>]?
	[description: <string>]?
	[width: <number> | <string>]?
	[overlay: <boolean> | "light" | "dark" |
		{
			[color: <string>]?
			[opacity: <number> | <string>]?
		}
	]?
	[position: "rightTop" | "right" | "rightBottom" | "bottomRight" | "bottom" | "bottomLeft" | "leftBottom" | "left" | "leftTop" | "topLeft" | "top" | "topRight"]?
	[offset:
		{
			[top: <number>]?
			[left: <number>]?
		}
	]?
	[arrowSize: <number>]?
	[closable: <boolean>]?
	[draggable: <boolean>]?
	[highlight: <boolean>]?
	[hashable: <boolean>]?
	[alignButtons: "left" | "center" | "right"]?
	[buttons: [
		{
			[
				[ Close | Next | Back ]: [ <boolean> | <function> |
					{
						[className: <string>]?
						[click: <boolean> | <function>]?
						[disabled: <boolean>]?
					}
				]
			|
				<string> : [ <function> |
					{
						[className: <string>]?
						[click: <boolean> | <function>]?
						[disabled: <boolean>]?
					}
				]
			]*
		}
	]]?
	[onShow: <function>]?
	[onHide: <function>]?
}
~~~


Support
-----------
**Required**

* jQuery (developed on 1.7.1)
* Browsers Chrome 1+, Firefox 3.5+, Internet Explorer 7+, Opera (untested), Safari 5.1+

**Optional**

* jQuery UI Draggable (developed on 1.8.18)


Integration
--------------

Besides creating guiders, here is sample code you can use in your application to work with guiders:

~~~ javascript
$.guider.show(name); // shows the guider, given the name used at creation
$.guider.hideAll(); // hides all guiders
$.guider.next(); // hides the last shown guider, if shown, and advances to the next guider
$.guider.prev(); // hides the last shown guider, if shown, and advances to the previous guider
~~~

You'll likely want to change the default values, such as the width (set to 530px). These can be found at the top of `guider.js`. You'll also want to modify the css file to match your application's branding.

Lastly, if the URL of the current window is of the form `http://www.myurl.com/mypage.html#guider=foo`, then the guider with name equal to `foo` and the 'hashable' setting enable, will be shown automatically.


Future Features
-------------

* __Option Transformation:__ Provide methods to get and set options on specific guider are its initialisation.
* __Better Event Handling:__ Will provide more precise events and bindable events.
* __Auto Focus Default Button:__ This will allow users to set a default button that will be given focus once the guider is shown.
* __Add Fading on Show and Hide:__ I will give options to set an individual guider to fade in and out.
* __Scroll into View:__ Add Option to enable/disable scrolling shown guider into view.
* __Improved Mobile Support:__ Testers welcome. 


In Closing
-------------

Guider is a great way to improve the user experience of your web application.

If you have questions about Guider, email me at `guider@roydukkey.com`.


License
----------

Dual licensed under the MIT (http://www.roydukkey.com/mit) and GPL (http://www.roydukkey.com/gpl) licenses.