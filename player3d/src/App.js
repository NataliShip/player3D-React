import React, {Component} from 'react';
import axios from 'axios';
import Player3D from './player-3d'

class App extends Component {

  constructor() {
    super();
    this.state = {
      images: [],
      playerActive: false,
    }
    this.playerStart = this.playerStart.bind(this)
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

  playerStart() {
    this.setState({playerActive: true})
  }

  render() {
    const {state: {playerActive, images}} = this;
    const previewCss = playerActive ? 'hide' : ''
    const playerCss = !playerActive ? 'hide' : ''
    return (
      <div className='player3d'>
        <div>
          <h2 className='player3d__header'>3D обзор товара, через покадровую смену фотографий</h2>
          <p className='player3d__description'>Клик на превью для старта. Повторный клик остановит просмотр. Можно поворачивать с помощью мыши</p>
          <div className='player3d__columns'>
            <div className={`${playerCss} player3d__container`}>
              {this.state.images.length > 0
                ? < Player3D
                  framesList={this.state.images}
                  selectorStart='start'
                  intervalDefault={200}
                />
                : null
              }
            </div>

            {this.state.images.length > 0
              ? <div onClick={this.playerStart} id='start' className={`${previewCss} preview`}>
                <img className='preview__image' src={images[0]} alt='preview'></img>
                <span className='preview__play-icon'/>
              </div>
              : null
            }

          </div>
        </div>
      </div>
    );
  }
}

export default App;
