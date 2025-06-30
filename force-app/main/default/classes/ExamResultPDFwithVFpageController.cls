public with sharing class ExamResultPDFwithVFpageController {
    public String htmlContent { get; set; }

    public ExamResultPDFwithVFpageController() {
        // Retrieve the content parameter from the page and set it to the htmlContent property
        htmlContent = ApexPages.currentPage().getParameters().get('content');
        
        // Optional: Log content to debug
        System.debug('HTML Content for PDF: ' + htmlContent);
    }
}
