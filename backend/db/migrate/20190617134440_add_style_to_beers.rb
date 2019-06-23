class AddStyleToBeers < ActiveRecord::Migration[5.2]
  def change
    add_reference :beers, :style, foreign_key: true
  end
end
