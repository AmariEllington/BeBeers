class CreateReviews < ActiveRecord::Migration[5.2]
  def change
    create_table :reviews do |t|
      t.references :beer, foreign_key: true
      t.references :user, foreign_key: true
      t.text :review
      t.float :rating

      t.timestamps
    end
  end
end
