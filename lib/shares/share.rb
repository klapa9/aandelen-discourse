module Shares
  class Share
    def self.get(user)
      user.custom_fields["shares"].to_i
    end

    def self.set(user, value)
      user.custom_fields["shares"] = value
      user.save_custom_fields
    end

    def self.give(from_user, to_user, count)
      from = get(from_user)
      to = get(to_user)

      raise Discourse::InvalidParameters.new(:count) if count <= 0
      raise Discourse::InvalidAccess.new(I18n.t("shares.not_enough")) if from < count

      set(from_user, from - count)
      set(to_user, to + count)
    end
  end
end
