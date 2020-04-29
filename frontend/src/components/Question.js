import React, {Component} from 'react';
import '../stylesheets/Question.css';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      visibleAnswer: false
    }
  }

  flipVisibility() {
    this.setState({visibleAnswer: !this.state.visibleAnswer});
  }

  render() {
    const {question, answer, category, difficulty} = this.props;
    return (
      <div className='Question-holder'>
        <div className='Question'>{question}</div>
        <div className='Question-status'>
          <img className='category' src={`${category}.svg`}/>
          <div className='difficulty'>Difficulty: {difficulty}</div>
          <img
            src='delete.png'
            className='delete'
            onClick={() => this.props.questionAction('DELETE')}
          />
        </div>
        <button
          type='button'
          className='show-answer button'
          onClick={() => this.flipVisibility()}
        >
          {this.state.visibleAnswer ? 'Hide' : 'Show'} Answer
        </button>
        {this.state.visibleAnswer && (
          <div className='answer-holder'>
            <span>Answer: {answer}</span>
          </div>
        )}
      </div>
    );
  }
}

export default Question;