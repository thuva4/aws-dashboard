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
    }

    callAwsCloudWatch = async () => {
      let params =_.cloneDeep(this.props.params);
      let MetricWidget = JSON.stringify(this.props.params.MetricWidget);
      params.MetricWidget = MetricWidget;
      let that = this;
      fetch(`localhost:3001/getdashboard?dashboardName=${this.params.name}`)
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
        <h1>{this.props.name}</h1>
        {this.state.dashBoardData && this.createWidgets()}
        </div>
    );
  }
}

export default Dashboard;
