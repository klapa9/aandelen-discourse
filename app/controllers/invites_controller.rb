# frozen_string_literal: true

class InvitesController < ApplicationController
  requires_plugin 'aandelen-discourse'

  before_action :ensure_logged_in

  # GET /aandelen/invites.json
  def index
    user = current_user

    # Nieuwe leden: dit jaar nog geen invites
    if user.created_at.year == Date.today.year
      render json: {
        invites: [],
        max: 0,
        used: 0,
        remaining: 0,
        status: "new_member"
      }
      return
    end

    # Verzonden invites ophalen
    invites = Invite.where(inviter_id: user.id)
                    .order(created_at: :desc)
                    .map do |invite|
      {
        username: invite.invitee&.username || "unknown",
        date: invite.created_at.strftime("%Y-%m-%d"),
        email: invite.email
      }
    end

    # Max aantal invites per jaar
    max_invites = (user.username == "Pieter") ? 4 : 3

    # Berekeningen
    current_year = Date.today.year
    used_this_year = invites.count { |i| Date.parse(i[:date]).year == current_year }
    remaining = [max_invites - used_this_year, 0].max

    # Status bepalen
    status =
      if remaining > 0
        "can_invite"
      else
        "limit_reached"
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
