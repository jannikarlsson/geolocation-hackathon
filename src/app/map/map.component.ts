import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Icon, LatLng, icon, latLng, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public userLocation: LatLng = latLng(0, 0);

  public mapOptions = {
    zoom: 18,
  };

  mapLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  userMarker = marker(this.userLocation, {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  })

  layers: (L.TileLayer | L.Marker)[] = [
      this.mapLayer,
      this.userMarker
  ]

  map: L.Map | undefined;

  ngOnInit() {
    setInterval(() => {
      this.getUserLocation();
    }, 3000);
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.userLocation = latLng(latitude, longitude);
        console.log("location updated")
        this.onUpdateUserLocation()
      });
      
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  } 

  onUpdateUserLocation() {
    this.userMarker = marker(this.userLocation, {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
    this.updateLayers()
  }

  updateLayers() {
    this.layers = [
      this.mapLayer,
      this.userMarker
    ]
  }

  onMapReady(event: L.Map) {
    this.map = event;
  }
}
