module Aandelen
  class AutomatischeTransactie
    def self.execute(new_user)
      # Vind de uitnodiger via Invite
      invite = Invite.find_by(email: new_user.email)
      inviter = invite&.invited_by
      return unless inviter

      inviter_aandelen = inviter.aandelen_balance || 0
      return if inviter_aandelen <= 0

      helft_aandelen = (inviter_aandelen / 2).floor
      return if helft_aandelen <= 0

      ActiveRecord::Base.transaction do
        inviter.update!(aandelen_balance: inviter_aandelen - helft_aandelen)
        new_user.update!(aandelen_balance: helft_aandelen)

        ::AandelenTransaction.create!(
          sender: inviter,
          receiver: new_user,
          amount: helft_aandelen,
          description: "Automatische toewijzing bij uitnodiging"
        )
      end
    end
  end
end
