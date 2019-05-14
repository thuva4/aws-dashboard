import React, { Component } from 'react';
import './App.css';
import AWS_CONFIG from './env'
import AWS from 'aws-sdk';
import WidgetDefinition from './components/WidgetDefinition'
import * as _ from 'lodash';
import Tab from './components/Tab'

import Widget from './components/Widgets';
import Dashboard from './components/Dashboard';

AWS.config.update(AWS_CONFIG); 

class App extends Component {
  constructor(props){
    super(props);
    this.state = { 
    dashBoardList: {},
    
    }
  }

  setTempCredentials = (tempCredentials) => {
    this.setState({
      ...this.state,
    })
  }

  callCreateTemp = async () => {
    let that = this;
    await fetch(`http://10.133.26.118:3001/createtempCredentials`)
    .then(response => response.json())
    .catch(error => {
        console.error(error)
    })
  }


  componentWillMount(){
    const that = this;
    await this.callCreateTemp();
    await fetch("http://10.133.26.118:3001/listdashboard")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        that.setState({
          dashBoardList: data.DashboardEntries,
          activeTab: data.DashboardEntries[0].DashboardName
      });
    });
    this.interval = setInterval(() => {
      this.callCreateTemp()
    }, 1800000);

      // });
    // let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();
    // let roleArn = `arn:aws:iam::${accountId}:role/${role}`;
    // console.log("Assuming role: "+roleArn);

    // let sts = new AWS.STS() ;
    // sts.assumeRole({RoleArn: roleArn, RoleSessionName: 'SnapshotGraphs'}, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else {           // successful response
    //         console.log(JSON.stringify(data))
    //         let tempCredentials = new AWS.Credentials(data.Credentials.AccessKeyId, 
    //                                                   data.Credentials.SecretAccessKey, 
    //                                                   data.Credentials.SessionToken)
    //         this.setTempCredentials(tempCredentials);
    //     }
    // });
  }



//   getWidget = (widgetDefinition, callback, tempCredentials) => {
    
//     let cloudWatch = tempCredentials ? new AWS.CloudWatch({credentials:tempCredentials}) : new AWS.CloudWatch();

//      cloudWatch.getMetricWidgetImage(widgetDefinition, function (err, data) {
//      if (err) console.log(err, err.stack); // an error occurred
//         else {
//             console.log(data.MetricWidgetImage);           // successful response
//             var response = {
//                 statusCode: 200,
//                 headers: {
//                 'Content-Type' : 'image/png',
//                 'Access-Control-Allow-Origin' : '*',
//                 'Access-Control-Allow-Methods' : 'POST, GET, PUT, OPTIONS',
//                 'Access-Control-Allow-Headers' : 'x-api-key'
//                 },
//                 body: new Buffer(data.MetricWidgetImage).toString('base64')
//     };
//             callback(err, response);
//         }
//     });

// }

  // componentWillMount(){
  //   let that = this;
  //   this.state.cw.getDashboard({"DashboardName": "gg"}, function(err, data) {
  //     if (err) {
  //       console.log("Error", err);
  //     } else {
  //       console.log(data.DashboardBody)
  //       let dataJson = JSON.parse(data.DashboardBody)
  //       that.setState({
  //         dashBoardList: dataJson.widgets
  //     });
  //     }
  //   } );
  // }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  }


  createdashboard = () => {
    let dashboards = []

    // console.log(WidgetDefinition)
    console.log(this.state.dashBoardList.length)
    for (let i = 0; i < this.state.dashBoardList.length; i++) {
      dashboards.push(
          <Dashboard key={i} dashboardName={this.state.dashBoardList[i].DashboardName} vissible={this.state.dashBoardVissible[i]}></Dashboard>
      )
    }
    return dashboards;
  }
  
  render() {
    const {
      onClickTabItem,
      state: {
        activeTab,
        dashBoardList
      }
    } = this;
    if (dashBoardList) {
      return (
        <div>
          <div className="tabs">
          <ol className="tab-list">
            {dashBoardList.map((dashboard) => {
              const { DashboardName } = dashboard;
  
              return (
                <Tab
                  activeTab={activeTab}
                  key={DashboardName}
                  label={DashboardName}
                  onClick={onClickTabItem}
                />
              );
            })}
          </ol>
          <div className="tab-content">
            {dashBoardList.map((dashboard) => {
              if (dashboard.DashboardName !== activeTab) {
                return undefined;
              }
              else {
              return (<Dashboard key={activeTab} dashboardName={activeTab}></Dashboard>);
              }
            })}
          </div>
        </div>
        </div>
      );
    } else {
      return(
        <div>
          Loading
        </div>
      )
    }
    
  }
}

export default App;
