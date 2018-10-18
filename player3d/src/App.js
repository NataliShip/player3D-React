import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  constructor() {
    super();
    this.state = {
      images: [],
    }
  }

  componentDidMount() {
    axios.get('https://private-5adf60-images3dapi.apiary-mock.com/images')
      .then(response => {
        // handle success
        this.setState({images: response.data})
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;
