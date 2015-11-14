var path = require('path');

module.exports = function(app, passport, connection) {
  
  app.get('/', function(req, res) {
    res.render('index.ejs', { signupMessage: req.flash('signupMessage'), 
                                  loginMessage: req.flash('loginMessage')});
  });

  app.get('/dashboard', isLoggedIn, function(req, res) {
      res.render('dashboard.ejs', {user_id: req.user.id});
  });


  // This is the path for the backend
  // developer area. /test leads to the
  // dummy.ejs file. 
  app.get('/test', function(req, res, next) {
      if (req.isAuthenticated()){
          return next();
      }
      else {
        res.render('dummy.ejs')
      };
    }, function(req, res) {
        res.render('dummy.ejs', {user_id: req.user.id});
    });

    // Passport is an authentication system, and we call it here.
    // Passport configuration is in /app/config/passport.js
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/#signup',
        failureFlash: true 
        }) 
    );

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/#login',
        failureFlash: true
        })
    );


    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { 
            successRedirect: '/dashboard',
            failureRedirect: '/login' 
        })
    );

    app.get('/logout', function(req, res) {
        console.log('req', req.logout)
        req.logout();
        res.redirect('/');
    });


    // this is specifically for the test page so it does not end up
    // redirecting back to user-profile. 
    app.get('/testLogout', function(req, res) {
        console.log('req', req.logout)
        req.logout();
        res.redirect('/test');
    });
    app.post('/testSignup', passport.authenticate('local-signup', {
        successRedirect: '/test',
        failureRedirect: '/test',
        failureFlash: true 
        }) 
    );
    app.post('/testLogin', passport.authenticate('local-login', {
        successRedirect: '/test',
        failureRedirect: '/test#fail',
        failureFlash: true
        })
    );

// Serve our controller files
// Our dashboard page has all of these included
// so we have to send them our controller files
// What we *should* have done was put all
// the views and controllers in a "static" folder
// and serve the entire folder.  
  app.get('/controllers/trips.js', function(req, res) {
    res.sendfile('controllers/trips.js');
  });

  app.get('/controllers/profile.js', function(req, res) {
    res.sendfile('controllers/profile.js');
  });

  app.get('/controllers/friends.js', function(req, res) {
    res.sendfile('controllers/friends.js');
  });

  app.get('/controllers/messages.js', function(req, res) {
    res.sendfile('controllers/messages.js');
  });

  app.get('/controllers/blogs.js', function(req, res) {
    res.sendfile('controllers/blogs.js');
  });

  app.get('/controllers/feedback.js', function(req, res) {
    res.sendfile('controllers/feedback.js');
  });

