class AandelenController < ApplicationController

  requires_plugin "aandelen-discourse"


 

  before_action :ensure_logged_in


 

  # Huidige saldo van ingelogde gebruiker

  def balance

    render json: { balance: current_user.aandelen_balance || 0 }

  end


 

  def send

    from_user = current_user

    to_user = User.find_by(username: params[:to])

    amount = params[:amount].to_i


 

    if amount <= 0

      render json: { success: false, error: "Ongeldig aantal" }, status: 422

      return

    end


 

    if from_user.aandelen_balance < amount

      render json: { success: false, error: "Niet genoeg aandelen" }, status: 422

      return

    end


 

    # Verlaag saldo van verzender

    from_user.aandelen_balance -= amount

    from_user.save!


 

    # Verhoog saldo van ontvanger

    to_user.aandelen_balance ||= 0

    to_user.aandelen_balance += amount

    to_user.save!


 

    # Eventueel: log de transactie in een model

    AandelenTransaction.create!(

      sender_id: from_user.id,

      receiver_id: to_user.id,

      amount: amount

    )


 

    render json: { success: true }

  end

end


 