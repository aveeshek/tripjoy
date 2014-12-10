Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

var statPanel = null; var graphChart = null; var store5 = null;

var placesArray = new Array();
var nameArray = new Array();
var peopleCounter = 1;

function getRandomColor() {
    var letters = '99999CCCCCFFFFF9'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function cover_image(val) {
    return '<img src="' + val + '" height="64px" width="80px" />';
}

function createATripFunctionDown () {
	Ext.Msg.alert('Trip Status', 'Your trip is created successfully');
	document.getElementById("createATripLabel").style.backgroundColor = "#63D8E1";
	statPanel.show();
};

function createATripFunctionUp () {
	document.getElementById("createATripLabel").style.backgroundColor = "#63B8E1";
};

function addTripDestinations () {
	if (Ext.getCmp(Ext.getCmp('destinationTextFieldId').getRawValue()) != null 
			|| Ext.getCmp(Ext.getCmp('destinationTextFieldId').getRawValue()) != undefined) {
		Ext.Msg.alert('Trip Status', 'Your trip was aleady planned.');
	}
	Ext.getCmp('destinationStackId').add({
		id: Ext.getCmp('destinationTextFieldId').getRawValue(),
        border: false,
        autoHeight: true,
        autoWidth: true,
        collapsible: true,
        collapsed: true,
        titleCollapse: true,
        collapseFirst: true,
        closable: true,
        closeAction: 'destroy',
        title: Ext.getCmp('destinationTextFieldId').getRawValue(),
        padding: 0,
        listeners: {
            close: function (panel, eOptsx) {
                var temp = new Array();
                for(var i = 0, j = 0; i < placesArray.length; i++) {
                	if (placesArray[i] !== panel.getId())
                		temp[j++] = placesArray[i];
                }
                placesArray = temp;
                nameArray = temp;
                reCalculateTheGraphChart ();
            }
        }
    });
	document.getElementById(Ext.getCmp('destinationTextFieldId').getRawValue()+"_header").style.backgroundColor = getRandomColor ();
	var length = placesArray.length;
	placesArray[length] = Ext.getCmp('destinationTextFieldId').getRawValue();
	nameArray[length] = Ext.getCmp('destinationTextFieldId').getRawValue();
	reCalculateTheGraphChart ();
};

function reCalculateTheGraphChart () {
	if (Ext.getCmp('graphChart') != null || Ext.getCmp('graphChart') != undefined) {
		Ext.getCmp('graphChart').destroy();
	}
	store5.loadData(generateData(placesArray.length));
	var seriesData = [];
	for (var i = 0; i < peopleCounter; i++) {
		seriesData[i] = {
				type: 'radar',
				xField: 'name',
				yField: 'data' + Math.floor((Math.random() * 3) + 1),
				style: {
					opacity: 0.4
				}
		};
	}
	Ext.getCmp('graphChartPanel').add(new Ext.chart.Chart({
    	id: 'graphChart',
        width: 670,
        height: 480,
        animate: true,
        store: store5,
        insetPadding: 30,
        theme: 'Category2',
        showMarkers: true,
        showInLegend: true,
        legend: true,
        axes: [{
            type: 'Radial',
            position: 'radial',
            label: {
                display: true
            },
            grid: {
                odd: {
                    opacity: 1,
                    fill: '#ddd',
                    stroke: '#bbb',
                    'stroke-width': 1
                }
            }
        }],
        series: seriesData
	}));
	// open the deals
	if(peopleCounter == 2) {
		Ext.getCmp('portlet-0').enable( );
	} else if(peopleCounter == 3) {
		Ext.getCmp('portlet-3').enable( );
	} else if(peopleCounter == 4) {
		Ext.getCmp('portlet-5').enable( );
	} else if(peopleCounter == 5) {
		Ext.getCmp('portlet-4').enable( );
	}  else if(peopleCounter == 6) {
		Ext.getCmp('portlet-2').enable( );
	}  else if(peopleCounter == 7) {
		Ext.getCmp('portlet-1').enable( );
	}  else if(peopleCounter == 8) {
		Ext.getCmp('portlet-6').enable( );
	} 
}

function reloadStatChart () {
	store5.loadData(generateData(placesArray.length));
}

function generateData(n){
    var data = [],
        //p = (Math.random() *  11) + 1,
        i;
    for (i = 0; i < (n || placesArray.length); i++) {
        data.push({
            name: placesArray[i],
            data1: Math.floor(Math.max((Math.random() * 100), 20)),
            data2: Math.floor(Math.max((Math.random() * 100), 20)),
            data3: Math.floor(Math.max((Math.random() * 100), 20)),
            data4: Math.floor(Math.max((Math.random() * 100), 20)),
            data5: Math.floor(Math.max((Math.random() * 100), 20)),
            data6: Math.floor(Math.max((Math.random() * 100), 20)),
            data7: Math.floor(Math.max((Math.random() * 100), 20)),
            data8: Math.floor(Math.max((Math.random() * 100), 20)),
            data9: Math.floor(Math.max((Math.random() * 100), 20))
        });
    }
    return data;
};

function generateDataNegative(n){
    var data = [],
        //p = (Math.random() *  11) + 1,
        i;
    for (i = 0; i < (n || 12); i++) {
        data.push({
            name: Ext.Date.monthNames[i],
            data1: Math.floor(((Math.random() - 0.5) * 100)),
            data2: Math.floor(((Math.random() - 0.5) * 100)),
            data3: Math.floor(((Math.random() - 0.5) * 100)),
            data4: Math.floor(((Math.random() - 0.5) * 100)),
            data5: Math.floor(((Math.random() - 0.5) * 100)),
            data6: Math.floor(((Math.random() - 0.5) * 100)),
            data7: Math.floor(((Math.random() - 0.5) * 100)),
            data8: Math.floor(((Math.random() - 0.5) * 100)),
            data9: Math.floor(((Math.random() - 0.5) * 100))
        });
    }
    return data;
};

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
                 Ext.fly('connectAndMeetCountryText').update("PEOPLE IN " + Ext.getCmp('countryComboId').getRawValue());
                 Ext.getCmp('subCatagoryTreePanelId').getEl().unmask();
                 Ext.get('panel2').fadeOut({endOpacity:0.25});
                 window.setTimeout(function() {
                	 Ext.get('panel2').fadeIn({endOpacity: 1.0});
                	 }, 100);
                 Ext.get('peopleGrid').fadeOut({endOpacity:0.25});
                 window.setTimeout(function() {
                	 Ext.get('peopleGrid').fadeIn({endOpacity: 1.0});
                 }, 100);
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
    
    Ext.define('Place', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'id',
            type: 'string'
        }, {
            name: 'data1',
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
    
    var storePlace = new Ext.data.JsonStore({
        storeId: 'storePlace',
        proxy: {
            type: 'ajax',
            url: 'welcome/getPlaces',
            reader: {
                type: 'json',
                root: 'result',
                idProperty: 'id'
            }
        },
        fields: ['id', 'place']
    });

    var deckPanelTop = Ext.create('ExtMVC.view.portal.PortletPanel', {
        id: 'portalTop',
        region: 'center',
        margins: '35 5 0 0',
        border: false
    });

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
        	id: name + Math.floor((Math.random() * 10) + 1),
            text: 'image',
            dataIndex: 'image',
            renderer: cover_image,
            width: 100
        }, {
        	id: name + "image" + Math.floor((Math.random() * 10) + 1),
            text: 'name',
            flex: 1,
            xtype: 'templatecolumn',
            tpl: '<div class="peopleName"><b>{name}</b></div><br />' +
                '<div class="peopleActivity"><b>New Post</b>&nbsp;<span><i>{activity}</i></span></div>'
        }],
        listeners: {
        	itemcontextmenu: function (grid, record, item, index, e, eOpts) {
        		e.stopEvent();
        		if(Ext.getCmp('contextMenu') != null || Ext.getCmp('contextMenu') != undefined) {
        			Ext.getCmp('contextMenu').destroy();
        		}
        		var contextMenu = Ext.create('Ext.menu.Menu', {
        			id: 'contextMenu',
        		    height: 80,
        		    width: 160,
        		    items: [{
        		        text: 'Add to the Tour',
        		        icon: 'resources/images/add.png',
        		        menu: {
        		        	plain: true,
        		        	id: 'addToTour'
        		        }
        		    }, {
        		        text: 'Remove from the tour',
        		        icon: 'resources/images/remove.png'
        		    }, {
        				text: 'Start a conversation',
        		        icon: 'resources/images/msg.png',
        		        listeners: {
        		        	click: function(menu, item, e, eOpts) {
        		        		var w = new Ext.Window({
        		        			items:[{ 
        		        				xtype: 'textfield', 
        		        				fieldLabel: 'Chat'
        		        			}, 
        		        			new Ext.form.TextField({fieldLabel: 'Type Here'})
        		        		]}).show();
        		        	}
        		        }
        			}]
        		});
        		for (var i = 0; i < nameArray.length; i++) {
        			Ext.getCmp('addToTour').add({
        				id: nameArray[i] + "contextMenu",
        				text: nameArray[i],
        				listeners: {
        					click: function(menu, itemM, eM, eOptsM) {
        						var panelId = menu.getId().substr(0, menu.getId().length - "contextMenu".length);
        						Ext.getCmp(panelId).add({
        							border: false,
        							width: 100,
        							height: 100,
        							html: '<img src="'+record.raw[2]+'" />'
        						});
        						peopleCounter++;
        						reCalculateTheGraphChart ();
        					} 
        				}
        			});
        		}
        		contextMenu.showAt(e.getXY());
                return false;
        	}
        }
    });

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
    	id: 'panel2',
        border: false,
        padding: '0 0 0 0',
        flex: 1,
        width: 420,
        height: 'auto',
        items: [{
        	border: false,
        	id: 'portlet-0',
        	html: '<img src="resources/images/tiles/main_tiles.png" height="112px" width="445px" />',
        	width: 445,
        	height: 130,
            disabled: true
        },deckPanelTop]
    });

    var panel3 = Ext
        .create(
            'Ext.panel.Panel', {
            	id: 'panel3',
                //flex: 2,
            	width: 350,
                border: false,
                items: [{
                        border: false,
                        height: 20,
                        width: '97%',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        style : 'top:-2px;',
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
                        html: '<div id="createATripLabel" onmousedown="javascript:createATripFunctionDown();" onmouseup="javascript:createATripFunctionUp();">'
                        	+'<button id="creatTripButton"><img src="resources/images/plus.png" /></button><span>CREATE A TRIP!</span></div>'
                    }, {
                        border: false,
                        height: 5,
                        width: 'auto',
                        flex: 1
                    }, {
                        border: false,
                        height: 20,
                        width: 'auto',
                        html: '<span class="labelText">DESTINATION</span>'
                    }, {
                        height: 5,
                        border: false
                    }, {
                    	border: false,
                        width: '97%',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [{
                        	frame: false,
                        	border: false,
                            width: 305,
                        	xtype: 'combo',
                            id: 'destinationTextFieldId',
                            store: storePlace,
                            triggerAction: 'query',
                            //minChars: 0,
                            displayField: 'place',
                            mode: 'remote',
                            triggerCls : 'x-form-search-trigger',
                            listConfig: {
                                    getInnerTpl: function() {
                                            return '<div>{place}</div>';
                                    }
                            }
                        }, {
                        	width: 10,
                        	border: false
                        },{
                        	border: false,
                        	html : '<div onclick="javascript:addTripDestinations();"><img style="float:right" src="resources/images/plus_mini.png" /></div>'
                        }]
                    }, {
                        height: 10,
                        border: false
                    }, {
                        border: false,
                        height: 55,
                        width: '97%',
                        html: '<div id="connectAndMeetText"><div id="connectAndMeetCountryText">PEOPLE IN GREECE</div><span>CONECT AND MEET</span></div>'
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

    var store1 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    var storeNegatives = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateDataNegative()
    });
    var store3 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    var store4 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
    });
    store5 = new Ext.data.JsonStore({
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData(3)
    });
    
    
    statPanel = new Ext.Panel({
    	renderTo: 'extComponentId',
    	id: 'tourGraph',
    	border: false,
    	frame: true,
    	width: 'auto',
    	height: 500,
    	items: [{
    				border: false,
    				height: 30,
    				html: '<div style="float:left" onclick="javascript:reloadStatChart();"><img src="resources/images/reload.png" height="30px" width="30px" /></div>'
    			}, {
    				border: false,
                    width: '97%',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{
                    	id: 'graphChartPanel',
                    	border: false,
                    	width: 670,
    		            height: 480
                    }, {
                    	border: false,
                    	width: 300,
                    	id: 'destinationStackId'
                }]
    	}]
    }).hide();

});