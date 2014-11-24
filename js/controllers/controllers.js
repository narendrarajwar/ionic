imtrade.controller('MainCtrl',function($scope,$window,$location,$rootScope,$ionicActionSheet,$timeout,$ionicModal){
	$rootScope.user=JSON.parse($window.localStorage.getItem('user'));
	$rootScope.allUsers=JSON.parse($window.localStorage.getItem('allusr'));
	$rootScope.isLogin=$window.localStorage.getItem('user');
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.loading=false;
	$scope.isReply=false;
	$scope.locationRedirect=function(url){
		$location.path(url);
	};
	$scope.endSession=function(){
		$window.localStorage.clear();
		$rootScope.user=[];
		$scope.errormsg = $scope.successmsg = false;
		$rootScope.isLogin=false;
		$scope.locationRedirect('login');
	};
	$scope.showMenu=function(){
		//alert('mneu');
		var hideSheet = $ionicActionSheet.show({
     	buttons: [
       	{ text: '<i class="ion-person-add"></i> Profile' }
     	],
     	cancelText: '<i class="ion-android-system-back"></i> Cancel',
     	destructiveText: '<i class="ion-power"></i> Logout',
     	titleText: '<h3>User Setting Menu</h3>',

        buttonClicked: function(index) {
        	if(index==0)
        	{
        		$scope.locationRedirect('app/profile');
        	}
      		return true;
   		},
   		destructiveButtonClicked:function(){
   			$scope.endSession();
   			return true; 
   		}
   		});
   		
	};




	$scope.AllOrders=[];
	$scope.productUnit=[
					{label:'Kg',value:1},
					{label:'Ltr',value:2},
					{label:'Mtr',value:3},
					];
	$scope.product=$scope.productUnit[0];


	$ionicModal.fromTemplateUrl('templates/add-order.html',
	{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.newOrder=modal;
	});

	$scope.openNewOrder=function(){
		$scope.newOrder.show();
	};

	$scope.closeAddOrder=function(){
		$scope.$on('modal.hidden', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.newOrder.hide();
	};

	$scope.saveNewOrder=function(newOrderForm){
		if(newOrderForm.$valid){
		$scope.newOrder = new RecentOrders();
		$scope.newOrder.$save(function(){
			$scope.successmsg='New Order has been saved successsfully';
		});

		}
		else{
			$scope.errormsg='Fields are required';
		}
	};
	
	$scope.addOrderTo=function(){
		if($scope.product.name && $scope.product.qty && $scope.product.unit.value){
		$scope.AllOrders.push({name:$scope.product.name,
							   quantity:$scope.product.qty,
							   unit:$scope.product.unit.value});
		}
		else{
			$scope.errormsg='please fill fields';
		}
	};

	$scope.remItem=function(index){
		$scope.AllOrders.splice(index,1)
	};


	$scope.setListEnquiry=function(listenquiry){
		$scope.listEnquiry=[];
		var len=listenquiry.length;
		for(var i=0;i<len;i++){
			if(listenquiry[i].uid === $rootScope.user.uid || listenquiry[i].field_to.target_id === $rootScope.user.uid){
				$scope.listEnquiry.push(listenquiry[i]);
			}
		}
		return $scope.listEnquiry;
	};

	
	$scope.setUserName=function(msgid){
		for(var i=0;i<$rootScope.allUsers.length;i++){
			if($rootScope.allUsers[i].uid === msgid){
				$scope.uname=$rootScope.allUsers[i].field_first_name+' '+$rootScope.allUsers[i].field_last_name;
				break;
			}
		}
		return $scope.uname;
	};


});

imtrade.controller('LoginCtrl',function($scope,$rootScope,$cookies,AuthService,$http,$window,$ionicModal,$location){
	if($window.localStorage.getItem('user') !== null){
		$scope.locationRedirect('home');
	}
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.credentials={};
	$scope.rememberme=true;
	$scope.credentials={
		username:$cookies.username?$cookies.username:'',
		password:$cookies.password?$cookies.password:''
	};

	$scope.setRememberme=function(){
		$scope.rememberme=!$scope.rememberme;
	}
	$scope.credentials.instance=instance;
	$scope.doLogin=function(logform){
		//alert('aa');
		$scope.loading=true;
		if($scope.rememberme){
			$cookies.username = $scope.credentials.username;
			$cookies.password = $scope.credentials.password;
		}
		else{
			$cookies.username='';
			$cookies.password='';
		}
		if(logform.$valid){
		
		AuthService.login($scope.credentials).success(function(data){
			
			$rootScope.user=data;
			$window.localStorage.setItem('user',JSON.stringify($rootScope.user));
			$rootScope.isLogin =true;
			//alert(JSON.stringify($rootScope.user));
			$scope.loading=false;
			$scope.locationRedirect('home');

		}).
		error(function(error){
			$scope.errormsg='Invalid username or password';
			$scope.loading=false;
		});
		}
		else{
			$scope.errormsg='Username or Password is incorrect';
			$scope.loading=false;
		}
	};

	$ionicModal.fromTemplateUrl('templates/forgot-password.html',
	{
		scope:$scope,
		animation:'slide-in-up',
	}).then(function(modal) {
	   	$scope.forgetPass = modal;
	});
	$scope.openForgetForm=function(){
		$scope.errormsg='';
		$scope.successmsg='';
		$scope.forgetPass.show();
	};

	$scope.makeReset=function(resetPass){
		$scope.errormsg='';
		$scope.successmsg='';
		if(resetPass.$valid){
			$scope.successmsg='Email successfully sent';
		}
		else{
			$scope.errormsg='invalid Email Address';
		}
	};
	

	$scope.closeForgot=function(){
		$scope.$on('modal.hidden', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.$on('modal.removed', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.forgetPass.hide();
		$scope.modal.remove();
	};




	$ionicModal.fromTemplateUrl('templates/new-account.html',
	{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal) {
	    $scope.newAccount = modal;

	});
	$scope.openNewAccountForm=function(){
		$scope.newAccount.show();
	};
	$scope.closeNewAccountForm=function(){
		$scope.$on('modal.hidden', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.$on('modal.removed', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.newAccount.hide();

	};
	$scope.doRegister=function(user){
		$scope.successmsg='';
		$scope.errormsg='';

		if(user.$valid){
			$scope.successmsg='Account Created';
			//$scope.newAccount.hide();
		}
		else{
			$scope.errormsg='fill out all fields';
		}
	};
	

	
});

imtrade.controller('HomeCtrl',function($scope,$rootScope,$window,$ionicActionSheet,$timeout,RecentNews,RecentOrders,UserOperation){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};
	$scope.loading1=true;
	$scope.loading2=true;
	$scope.errormsg=false;
	$scope.successmsg=false;
	$rootScope.allUsers=UserOperation.query({api_key:$rootScope.user.api_token});
	$rootScope.allUsers.$promise.then(function(){
		$window.localStorage.setItem('allusr',JSON.stringify($rootScope.allUsers));
	});	
	
	$scope.recentNews=RecentNews.query({api_key:$rootScope.user.api_token});
	$scope.recentNews.$promise.then(function(){
		$scope.loading1=false;
	});
	$scope.recentOrders=RecentOrders.query({api_key:$rootScope.user.api_token,id:$rootScope.user.uid});
	$scope.recentOrders.$promise.then(function(){
		$scope.loading2=false;
	});
	

	$scope.loadHome=function(){
		$rootScope.allUsers=UserOperation.query({api_key:$rootScope.user.api_token});
		$rootScope.allUsers.$promise.then(function(){
			$window.localStorage.setItem('allusr',JSON.stringify($rootScope.allUsers));
		});
		$scope.recentNews=RecentNews.query({api_key:$rootScope.user.api_token});
		$scope.recentNews.$promise.then(function(){
			$scope.loading1=false;
		});
		$scope.recentOrders=RecentOrders.query({api_key:$rootScope.user.api_token,id:$rootScope.user.uid});
		$scope.recentOrders.$promise.then(function(){
			$scope.loading2=false;
			$scope.$broadcast('scroll.refreshComplete');
		});
		
	};

	$scope.toggleGroup=function(order){

		if($scope.isGroupShown(order)){
			$scope.shownGroup=null
		}
		else{
			$scope.shownGroup=order;
		}
	};
	$scope.isGroupShown=function(order){
		return $scope.shownGroup === order;
	};
});


imtrade.controller('ProfileCtrl',function(UserOperation,$scope,$rootScope,$window,$location,$ionicModal,$timeout){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};
	$scope.edit={};
	$scope.edit.field_phone_mobile={};
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.userProf=UserOperation.get({api_key:$rootScope.user.api_token,pid:$rootScope.user.profile.pid});
	$scope.userProf.$promise.then(function(){
		$scope.edit={
				field_first_name:$scope.userProf.field_first_name,
				field_last_name:$scope.userProf.field_last_name,
				field_email:$scope.userProf.field_email
		};
		$scope.edit.field_phone_mobile.number=$scope.userProf.field_phone_mobile.number;
	});
	$scope.loadProfile=function(){
		$scope.userProf=UserOperation.get({api_key:$rootScope.user.api_token,pid:$rootScope.user.profile.pid});
		$scope.userProf.$promise.then(function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.edit={
				field_first_name:$scope.userProf.field_first_name,
				field_last_name:$scope.userProf.field_last_name,
				field_email:$scope.userProf.field_email
			};
			$scope.edit.field_phone_mobile.number=$scope.userProf.field_phone_mobile.number;	
		});		
	};
	
	$ionicModal.fromTemplateUrl('templates/edit-profile.html',
	{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.userUpdateForm=modal;
	});
	$scope.openEditProfile=function(){
		$scope.userUpdateForm.show();
	};
	
	$scope.doUpdate=function(updatefrm){
		//alert(JSON.stringify(updatefrm));
		$scope.successmsg='';
		$scope.errormsg='';
		if(updatefrm.$valid){
		$scope.pr=UserOperation.get({api_key:$rootScope.user.api_token,pid:$rootScope.user.profile.pid});
		$scope.pr.$promise.then(function(){
			alert(JSON.stringify($scope.pr));
		});
			$scope.successmsg="user info. updated successfully!";
		}
		else{
			$scope.errormsg="Please fill correct information";
		}
	}	

	$scope.closeEditProfile=function(){
		$scope.$on('modal.hidden', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.$on('modal.removed', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.userUpdateForm.hide();
	};
	
});


imtrade.controller('OrderCtrl',function($window,$scope,$rootScope,RecentOrders){

	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};
	$scope.loading=true;
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.orders=RecentOrders.query({api_key:$rootScope.user.api_token,id:$rootScope.user.uid});
	$scope.orders.$promise.then(function(){
		$scope.loading=false;
	});
	$scope.laodOrders=function(){
		$scope.orders=RecentOrders.query({api_key:$rootScope.user.api_token,id:$rootScope.user.uid});
		$scope.orders.$promise.then(function(){
			$scope.loading=false;
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
});

imtrade.controller('InvoiceHistoryCtrl',function($window,$scope,ListInvoice,$rootScope){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	}
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.invoices = ListInvoice.query({api_key:$rootScope.user.api_token,uid:$rootScope.user.uid});
	$scope.invoices.$promise.then(function(){
		//alert(JSON.stringify($scope.invoices));
	});
	$scope.loadInvoices=function(){
		$scope.invoices = ListInvoice.query({api_key:$rootScope.user.api_token,uid:$rootScope.user.uid});
		$scope.invoices.$promise.then(function(){
			//alert(JSON.stringify($scope.invoices));
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
});

imtrade.controller('OrderDetailCtrl',function($window,$rootScope,$scope,$stateParams,ListOrderItems){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};

	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.orderId=$stateParams.orderId;
	$scope.orders=ListOrderItems.query({api_key:$rootScope.user.api_token,orderId:$scope.orderId});
	$scope.orders.$promise.then(function(){
		$rootScope.accord=$scope.orders;
		//alert(JSON.stringify($scope.orders));
	})
});

imtrade.controller('EnquiryCtrl',function($window,$scope,$ionicModal,Enquiry,$rootScope){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};
	
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.allEnquiry=Enquiry.query({api_key:$rootScope.user.api_token});
	$scope.allEnquiry.$promise.then(function(){
		//alert(JSON.stringify($scope.allEnquiry));
		$scope.setListEnquiry($scope.allEnquiry);
	});
	$scope.loadEnquiry=function(){
		$scope.allEnquiry=Enquiry.query({api_key:$rootScope.user.api_token});
		$scope.allEnquiry.$promise.then(function(){
			//alert(JSON.stringify($scope.allEnquiry));
			$scope.setListEnquiry($scope.allEnquiry);		
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	
	$ionicModal.fromTemplateUrl('templates/new-enquiry.html',{
		scope:$scope,
		animation:'slide-in-up'
	}).then(function(modal){
		$scope.newEnquiry=modal;
	});

	$scope.openNewEnquiry=function(){
		$scope.newEnquiry.show();
	};

	$scope.closeNewEnquiry=function(){
		$scope.$on('modal.hidden', function() {
	   		$scope.successmsg=false;
			$scope.errormsg=false;
		});
		$scope.newEnquiry.hide();
	}

	

});

imtrade.controller('MsgFullModeCtrl',function($window,$scope,$rootScope,$stateParams,Enquiry,EnquiryThread,$ionicPopover){
	if($window.localStorage.getItem('user') == null){
		$scope.locationRedirect('login');
	};
	$scope.errormsg=false;
	$scope.successmsg=false;
	$scope.msgId=$stateParams.msgId;
	//alert($scope.msgId);
	$scope.singleMsg=Enquiry.get({msgId:$scope.msgId,api_key:$rootScope.user.api_token});
	$scope.singleMsg.$promise.then(function(){
		if($scope.singleMsg.field_thread!=null){
			$scope.msgId=$stateParams.msgId=$scope.singleMsg.field_thread.target_id;
			$scope.message=Enquiry.get({msgId:$scope.msgId,api_key:$rootScope.user.api_token});
			$scope.message.$promise.then(function(){
				$scope.threadMsg=EnquiryThread.query({parentId:$scope.message.id,api_key:$rootScope.user.api_token});	
			});
		}
		else
		{
			$scope.message=$scope.singleMsg;
		}
		
	});
	$scope.enqReply={};
	$scope.enqReply.field_thread={};
	$scope.enqReply.field_to={};

	/*$scope.enquiryReply=function(){
		$scope.isReply=!$scope.isReply?true:false;
		$scope.errormsg=false;
		$scope.successmsg=false;
	};*/

	$ionicPopover.fromTemplateUrl('templates/enquiry-reply.html',{
		scope:$scope,
	}).then(function(popover){
		$scope.replyMsgForm=popover;
	});
	$scope.openEnqRepPopUp=function($event){
		$scope.replyMsgForm.show($event);
	};
	$scope.closeEnqRepPopUp=function(){
		$scope.$on('popover.hidden', function() {
    		$scope.errormsg=$scope.successmsg='';
      	});
		$scope.replyMsgForm.hide();
	};

	
	$scope.sendEnquiry=function(replyFrm){	
		if(replyFrm.$valid){
			$scope.msgId=$stateParams.msgId;
			
			$scope.currentMgdId=Enquiry.get({api_key:$rootScope.user.api_token,msgId:$scope.msgId});
			$scope.currentMgdId.$promise.then(function(){
				$scope.enqReply.field_thread.target_id = $scope.currentMgdId.id;
				$scope.enqReply.field_to.target_id = 'Re: '+$scope.currentMgdId.uid;
				$scope.enqReply.field_subject=$scope.currentMgdId.field_subject;
				$scope.enqData=new Enquiry({api_key:$rootScope.user.api_token});
				$scope.enqData=$scope.enqReply;
				//$scope.enqData.$save(function(){
					$scope.successmsg='you replied';
					$scope.errormsg='';	
				//});
				alert(JSON.stringify($scope.enqData));
			});
		}
		else
		{
			$scope.errormsg='write something';
			$scope.successmsg='';
		}
	};
});

imtrade.controller('DelCtrl',function($scope,$rootScope,$ionicScrollDelegate,$ionicPopover){
	
	var delegate = $ionicScrollDelegate.$getByHandle('thisScroll');
	delegate.scrollToRememberedPosition();
	$scope.items = [];
  	for (var i=0; i<100; i++) {
    	$scope.items.push(i);
  	};

  	delegate.rememberScrollPosition();

  	
  	
  	
  	$scope.scrollTop=function(){
  		$ionicScrollDelegate.scrollBottom(true);
  	}
	$ionicPopover.fromTemplateUrl('my-popover.html', {
	    scope: $scope,
	  }).then(function(popover) {
	    $scope.popover = popover;
	  });
	  $scope.openPopover = function($event) {
	    $scope.popover.show($event);
	  };
	  $scope.closePopover = function() {
	    $scope.popover.hide();
	  };
});