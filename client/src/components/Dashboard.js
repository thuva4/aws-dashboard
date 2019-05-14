import React, { Component } from 'react';
// Load the AWS SDK for Node.js

import * as _ from 'lodash';
import WidgetDefinition from './WidgetDefinition'
import Widget from './Widgets'

class Dashboard extends Component {

    constructor(){
        super();    
        this.state = {
            dashBoardData: {}
        } 
    }
    componentWillMount(){
        this.callAwsCloudWatch()
        this.interval = setInterval(() => {
            this.callCreateTemp()
          }, 1800000);
    }

    callCreateTemp = async () => {
        let that = this;
        fetch(`http://10.133.26.118:3001/createtempCredentials`)
        .then(response => response.json())
        .catch(error => {
            console.error(error)
        })
      }

    callAwsCloudWatch = async () => {
      let that = this;
      fetch(`http://10.133.26.118:3001/getdashboard?dashboardName=${this.props.dashboardName}`)
      .then(response => response.json())
      .then(data => {
        that.setState({
                    dashBoardData: data
        });
      })

    }

    createWidgets = () => {
        let widgets = []
        console.log(WidgetDefinition)
        console.log(this.state.dashBoardData.length)
        for (let i = 0; i < this.state.dashBoardData.length; i++) {
          let localWidgetDefinition = _.cloneDeep(WidgetDefinition);
          localWidgetDefinition.MetricWidget["metrics"] = this.state.dashBoardData[i].properties.metrics
          if(this.state.dashBoardData[i].properties.title){
            localWidgetDefinition.MetricWidget["title"] = this.state.dashBoardData[i].properties.title
          }
          widgets.push(
              <Widget key={i} params={localWidgetDefinition}></Widget>
          )
        }
        return widgets;
      }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

  render() {
    return (
        <div className='container'>
        <h1>{this.props.dashboardName}</h1>
        {this.state.dashBoardData && this.createWidgets()}
        </div>
    );
  }
}

export default Dashboard;
