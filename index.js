/*Author : AL EMRAN
email:emrancu1@gmail.com
website:http://alemran.me
*/

export const SSLPayment = (function () {

// variable defining
  let cssPrepend = false;


  // set stylesheet as constants
  const cssContent = `
    .payment-close-button{
            font-size: 18px;
            line-height: 20px;
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
          background: white;
          margin-bottom: -10px;
        }
        .payment-modal-header > .payment-logo > .payment-logo-img{
            max-height: 60px !important;
        }
        .payment-modal-header > .payment-logo{
            position: absolute;
            top: 10px; 
            z-index: 999;
            text-align: center; 
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            left: 100px;
            right: 100px;
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
            background-color: transparent;
        }
        .payment-modal-body{
            position: relative;
            flex-shrink: 0;
            margin-top: auto;
            margin-bottom: auto;
            width: 340px;
            border-radius: 6px; 
            opacity: 1;
            cursor: auto;
            transition: transform .3s cubic-bezier(.175, .885, .32, 1.275);
            padding-bottom: 100px;
            background-color: transparent;
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
     `;


  const paymentModalOpen = function () {
    document.querySelector('#ssl-payment-modal .payment-modal-container').classList.add('payment-active');
    document.querySelector('body').classList.add('payment-modal-active');
  };

  const paymentModalHide = function () {
    document.querySelector('#ssl-payment-modal .payment-modal-container').classList.remove('payment-active');
    document.querySelector('body').classList.remove('payment-modal-active');
    setTimeout(() => {
      document.querySelector("#ssl-payment-modal").innerHTML = '';
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

  const modalEvent = function () {

    document.querySelector("#ssl-payment-modal").addEventListener("click", function (event) {
      event.stopPropagation();
      if (event.target.classList.contains('payment-close-button')) {
        paymentModalHide()
      }
    }, false);

    window.addEventListener("message", function (event) {

      if (event.origin === 'https://sandbox.sslcommerz.com' || event.origin === 'https://epay.sslcommerz.com') {
        let data = JSON.parse(event.data);
        if (data.type == 'otp' || data.type == 'gw_redirect') {
          window.location.replace(data.url);
        }

        if (data.type == 'resize') {
          document.querySelector("#ssl-payment-modal .payment-modal-body iframe").style.height = (parseFloat(data.height) + 5) + 'px'
        }
      }
    });


  };

  let AddStylehtmlData = function () {
    let body = document.querySelector('body');
    let style = document.createElement('style');
    style.innerHTML = cssContent;
    body.parentNode.insertBefore(style, body);

    let paymentModal =  document.createElement('div');
    paymentModal.id = "ssl-payment-modal";
    body.append(paymentModal);
    cssPrepend = true;
    setTimeout(() => {
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
          document.querySelector("#ssl-payment-modal").innerHTML = content;
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
    document.querySelector("#ssl-payment-modal").innerHTML = content;
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
