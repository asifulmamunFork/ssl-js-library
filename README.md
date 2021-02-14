# Just Import JS.

<code> import {SSLPayment} from "path..../SSLPaymentModal";</code>


#For Request and Open Payment Modal:

SSLPayment.OpenModalWithRequest(this.$store.state.baseURL + 'payment-request/'+ this.$route.params.id + '/7' ,{});


#For custom request:  Open Payment Modal Only:

SSLPayment.OpenModal( payment_url_from_ssl , logo_url);
