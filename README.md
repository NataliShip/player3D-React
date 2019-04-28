# Player3D на React 
[![Build Status](https://travis-ci.com/NataliShip/player3D-React.svg?branch=master)](https://travis-ci.com/NataliShip/player3D-React)   ![Latest Stable Version](https://img.shields.io/github/release/NataliShip/player3D-React.svg) ![GitHub](https://img.shields.io/github/license/NataliShip/player3D-React.svg) [![GitHub stars](https://img.shields.io/github/stars/NataliShip/player3D-React.svg)](https://github.com/NataliShip/player3D-React/stargazers) ![GitHub All Releases](https://img.shields.io/github/downloads/NataliShip/player3D-React/total.svg)  ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/NataliShip/player3D-React.svg)

3D плеер на React для демонстрации товаров на 360° с использованием canvas через покадровую смену фотографий. Используется Canvas, как наиболее подходящий инструмент для управления пиксельными изображениями.

**DEMO: http://reactapp.ru/3d-player-react/**

**Принимает параметры:**

`framesList` - массив ссылок на изображения (в примере загружается с api)

`intervalDefault` - интервал смены кадров по умолчанию (200мс)

`selectorStart` - селектор (id) элемента, который будет запускать плеер

**Использование:**
```js
<div class='container'>
  <Player3D
    framesList={images3d}
    selectorStart='start'
    intervalDefault={200}
  />
</div>
<button id='start'>Start</buttin>
```
В данном примере, классу container нужно задать ширину и высоту, так как canvas будет брать значение ширины и высоты родительского компонента при инициализации. Можно задавать относительные параметры в %.

`images3d` - это переменная содержащая массив ссылок на изображения

`'start'` - это id того элемента который будет запускать плеер. На него автоматически будет навешен обработчик на событие click. Достаточно добавить id

![Alt text](http://reactapp.ru/img/3d-player-react.png "3d плеер React")
