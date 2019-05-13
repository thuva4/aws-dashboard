import React, { Component } from 'react';
// Load the AWS SDK for Node.js

import * as _ from 'lodash';

class Widget extends Component {

    constructor(){
        super();
        this.state = {
            imageStr: ""
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
        await this.props.cw.getMetricWidgetImage(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              let base64data = data.MetricWidgetImage.toString('base64');
              that.setState({
                imageStr: base64data
              });
            }
          } );
    }

    componentDidMount(){
      this.interval = setInterval(() => {
        this.callAwsCloudWatch()
      }, 5000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

  render() {
    return (
      <div className="col-md-4" style={{"float": "left"}}>
          <img src={`data:image/png;base64,${this.state.imageStr}`} alt="time-series" />
      </div>
    );
  }
}

export default Widget;