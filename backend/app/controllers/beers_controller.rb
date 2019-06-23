class BeersController < ApplicationController
  
  def index
    beers_db = Beer.all
    reviews = Review.all
    beers = []
    beers_db.map do |beer|
      beer = beer.as_json
      beer[:reviews] = Beer.find(beer["id"]).reviews.as_json.map do |review|
        review[:username] = Review.find(review["id"]).user.username
        review
      end
      beer[:style] = Beer.find(beer["id"]).style.as_json
      beer[:country] = Beer.find(beer["id"]).country.as_json
      beers << beer
    end
    # reviews = Review.all.map {|review| review = add_username_to_review(review)}
    render json: beers
    #   {
    #     :reviews => { 
    #       except: [ :created_at, :updated_at]
    #     }
    #   },
    #   {
    #     :country => {
    #       except: [:id, :created_at, :updated_at]
    #     }
    #   },
    #   {
    #     :style => {
    #       except: [:id, :created_at, :updated_at]
    #     }
    #   },
    #   {
    #     :users => {
    #       except: [:id, :created_at, :updated_at]
    #     }
    #   }
    # ]
  end
  def show
    beer = Beer.find(params[:id])
    render json: beer, include: [
      {
        :reviews => { 
          except: [:id, :beer_id, :created_at, :updated_at]
        }
      },
      {
        :country => {
          except: [:id, :created_at, :updated_at]
        }
      },
      {
        :style => {
          except: [:id, :created_at, :updated_at]
        }
      },
      {
        :users => {
          except: [:id, :created_at, :updated_at]
        }
      }
    ]
      
      
  end
  def new
    beer = Beer.new
    
  end
  def create
    beer = Beer.create(beer_params)
    render json: beer
  end
  def edit
    beer = Beer.find(params[:id])
   
  end
  def update
    beer = Beer.find(params[:id])
    beer.update(beer_params)
    render json: beer
  end
  private 
  def beer_params
    params.require(:beer).permit(:name, :brewery, :country_id, :notes, :abv, :image, :style_id)
    
  end
  
  def add_username_to_review(review)
    reviewHash = review.as_json
    username = User.find(review.user_id).username
    reviewHash[:username] = username
    reviewHash
  end

end
