var express = require('express');
var router = express.Router();

// let AWS_CONFIG  = require('./env');
let AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');

/* GET home page. */
router.get('/tempCredentials', function(req, res, next) {
    axios.get("http://169.254.169.254/latest/meta-data/iam/info")
      .then(response => response.data)
      .then(data => {
        console.log(data);
    })
        let roleArn = `arn:aws:iam::315465781430:role/Application-CDE-MSD-DevOps-Role`;
        console.log("Assuming role: "+roleArn);

        let sts = new AWS.STS() ;
        sts.assumeRole({RoleArn: roleArn, RoleSessionName: 'SnapshotGraphs'}, function(err, data) {
            if (err) res.status(500).send(err); // an error occurred
            else {           // successful response
                console.log(JSON.stringify(data))
                fs.writeFile('./credencials.json', JSON.stringify(data), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                }); 
            }
        });
});

router.get('/getdashboard', function(req, res, next){
    fs.readFile('./credencials.json', function(err, data){
        data = JSON.parse(data)
        console.log(data)
        let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
            data.Credentials.SecretAccessKey, 
            data.Credentials.SessionToken)
        let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
        cloudWatch.getDashboard({"DashboardName": "Platform-Email-Service"}, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log(data.DashboardBody)
              let dataJson = JSON.parse(data.DashboardBody)
              console.log(dataJson)
              res.send(dataJson)
            }
          } );
    })
})

module.exports = router;
