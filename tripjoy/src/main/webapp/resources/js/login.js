Ext.onReady(function () {

	new Ext.Panel({
        renderTo: 'loginDeck',
        border: false,
        frame: false,
        baseCls: 'x-plain',
        margin: '0px',
        width: 'auto',
        //height: 840,
        defaults: {
            bodyStyle : 'background-color: #FFF'
        },
        style: 'background-color: #FFF;',
        items: [{
        	border: false,
        	html:'<header></header>'
        }, {
        	border: false,
        	html:'<div id="emailLabel">Tripjoy Account <a href="">What\'s this?</a></div>'
        }, {
        	id: 'emailId',
        	xtype: 'textfield',
        	name: 'title',
        	width : '90%',
        	emptyText : 'someone@example.com',
        	style : 'margin-top: -5px'
        }, {
        	id: 'password',
        	xtype: 'textfield',
        	inputType: 'password',
        	name: 'title',
        	width : '90%',
        	emptyText : ''
        }, {
        	id: 'rememberme',
        	xtype: 'checkbox',
        	fieldLabel: 'Keep me signed in',
        	name: 'rememberme',
        	labelSeparator: '',
            hideLabel: true,
            boxLabel: 'Keep me signed in',
            fieldLabel: 'Keep me signed in'
        }, {
        	id: 'submitButton',
        	xtype: 'button',
        	text: 'Sign in',
        	cls : 'button'
        }, {
        	id: 'facebookId',
        	border: false,
        	height: 36,
        	width: 210,
        	style: 'padding-left: 4px; margin-top: 20px;',
        	html: '<img src="resources/images/openid/facebook.png" alt="login with facebook" />'
        },{
        	id: 'forgotId',
        	border: false,
        	style: 'margin-top:30px;',
        	html: '<a href="">Can\'t access your account?</a>'
        },{
        	id: 'singleUseId',
        	border: false,
        	html: '<a href="">Sign in with a single-use code?</a>'
        },{
        	id: 'signpId',
        	border: false,
        	style: 'margin-top:70px;',
        	html: '<span><b>Don\'t have a Tripjoy Account? </b><a href="">Sign up now</a></span>'
        }]
    });

});