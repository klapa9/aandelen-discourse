module Aandelen
  class AutomatischeTransactie
    def self.execute(new_user)
      # Vind de uitnodiger via Invite
      inviter = new_user.invited_by
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
          description: "Welkom bij Magast! #{inviter.username} heeft zo veel vertrouwen in jou dat hij de helft van zijn aandelen schenkt als welkomstgeschenk!"
        )
      end
    end
  end
end
