/* global $, Stripe */
//Document ready function
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('form-submit-btn');
  
  //Set Stripe public key
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  //When user clicks form submit button
  submitBtn.click(function(event){
    //prevent default submission behavior
    event.preventDefault();
    submitBtn.val('Processing...').prop('disabled', true);
    
    //Collect credit card fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    //Use Stripe JS library to check for card errors
    var error = false;
    
    //Validate card number
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('Please re-enter a valid credit card number.');
    };
    
    //Validate CVC code
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('Please re-enter a valid security number (cvc).');
    };
    
    //Validate card expiration
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('Please re-enter a valid credit card expiration date.');
    };
    
    
    if(error) {
      //If there are card errors, don't send to Stripe
      submitBtn.prop('disabled, false').val("Sign Up")
    } else {
      //Send card info to stripe
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
        
      }, stripeResponseHandler);
    }
        
        
        return false;
  });
  
  //Stripe returns back card token
  function stripeResponseHandler(status, response) {
    var token = response.id;
    
    //Inject card token as hidden field into form
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token));
    
    //Submit form to rails app
    theForm.get(0).submit();
  };

});

