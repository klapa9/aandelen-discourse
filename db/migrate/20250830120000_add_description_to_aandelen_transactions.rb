class AddDescriptionToAandelenTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :aandelen_transactions, :description, :text
  end
end
