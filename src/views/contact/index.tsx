import React, { Component } from 'react'
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  Map,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet'

const center = [51.505, -0.09]
const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
]

export default class OtherLayersExample extends Component<{}> {
  render() {
    return (
      <Map center={[51.51, -0.08]} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
          <LayerGroup>
            <Circle
              center={[51.51, -0.08]}
              color="green"
              fillColor="green"
              radius={100}
            />
          </LayerGroup>
        <FeatureGroup color="purple">
          <Popup>Popup in FeatureGroup</Popup>
          <Circle center={[51.51, -0.06]} radius={200} />
        </FeatureGroup>
      </Map>
    )
  }
}