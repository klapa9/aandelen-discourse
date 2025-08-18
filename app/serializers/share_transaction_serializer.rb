# frozen_string_literal: true

class UserShareSerializer < ApplicationSerializer
 attributes :id, :balance, :user_id
end
```

### `app/serializers/share_transaction_serializer.rb`
```ruby
# frozen_string_literal: true

class ShareTransactionSerializer < ApplicationSerializer
 attributes :id, :amount, :created_at, :sender_username, :receiver_username
 
 def sender_username
   object.sender.username
 end
 
 def receiver_username
   object.receiver.username
 end
end
