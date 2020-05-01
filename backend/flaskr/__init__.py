from flask import Flask, request, abort, jsonify
from flask_cors import CORS

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)

    '''
    Set up CORS. Allow '*' for origins. Delete the sample route after completing the TODOs
    '''
    CORS(app, resources={"*": {"origins": "http://localhost:3000"}})

    '''
    Use the after_request decorator to set Access-Control-Allow
    '''

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    '''
    Create an endpoint to handle GET requests 
    for all available categories.
    '''

    @app.route('/categories')
    def get_categories():
        categories = [category.format() for category in Category.query.all()]

        return jsonify({
            'success': True,
            'categories': categories
        })

    '''
    Create an endpoint to handle GET requests for questions, 
    including pagination (every 10 questions). 
    This endpoint should return a list of questions, 
    number of total questions, current category, categories. 
  
    TEST: At this point, when you start the application
    you should see questions and categories generated,
    ten questions per page and pagination at the bottom of the screen for three pages.
    Clicking on the page numbers should update the questions. 
    '''

    @app.route('/questions')
    def get_paginated_questions():
        page = request.args.get('page', 1, type=int)
        results = Question.query.all()
        categories = [category.format() for category in Category.query.all()]
        start = (page - 1) * QUESTIONS_PER_PAGE
        end = start + QUESTIONS_PER_PAGE
        questions = [q.format() for q in results][start:end]

        return jsonify({
            'success': True,
            'questions': questions,
            'total_questions': len(results),
            'categories': categories,
            'current_category': None
        })

    '''
    Create an endpoint to DELETE question using a question ID. 
    
    TEST: When you click the trash icon next to a question, the question will be removed.
    This removal will persist in the database and when you refresh the page. 
    '''

    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        question = Question.query.filter_by(id=question_id).first()
        try:
            question.delete()
        except:
            abort(422)
        return jsonify({
            'success': True,
            'message': 'Question successfully deleted',
            'id': question_id
        })

    '''
    Create an endpoint to POST a new question, 
    which will require the question and answer text, 
    category, and difficulty score.
    
    TEST: When you submit a question on the "Add" tab, 
    the form will clear and the question will appear at the end of the last page
    of the questions list in the "List" tab.  
    '''

    @app.route('/questions', methods=['POST'])
    def add_a_question():
        body = request.get_json()

        question = body['question']
        answer = body['answer']
        category = body['category']
        difficulty = body['difficulty']

        try:
            new_quesion = Question(
                question=question, answer=answer, category=category, difficulty=difficulty)
            new_quesion.insert()
        except:
            abort(422)

        return jsonify({
            'success': True,
            'message': 'Question successfully created',
            'question': {
                'question': question,
                'answer': answer,
                'category': category,
                'difficulty': difficulty,
            }
        })

    '''
    Create a POST endpoint to get questions based on a search term. 
    It should return any questions for whom the search term 
    is a substring of the question. 
    
    TEST: Search by any phrase. The questions list will update to include 
    only question that include that string within their question. 
    Try using the word "title" to start. 
    '''

    @app.route('/questions/search', methods=['POST'])
    def search_question():
        body = request.get_json()
        search_term = body.get('search_term', None)
        if search_term is None:
            abort(422)

        searched_question = Question.query.filter(
            Question.question.ilike(f'%{search_term}%')).all()
        return jsonify({
            'success': True,
            'questions': [question.format() for question in searched_question],
            'total_questions': len(searched_question)
        })

    '''
    Create a GET endpoint to get questions based on category. 
    
    TEST: In the "List" tab / main screen, clicking on one of the 
    categories in the left column will cause only questions of that 
    category to be shown. 
    '''

    @app.route('/categories/<int:category_id>/questions')
    def get_questions_by_category(category_id):
        category = Category.query.filter_by(id=category_id).first()
        if category is None:
            abort(404)

        questions = [question.format() for question in category.questions]
        return jsonify({
            'success': True,
            'questions': questions,
            'total_questions': len(questions),
            'current_category': category.format()
        })

    '''
    Create a POST endpoint to get questions to play the quiz. 
    This endpoint should take category and previous question parameters 
    and return a random questions within the given category, 
    if provided, and that is not one of the previous questions. 
    
    TEST: In the "Play" tab, after a user selects "All" or a category,
    one question at a time is displayed, the user is allowed to answer
    and shown whether they were correct or not. 
    '''

    @app.route('/quizzes', methods=['POST'])
    def get_next_question():
        body = request.get_json()
        category = body['quiz_category']
        previous_questions = body['previous_questions']
        index = len(previous_questions)
        questions_query = Question.query

        if category != 0:
            questions_query = Question.query.filter(
                Question.category == category)

        questions = questions_query.filter(Question.id not in previous_questions).all()

        next_question = questions[index]

        if index == questions_query.count() - 1:
            return jsonify({
                'success': True,
                'question': next_question.format(),
                'last_question': True
            })

        if index > questions_query.count() - 1:
            abort(404)

        return jsonify({
            'success': True,
            'question': next_question.format(),
            'last_question': False
        })

    '''
    @TODO: 
    Create error handlers for all expected errors 
    including 404 and 422. 
    '''

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Bad request"
        }), 400

    @app.errorhandler(404)
    def resource_not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": "Resource not found"
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "Method not allowed"
        }), 405

    @app.errorhandler(422)
    def unprocessable_request(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "Unprocessable request"
        }), 422

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "Internal server error"
        }), 500

    return app
