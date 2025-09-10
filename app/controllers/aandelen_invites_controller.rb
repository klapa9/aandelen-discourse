# frozen_string_literal: true

class AandelenInvitesController < ApplicationController
  requires_plugin 'aandelen-discourse'

  before_action :ensure_logged_in

  # GET /aandelen/invites.json
  def index
    user = current_user
    current_year = Date.today.year
    max_invites = 3

    # Verzonden invites ophalen (niet van Martijn)
   invites = Invite
    .where(invited_by_id: user.id)
    .order(created_at: :desc)
    .map do |invite|
      invited_user = InvitedUser.find_by(invite_id: invite.id)
      username = invited_user&.user&.username

      {
        email: invite.email,
        date: invite.created_at.strftime("%Y-%m-%d"),
        username: username
      }
    end




    # Bereken het aantal gebruikte invites dit jaar
    used_this_year = invites.count { |i| Date.parse(i[:date]).year == current_year }
    remaining = [max_invites - used_this_year, 0].max

    # Status bepalen
    status =
      if used_this_year > 0
        "limit_reached"
      elsif user.created_at.year == current_year
        "new_member"
      else
        remaining > 0 ? "can_invite" : "limit_reached"
      end

    render json: {
      invites: invites,
      max: max_invites,
      used: used_this_year,
      remaining: remaining,
      status: status
    }
  end
end
