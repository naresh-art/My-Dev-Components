// import { LightningElement, track, wire } from 'lwc';
// import { CurrentPageReference } from 'lightning/navigation';
// import getConsultantTechnology from '@salesforce/apex/ConsultantController.getConsultantTechnology';

// export default class ExamComponent extends LightningElement {
//     @track consultantId = null;
//     @track technologyExpertise = null;
//     @track questions = [];
//     @track userAnswers = {};
//     @track showStartButton = true;
//     @track showQuestions = false;
//     @track showResult = false;
//     @track noQuestions = false;
//     @track score = 0;
//     @track attemptedQuestions = 0;
//     @track resultMessage = '';
//     @track formattedTime = '01:00';
//     @track loading = false;

//     timer; // Reference to the timer interval
//     timeLeft = 60; // Time in seconds

//     // Question bank mapped to expertise
//     questionBank = {
//         Networking: [
//             {
//                 id: '1',
//                 text: 'What is a subnet mask?',
//                 options: [
//                     { label: 'Defines the network and host portions of an IP address', value: 'Defines the network and host portions of an IP address' },
//                     { label: 'Specifies the default gateway', value: 'Specifies the default gateway' },
//                     { label: 'Encrypts network traffic', value: 'Encrypts network traffic' }
//                 ],
//                 correctAnswer: 'Defines the network and host portions of an IP address'
//             },
//             {
//                 id: '2',
//                 text: 'What does DNS stand for?',
//                 options: [
//                     { label: 'Domain Name System', value: 'Domain Name System' },
//                     { label: 'Data Network Service', value: 'Data Network Service' },
//                     { label: 'Distributed Name Server', value: 'Distributed Name Server' }
//                 ],
//                 correctAnswer: 'Domain Name System'
//             }
//         ],
//         'Data Engineer': [
//             {
//                 id: '1',
//                 text: 'What is ETL in data engineering?',
//                 options: [
//                     { label: 'Extract, Transform, Load', value: 'Extract, Transform, Load' },
//                     { label: 'Evaluate, Translate, Load', value: 'Evaluate, Translate, Load' },
//                     { label: 'Extract, Transfer, Log', value: 'Extract, Transfer, Log' }
//                 ],
//                 correctAnswer: 'Extract, Transform, Load'
//             },
//             {
//                 id: '2',
//                 text: 'Which of the following is a distributed data processing framework?',
//                 options: [
//                     { label: 'Apache Spark', value: 'Apache Spark' },
//                     { label: 'Microsoft Excel', value: 'Microsoft Excel' },
//                     { label: 'Tableau', value: 'Tableau' }
//                 ],
//                 correctAnswer: 'Apache Spark'
//             }
//         ],
//         'Salesforce': [
//             {
//                 id: '1',
//                 text: 'What is a Governor Limit in Salesforce?',
//                 options: [
//                     { label: 'A limit on the number of users in an org', value: 'A limit on the number of users in an org' },
//                     { label: 'A limit that Salesforce applies to prevent excessive resource usage', value: 'A limit that Salesforce applies to prevent excessive resource usage' },
//                     { label: 'A limit on the number of dashboards created in an org', value: 'A limit on the number of dashboards created in an org' }
//                 ],
//                 correctAnswer: 'A limit that Salesforce applies to prevent excessive resource usage'
//             },
//             {
//                 id: '2',
//                 text: 'Which language is used to write Apex triggers?',
//                 options: [
//                     { label: 'Java', value: 'Java' },
//                     { label: 'Python', value: 'Python' },
//                     { label: 'Apex', value: 'Apex' }
//                 ],
//                 correctAnswer: 'Apex'
//             },
//         ],
//         '.Net': [
//             {
//                 id: '1',
//                 text: 'What does the .NET Framework provide?',
//                 options: [
//                     { label: 'An environment for developing, building, and running applications', value: 'An environment for developing, building, and running applications' },
//                     { label: 'A database management system', value: 'A database management system' },
//                     { label: 'An operating system for Windows', value: 'An operating system for Windows' }
//                 ],
//                 correctAnswer: 'An environment for developing, building, and running applications'
//             },
//             {
//                 id: '2',
//                 text: 'What does CLR stand for in .NET?',
//                 options: [
//                     { label: 'Common Language Runtime', value: 'Common Language Runtime' },
//                     { label: 'Common Logic Runtime', value: 'Common Logic Runtime' },
//                     { label: 'Code Level Runtime', value: 'Code Level Runtime' }
//                 ],
//                 correctAnswer: 'Common Language Runtime'
//             },
//         ]

