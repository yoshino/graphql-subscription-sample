module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user || reject_unauthorized_connection
    end

    private

    def find_verified_user
      User.first
    end
  end
end
