var express = require('express');
var router = express.Router();

// let AWS_CONFIG  = require('./env');
let AWS = require('aws-sdk');
const axios = require('axios');

/* GET home page. */
router.get('/tempCredentials', function(req, res, next) {
    axios.get("http://169.254.169.254/latest/meta-data/iam/info")
      .then(response => response.data)
      .then(data => {
        console.log(data);
    })
        let roleArn = `arn:aws:iam::315465781430:instance-profile/Application-CDE-MSD-DevOps-Role`;
        console.log("Assuming role: "+roleArn);

        let sts = new AWS.STS() ;
        sts.assumeRole({RoleArn: roleArn, RoleSessionName: 'SnapshotGraphs'}, function(err, data) {
            if (err) res.status(500).send(err); // an error occurred
            else {           // successful response
                console.log(JSON.stringify(data))
                let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
                                                          data.Credentials.SecretAccessKey, 
                                                          data.Credentials.SessionToken)
                res.send({Credentials: tempCredentials});
            }
        });

});

module.exports = router;
