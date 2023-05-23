({
	getSpecificFile : function(component, event, helper) {
        var recordId=component.get("v.contentdocumentId");
        //Remove hardcoding based on your record
       	helper.requestFiledata(component, event,'a015i00000mY5bWAAS','');
	},
    getCaseFiles : function(component, event, helper) {
    	var recordId=component.get("v.recordId");
       //Remove hardcoding based on your record
    	helper.requestFiledata(component, event, '5002v00002g58RPAAY','entity');
	}
})