// These routes talk to the database. These *can't* be served from a "static" folder
// Making Trips
  app.post('/api/createTrip', isLoggedIn, function(req, res) {
    Trips.addTrip(req.body.destination, req.body.geocode_latitude, req.body
        .geocode_longitude, req.body.start, req.body.end)
      .then(function(response) {
        res.send(response);
      });
  });
  app.post('/api/createUserTrip', isLoggedIn, function(req, res) {
    UsersTrips.makeTrip(req.body.trip_id, req.user.id)
      .then(
        Media.addMedia(req.body.trip_id, req.body.media, 'trip')
        .then(function(response) {
          res.send(response);
        }));
  });

  // Getting Trips By User Name
  app.post('/api/getTrips', isLoggedIn, function(req, res) {
    Trips.getTripsByUsername(req.body.username)
      .then(function(response) {
        res.send(response);
      });
  });

  // Getting Trips of the Logged In User
  app.post('/api/getMyTrips', isLoggedIn, function(req, res) {
    Trips.getTripsById(req.user.id)
      .then(function(response) {
        res.send(response);
      });
  });

  // Getting Trips By Time
  app.post('/api/getTripsByTime', isLoggedIn, function(req, res) {
    Trips.getTripsByTime(req.body.start, req.body.end)
      .then(function(response) {
        res.send(response);
      });
  });

  // Add activity to trip
  app.post('/api/addActivity', isLoggedIn, function(req, res) {
    Activities.addActivity(req.body.users_trips_id, req.body.activity)
      .then(function(response) {
        res.send(response);
      });
  });



  // Adding Profile
  app.post('/api/addProfile', isLoggedIn, function(req, res) {
    Users.addProfile(req.user.id, req.body.profile)
      .then(
        Media.addMedia(req.user.id, req.body.profilepic, 'user')
        .then(function(response) {
          res.send(response);
        }));
  });

  // Getting Profile (by username)
  app.post('/api/getProfile', isLoggedIn, function(req, res) {
    Users.getUserByName(req.body.username)
      .then(function(response) {
        res.send(response);
      });
  });

  // Befriend
  app.post('/api/befriend', isLoggedIn, function(req, res) {
    Friends.befriend(req.body.friender, req.body.friendee)
      .then(function(response) {
        res.send(response);
      });
  });

  // Get Friends
  app.post('/api/getFriends', isLoggedIn, function(req, res) {
    Friends.getFriends(req.body)
      .then(function(response) {
        res.send(response);
      });
  });
  
  // Messages - Send Message
  app.post('/api/sendMessage', isLoggedIn, function(req, res) {
    Messages.addMessage(req.body.sender_id, req.body.reciever_id, req.body
        .subject, req.body.content)
      .then(function(response) {
        res.send(response);
      });
  });

  // Get Messages
  app.post('/api/getMessages', isLoggedIn, function(req, res) {
    console.log('route', req.body.username, req.body.recOrSend);
    Messages.getMessages(req.body.username, req.body.recOrSend)
      .then(function(response) {
        res.send(response);
      });
  });

  // Blogs - add blogs
  app.post('/api/publishBlog', isLoggedIn, function(req, res) {
    Blogs.publishBlog(req.body.author_id, req.body.subject, req.body.body, req.body.media)
      .then(function(response) {
          res.send(response);
        });
  });

  // Blogs - Get Blogs
  app.post('/api/getBlogs', isLoggedIn, function(req, res) {
    console.log('route', req.body.username);
    Blogs.getBlogs(req.body.username)
      .then(function(response) {
        res.send(response);
      });
  });


  // Feedback - leave Feedback
  app.post('/api/addFeedback', isLoggedIn, function(req, res) {
    Feedback.addFeedback(req.body.author_id, req.body.subject_id, req.body.feedback)
      .then(function(response) {
        res.send(response);
      });
  });

  // Feedback - get Feedback
  app.post('/api/getFeedback', isLoggedIn, function(req, res) {
    Feedback.getFeedback(req.body.username, req.body.authOrSubj)
      .then(function(response) {
        res.send(response);
      });
  });

    // Angular Files ===============================================================
    // again, we *should* have served these from a static folder
    // =============================================================================
    app.get('/bower_components/angular/angular.js', function(req, res) {
        res.sendfile('bower_components/angular/angular.js');
    });

    app.get('/bower_components/angular-route/angular-route.js', function(req, res) {
        res.sendfile('bower_components/angular-route/angular-route.js');
    });

    app.get('/views/js/jquery.js', function(req, res) {
        res.sendfile('views/js/jquery.js');
    });

    app.get('/bower_components/angular-bootstrap/ui-bootstrap.js', function(req, res) {
        res.sendfile('bower_components/angular-bootstrap/ui-bootstrap.js');
    });

    app.get('/bower_components/angular-xeditable/dist/js/xeditable.js', function(req, res) {
        res.sendfile('bower_components/angular-xeditable/dist/js/xeditable.js');
    });

    app.get('/bower_components/angular-xeditable/dist/css/xeditable.css', function(req, res) {
        res.sendfile('bower_components/angular-xeditable/dist/css/xeditable.css');
    });

    app.get('/app/app.js', function(req, res) {
        res.sendfile('app/app.js');
    });

    app.get('/views/trips.html', function(req, res) {
        res.sendfile('views/trips.html');
    })

    app.get('/views/profile.html', function(req, res) {
        res.sendfile('views/profile.html');
    })

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

        // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        
        res.redirect('/');
    }

}