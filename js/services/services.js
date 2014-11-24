imtrade.factory('AuthService',function($http){
	var authservice={};
	authservice.login=function(cred){
		return $http.post(API_URL+':'+API_PORT+'/account/login.json',cred,header).
		success(function(response){
			return response;
		});
	}
	return authservice;
});

imtrade.factory('Login',function($resource){
	return $resource(API_URL+':port/account/login.json',{
		port:API_PORT },{
			log:{
				method:"POST",
				headers:{"Content-Type":"application/json"}
			}
		});
});

imtrade.factory('RecentNews',function($resource){
	return $resource(API_URL+':port/entity.json/news/simple?sort_by=created&api_key=:api_key',
		{
			port:':'+ API_PORT,api_key:'@api_key'
		},{
		update:{
			method:'PUT',
			headers:{"Content-Type":"application/json"}
		}
	});
});

imtrade.factory('RecentOrders',function($resource){
	return $resource(API_URL+':port/entity.json/order/simple?condition[uid]=:id&sort_by=created&sort_dir=DESC&api_key=:api_key',
		{	port:':'+API_PORT,id:'@id',api_key:'@api_key'},{
			update:{
				method:'PUT',
				headers:{"Content-Type":"aplication/json"}
			}
	});
});

imtrade.factory('UserOperation',function($resource){
	return $resource(API_URL+':port/entity.json/personal/profile2/:pid?api_key=:api_key',
		{port:':'+API_PORT, pid:'@pid', api_key:'@api_key'},{
			update:{
				method:'PUT',
				headers:{"Content-Type":"application/json"}
			}
		});
});

imtrade.factory('ListInvoice',function($resource){
	return $resource(API_URL+':port/entity.json/invoice/simple?condition[field_invoice_to].[target_id]=:uid&sort_by=created&sort_dir=DESC&&api_key=:api_key',
	{ port:':'+API_PORT,api_key:'@api_key', uid:'@uid' 	},{
		update:{
			method:'PUT',
			headers:{"Content-Type":"application/json"}
		}
	});
});

imtrade.factory('ListOrderItems',function($resource){
	return $resource(API_URL+':port/entity.json/order_item/simple?condition[field_order_reference].[target_id]=:orderId&api_key=:api_key',
		{ port:':'+API_PORT,orderId:'@orderId',api_key:'@api_key'});
});


imtrade.factory('Enquiry',function($resource){
	return $resource(API_URL+':port/entity.json/message/simple/:msgId?sort_by=changed&sort_dir=DESC&api_key=:api_key',
		{port:':'+API_PORT, msgId:'@msgId',api_key:'@api_key'});
});



imtrade.factory('EnquiryThread',function($resource){
	return $resource(API_URL+':port/entity.json/message/simple?condition[field_thread].[target_id]=:parentId&api_key=:api_key',
		{port:':'+API_PORT,api_key:'@api_key',parentId:'@parentId'});
});