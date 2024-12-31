
public without sharing class ExamController {
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
    
            // for (String line : lines) {
            //     List<String> values = line.split(',');
    
            //     // Ensure the row has the correct number of columns
            //     if (values.size() < 6) continue;
    
            //     allQuestions.add(new QuestionWrapper(
            //         values[0].trim(), // Question ID
            //         values[1].trim(), // Question Text
            //         new List<String>{ values[2].trim(), values[3].trim(), values[4].trim() }, // Options
            //         values[5].trim()  // Correct Answer
            //     ));
            // }

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
            update consultant;
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
    