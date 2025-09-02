# app/validators/aandelen_invite_validator.rb
class AandelenInviteValidator
  def self.validate(invite)
    # --- CORRECTIE 1 ---
    # De methode heet .invited_by, niet .inviter
    user = invite.invited_by

    # Een extra check om zeker te zijn dat de gebruiker bestaat
    return unless user

    if user.created_at.year == Date.today.year
      invite.errors.add(:base, I18n.t("invites.error.new_member"))
      return
    end

    # --- CORRECTIE 2 ---
    # De databasekolom heet 'invited_by_id', niet 'inviter_id'
    invites_this_year = Invite.where(
      invited_by_id: user.id
    ).where("created_at >= ?", Date.today.beginning_of_year).count

    if invites_this_year >= 1
      invite.errors.add(:base, I18n.t("invites.error.limit_reached"))
    end
  end
end