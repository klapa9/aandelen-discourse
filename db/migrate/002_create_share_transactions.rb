# frozen_string_literal: true

class CreateShareTransactions < ActiveRecord::Migration[7.0]
 def change
   create_table :share_transactions do |t|
     t.references :sender, null: false, foreign_key: { to_table: :users }
     t.references :receiver, null: false, foreign_key: { to_table: :users }
     t.decimal :amount, precision: 10, scale: 2, null: false
     t.text :note
     t.timestamps
   end

   add_index :share_transactions, [:sender_id, :created_at]
   add_index :share_transactions, [:receiver_id, :created_at]
 end
end