//         // Add other mappings as needed
//     };

//     // Retrieve consultantId from URL
//     @wire(CurrentPageReference)
//     setCurrentPageReference(pageRef) {
//         if (pageRef && pageRef.state.consultantId) {
//             this.consultantId = pageRef.state.consultantId;
//             this.loadConsultantData();
//         }
//     }

//     // Fetch consultant technology expertise
//     loadConsultantData() {
//         this.loading = true;
//         getConsultantTechnology({ consultantId: this.consultantId })
//             .then((result) => {
//                 this.technologyExpertise = result;
//                 this.filterQuestions();
//             })
//             .catch((error) => {
//                 console.error('Error fetching consultant technology:', error);
//                 this.noQuestions = true;
//             })
//             .finally(() => {
//                 this.loading = false;
//             });
//     }

//     // Filter questions based on expertise
//     filterQuestions() {
//         if (this.questionBank[this.technologyExpertise]) {
//             this.questions = this.questionBank[this.technologyExpertise];
//             this.noQuestions = false;
//         } else {
//             this.noQuestions = true;
//         }
//     }

//     startExam() {
//         this.showStartButton = false;
//         this.showQuestions = true;
//         this.startTimer();
//     }

//     startTimer() {
//         this.timer = setInterval(() => {
//             this.timeLeft--;

//             const minutes = Math.floor(this.timeLeft / 60);
//             const seconds = this.timeLeft % 60;
//             this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

//             if (this.timeLeft <= 0) {
//                 clearInterval(this.timer);
//                 this.handleTimeOver();
//             }
//         }, 1000);
//     }

//     handleTimeOver() {
//         this.resultMessage = 'Time Over!';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         const selectedValue = event.detail.value;
//         this.userAnswers[questionId] = selectedValue;

//         this.attemptedQuestions = Object.keys(this.userAnswers).length;
//     }

//     handleSubmit() {
//         clearInterval(this.timer);

//         this.resultMessage = 'Exam Completed!';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     calculateScore() {
//         let correctAnswers = 0;

//         this.questions.forEach((question) => {
//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });

//         this.score = correctAnswers;
//         this.attemptedQuestions = Object.keys(this.userAnswers).length;

//         this.resultMessage += this.score >= 2 ? ' Congratulations, You Passed!' : ' Sorry, You Failed.';
//     }

// }


// import { LightningElement, track, wire } from 'lwc';
// import { CurrentPageReference } from 'lightning/navigation';
// import getConsultantTechnology from '@salesforce/apex/ConsultantController.getConsultantTechnology';
// import updateExamResult from '@salesforce/apex/ConsultantController.updateExamResult';

// export default class ExamComponent extends LightningElement {
//     @track consultantId = null;
//     @track technologyExpertise = null;
//     @track questions = [];
//     @track userAnswers = {};
//     @track showStartButton = true;
//     @track showQuestions = false;
//     @track showResult = false;
//     @track noQuestions = false;
//     @track score = 0;
//     @track attemptedQuestions = 0;
//     @track resultMessage = '';
//     @track formattedTime = '01:00';
//     @track loading = false;

//     timer;
//     timeLeft = 60;

