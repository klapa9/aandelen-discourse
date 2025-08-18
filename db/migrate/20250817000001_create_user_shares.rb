# frozen_string_literal: true

class CreateUserShares < ActiveRecord::Migration[7.0]
 def change
   create_table :user_shares do |t|
     t.references :user, null: false, foreign_key: true, index: { unique: true }
     t.decimal :balance, precision: 10, scale: 2, default: 0.0, null: false
     t.timestamps
   end
 end
end