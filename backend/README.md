# Full Stack Trivia API Backend

## Getting Started

### Installing Dependencies

#### Python 3.7

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Enviornment

We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

Once you have your virtual environment setup and running, install dependencies by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

This will install all of the required packages we selected within the `requirements.txt` file.

##### Key Dependencies

- [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

## Database Setup
With Postgres running, restore a database using the trivia.psql file provided. From the backend folder in terminal run:
```bash
psql trivia < trivia.psql
```

## Running the server

From within the `backend` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
export FLASK_APP=flaskr
export FLASK_ENV=development
flask run
```

Setting the `FLASK_ENV` variable to `development` will detect file changes and restart the server automatically.

Setting the `FLASK_APP` variable to `flaskr` directs flask to use the `flaskr` directory and the `__init__.py` file to find the application. 

## Tasks

One note before you delve into your tasks: for each endpoint you are expected to define the endpoint and response data. The frontend will be a plentiful resource because it is set up to expect certain endpoints and response data formats already. You should feel free to specify endpoints in your own way; if you do so, make sure to update the frontend or you will get some unexpected behavior. 

1. Use Flask-CORS to enable cross-domain requests and set response headers. 
2. Create an endpoint to handle GET requests for questions, including pagination (every 10 questions). This endpoint should return a list of questions, number of total questions, current category, categories. 
3. Create an endpoint to handle GET requests for all available categories. 
4. Create an endpoint to DELETE question using a question ID. 
5. Create an endpoint to POST a new question, which will require the question and answer text, category, and difficulty score. 
6. Create a POST endpoint to get questions based on category. 
7. Create a POST endpoint to get questions based on a search term. It should return any questions for whom the search term is a substring of the question. 
8. Create a POST endpoint to get questions to play the quiz. This endpoint should take category and previous question parameters and return a random questions within the given category, if provided, and that is not one of the previous questions. 
9. Create error handlers for all expected errors including 400, 404, 422 and 500. 

## API Endpoints

#### GET `/categories`

Returns a list of dictionaries with keys `id` and `type`.

- **Request Arguments:** None
- **Response:**

```
{
  "categories": [
    {
      "id": 1,
      "type": "Science"
    },
    {
      "id": 2,
      "type": "Art"
    },
    ...
  ],
  "success": true
}

```


#### GET '/questions'

Returns a list of questions, categories, success value and total number of questions
Questions are paginated on server side in a group of 10.

- **Request Arguments:** page number \<int>
- **Response:**
```
curl http://localhost:5000/questions 
```

```
{
  {
    "categories": [
      {
        "id": 1,
        "type": "Science"
      },
        ...
    ],
    "current_category": null, 
    "questions": [
      {
        "answer": "Apollo 13",
        "category": 5,
        "difficulty": 4,
        "id": 2,
        "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
      },
    ...
    ],
    "success": true,
    "total_questions": 20
  }
}

```


### GET '/categories/:category_id/questions'

Gets list of questions from chosen category, success value and the total count of questions in chosen category and the category itself

- **Request Arguments:** category id \<int>
- **Response:**
```
curl http://localhost:5000/categories/1/questions
```

```
{
  "current_category": {
    "id": 1,
    "type": "Science"
  },
  "questions": [
    {
      "answer": "The Liver",
      "category": 1,
      "difficulty": 4,
      "id": 20,
      "question": "What is the heaviest organ in the human body?"
    },
    {
      "answer": "Alexander Fleming",
      "category": 1,
      "difficulty": 3,
      "id": 21,
      "question": "Who discovered penicillin?"
    },
    {
      "answer": "Blood",
      "category": 1,
      "difficulty": 4,
      "id": 22,
      "question": "Hematology is a branch of medicine involving the study of what?"
    }
  ],
  "success": true,
  "total_questions": 3
}
```


#### POST '/questions'

Creates a new question using the submitted data (question, answer, difficulty, category). Returns the success value.

- **Request Arguments:** None
- **Request Body:** (json) 
```
{
  "question": "Which planet has the most gravity?",
  "answer": "Jupiter",
  "category": 1 (integer, 1-5),
  "difficulty": 2 (integer, 1-5)
}
```
- **Response**
```
curl http://localhost:5000/questions -X POST -H "Content-Type: application/json" -d '{"question": "Which planet has the most gravity?","answer":"Jupiter", "category": 1, "difficulty": 2}' 
```
```
{
  "message": "Question successfully created", 
  "question": {
    "answer": "Jupiter", 
    "category": 1, 
    "difficulty": 2, 
    "question": "Which planet has the most gravity?"
  }, 
  "success": true
}

```


#### POST '/questions/search'

Gets questions with submitted search term (case insensitive). Returns questions list, success value and total questions count.

- **Request Arguments:** None
- **Request Body:** (json) 
```
{
  "search_term": "actor",
}
```
- **Response**
```
curl http://localhost:5000/questions/search -X POST -H "Content-Type: application/json" -d '{"search_term": "actor"}' 
```
```
{
  "questions": [
    {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }
  ], 
  "success": true, 
  "total_questions": 1
}

```


#### POST '/quizzes'

Gets one question of chosen category for the quiz. Returns a question, success value and information whether the question is the last one.

- **Request Arguments:** None
- **Request Body:** (json)
```
{
    "quiz_category": 1, // (integer, 1-5) 
    "previous_questions": [] // (array of previous questions)
}
```
- **Response**
```
curl http://localhost:5000/quizzes -X POST -H "Content-Type: application/json" -d '{"quiz_category": 1, "previous_questions": []}'
```

```
{
  "question": {
    "answer": "The Liver", 
    "category": 1, 
    "difficulty": 4, 
    "id": 20, 
    "question": "What is the heaviest organ in the human body?"
  }, 
  "success": true,
  "last_question": false
}

```


#### DELETE '/questions/:question_id'

Creates a new question using the submitted data (question, answer, difficulty, category). Returns the success value.

- **Request Arguments:** question_id (integer)
- **Response**
```
curl http://localhost:5000/questions/21 -X DELETE
```
```
{
  "id": 21, 
  "message": "Question successfully deleted", 
  "success": true
}


```


## Error Handling
Errors are returned as JSON objects in the following format:
```
{
    "success": False, 
    "error": 400,
    "message": "Bad request"
}
```
Error types:

400: Bad Request
404: Resource Not Found
405: Method Not Allowed
422: Unprocessable
500: Internal Server Error


## Testing
To run the tests, run
```
dropdb trivia_test
createdb trivia_test
psql trivia_test < trivia.psql
python test_flaskr.py
```