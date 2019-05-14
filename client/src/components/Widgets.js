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

    arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = [].slice.call(new Uint8Array(buffer));
    
      bytes.forEach((b) => binary += String.fromCharCode(b));
    
      return window.btoa(binary);
    };


    callAwsCloudWatch = async () => {
      let params =_.cloneDeep(this.props.params);
      let MetricWidget = JSON.stringify(this.props.params.MetricWidget);
      params.MetricWidget = MetricWidget;
      let that = this;
      await fetch('http://10.133.26.118:3001/getwidgetImage', {
        method: 'post',
        body: JSON.stringify(params),
        headers: { 'Content-type': 'application/json' }
      })
      .then(response => {
        response.arrayBuffer().then((buffer) => {
          var base64Flag = 'data:image/jpeg;base64,';
          var imageStr = that.arrayBufferToBase64(buffer);
          that.setState({
            imageStr: imageStr
          });
        // response
        })
      }
      );
      // .then(data => {
      //   let base64data = data.MetricWidgetImage.toString('base64');
      //   console.log(base64data)
        // that.setState({
        //   imageStr: base64data
        // });
      // });
    }

    componentDidMount(){
      this.interval = setInterval(() => {
        this.callAwsCloudWatch()
      }, 10000);
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
