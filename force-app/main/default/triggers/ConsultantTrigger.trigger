trigger ConsultantTrigger on Consultant__c (after insert) {
    // List<Approval.ProcessSubmitRequest> approvalRequests = new List<Approval.ProcessSubmitRequest>();

    // for (Consultant__c consultant : Trigger.New) {
    //     if (consultant.Approval_Status__c == 'Pending Approval From HR') {
    //         Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
    //         req.setObjectId(consultant.Id);
    //         req.setComments('Automatically submitted for approval after record creation.');
    //         approvalRequests.add(req);
    //     }
    // }

    // if (!approvalRequests.isEmpty()) {
    //     List<Approval.ProcessResult> results = Approval.process(approvalRequests);

    //     for (Approval.ProcessResult result : results) {
    //         if (!result.isSuccess()) {
    //             System.debug('Approval submission failed for record: ' + result.getInstanceStatus());
    //         }
    //     }
    // }
}
