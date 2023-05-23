public class DeleteChatterchat implements schedulable {
    
    public void execute(schedulablecontext sc){
        DeletePreviousRecords del = new DeletePreviousRecords();
		Database.executeBatch(del);
    }

}