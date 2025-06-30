
public without sharing class ExamController {
        @AuraEnabled(cacheable=true)
        public static String getConsultantStatus(String consultantId) {
            Consultant__c consultant = [SELECT Exam_Status__c FROM Consultant__c WHERE Id = :consultantId LIMIT 1];
            return consultant.Exam_Status__c;
        }

        @AuraEnabled(cacheable=true)
        public static String getConsultantTechnology(String consultantId) {
            Consultant__c consultant = [SELECT Technology_Expertise__c FROM Consultant__c WHERE Id = :consultantId LIMIT 1];
            return consultant.Technology_Expertise__c;
        }
    
        @AuraEnabled
        public static List<QuestionWrapper> getRandomQuestions(String technology) {
            // Construct the static resource name based on technology
            String staticResourceName = technology;
    
            // Fetch the static resource
            StaticResource staticResource = [SELECT Body FROM StaticResource WHERE Name = :staticResourceName LIMIT 1];
    
            if (staticResource == null) {
                throw new AuraHandledException('No questions available for the selected technology.');
            }
    
            // Parse the CSV content
            String csvContent = staticResource.Body.toString();
            List<String> lines = csvContent.split('\n');
            List<QuestionWrapper> allQuestions = new List<QuestionWrapper>();
            
            for (String line : lines) {
                List<String> values = line.split(',');
                
                // Ensure the row has the correct number of columns
                if (values.size() < 6) continue;
                
                // Remove any double quotes from the text and options
                String questionText = values[1].replace('"', '').trim();
                List<String> options = new List<String>{
                    values[2].replace('"', '').trim(),
                    values[3].replace('"', '').trim(),
                    values[4].replace('"', '').trim()
                };
                String correctAnswer = values[5].replace('"', '').trim();
                
                allQuestions.add(new QuestionWrapper(
                    values[0].trim(), // Question ID
                    questionText, // Question Text
                    options, // Options
                    correctAnswer // Correct Answer
                ));
            }
            
    
            // Shuffle the list of questions
            allQuestions = shuffleQuestions(allQuestions);
    
            // Return the first 5 questions or fewer if less than 5
            List<QuestionWrapper> randomQuestions = new List<QuestionWrapper>();
            Integer maxLimit = Math.min(allQuestions.size(), 5);
            for (Integer i = 0; i < maxLimit; i++) {
                randomQuestions.add(allQuestions[i]);
            }
    
            return randomQuestions;
        }
    
        @AuraEnabled
        public static void updateExamResult(String consultantId, String status, String resultDetails) {
            Consultant__c consultant = [SELECT Id, Exam_Status__c FROM Consultant__c WHERE Id = :consultantId LIMIT 1];
            consultant.Exam_Status__c = status;
            consultant.Approval_Status__c = 'Evaluation';
            update consultant;

            // Generate PDF and send email
            sendResultEmailWithPDF(consultantId, status, resultDetails);
        }
    
        // Helper method to shuffle the list of questions
        private static List<QuestionWrapper> shuffleQuestions(List<QuestionWrapper> questions) {
            Integer n = questions.size();
            for (Integer i = n - 1; i > 0; i--) {
                Integer j = Math.floor(Math.random() * (i + 1)).intValue();
                QuestionWrapper temp = questions[i];
                questions[i] = questions[j];
                questions[j] = temp;
            }
            return questions;
        }
    
        // @AuraEnabled
        // public static void sendResultEmailWithPDF(String consultantId, String status, String resultDetails) {
        //     try {
        //         // Fetch consultant details
        //         Consultant__c consultant = [SELECT Name, Technology_Expertise__c, Email_Address__c FROM Consultant__c WHERE Id = :consultantId LIMIT 1];
        //         System.debug('Consultant details: ' + consultant);

        //         // Retrieve Org-Wide Email Address ID
        //         OrgWideEmailAddress orgWideEmail = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'nareshp@sprintpark.com' LIMIT 1];
        //         System.debug('Org-Wide Email Address ID: ' + orgWideEmail.Id);

        //         // Construct the email body
        //         String emailBody = 'Dear HR Team,\n\n' +
        //                         'Please find the exam results for the following consultant:\n\n' +
        //                         'Consultant Name: ' + consultant.Name + '\n' +
        //                         'Technology Expertise: ' + consultant.Technology_Expertise__c + '\n' +
        //                         'Exam Status: ' + status + '\n\n' +
        //                         'Exam Details:\n' + resultDetails + '\n\n' +
        //                         'Thank you,\n' +
        //                         'Exam Evaluation Team';

        //         // Send Email
        //         Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        //         email.setOrgWideEmailAddressId(orgWideEmail.Id); // Set the OWA ID
        //         email.setToAddresses(new String[] { 'nareshpunagani316@gmail.com' }); // HR email
        //         email.setSubject('Exam Results for Consultant: ' + consultant.Name);
        //         email.setPlainTextBody(emailBody); // Set the email body
        //         System.debug('Email object prepared: ' + email);

        //         // Send email
        //         Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
        //         for (Messaging.SendEmailResult result : results) {
        //             if (!result.isSuccess()) {
        //                 System.debug('Failed to send email: ' + result.getErrors());
        //                 throw new AuraHandledException('Email failed to send: ' + result.getErrors()[0].getMessage());
        //             }
        //         }
        //         System.debug('Email sent successfully.');
        //     } catch (Exception e) {
        //         System.debug('Error occurred while sending email: ' + e.getMessage());
        //         throw new AuraHandledException('Failed to send email: ' + e.getMessage());
        //     }
        // }

                
        @AuraEnabled
        public static void sendResultEmailWithPDF(String consultantId, String status, String resultDetails) {
            try {
                // Fetch consultant details
                Consultant__c consultant = [SELECT Name, Technology_Expertise__c, Email_Address__c FROM Consultant__c WHERE Id = :consultantId LIMIT 1];

                // Retrieve Org-Wide Email Address
                OrgWideEmailAddress orgWideEmail = [SELECT Id FROM OrgWideEmailAddress WHERE Address = 'nareshp@sprintpark.com' LIMIT 1];

                // Parse resultDetails JSON
                Map<String, Object> resultData = (Map<String, Object>) JSON.deserializeUntyped(resultDetails);
                String score = (String) resultData.get('score');
                List<Object> questions = (List<Object>) resultData.get('questions');

                // Construct the email body
                String emailBody = '<html><body>';
                emailBody += '<p>Dear HR Team,</p>';
                emailBody += '<p>The following consultant has successfully submitted their exam:</p>';

                // Consultant details
                emailBody += '<ul>';
                emailBody += '<li><strong>Consultant Name:</strong> ' + consultant.Name + '</li>';
                emailBody += '<li><strong>Technology Expertise:</strong> ' + consultant.Technology_Expertise__c + '</li>';
                emailBody += '<li><strong>Exam Status:</strong> ' + status + '</li>';
                emailBody += '<li><strong>Score:</strong> ' + score + '</li>';
                emailBody += '</ul>';

                // Add the table for exam details
                emailBody += '<h3>Exam Details</h3>';
                emailBody += '<table style="border-collapse: collapse; width: 100%; margin-top: 20px;" border="1">';
                emailBody += '<thead>';
                emailBody += '<tr style="background-color: #f2f2f2;">';
                emailBody += '<th style="padding: 8px; text-align: left;">Question Name</th>';
                emailBody += '<th style="padding: 8px; text-align: left;">Selected Answer</th>';
                emailBody += '<th style="padding: 8px; text-align: left;">Correct/Wrong</th>';
                emailBody += '<th style="padding: 8px; text-align: left;">Correct Answer</th>';
                emailBody += '</tr>';
                emailBody += '</thead>';
                emailBody += '<tbody>';

                // Add rows for each question
                for (Object obj : questions) {
                    Map<String, Object> question = (Map<String, Object>) obj;
                    String questionText = (String) question.get('text');
                    String selectedAnswer = (String) question.get('selectedAnswer');
                    String correctAnswer = (String) question.get('correctAnswer');
                    Boolean isCorrect = (Boolean) question.get('isCorrect');

                    emailBody += '<tr>';
                    emailBody += '<td style="padding: 8px;">' + questionText + '</td>';
                    emailBody += '<td style="padding: 5px;">' + selectedAnswer + '</td>';
                    emailBody += '<td style="padding: 5px;">' + (isCorrect ? 'Correct' : 'Wrong') + '</td>';
                    emailBody += '<td style="padding: 5px;">' + correctAnswer + '</td>';
                    emailBody += '</tr>';
                }

                emailBody += '</tbody>';
                emailBody += '</table>';

                // Add a closing note
                emailBody += '<p style="margin-top: 20px;">If you have any questions or need further details, please feel free to reach out.</p>';
                emailBody += '<p>Thank you,<br>Exam Evaluation Team</p>';
                emailBody += '</body></html>';

                // Prepare the email
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setOrgWideEmailAddressId(orgWideEmail.Id);
                email.setToAddresses(new String[] { 'nareshpunagani316@gmail.com' }); // HR email
                email.setSubject('Exam Results for Consultant: ' + consultant.Name);
                email.setHtmlBody(emailBody);

                // Send the email
                Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
                for (Messaging.SendEmailResult result : results) {
                    if (!result.isSuccess()) {
                        throw new AuraHandledException('Failed to send email: ' + result.getErrors()[0].getMessage());
                    }
                }
            } catch (Exception e) {
                throw new AuraHandledException('Failed to send email: ' + e.getMessage());
            }
        }

        // Wrapper class for a question
        public class QuestionWrapper {
            @AuraEnabled public String id;
            @AuraEnabled public String text;
            @AuraEnabled public List<String> options;
            @AuraEnabled public String correctAnswer;
    
            public QuestionWrapper(String id, String text, List<String> options, String correctAnswer) {
                this.id = id;
                this.text = text;
                this.options = options;
                this.correctAnswer = correctAnswer;
            }
        }
    }
    