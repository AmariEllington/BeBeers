class CreateBeers < ActiveRecord::Migration[5.2]
  def change
    create_table :beers do |t|
      t.string :name
      t.string :brewery
      t.references :country, foreign_key: true
      t.string :style
      t.text :notes
      t.integer :abv
      t.string :image

      t.timestamps
    end
  end
end
