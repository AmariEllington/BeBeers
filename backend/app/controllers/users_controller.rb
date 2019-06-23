class UsersController < ApplicationController
    



  def index
      users = User.all
      render json: users
  end
  def show
      user = User.find(params[:id])
      render json: user
  end
  def new
      user = User.new
      
  end
  def create
      user = User.new( user_params)
      if user.valid?
         user.save
        render json: user
      else
        render json: { error: 'Username already taken' }, status: 404
      end
  end

  def edit
      user = User.find(params[:id])
  end

  def update
      user = User.find(params[:id])
      user.update(user_params)
      render json: user
  end

  def destroy
      user = User.find(params[:id])
      user.destroy
      render json: user
  end


  def get_user
    user = User.find_by(username: params[:username])
    if user
        render json: user
    else
        render json: { error: 'User not found' }, status: 404
    end
  end

  private 
  def user_params
      params.require(:user).permit(:username)
  end
end
