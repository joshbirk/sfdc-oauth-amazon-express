var expires_in = 5400;
var sync_request = require('sync-request');

exports.addRoutes = function(app,expiry,debug) {  
  if(debug) {console.log('setting up token endpoint');}    

  app.post('/token',function (req, res) {
    if(debug) {console.log(req.body);}
    if(!expiry) { expires_in = expiry; }

    var sr = sync_request('POST', 'https://login.salesforce.com/services/oauth2/token',
                        {
                        headers: {'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},
                        body: 'grant_type='+req.body.grant_type+'&code='+req.body.code+'&refresh_token='+req.body.refresh_token+'&client_id='+req.body.client_id+'&client_secret='+req.body.client_secret+'&redirect_uri='+req.body.redirect_uri
                        });

    if(debug) {console.log(sr.getBody('utf8'));}
    response = JSON.parse(sr.getBody('utf8'));
    
    response.access_token = response.access_token + " " + response.instance_url;
    response.expires_in = expires_in; //in seconds, set this to be less than your setting under session management.

    res.jsonp(response);
  
  });

  app.get('/token',function (req, res) {

    res.send('Post required.  Expiry set to '+expires_in);

  });
  

  if(debug) {console.log('endpoint set');}    


}

exports.splitToken = function(token) {

  var oauth = {access_token : token.split(" ")[0],
               instance_url : token.split(" ")[1]}
   

  return oauth;
}