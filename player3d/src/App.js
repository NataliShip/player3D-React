import React, { Component } from 'react';
import axios from 'axios';
import Player3D from './player-3d'

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
      <div className='col-center'>
        <div>
          <h2>3D обзор товара, через покадровую смену фотографий</h2>
          <button id='start'>Старт</button>
          <div className='container'>
            {this.state.images.length > 0
              ? <Player3D
                framesList={this.state.images}
                selectorStart='start'
                intervalDefault={200}
              />
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