//     questionBank = {
//         Networking: [
//             {
//                 id: '1',
//                 text: 'What is a subnet mask?',
//                 options: [
//                     { label: 'Defines the network and host portions of an IP address', value: 'Defines the network and host portions of an IP address' },
//                     { label: 'Specifies the default gateway', value: 'Specifies the default gateway' },
//                     { label: 'Encrypts network traffic', value: 'Encrypts network traffic' }
//                 ],
//                 correctAnswer: 'Defines the network and host portions of an IP address'
//             },
//             {
//                 id: '2',
//                 text: 'What does DNS stand for?',
//                 options: [
//                     { label: 'Domain Name System', value: 'Domain Name System' },
//                     { label: 'Data Network Service', value: 'Data Network Service' },
//                     { label: 'Distributed Name Server', value: 'Distributed Name Server' }
//                 ],
//                 correctAnswer: 'Domain Name System'
//             }
//         ],
//         'Data Engineer': [
//             {
//                 id: '1',
//                 text: 'What is ETL in data engineering?',
//                 options: [
//                     { label: 'Extract, Transform, Load', value: 'Extract, Transform, Load' },
//                     { label: 'Evaluate, Translate, Load', value: 'Evaluate, Translate, Load' },
//                     { label: 'Extract, Transfer, Log', value: 'Extract, Transfer, Log' }
//                 ],
//                 correctAnswer: 'Extract, Transform, Load'
//             },
//             {
//                 id: '2',
//                 text: 'Which of the following is a distributed data processing framework?',
//                 options: [
//                     { label: 'Apache Spark', value: 'Apache Spark' },
//                     { label: 'Microsoft Excel', value: 'Microsoft Excel' },
//                     { label: 'Tableau', value: 'Tableau' }
//                 ],
//                 correctAnswer: 'Apache Spark'
//             }
//         ],
//         'Salesforce': [
//             {
//                 id: '1',
//                 text: 'What is a Governor Limit in Salesforce?',
//                 options: [
//                     { label: 'A limit on the number of users in an org', value: 'A limit on the number of users in an org' },
//                     { label: 'A limit that Salesforce applies to prevent excessive resource usage', value: 'A limit that Salesforce applies to prevent excessive resource usage' },
//                     { label: 'A limit on the number of dashboards created in an org', value: 'A limit on the number of dashboards created in an org' }
//                 ],
//                 correctAnswer: 'A limit that Salesforce applies to prevent excessive resource usage'
//             },
//             {
//                 id: '2',
//                 text: 'Which language is used to write Apex triggers?',
//                 options: [
//                     { label: 'Java', value: 'Java' },
//                     { label: 'Python', value: 'Python' },
//                     { label: 'Apex', value: 'Apex' }
//                 ],
//                 correctAnswer: 'Apex'
//             },
//         ],
//         '.Net': [
//             {
//                 id: '1',
//                 text: 'What does the .NET Framework provide?',
//                 options: [
//                     { label: 'An environment for developing, building, and running applications', value: 'An environment for developing, building, and running applications' },
//                     { label: 'A database management system', value: 'A database management system' },
//                     { label: 'An operating system for Windows', value: 'An operating system for Windows' }
//                 ],
//                 correctAnswer: 'An environment for developing, building, and running applications'
//             },
//             {
//                 id: '2',
//                 text: 'What does CLR stand for in .NET?',
//                 options: [
//                     { label: 'Common Language Runtime', value: 'Common Language Runtime' },
//                     { label: 'Common Logic Runtime', value: 'Common Logic Runtime' },
//                     { label: 'Code Level Runtime', value: 'Code Level Runtime' }
//                 ],
//                 correctAnswer: 'Common Language Runtime'
//             },
//         ]

//         // Add other mappings as needed
//     };

//     @wire(CurrentPageReference)
//     setCurrentPageReference(pageRef) {
//         if (pageRef?.state?.consultantId) {
//             this.consultantId = pageRef.state.consultantId;
//             this.loadConsultantData();
//         }
//     }

//     loadConsultantData() {
//         this.loading = true;
//         getConsultantTechnology({ consultantId: this.consultantId })
//             .then((result) => {
//                 this.technologyExpertise = result;
//                 this.filterQuestions();
//             })
//             .catch((error) => {
//                 console.error('Error fetching consultant technology:', error);
//                 this.noQuestions = true;
//             })
//             .finally(() => {
//                 this.loading = false;
//             });
//     }

//     filterQuestions() {
//         if (this.questionBank[this.technologyExpertise]) {
//             this.questions = this.questionBank[this.technologyExpertise];
//             this.noQuestions = false;
//         } else {
//             this.noQuestions = true;
//         }
//     }

//     startExam() {
//         this.showStartButton = false;
//         this.showQuestions = true;
//         this.startTimer();
//     }

//     startTimer() {
//         this.timer = setInterval(() => {
//             this.timeLeft--;
//             const minutes = Math.floor(this.timeLeft / 60);
//             const seconds = this.timeLeft % 60;
//             this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//             if (this.timeLeft <= 0) {
//                 clearInterval(this.timer);
//                 this.handleTimeOver();
//             }
//         }, 1000);
//     }

//     handleTimeOver() {
//         this.resultMessage = 'Time Over!';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         this.userAnswers[questionId] = event.detail.value;
//         this.attemptedQuestions = Object.keys(this.userAnswers).length;
//     }

//     handleSubmit() {
//         clearInterval(this.timer);
//         this.resultMessage = 'Exam Completed!';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//         this.sendExamResult();
//     }

//     calculateScore() {
//         let correctAnswers = 0;
//         this.questions.forEach((question) => {
//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });
//         this.score = correctAnswers;
//         const passingScore = Math.ceil(this.questions.length * 0.7);
//         const status = this.score >= passingScore ? 'Pass' : 'Fail';
//         this.resultMessage += ` ${status === 'Pass' ? 'Congratulations, You Passed!' : 'Sorry, You Failed.'}`;
//         return status;
//     }

