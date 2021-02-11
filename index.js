/*Author : AL EMRAN
email:emrancu1@gmail.com
website:http://alemran.me
*/

export const SSLPayment = (function () {

// variable defining
  let cssPrepend = false;


  // set stylesheet as constants
  const cssContent = `
    <style>
        .payment-close-button{
            font-size: 18px;
            line-height: 1;
            color: #000;
            text-shadow: 0 1px 0 #fff;
            filter: alpha(opacity=20);
            opacity: .8;
            position: absolute;
            right: 10px;
            z-index: 999999;
            top: 9px;
            font-weight: 600;
            border-radius: 50%;
            border: 1px solid red;
            height: 25px;
            width: 25px;
            text-align: center;
            cursor: pointer;
        }
    
        .payment-modal-header{
            position: relative;
            padding-bottom: 35px;
        }
        .payment-modal-header > .payment-logo > .payment-logo-img{
            max-width: 90px;
        }
        .payment-modal-header > .payment-logo{
            position: absolute;
            top: -50px;
            left: 0;
            right: 0;
            z-index: 999;
            text-align: center;
        }
        .payment-modal-container.payment-active {
            opacity: 1;
            visibility: visible;
            z-index: 999;
            transition: all .6s;
        }
        .payment-modal-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: auto;
            display: flex;
            background: rgba(0,0,0,.5);
            justify-content: center; 
            padding-top: 100px;
            opacity: 0;
            visibility: hidden;
            z-index: -1;
            transition: all .6s;
        }
        .payment-modal-content{
            background-color: #fff;
        }
        .payment-modal-body{
            position: relative;
            flex-shrink: 0;
            margin-top: auto;
            margin-bottom: auto;
            width: 340px;
            border-radius: 6px;
            background: #fff;
            opacity: 1;
            cursor: auto;
            transition: transform .3s cubic-bezier(.175, .885, .32, 1.275);
        }
        .payment-modal-body > iframe{
            border: none;
            margin: 0;
            padding: 0;
            display: block;
            height: 570px;
            width: 340px;
            border-radius: 5px;
        }
    
        body.payment-modal-active{
            overflow-y: hidden !important;
        }
    </style>`;


  const paymentModalOpen = function () {
    $(".payment-modal-container").addClass('payment-active');
    $("body").addClass('payment-modal-active');
  };

  const paymentModalHide = function () {
    $(".payment-modal-container").removeClass('payment-active');
    $("body").removeClass('payment-modal-active');
    setTimeout(() => {
      $("body").find("#ssl-payment-modal").html('')
    }, 300)
  }



  const paymentModal = function (paymentURL, logo) {
    return `
	 <div class="payment-modal-container">
     <div class="payment-modal-content">
        <div class="payment-modal-header">
            <div class="payment-logo">
                <img src="${logo}" class="payment-logo-img" alt="">
            </div>
            <div class="payment-close-button"  >x</div>
        </div>
        <div class="payment-modal-body">
            <iframe src="${paymentURL}"  >
            </iframe>
        </div>
     </div>
     <div class="payment-modal-bg"></div>
     </div>`;
  }

  const modalEvent = function(){
    $('body').find("#ssl-payment-modal").on('click', ".payment-close-button", function(){
      paymentModalHide()
    })

    window.addEventListener("message", function(event){
      if(event.origin === 'https://sandbox.sslcommerz.com'){
        let data = JSON.parse(event.data);
        if(data.type == 'otp'){
          window.location.replace(data.url);
        }
      }
    });


  };

  let AddStylehtmlData = function () {
    $('body').prepend(cssContent);
    $('body').append('<div id="ssl-payment-modal"></div>') ;
    cssPrepend = true;
    setTimeout(()=>{
      modalEvent();
    }, 200)
  }


  const OpenModalWithRequest = function (url, data) {

    if (!cssPrepend) {
      AddStylehtmlData();
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {

        if (data.status === 'success' && data.data) {
          let paymentURL = data.data + '?full=1';
          let logo = data.logo
          let content = paymentModal(paymentURL, logo);
          $("body").find("#ssl-payment-modal").html(content)
          setTimeout(() => {
            paymentModalOpen()
          }, 100)
        } else {
          alert("Something went wrong")
        }

      })
      .catch((error) => {
        alert("Something went wrong")
      });

  }


  const openModal = function (paymentURL, logo) {

    if (!cssPrepend) {
      AddStylehtmlData();
    }

    let content = paymentModal(paymentURL + '?full=1', logo);
    $("body").find("#ssl-payment-modal").html(content);
    setTimeout(() => {
      paymentModalOpen()
    }, 100)


  }

  return {
    OpenModalWithRequest: function (url, data) {

      OpenModalWithRequest(url, data);

    },
    OpenModal: function (paymentURL, logo) {

      openModal(paymentURL, logo)

    }
  };

})();
