// import { LightningElement, track } from 'lwc';

// export default class QuestionnaireComp extends LightningElement {
//     @track questions = [
//         {
//             id: '1',
//             text: 'Who is the Father of our Nation?',
//             options: [
//                 { label: 'Mahatma Gandhi', value: 'Mahatma Gandhi' },
//                 { label: 'Jawaharlal Nehru', value: 'Jawaharlal Nehru' },
//                 { label: 'Subhas Chandra Bose', value: 'Subhas Chandra Bose' }
//             ],
//             correctAnswer: 'Mahatma Gandhi'
//         },
//         {
//             id: '2',
//             text: 'Who was the first President of India?',
//             options: [
//                 { label: 'Dr. Rajendra Prasad', value: 'Dr. Rajendra Prasad' },
//                 { label: 'Dr. B. R. Ambedkar', value: 'Dr. B. R. Ambedkar' },
//                 { label: 'Dr. Sarvepalli Radhakrishnan', value: 'Dr. Sarvepalli Radhakrishnan' }
//             ],
//             correctAnswer: 'Dr. Rajendra Prasad'
//         },
//         {
//             id: '3',
//             text: 'Who invented the Computer?',
//             options: [
//                 { label: 'Charles Babbage', value: 'Charles Babbage' },
//                 { label: 'Alan Turing', value: 'Alan Turing' },
//                 { label: 'John von Neumann', value: 'John von Neumann' }
//             ],
//             correctAnswer: 'Charles Babbage'
//         },
//         {
//             id: '4',
//             text: 'What is the capital of India?',
//             options: [
//                 { label: 'Mumbai', value: 'Mumbai' },
//                 { label: 'New Delhi', value: 'New Delhi' },
//                 { label: 'Kolkata', value: 'Kolkata' }
//             ],
//             correctAnswer: 'New Delhi'
//         },
//         {
//             id: '5',
//             text: 'Who wrote the Indian National Anthem?',
//             options: [
//                 { label: 'Rabindranath Tagore', value: 'Rabindranath Tagore' },
//                 { label: 'Bankim Chandra Chatterjee', value: 'Bankim Chandra Chatterjee' },
//                 { label: 'Sarojini Naidu', value: 'Sarojini Naidu' }
//             ],
//             correctAnswer: 'Rabindranath Tagore'
//         },
//         {
//             id: '6',
//             text: 'What is the national animal of India?',
//             options: [
//                 { label: 'Tiger', value: 'Tiger' },
//                 { label: 'Elephant', value: 'Elephant' },
//                 { label: 'Peacock', value: 'Peacock' }
//             ],
//             correctAnswer: 'Tiger'
//         },
//         {
//             id: '7',
//             text: 'Who discovered gravity?',
//             options: [
//                 { label: 'Albert Einstein', value: 'Albert Einstein' },
//                 { label: 'Isaac Newton', value: 'Isaac Newton' },
//                 { label: 'Galileo Galilei', value: 'Galileo Galilei' }
//             ],
//             correctAnswer: 'Isaac Newton'
//         },
//         {
//             id: '8',
//             text: 'Who is known as the Missile Man of India?',
//             options: [
//                 { label: 'Dr. APJ Abdul Kalam', value: 'Dr. APJ Abdul Kalam' },
//                 { label: 'Homi Bhabha', value: 'Homi Bhabha' },
//                 { label: 'Vikram Sarabhai', value: 'Vikram Sarabhai' }
//             ],
//             correctAnswer: 'Dr. APJ Abdul Kalam'
//         },
//         {
//             id: '9',
//             text: 'Which is the national flower of India?',
//             options: [
//                 { label: 'Rose', value: 'Rose' },
//                 { label: 'Lotus', value: 'Lotus' },
//                 { label: 'Sunflower', value: 'Sunflower' }
//             ],
//             correctAnswer: 'Lotus'
//         },
//         {
//             id: '10',
//             text: 'What is the national fruit of India?',
//             options: [
//                 { label: 'Banana', value: 'Banana' },
//                 { label: 'Apple', value: 'Apple' },
//                 { label: 'Mango', value: 'Mango' }
//             ],
//             correctAnswer: 'Mango'
//         }
//     ];

//     userAnswers = {};
//     @track showQuestions = true;
//     @track showResult = false;
//     @track score = 0;
//     @track resultMessage = '';

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         const selectedValue = event.detail.value;
//         this.userAnswers[questionId] = selectedValue;
//     }

//     handleSubmit() {
//         let correctAnswers = 0;

//         this.questions.forEach((question) => {
//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });

