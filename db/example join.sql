SELECT username, dest_name
FROM users INNER JOIN users_trips ON users.id=users_trips.user_id INNER JOIN trips ON users_trips.trip_id=trips.id
WHERE users.id=3;