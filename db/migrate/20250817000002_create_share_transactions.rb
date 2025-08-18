# frozen_string_literal: true

class CreateShareTransactions < ActiveRecord::Migration[7.0]
 def change
   create_table :share_transactions do |t|
     t.integer :sender_id, null: false
     t.integer :receiver_id, null: false
     t.decimal :amount, precision: 15, scale: 2, null: false
     t.text :note
     t.timestamps null: false
   end

   add_index :share_transactions, :sender_id
   add_index :share_transactions, :receiver_id
   add_index :share_transactions, :created_at
   add_foreign_key :share_transactions, :users, column: :sender_id
   add_foreign_key :share_transactions, :users, column: :receiver_id
 end
end