# Alternative library : SSL Commerz easy checkout  

# Current System of SSLcommerz
<code>
(function (window, document) {
	var loader = function () {
	    var script = document.createElement("script"), tag = document.getElementsByTagName("script")[0];
	    script.src = "https://sandbox.sslcommerz.com/embed.min.js?" + Math.random().toString(36).substring(7);
	    tag.parentNode.insertBefore(script, tag);
	};

	window.addEventListener ? window.addEventListener("load", loader, false) : window.attachEvent("onload", loader);
})(window, document);</code>

# New Solution

1. Just import Like: 
<code> import {SSLPayment} from "path..../SSLPaymentModal";</code>

2.Request to Your Endpoint with any event:
  #For Request and Open Payment Modal:
  function sslPay(){
    SSLPayment.OpenModalWithRequest( your Ednpoint URL ,{data});
  }

  #For custom request:  Open Payment Modal Only:
    Request to your endpoint with axios/ajax/fetch then call following functionif status is success:
   function sslPay(){
    SSLPayment.OpenModal( payment_url_from_ssl , logo_url);
    }
