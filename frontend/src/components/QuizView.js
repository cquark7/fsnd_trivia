import React, {Component} from 'react';
import $ from 'jquery';
import {BASE_URL} from "../App";

import '../stylesheets/QuizView.css';

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      categories: [],
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      lastQuestion: false,
      endGame: false,
    };
  }

  componentDidMount() {
    $.ajax({
      url: `${BASE_URL}/categories`,
      type: 'GET',
      success: (result) => {
        this.setState({categories: result.categories});

      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again');

      },
    });
  }

  selectCategory = ({type, id = 0}) => {
    this.setState({quizCategory: {type, id}}, this.getNextQuestion);
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  getNextQuestion = () => {
    if (!this.state.lastQuestion) {
      const previousQuestions = [...this.state.previousQuestions];
      if (this.state.currentQuestion.id) {
        previousQuestions.push(this.state.currentQuestion.id);
      }
      if (previousQuestions.length === 5) {
        this.setState({endGame: true})
      }

      $.ajax({
        url: `${BASE_URL}/quizzes`,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          previous_questions: previousQuestions,
          quiz_category: this.state.quizCategory.id,
        }),
        xhrFields: {
          withCredentials: true,
        },
        crossDomain: true,
        success: (result) => {
          this.setState({
            showAnswer: false,
            previousQuestions: previousQuestions,
            currentQuestion: result.question,
            lastQuestion: result.last_question,
            guess: '',
          });

        },
        error: (error) => {
          alert('Unable to load question. Please try your request again');

        },
      });
    } else {
      this.setState({endGame: true});
    }
  };


  submitGuess = (event) => {
    event.preventDefault();
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    let evaluate = this.evaluateAnswer();
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    });
  };

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      lastQuestion: false,
      endGame: false,
    });
  };

  renderPrePlay() {
    return (
      <div className='quiz-play-holder'>
        <div className='choose-header'>Choose Category</div>
        <div className='category-holder'>
          <div className='play-category' onClick={this.selectCategory}>
            ALL
          </div>
          {this.state.categories.map((category) => {
            return (
              <div
                key={category.id}
                value={category.id}
                className='play-category'
                onClick={() => this.selectCategory(category)}
              >
                {category.type}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderFinalScore() {
    return (
      <div className='quiz-play-holder'>
        <div className='final-header'>
          Your Final Score is {this.state.numCorrect}
        </div>
        <button
          type='button'
          className='play-again button'
          onClick={this.restartGame}
        >
          Play Again?
        </button>
      </div>
    );
  }


  evaluateAnswer = () => {
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    const answerArray = this.state.currentQuestion.answer
      .toLowerCase()
      .split(' ');
    return answerArray.includes(formatGuess);
  };


  renderCorrectAnswer() {
    const formatGuess = this.state.guess
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .toLowerCase();
    let evaluate = this.evaluateAnswer();
    return (
      <div className='quiz-play-holder'>
        <div className='quiz-question'>
          {this.state.currentQuestion.question}
        </div>
        <div className={`${evaluate ? 'correct' : 'wrong'}`}>
          {evaluate ? 'You were correct!' : 'You were incorrect'}
        </div>
        <div className='quiz-answer'>{this.state.currentQuestion.answer}</div>
        <button
          type='button'
          className='next-question button'
          onClick={this.getNextQuestion}
        >
          Next Question
        </button>
      </div>
    );
  }


  renderPlay() {
    return this.state.previousQuestions.length === questionsPerPlay ||
    this.state.endGame ? (
      this.renderFinalScore()
    ) : this.state.showAnswer ? (
      this.renderCorrectAnswer()
    ) : (
      <div className='quiz-play-holder'>
        <div className='quiz-question'>
          {this.state.currentQuestion.question}
        </div>
        <form onSubmit={this.submitGuess}>
          <input type='text' name='guess' onChange={this.handleChange}/>
          <input
            className='submit-guess button'
            type='submit'
            value='Submit Answer'
          />
        </form>
      </div>
    );
  }

  render() {
    return this.state.quizCategory ? this.renderPlay() : this.renderPrePlay();
  }
}

export default QuizView;