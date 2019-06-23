class ReviewsController < ApplicationController
  def index
      reviews = Review.all
      reviews = reviews.map {|review| review = add_username_to_review(review)}
      render json: reviews

  end
  
  def show    
    review = Review.find(params[:id])
    #   byebug
    review = add_username_to_review(review)
    render json: review
  end
  def new
      review = Review.new
      
  end
  def create
      review = Review.create(review_params)
      render json: review
      
  end
  def edit
      review = Review.find(params[:id])
      
  end
  private
  def review_params 
      params.require(:review).permit(:beer_id, :user_id, :review_content, :rating)
      
  end

  def add_username_to_review(review)
    reviewHash = review.as_json
    username = User.find(review.user_id).username
    reviewHash[:username] = username
    reviewHash
  end
  
end
