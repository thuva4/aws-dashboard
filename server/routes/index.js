var express = require('express');
var router = express.Router();

// let AWS_CONFIG  = require('./env');
let AWS = require('aws-sdk');
AWS.config.update({'region': 'us-east-1'})
const axios = require('axios');
const fs = require('fs');

/* GET home page. */
router.get('/createtempCredentials', function(req, res, next) {
        let roleArn = `arn:aws:iam::315465781430:role/Application-CDE-MSD-DevOps-Role`;
        console.log("Assuming role: "+roleArn);
        let sts = new AWS.STS() ;
        sts.assumeRole({RoleArn: roleArn, RoleSessionName: 'SnapshotGraphs'}, function(err, data) {
            if (err) res.status(500).send(err); // an error occurred
            else {           // successful response
                fs.writeFile('./credencials.json', JSON.stringify(data), function(err) {
                    if(err) {
                        return res.status(500).send(err);
                    }
                }); 
                res.send(data.Credentials);
            }
    });
});

router.get('/gettempCredentials', function(req, res, next){
    fs.readFile('./credencials.json', function(err, data){
        if (err) res.status(500).send(err)
        else {
            data = JSON.parse(data)
            res.send(data.Credentials)
            // let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
            //     data.Credentials.SecretAccessKey, 
            //     data.Credentials.SessionToken)
            // let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
            // cloudWatch.getDashboard({"DashboardName": "Platform-Email-Service"}, function(err, data) {
            //     if (err) {
            //       console.log("Error", err);
            //     } else {
            //       console.log(data.DashboardBody)
            //       let dataJson = JSON.parse(data.DashboardBody)
            //       console.log(dataJson)
            //       res.send(dataJson)
            //     }
            //   } );
        }
    })
})

module.exports = router;
