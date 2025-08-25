class AddAandelenBalanceToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :aandelen_balance, :integer, default: 0
  end
end
