# frozen_string_literal: true

class CreateUserShares < ActiveRecord::Migration[7.0]
 def change
   create_table :user_shares do |t|
     t.integer :user_id, null: false
     t.decimal :balance, precision: 15, scale: 2, default: 0.0, null: false
     t.timestamps null: false
   end
   
   add_index :user_shares, :user_id, unique: true
   add_foreign_key :user_shares, :users
 end
end