class AandelenController < ApplicationController
  requires_plugin "aandelen-discourse"

  before_action :ensure_logged_in

  def send
    from = params[:from]
    to = params[:to]
    amount = params[:amount].to_i

    # hier zou je DB-logica doen
    # bv. een AandelenTransaction model opslaan

    render json: { success: true }
  end
end