//     sendExamResult() {
//         const status = this.calculateScore();
//         const resultDetails = `Score: ${this.score}/${this.questions.length}<br/>Selected Answers: ${JSON.stringify(this.userAnswers)}`;
//         updateExamResult({ consultantId: this.consultantId, status, resultDetails })
//             .then(() => {
//                 console.log('Exam result updated successfully.');
//             })
//             .catch((error) => {
//                 console.error('Error updating exam result:', error);
//             });
//     }
// }


import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getConsultantTechnology from '@salesforce/apex/ExamController.getConsultantTechnology';
import getRandomQuestions from '@salesforce/apex/ExamController.getRandomQuestions';
import updateExamResult from '@salesforce/apex/ExamController.updateExamResult';

export default class ExamComponent extends LightningElement {
    @track consultantId = null;
    @track technologyExpertise = null;
    @track questions = [];
    @track userAnswers = {};
    @track showStartButton = true;
    @track showQuestions = false;
    @track showResult = false;
    @track noQuestions = false;
    @track score = 0;
    @track attemptedQuestions = 0;
    @track resultMessage = '';
    @track formattedTime = '01:00';
    @track loading = false;

    timer; // Timer reference
    timeLeft = 60; // Exam time in seconds

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        if (pageRef?.state?.consultantId) {
            this.consultantId = pageRef.state.consultantId;
            this.loadConsultantTechnology();
        }
    }

    loadConsultantTechnology() {
        this.loading = true;
        getConsultantTechnology({ consultantId: this.consultantId })
            .then((result) => {
                this.technologyExpertise = result;
                this.loadQuestions();
            })
            .catch((error) => {
                console.error('Error fetching consultant technology:', error);
                this.noQuestions = true;
            })
            .finally(() => {
                this.loading = false;
            });
    }

    // loadQuestions() {
    //     this.loading = true;
    //     getRandomQuestions({ technology: this.technologyExpertise })
    //         .then((result) => {
    //             this.questions = result.map((question) => ({
    //                 id: question.id,
    //                 text: question.text,
    //                 options: question.options.map((option) => ({ label: option, value: option })),
    //                 correctAnswer: question.correctAnswer
    //             }));
    //             this.noQuestions = this.questions.length === 0;
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching questions:', error);
    //             this.noQuestions = true;
    //         })
    //         .finally(() => {
    //             this.loading = false;
    //         });
    // }

    loadQuestions() {
        this.loading = true;
        getRandomQuestions({ technology: this.technologyExpertise })
            .then((result) => {
                this.questions = result.map((question, index) => ({
                    id: (index + 1).toString(), // Dynamically assign sequential numbering
                    text: question.text,
                    options: question.options.map((option) => ({ label: option, value: option })),
                    correctAnswer: question.correctAnswer
                }));
                this.noQuestions = this.questions.length === 0;
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
                this.noQuestions = true;
            })
            .finally(() => {
                this.loading = false;
            });
    }
    

    startExam() {
        this.showStartButton = false;
        this.showQuestions = true;
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeOver();
            }
        }, 1000);
    }

    handleTimeOver() {
        this.resultMessage = 'Time Over!';
        this.calculateScore();
        this.showQuestions = false;
        this.showResult = true;
    }

    handleAnswerChange(event) {
        const questionId = event.target.dataset.id;
        this.userAnswers[questionId] = event.detail.value;
        this.attemptedQuestions = Object.keys(this.userAnswers).length;
    }

    handleSubmit() {
        clearInterval(this.timer);
        this.resultMessage = 'Exam Completed!';
        this.calculateScore();
        this.showQuestions = false;
        this.showResult = true;
        this.sendExamResult();
    }

    calculateScore() {
        let correctAnswers = 0;
        this.questions.forEach((question) => {
            if (this.userAnswers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        this.score = correctAnswers;
        const passingScore = Math.ceil(this.questions.length * 0.7);
        const status = this.score >= passingScore ? 'Pass' : 'Fail';
        this.resultMessage += ` ${status === 'Pass' ? 'Congratulations, You Passed!' : 'Sorry, You Failed.'}`;
        return status;
    }

    sendExamResult() {
        const status = this.calculateScore();
        const resultDetails = `Score: ${this.score}/${this.questions.length}<br/>Selected Answers: ${JSON.stringify(this.userAnswers)}`;
        updateExamResult({ consultantId: this.consultantId, status, resultDetails })
            .then(() => {
                console.log('Exam result updated successfully.');
            })
            .catch((error) => {
                console.error('Error updating exam result:', error);
            });
    }
}
