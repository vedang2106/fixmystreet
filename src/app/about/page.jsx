"use client"
import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "/marker-icon.png", // You'll need to add this image to your public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const PotholeReporter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [location, setLocation] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 19.0760, // Default to Mumbai coordinates
    lng: 72.8777
  });
  const [markerPosition, setMarkerPosition] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
          
          try {
            // Using Nominatim for reverse geocoding (free OpenStreetMap service)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            if (data.display_name) {
              setLocation(data.display_name);
            } else {
              setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert("Unable to get your location. Please enter it manually.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
    }
  };

  // Component to handle map clicks
  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      if (!map) return;
      
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data.display_name) {
            setLocation(data.display_name);
          } else {
            setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (error) {
          console.error("Error getting address:", error);
          setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      });
    }, [map]);

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage && location) {
      // Here you would typically send the data to your server
      console.log({
        image: selectedImage,
        location: location,
        coordinates: markerPosition,
        timestamp: new Date().toISOString()
      });
      // Add your submission logic here
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Report a Pothole</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div 
              className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
              onClick={() => document.getElementById('imageInput').click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Selected pothole" 
                    className="mx-auto max-h-48 rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">Click to change photo</p>
                </div>
              ) : (
                <>
                  <Camera className="mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tap to upload a photo</p>
                </>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="Click the location icon or select on map"
                className="w-full p-2 pr-10 border rounded"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button 
                type="button"
                onClick={getCurrentLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
            </div>

            <div style={{ height: '300px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEvents />
                {markerPosition && (
                  <Marker 
                    position={[markerPosition.lat, markerPosition.lng]}
                    icon={icon}
                    draggable={true}
                  />
                )}
              </MapContainer>
            </div>
            
            <textarea
              placeholder="Description (optional)"
              className="w-full p-2 border rounded"
              rows={3}
            />
            
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!selectedImage || !location}
            >
              Submit Report
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PotholeReporter;