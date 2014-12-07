function cover_image(val) {
    return '<img src="' + val + '" height="64px" width="80px" />';
}

Ext.onReady(function () {
	
	var printToConsole = function (message) {
	    if (typeof window.console !== 'undefined') {
	        window.console.log(message);
	    } else if (typeof console === 'undefined') {
	        var console = {
	            log: function () {}
	        };
	        console.log(message);
	    }
	};

    var countryStore = new Ext.data.JsonStore({
        autoDestroy: true,
        autoLoad: true,
        storeId: 'countryStore',
        proxy: {
            type: 'ajax',
            url: 'welcome/getCountry',
            reader: {
                type: 'json',
                root: 'result',
                idProperty: 'id'
            }
        },
        fields: ['id', 'countryName']
    });
    
    countryStore.on('load', function (store) {
        Ext.getCmp('countryComboId').setValue(countryStore.getAt('0').get('id'));
    });
    
    var subcatagoryTeeStore = null; 
    var reloadCounryDetails = function (combo, newValue){
    	Ext.getCmp('subCatagoryTreePanelId').getEl().mask();
    	Ext.Ajax.request({
             url: 'welcome/getCountryDetails',
             method: 'GET',
             params: {
            	 countryId: newValue
             },
             success: function (response) {
            	 var data = Ext.decode(response.responseText).result;
                 var countryDetailData = data.countryDetailsTreeDtos;
                 var mapImage = data.mapImage;
                 subcatagoryTeeStore = Ext.create('Ext.data.TreeStore', {
                     root: {
                         expanded: true,
                         children: countryDetailData
                     }});
                 Ext.getCmp('subCatagoryTreePanelId').reconfigure(subcatagoryTeeStore);
                 
                 document.getElementById('countryMapId').style.backgroundImage = "url(resources/images/map/"+mapImage+")";
                 document.getElementById('countryMapId').style.height = data.height + "px";
                 document.getElementById('countryMapId').style.weight = data.width + "px";
                 Ext.getCmp('subCatagoryTreePanelId').getEl().unmask();
             },
             failure: function (response) {
                 printToConsole(Ext.decode(response.responseText));
                 Ext.Msg.show({
                     title: 'Oops! Error',
                     msg: 'Connection to the server failed. Try again or contact helpdesk.',
                     buttons: Ext.Msg.OK,
                     icon: Ext.Msg.ERROR
                 });
                 Ext.getCmp('subCatagoryTreePanelId').getEl().unmask();
             }
         });		
    };

    /** ------------------------ SAMPLE DATA ------------------------------ **/

    Ext.define('People', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'name',
            type: 'string'
        }, {
            name: 'activity',
            type: 'string'
        }, {
            name: 'image',
            type: 'string'
        }]
    });

    var store = Ext.create('Ext.data.ArrayStore', {
        model: 'People',
        data: [
            ['EMMA THOMPSON', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/emma.png'],
            ['DAVID HUDSON', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/david.png'],
            ['LISA LIAM', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/lisa.png'],
            ['LISA LIAM', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/lisa.png'],
            ['EMMA THOMPSON', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/emma.png'],
            ['DAVID HUDSON', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/david.png'],
            ['LISA LIAM', Math.floor((Math.random() * 100) + 1) + ' minutes ago', 'resources/images/people/lisa.png']
        ]
    });

    /** ------------------------------------------------------------------ **/
    var deckPanelTop = Ext.create('ExtMVC.view.portal.PortletPanel', {
        id: 'portalTop',
        region: 'center',
        margins: '35 5 0 0',
        border: false
    });

    /** ------------------------------------------------------------------ **/
    var grid = Ext.create('Ext.grid.Panel', {
        id: 'peopleGrid',
        store: store,
        border: false,
        width: '97%',
        height: 360,
        hideHeaders: true,
        headerPosition: 'bottom',
        bodyStyle: {
            background: '#ffc'
        },
        scroll: 'vertical',
        selModel: Ext.create('Ext.selection.RowModel'),
        columns: [{
            text: 'image',
            dataIndex: 'image',
            renderer: cover_image,
            width: 100
        }, {
            text: 'name',
            flex: 1,
            xtype: 'templatecolumn',
            tpl: '<div class="peopleName"><b>{name}</b></div><br />' +
                '<div class="peopleActivity"><b>New Post</b>&nbsp;<span><i>{activity}</i></span></div>'
        }]
    });

    /** ------------------------------------------------------------------ **/

    var panel1 = Ext
        .create(
            'Ext.panel.Panel', {
                width: 180,
                padding: '0px',
                margin: '0px',
                border: false,
                //flex: 1,
                items: [{
                    xtype: 'combo',
                    baseCls: 'x-plain',
                    frame: false,
                    border: false,
                    id: 'countryComboId',
                    //mode: 'local',
                    store: countryStore,
                    displayField: 'countryName',
                    valueField: 'id',
                    autoSelect: true,
                    autoShow: true,
                    triggerAction: 'all',
                    forceSelection: true,
                    listeners: {
                    	change: function (combo, newValue, oldValue, eOpts ) {
                    		reloadCounryDetails(combo, newValue);
                    	} 
                    }
                }, {
                    height: 10,
                    border: 0,
                    border: false
                }, {
                    xtype: 'treepanel',
                    id: 'subCatagoryTreePanelId',
                    width: 150,
                    height: 210,
                    store: null,
                    rootVisible: false,
                    lines: false,
                    border: false,
                    autoScroll: true,
                    scroll: 'vertical'
                }, {
                    height: 10,
                    border: 0,
                    border: false
                }, {
                    height: 300,
                    width: 180,
                    html: '<div id="countryMapId" style="background-image: url(resources/images/map/Italy.png); height:259px; width:180px;" />',
                    border: false
                }]
            });

    var panel2 = Ext.create('Ext.panel.Panel', {
        border: false,
        padding: '0 0 0 0',
        flex: 1,
        width: 420,
        height: 'auto',
        items: [{
        	border: false,
        	html: '<img src="resources/images/tiles/main_tiles.png" height="112px" width="445px" />',
        	width: 445,
        	height: 130
        },deckPanelTop]
    });

    var panel3 = Ext
        .create(
            'Ext.panel.Panel', {
                //flex: 2,
            	width: 350,
                border: false,
                items: [{
                        border: false,
                        height: 20,
                        width: 'auto',
                        html: '<span class="labelText">DESTINATION</span>'
                    }, {
                        height: 5,
                        border: false
                    }, {
                        xtype: 'textfield',
                        id: 'destinationTextFieldId',
                        border: false,
                        height: 40,
                        width: '97%',
                        emptyText: 'Search a place to check out'
                    }, {
                        height: 0,
                        border: false
                    }, {
                        border: false,
                        height: 20,
                        width: '97%',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                            border: false,
                            height: 20,
                            width: 'auto',
                            html: '<span class="labelText">DEPART DATE</span>'
                        }, {
                            border: false,
                            height: 5,
                            width: 'auto',
                            flex: 1
                        }, {
                            border: false,
                            height: 20,
                            width: 'auto',
                            html: '<span class="labelText">RETURN DATE</span>'
                        }]
                    }, {
                        border: false,
                        width: '97%',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'datefield',
                            id: 'departFromDateFieldId',
                            flex: 3
                        }, {
                            border: false,
                            height: 5,
                            flex: 1
                        }, {
                            xtype: 'datefield',
                            flex: 3
                        }]
                    }, {
                        border: false,
                        height: 5,
                        width: 'auto',
                        flex: 1
                    }, {
                        border: false,
                        height: 60,
                        width: '97%',
                        html: '<div id="createATripLabel"><button id="creatTripButton"><img src="resources/images/plus.png" /></button><span>CREATE A TRIP!</span></div>'
                    }, {
                        border: false,
                        height: 5,
                        width: 'auto',
                        flex: 1
                    }, {
                        border: false,
                        height: 55,
                        width: '97%',
                        html: '<div id="connectAndMeetText"><div>PEOPLE IN GREECE</div><span>CONECT AND MEET</span></div>'
                    },
                    grid
                ]
            });

    new Ext.Panel({
        renderTo: 'extComponentId',
        border: false,
        frame: false,
        baseCls: 'x-plain',
        margin: '0px',
        width: 'auto',
        height: 840,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            // bodyStyle : 'padding:15px'
        },
        items: [panel1, panel2, panel3]
    });

    //$(document).ready(function() { $(document).ready(function() {
    //$(".x-grid-body").customScrollbar(); }); });

    /*var createCardPanel = function (src, width){
				 if(width == null)
					 width = '100%';
				 return Ext.create('ExtMVC.view.app.Portlet', {
			            style: 'padding-bottom: 10px',
			            html: 'ABC',
			            height: 270,
			            width: width,
			            boxMinHeight: 0});
			};

			function populateDefinitions(exportDataList) {
				mainPanel.doLayout();
		        mainPanel.render();
		        var downloadDataList = ['1', '2', '3', '4', '5', '6', '7'];
		        for (var index = 0; index < downloadDataList.length; index++) {
		            if (index == 0)
		                Ext.getCmp('firstHalfDeckOfTop').add(createCardPanel(downloadDataList[index], '100%'));
		            else
		            	Ext.getCmp('firstHalfDeckOfTop').add(createCardPanel(downloadDataList[index], null));
		        }
		        mainPanel.doLayout();
		        mainPanel.render();
		    }*/

});