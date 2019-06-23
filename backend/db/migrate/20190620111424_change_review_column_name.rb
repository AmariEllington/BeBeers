class ChangeReviewColumnName < ActiveRecord::Migration[5.2]
  def change
    rename_column :reviews, :review, :review_content
  end
end
