import { ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit, Output, inject } from '@angular/core';
import * as L from 'leaflet';
import { Icon, LatLng, icon, latLng, marker, tileLayer } from 'leaflet';
import { ApiService, HiddenObject } from '../api.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Output() openForm = new EventEmitter();

  finderForm = new FormControl('', Validators.required);

  isDialogOpen = false;

  public userLocation: LatLng = latLng(0, 0);

  public mapOptions = {
    zoom: 18,
  };

  private apiService = inject(ApiService);

  public currentLoc: HiddenObject = {} as HiddenObject;

  mapLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  userMarker = marker(this.userLocation, {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  })

  locMarkers: {id: string, marker: L.Marker, found: boolean, nameOfFinder: string | null; }[] = []

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

  constructor(private cdr: ChangeDetectorRef) {}


  ngOnInit() {
    // setInterval(() => {
    //   this.getUserLocation();
    // }, 5000);
    this.getUserLocation();
    this.apiService.getHiddenObject().subscribe((data) => {
      console.log(data)
      this.makeMarkers(data.map((loc) => ({id: loc.id, loc: latLng(loc.latitude, loc.longitude), found: loc.found, nameOfFinder: loc.nameOfFinder})))
    })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
    this.makeMarkers(this.locMarkers.map((marker) => ({id: marker.id, loc: marker.marker.getLatLng(), found: marker.found, nameOfFinder: marker.nameOfFinder})))
    this.layers = [
      this.mapLayer,
      this.userMarker,
      ...this.locMarkers.map((marker) => marker.marker)
    ]
    // this.layers = this.layers.concat(this.locMarkers.map((marker) => marker.marker))
    console.log(this.layers)
    this.cdr.detectChanges();
  }

  onMapReady(event: L.Map) {
    this.map = event;
  }

  makeMarkers(locs: {id: string, loc: LatLng, found: boolean, nameOfFinder: string | null}[]) {
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
            this.handleMarkerClick(loc)
        }),
        found: loc.found,
        nameOfFinder: loc.nameOfFinder
        }
      })
    }
  }
  
  handleMarkerClick(loc: {id: string, loc: LatLng, found: boolean, nameOfFinder: string | null}) {
    this.isDialogOpen = true;
    const latitude = loc.loc.lat;
    const longitude = loc.loc.lng;
    this.currentLoc = {
      id: loc.id,
      latitude: latitude,
      longitude: longitude,
      found: loc.found,
      nameOfFinder: loc.nameOfFinder
    };
    this.cdr.detectChanges();
    console.log('Yay, my marker was clicked' + loc.id, event) 
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.cdr.detectChanges();
  }

  saveAndCloseDialog() {
    console.log(this.finderForm.value)
    this.apiService.claimHiddenObject({
      ...this.currentLoc,
      found: true,
      nameOfFinder: this.finderForm.value
    })
    this.isDialogOpen = false;
    this.finderForm.setValue('');
    this.cdr.detectChanges();
    
  }
}