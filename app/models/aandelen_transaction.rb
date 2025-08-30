# frozen_string_literal: true

class AandelenTransaction < ActiveRecord::Base
  belongs_to :sender, class_name: "User"
  belongs_to :receiver, class_name: "User"
end
