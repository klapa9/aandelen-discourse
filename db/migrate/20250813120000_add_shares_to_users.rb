# db/migrate/20250814120000_add_shares_to_users.rb
class AddSharesToUsers < ActiveRecord::Migration[6.1]
  def up
    # Voeg een custom_field 'shares' toe aan bestaande gebruikers indien niet aanwezig
    User.all.each do |user|
      user.custom_fields['shares'] ||= 0
      user.save_custom_fields
    end
  end

  def down
    # Verwijder het custom_field 'shares' van alle gebruikers
    User.all.each do |user|
      user.custom_fields.delete('shares')
      user.save_custom_fields
    end
  end
end
