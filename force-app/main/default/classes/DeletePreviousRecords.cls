global class DeletePreviousRecords implements Database.Batchable<SObject> {
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        DateTime yesterday = System.now().addDays(-1)	;
        String soqlQuery = 'SELECT Id FROM ContentDocument where :yesterday ';
        return Database.getQueryLocator(soqlQuery);
    }
    
    global void execute(Database.BatchableContext BC, List<SObject> recordss) {
        delete recordss;
        system.debug(recordss);
    }
    
    global void finish(Database.BatchableContext BC) {
        System.debug('Batch job completed successfully.');
    }
}