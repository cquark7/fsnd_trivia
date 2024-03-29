import React, {Component} from 'react';
import $ from 'jquery';

import '../stylesheets/FormView.css';
import {BASE_URL} from "../App";


class FormView extends Component {
  constructor(props) {
    super();
    this.state = {
      question: '',
      answer: '',
      difficulty: 1,
      category: 1,
      categories: [],
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

  submitQuestion = (event) => {
    event.preventDefault();
    $.ajax({
      url: `${BASE_URL}/questions`,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
        difficulty: this.state.difficulty,
        category: this.state.category,
      }),
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
      success: (result) => {
        document.getElementById('add-question-form').reset();
        alert(result.message);

      },
      error: (error) => {
        alert('Unable to add question. Please try your request again');

      },
    });
  };

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  };

  render() {
    return (
      <div id='add-form'>
        <h2>Add a New Trivia Question</h2>
        <form
          className='form-view'
          id='add-question-form'
          onSubmit={this.submitQuestion}
        >
          <label>
            <span>Question</span>
            <input type='text' name='question' onChange={this.handleChange}/>
          </label>
          <label>
            <span>Answer</span>
            <input type='text' name='answer' onChange={this.handleChange}/>
          </label>
          <label>
            <span>Difficulty</span>
            <select name='difficulty' onChange={this.handleChange}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select name='category' onChange={this.handleChange}>
              {this.state.categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.type}
                  </option>
                );
              })}
            </select>
          </label>
          <input type='submit' className='button' value='Submit'/>
        </form>
      </div>
    );
  }
}

export default FormView;