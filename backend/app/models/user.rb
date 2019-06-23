class User < ApplicationRecord
  validates :username, presence: true, uniqueness: true
  has_many :reviews
  has_many :beers, through: :reviews
end