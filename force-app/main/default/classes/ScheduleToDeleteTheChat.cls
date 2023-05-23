global class ScheduleToDeleteTheChat implements Schedulable {
    global void execute (SchedulableContext a){
        DeletePreviousRecords del = new DeletePreviousRecords();
        database.executeBatch(del);
    }

}