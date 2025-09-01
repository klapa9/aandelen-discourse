# app/validators/aandelen_invite_validator.rb
class AandelenInviteValidator
  def self.validate(invite)
    user = invite.inviter

    if user.created_at.year == Date.today.year
      invite.errors.add(:base, I18n.t("invites.error.new_member"))
      return
    end

    invites_this_year = Invite.where(
      inviter_id: user.id
    ).where("created_at >= ?", Date.today.beginning_of_year).count

    if invites_this_year >= 1
      invite.errors.add(:base, I18n.t("invites.error.limit_reached"))
    end
  end
end
