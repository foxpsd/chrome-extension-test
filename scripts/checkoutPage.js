var adressList = $(".J_addressItem");
if(adressList.length){
	adressList.eq(0).click();
	setInterval(function(){
		var payBtn = $("#J_checkoutToPay");
		payBtn.trigger("click");
	},500);
}