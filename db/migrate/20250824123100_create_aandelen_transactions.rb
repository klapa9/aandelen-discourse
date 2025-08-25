class CreateAandelenTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :aandelen_transactions do |t|
      t.integer :sender_id, null: false
      t.integer :receiver_id, null: false
      t.integer :amount, null: false
      t.timestamps
    end
  end
end
