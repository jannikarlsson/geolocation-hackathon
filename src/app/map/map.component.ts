import { Component, EventEmitter, NgZone, OnInit, Output, inject } from '@angular/core';
import * as L from 'leaflet';
import { Icon, LatLng, icon, latLng, marker, tileLayer } from 'leaflet';
import { ApiService, HiddenObject } from '../api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() openForm = new EventEmitter();

  public userLocation: LatLng = latLng(0, 0);

  public mapOptions = {
    zoom: 18,
  };

  private apiService = inject(ApiService);

  mapLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  userMarker = marker(this.userLocation, {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  })

  locMarkers: {id: number, marker: L.Marker, found: boolean }[] = []

  layers: (L.TileLayer | L.Marker)[] = [
      this.mapLayer,
      this.userMarker
  ]

  map: L.Map | undefined;

  giftIcon = icon({
    iconSize: [ 35, 35 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'assets/gift.png',
  })

  grayGiftIcon = icon({
    iconSize: [ 35, 35 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'assets/gray-gift.png',
  })

  ngOnInit() {
    // setInterval(() => {
    //   this.getUserLocation();
    // }, 3000);
    this.getUserLocation();
    this.apiService.getHiddenObject().subscribe((data) => {
      console.log(data)
      this.makeMarkers(data.map((loc) => ({id: loc.id, loc: latLng(loc.latitude, loc.longitude), found: loc.found})))
    })
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.userLocation = latLng(latitude, longitude);
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
      this.userMarker,
    ]
    this.makeMarkers(this.locMarkers.map((marker) => ({id: marker.id, loc: marker.marker.getLatLng(), found: marker.found})))
    this.layers = this.layers.concat(this.locMarkers.map((marker) => marker.marker))
    console.log(this.layers)
  }

  onMapReady(event: L.Map) {
    this.map = event;
  }

  makeMarkers(locs: {id: number, loc: LatLng, found: boolean}[]) {
    if (locs) {
      this.locMarkers = locs.map((loc) => {
        return {
          id: loc.id,
          marker: marker(loc.loc, {
            icon: icon({
              iconSize: [ 35, 35 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: loc.found ? 'assets/gift-gray.png' : 'assets/gift.png',
            })
          }).on('click', event => {
            this.openForm.emit();
            console.log('Yay, my marker was clicked' + loc.id, event) 
        }),
        found: loc.found
        }
      })
    }
  }
}