//         this.score = correctAnswers;
//         this.resultMessage = correctAnswers >= 8 ? 'Congratulations, You Passed!' : 'Sorry, You Failed.';
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     retryQuiz() {
//         this.userAnswers = {};
//         this.score = 0;
//         this.showQuestions = true;
//         this.showResult = false;
//     }
// }


// import { LightningElement, track } from 'lwc';

// export default class QuestionnaireComp extends LightningElement {
//      @track questions = [
//     {
//         id: '1',
//         text: 'Who is the Father of our Nation?',
//         options: [
//             { label: 'Mahatma Gandhi', value: 'Mahatma Gandhi' },
//             { label: 'Jawaharlal Nehru', value: 'Jawaharlal Nehru' },
//             { label: 'Subhas Chandra Bose', value: 'Subhas Chandra Bose' }
//         ],
//         correctAnswer: 'Mahatma Gandhi'
//     },
//     {
//         id: '2',
//         text: 'Who was the first President of India?',
//         options: [
//             { label: 'Dr. Rajendra Prasad', value: 'Dr. Rajendra Prasad' },
//             { label: 'Dr. B. R. Ambedkar', value: 'Dr. B. R. Ambedkar' },
//             { label: 'Dr. Sarvepalli Radhakrishnan', value: 'Dr. Sarvepalli Radhakrishnan' }
//         ],
//         correctAnswer: 'Dr. Rajendra Prasad'
//     },
//     {
//         id: '3',
//         text: 'Who invented the Computer?',
//         options: [
//             { label: 'Charles Babbage', value: 'Charles Babbage' },
//             { label: 'Alan Turing', value: 'Alan Turing' },
//             { label: 'John von Neumann', value: 'John von Neumann' }
//         ],
//         correctAnswer: 'Charles Babbage'
//     }
// ];
    
//     userAnswers = {};
//     @track showQuestions = true;
//     @track showResult = false;
//     @track score = 0;
//     @track resultMessage = '';

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         const selectedValue = event.detail.value;
//         this.userAnswers[questionId] = selectedValue;
//     }

//     handleSubmit() {
//         let correctAnswers = 0;

//         this.questions.forEach((question) => {
//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });

//         this.score = correctAnswers;
//         this.resultMessage = correctAnswers >= 25 ? 'Congratulations, You Passed!' : 'Sorry, You Failed.';
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     retryQuiz() {
//         this.userAnswers = {};
//         this.score = 0;
//         this.showQuestions = true;
//         this.showResult = false;
//     }
// }



// import { LightningElement, track } from 'lwc';

// export default class QuestionnaireComp extends LightningElement {
//     @track questions = [
//     {
//         id: '1',
//         text: 'Who is the Father of our Nation?',
//         options: [
//             { label: 'Mahatma Gandhi', value: 'Mahatma Gandhi' },
//             { label: 'Jawaharlal Nehru', value: 'Jawaharlal Nehru' },
//             { label: 'Subhas Chandra Bose', value: 'Subhas Chandra Bose' }
//         ],
//         correctAnswer: 'Mahatma Gandhi'
//     },
//     {
//         id: '2',
//         text: 'Who was the first President of India?',
//         options: [
//             { label: 'Dr. Rajendra Prasad', value: 'Dr. Rajendra Prasad' },
//             { label: 'Dr. B. R. Ambedkar', value: 'Dr. B. R. Ambedkar' },
//             { label: 'Dr. Sarvepalli Radhakrishnan', value: 'Dr. Sarvepalli Radhakrishnan' }
//         ],
//         correctAnswer: 'Dr. Rajendra Prasad'
//     },
//     {
//         id: '3',
//         text: 'Who invented the Computer?',
//         options: [
//             { label: 'Charles Babbage', value: 'Charles Babbage' },
//             { label: 'Alan Turing', value: 'Alan Turing' },
//             { label: 'John von Neumann', value: 'John von Neumann' }
//         ],
//         correctAnswer: 'Charles Babbage'
//     }
// ];


//     userAnswers = {};
//     @track showQuestions = true;
//     @track showResult = false;
//     @track score = 0;
//     @track resultMessage = '';

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         const selectedValue = event.detail.value;
//         this.userAnswers[questionId] = selectedValue;
//     }

//     handleSubmit() {
//         let correctAnswers = 0;

//         // Evaluate answers and assign classes for display
//         this.questions.forEach((question) => {
//             question.options.forEach((option) => {
//                 if (option.value === question.correctAnswer) {
//                     option.class = 'correct-answer'; // Correct answer is always green
//                 } else if (option.value === this.userAnswers[question.id]) {
//                     option.class = 'wrong-answer'; // Wrong answer chosen by user
//                 } else {
//                     option.class = 'default-answer'; // Neutral styling for other options
//                 }
//             });

//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });

//         this.score = correctAnswers;
//         this.resultMessage = correctAnswers >= 25 ? 'Congratulations, You Passed!' : 'Sorry, You Failed.';
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     retryQuiz() {
//         this.userAnswers = {};
//         this.score = 0;
//         this.questions.forEach((question) => {
//             question.options.forEach((option) => {
//                 delete option.class; // Reset the class for all options
//             });
//         });
//         this.showQuestions = true;
//         this.showResult = false;
//     }
// }


// import { LightningElement, track } from 'lwc';

// export default class QuestionnaireComp extends LightningElement {
//     @track questions = [
//         {
//             id: '1',
//             text: 'What is the default value of an int variable in Java?',
//             options: [
//                 { label: '0', value: '0' },
//                 { label: 'null', value: 'null' },
//                 { label: 'undefined', value: 'undefined' }
//             ],
//             correctAnswer: '0'
//         },
//         {
//             id: '2',
//             text: 'Which keyword is used to create a class in Java?',
//             options: [
//                 { label: 'class', value: 'class' },
//                 { label: 'create', value: 'create' },
//                 { label: 'new', value: 'new' }
//             ],
//             correctAnswer: 'class'
//         },
//         {
//             id: '3',
//             text: 'Which of the following is a reserved keyword in Java?',
//             options: [
//                 { label: 'static', value: 'static' },
//                 { label: 'null', value: 'null' },
//                 { label: 'main', value: 'main' }
//             ],
//             correctAnswer: 'static'
//         },
//         {
//             id: '4',
//             text: 'What is the size of a byte variable in Java?',
//             options: [
//                 { label: '8 bits', value: '8 bits' },
//                 { label: '16 bits', value: '16 bits' },
//                 { label: '32 bits', value: '32 bits' }
//             ],
//             correctAnswer: '8 bits'
//         },
//         {
//             id: '5',
//             text: 'What is the default value of a boolean variable in Java?',
//             options: [
//                 { label: 'true', value: 'true' },
//                 { label: 'false', value: 'false' },
//                 { label: 'null', value: 'null' }
//             ],
//             correctAnswer: 'false'
//         }
//     ];

//     userAnswers = {};
//     @track showQuestions = true;
//     @track showResult = false;
//     @track score = 0;
//     @track attemptedQuestions = 0; // Tracks number of attempted questions
//     @track resultMessage = '';
//     @track formattedTime = '02:00'; // Start with 5 minutes

//     timer; // Reference to the timer interval
//     timeLeft = 120; // 5 minutes in seconds

//     connectedCallback() {
//         // Start the timer when the component is initialized
//         this.startTimer();
//     }

//     disconnectedCallback() {
//         // Clear the timer when the component is destroyed
//         clearInterval(this.timer);
//     }

//     startTimer() {
//         this.timer = setInterval(() => {
//             this.timeLeft--;

//             // Format time as MM:SS
//             const minutes = Math.floor(this.timeLeft / 60);
//             const seconds = this.timeLeft % 60;
//             this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

//             // When the timer reaches 0
//             if (this.timeLeft <= 0) {
//                 clearInterval(this.timer);
//                 this.handleTimeOver();
//             }
//         }, 1000);
//     }

//     handleTimeOver() {
//         // Display the result when time is over
//         this.resultMessage = 'Time Over! Here is your result.';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     handleAnswerChange(event) {
//         const questionId = event.target.dataset.id;
//         const selectedValue = event.detail.value;
//         this.userAnswers[questionId] = selectedValue;
//     }

//     handleSubmit() {
//         // Clear the timer when the user submits the quiz
//         clearInterval(this.timer);

//         this.resultMessage = 'Thank you for completing the quiz!';
//         this.calculateScore();
//         this.showQuestions = false;
//         this.showResult = true;
//     }

//     calculateScore() {
//         let correctAnswers = 0;

//         // Evaluate answers and assign classes for display
//         this.questions.forEach((question) => {
//             question.options.forEach((option) => {
//                 if (option.value === question.correctAnswer) {
//                     option.class = 'correct-answer'; // Correct answer is always green
//                 } else if (option.value === this.userAnswers[question.id]) {
//                     option.class = 'wrong-answer'; // Wrong answer chosen by user
//                 } else {
//                     option.class = 'default-answer'; // Neutral styling for other options
//                 }
//             });

//             if (this.userAnswers[question.id] === question.correctAnswer) {
//                 correctAnswers++;
//             }
//         });

//         this.score = correctAnswers;

//         // Update the number of attempted questions
//         this.attemptedQuestions = Object.keys(this.userAnswers).length;

//         // Determine pass or fail
//         if (this.score >= 4) {
//             this.resultMessage += ' Congratulations, You Passed!';
//         } else {
//             this.resultMessage += ' Sorry, You Failed.';
//         }
//     }

//     retryQuiz() {
//         this.userAnswers = {};
//         this.score = 0;
//         this.questions.forEach((question) => {
//             question.options.forEach((option) => {
//                 delete option.class; // Reset the class for all options
//             });
//         });
//         this.formattedTime = '02:00';
//         this.timeLeft = 120;
//         this.showQuestions = true;
//         this.showResult = false;
//         this.startTimer();
//     }
// }


import { LightningElement, track } from 'lwc';

export default class QuestionnaireComp extends LightningElement {
    @track questions = [
        {
            id: '1',
            text: 'Who is the Father of our Nation?',
            options: [
                { label: 'Mahatma Gandhi', value: 'Mahatma Gandhi' },
                { label: 'Jawaharlal Nehru', value: 'Jawaharlal Nehru' },
                { label: 'Subhas Chandra Bose', value: 'Subhas Chandra Bose' }
            ],
            correctAnswer: 'Mahatma Gandhi'
        },
        {
            id: '2',
            text: 'Who was the first President of India?',
            options: [
                { label: 'Dr. Rajendra Prasad', value: 'Dr. Rajendra Prasad' },
                { label: 'Dr. B. R. Ambedkar', value: 'Dr. B. R. Ambedkar' },
                { label: 'Dr. Sarvepalli Radhakrishnan', value: 'Dr. Sarvepalli Radhakrishnan' }
            ],
            correctAnswer: 'Dr. Rajendra Prasad'
        },
        {
            id: '3',
            text: 'Who invented the Computer?',
            options: [
                { label: 'Charles Babbage', value: 'Charles Babbage' },
                { label: 'Alan Turing', value: 'Alan Turing' },
                { label: 'John von Neumann', value: 'John von Neumann' }
            ],
            correctAnswer: 'Charles Babbage'
        }
    ];

    userAnswers = {};
    @track showStartButton = true; // Initially show "Start Exam" button
    @track showQuestions = false;
    @track showResult = false;
    @track score = 0;
    @track attemptedQuestions = 0; // Tracks number of attempted questions
    @track resultMessage = '';
    @track formattedTime = '01:00'; // Start with 5 minutes

    timer; // Reference to the timer interval
    timeLeft = 60; // 5 minutes in seconds

    startExam() {
        this.showStartButton = false; // Hide "Start Exam" button
        this.showQuestions = true; // Display the quiz
        this.startTimer(); // Start the timer
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;

            // Format time as MM:SS
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // When the timer reaches 0
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeOver();
            }
        }, 1000);
    }

    handleTimeOver() {
        // Display the result when time is over
        this.resultMessage = 'Time Over!';
        this.calculateScore();
        this.showQuestions = false;
        this.showResult = true;
    }

    handleAnswerChange(event) {
        const questionId = event.target.dataset.id;
        const selectedValue = event.detail.value;
        this.userAnswers[questionId] = selectedValue;

        // Update the number of attempted questions
        this.attemptedQuestions = Object.keys(this.userAnswers).length;
    }

    handleSubmit() {
        // Clear the timer when the user submits the quiz
        clearInterval(this.timer);

        this.resultMessage = 'Quiz Completed!';
        this.calculateScore();
        this.showQuestions = false;
        this.showResult = true;
    }

    calculateScore() {
        let correctAnswers = 0;

        // Evaluate answers and assign classes for display
        this.questions.forEach((question) => {
            question.options.forEach((option) => {
                if (option.value === question.correctAnswer) {
                    option.class = 'correct-answer'; // Correct answer is always green
                } else if (option.value === this.userAnswers[question.id]) {
                    option.class = 'wrong-answer'; // Wrong answer chosen by user
                } else {
                    option.class = 'default-answer'; // Neutral styling for other options
                }
            });

            if (this.userAnswers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        this.score = correctAnswers;

        // Update the number of attempted questions
        this.attemptedQuestions = Object.keys(this.userAnswers).length;

        // Determine pass or fail
        if (this.score >= 2) {
            this.resultMessage += ' Congratulations, You Passed!';
        } else {
            this.resultMessage += ' Sorry, You Failed.';
        }
    }

    retryQuiz() {
        this.userAnswers = {};
        this.score = 0;
        this.attemptedQuestions = 0;
        this.questions.forEach((question) => {
            question.options.forEach((option) => {
                delete option.class; // Reset the class for all options
            });
        });
        this.formattedTime = '05:00';
        this.timeLeft = 300;
        this.showQuestions = false;
        this.showResult = false;
        this.showStartButton = true; // Show the "Start Exam" button
    }
}
