var express = require('express');
var router = express.Router();

// let AWS_CONFIG  = require('./env');
let AWS = require('aws-sdk');
AWS.config.update({'region': 'us-east-1'})
const axios = require('axios');
const fs = require('fs');

router.get('/createtempCredentials', async function(req, res, next) {
        let roleArn =await axios.get("http://169.254.169.254/latest/meta-data/iam/info")	    
            .then(response => response.data)	     
            .then(data => {	      
             return data.InstanceProfileArn.replace("instance-profile", "role");;
        })
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
            // cloudWatch.listDashboards({}, function(err, data) {
            //     if (err) {
            //         return res.status(500).send(err);
            //     } else {
            //       console.log(data.DashboardEntries)
            //       let dataJson = {
            //         DashboardEntries:data.DashboardEntries
            //       }
            //       console.log(dataJson)
            //       res.send(dataJson)
            //     }
            //   } );
        }
    })
});

router.get('/getdashboard', function(req, res, next){
    fs.readFile('./credencials.json', function(err, data){
        if (err) res.status(500).send(err)
        else {
            data = JSON.parse(data)
            let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
                data.Credentials.SecretAccessKey, 
                data.Credentials.SessionToken)
            let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
            cloudWatch.getDashboard({"DashboardName": `${req.query.dashboardName}`}, function(err, data) {
                if (err) {
                  return res.status(500).send(err);
                } else {
                  console.log(data.DashboardBody)
                  let dataJson = JSON.parse(data.DashboardBody)
                  res.send(dataJson.widgets)
                }
              } );
        }
    })
});


router.post('/getwidgetImage', async function(req, res, next){
    await fs.readFile('./credencials.json', async function(err, data){
        if (err) res.status(500).send(err)
        else {
            data = JSON.parse(data)
            let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
                data.Credentials.SecretAccessKey, 
                data.Credentials.SessionToken)
            let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
            await cloudWatch.getMetricWidgetImage(req.body, function(err, data) {
                if (err) {
                  res.status(500).send(err);
                } else {
                    // console.log(data)
                    res.send(data.MetricWidgetImage);
                    // res.writeHead(200, {
                    //     'Content-Type': 'image/png',
                    //     'Content-Length': data.MetricWidgetImage.length
                    //   });
                    // res.end(data.MetricWidgetImage); 
                }
              } );
        }
    })
});

router.get('/listdashboard', function(req, res, next){
    fs.readFile('./credencials.json', function(err, data){
        if (err) res.status(500).send(err)
        else {
            data = JSON.parse(data)
            let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
                data.Credentials.SecretAccessKey, 
                data.Credentials.SessionToken)
            let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
            cloudWatch.listDashboards({}, function(err, data) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                  console.log(data.DashboardEntries)
                  let dataJson = {
                    DashboardEntries:data.DashboardEntries
                  }
                  console.log(dataJson)
                  res.send(dataJson)
                }
              } );
        }
    })
});

module.exports = router;
