import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getConsultantTechnology from '@salesforce/apex/ExamController.getConsultantTechnology';
import getRandomQuestions from '@salesforce/apex/ExamController.getRandomQuestions';
import updateExamResult from '@salesforce/apex/ExamController.updateExamResult';
import getConsultantStatus from '@salesforce/apex/ExamController.getConsultantStatus';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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
    @track showComponent = false;
    @track restrictedAccess = false;

    timer; // Timer reference
    timeLeft = 60; // Exam time in seconds

    @wire(CurrentPageReference)
    setCurrentPageReference(pageRef) {
        if (pageRef?.state?.consultantId) {
            this.consultantId = pageRef.state.consultantId;
            this.checkConsultantStatus();
            this.loadConsultantTechnology();
        }
    }

    checkConsultantStatus() {
        getConsultantStatus({ consultantId: this.consultantId })
            .then((status) => {
                if (!status) {
                    this.showComponent = true;
                } else {
                    this.restrictedAccess = true;
                }
            })
            .catch((error) => {
                console.error('Error checking consultant status:', error);
                this.restrictedAccess = true;
            })
            .finally(() => {
                this.loading = false;
            });
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
        const passingScore = Math.ceil(this.questions.length * 0.7); // Passing threshold: 70%
        const status = this.score >= passingScore ? 'Pass' : 'Fail';
        this.resultMessage = `Exam Completed! ${status === 'Pass' ? 'Congratulations, You Passed!' : 'Sorry, You Failed.'
            }`;
        return status;
    }

    // sendExamResult() {
    //     const status = this.calculateScore();
    //     const resultDetails = `Score: ${this.score}/${this.questions.length}\nSelected Answers: ${JSON.stringify(this.userAnswers)}`;
    //     updateExamResult({ consultantId: this.consultantId, status, resultDetails })
    //         .then(() => {
    //             this.showToast('Success', 'Exam result and PDF sent to HR successfully.', 'success');
    //         })
    //         .catch((error) => {
    //             console.error('Error updating exam result and sending email:', error);
    //             this.showToast('Error', 'Failed to send exam result to HR.', 'error');
    //         });
    // }
    
    sendExamResult() {
        const status = this.calculateScore();
        // Build detailed result details
        const resultDetails = {
            score: `${this.score}/${this.questions.length}`,
            questions: this.questions.map((question) => {
                const selectedAnswer = this.userAnswers[question.id] || 'No Answer';
                const isCorrect = selectedAnswer === question.correctAnswer;
                return {
                    text: question.text,
                    selectedAnswer: selectedAnswer,
                    correctAnswer: question.correctAnswer,
                    isCorrect: isCorrect
                };
            })
        };
    
        // Convert resultDetails to JSON string
        const resultDetailsJSON = JSON.stringify(resultDetails);
    
        // Call Apex method with detailed result details
        updateExamResult({
            consultantId: this.consultantId,
            status,
            resultDetails: resultDetailsJSON
        })
        .then(() => {
            this.showToast('Success', 'Exam result sent to HR successfully.', 'success');
        })
        .catch((error) => {
            console.error('Error updating exam result and sending email:', error);
            this.showToast('Error', 'Failed to send exam result to HR.', 'error');
        });
    }
    
    
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }
    
}
