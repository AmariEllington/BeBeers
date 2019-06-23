class StylesController < ApplicationController

  def index
    styles = Style.all
    render json: styles
end

def show    
   style = Style.find(params[:id])
    render json: style
end

end
