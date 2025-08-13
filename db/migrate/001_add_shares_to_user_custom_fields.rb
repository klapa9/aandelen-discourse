# frozen_string_literal: true

class AddSharesToUserCustomFields < ActiveRecord::Migration[6.1]
  def change
    add_column :user_custom_fields, :shares, :integer, default: 0
  end
end
