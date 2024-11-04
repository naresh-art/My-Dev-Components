// import { LightningElement } from 'lwc';

// export default class LocationMapComponent extends LightningElement {
//     selectedAddress = ''; // Holds the selected address value
//     mapCenter = {
//         location: {
//             Latitude: 37.7749,  // Default to San Francisco
//             Longitude: -122.4194
//         }
//     };
    
//     mapMarkers = [];

//     // Options for the address dropdown
//     get addressOptions() {
//         return [
//             { label: 'San Francisco, USA', value: 'USA' },
//             { label: 'Bangalore, India', value: 'India' }
//         ];
//     }

//     // Handle address selection change
//     handleAddressChange(event) {
//         this.selectedAddress = event.detail.value;
        
//         if (this.selectedAddress === 'USA') {
//             // Update map center and markers for USA location
//             this.mapCenter = {
//                 location: {
//                     Latitude: 37.7749,
//                     Longitude: -122.4194
//                 }
//             };
//             this.mapMarkers = [{
//                 location: {
//                     Latitude: 37.7749,
//                     Longitude: -122.4194
//                 },
//                 title: 'San Francisco, USA',
//                 description: 'San Francisco, California, USA'
//             }];
//         } else if (this.selectedAddress === 'India') {
//             // Update map center and markers for India location
//             this.mapCenter = {
//                 location: {
//                     Latitude: 12.9716,
//                     Longitude: 77.5946
//                 }
//             };
//             this.mapMarkers = [{
//                 location: {
//                     Latitude: 12.9716,
//                     Longitude: 77.5946
//                 },
//                 title: 'Bangalore, India',
//                 description: 'Bangalore, Karnataka, India'
//             }];
//         }
//     }
// }



// import { LightningElement } from 'lwc';

// export default class LocationMapComponent extends LightningElement {
//     selectedAddress = 'USA'; // Default location is USA
//     mapCenter = {
//         location: {
//             Latitude: 20.5937,  // Default to a global view between the two locations
//             Longitude: 78.9629
//         }
//     };
    
//     mapMarkers = [
//         {
//             location: {
//                 Latitude: 37.7749,
//                 Longitude: -122.4194
//             },
//             value: 'USA',
//             title: 'San Francisco, USA',
//             description: 'San Francisco, California, USA'
//         },
//         {
//             location: {
//                 Latitude: 12.9716,
//                 Longitude: 77.5946
//             },
//             value: 'India',
//             title: '2nd Floor, Abhis Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081',
//             description: 'Hyderabad, Telangana, India'
//         }
//     ];

//     // Handle marker selection when a location button is clicked
//     handleMarkerSelect(event) {
//         const selectedLocation = event.target.dataset.id;
//         this.selectedAddress = selectedLocation;
        
//         if (selectedLocation === 'USA') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 37.7749,
//                     Longitude: -122.4194
//                 }
//             };
//         } else if (selectedLocation === 'India') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 12.9716,
//                     Longitude: 77.5946
//                 }
//             };
//         }
//     }
// }


// import { LightningElement } from 'lwc';

// export default class LocationMapComponent extends LightningElement {
//     selectedAddress = 'USA'; // Default location is USA
//     mapCenter = {
//         location: {
//             Latitude: 20.5937,  // Default to a global view between the two locations
//             Longitude: 78.9629
//         }
//     };
    
//     mapMarkers = [
//         {
//             location: {
//                 Latitude: 37.7749,
//                 Longitude: -122.4194
//             },
//             value: 'USA',
//             title: 'San Francisco, USA',
//             description: 'San Francisco, California, USA'
//         },
//         {
//             location: {
//                 Latitude: 12.9716,
//                 Longitude: 77.5946
//             },
//             value: 'India',
//             title: 'Bangalore, India',
//             description: 'Bangalore, Karnataka, India'
//         }
//     ];

//     // Handle marker selection when a location button is clicked
//     handleMarkerSelect(event) {
//         const selectedLocation = event.target.dataset.id;
//         this.selectedAddress = selectedLocation;
        
//         if (selectedLocation === 'USA') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 37.7749,
//                     Longitude: -122.4194
//                 }
//             };
//         } else if (selectedLocation === 'India') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 12.9716,
//                     Longitude: 77.5946
//                 }
//             };
//         }
//     }
// }


// import { LightningElement } from 'lwc';

// export default class LocationMapComponent extends LightningElement {
//     selectedAddress = 'USA'; // Default to USA
//     mapCenter = {
//         location: {
//             Latitude: 20.5937,  // Default between the two locations (India/USA)
//             Longitude: 78.9629
//         }
//     };
    
//     mapMarkers = [
//         {
//             location: {
//                 Latitude: 41.85378, // Latitude for South Windsor, CT, USA
//                 Longitude: -72.6076  // Longitude for South Windsor, CT, USA
//             },
//             value: 'USA',
//             title: '85 Felt Rd, Suite #604, South Windsor, CT 06074',
//             description: 'USA Location: 85 Felt Rd, Suite #604, South Windsor, CT 06074'
//         },
//         {
//             location: {
//                 Latitude: 17.4474, // Latitude for Hyderabad, Telangana, India
//                 Longitude: 78.3762  // Longitude for Hyderabad, Telangana, India
//             },
//             value: 'India',
//             title: "2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081",
//             description: "India Location: 2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081"
//         }
//     ];

//     // Handle marker selection when a location button is clicked
//     handleMarkerSelect(event) {
//         const selectedLocation = event.target.dataset.id;
//         this.selectedAddress = selectedLocation;
        
//         if (selectedLocation === 'USA') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 41.85378, // Latitude for South Windsor, CT, USA
//                     Longitude: -72.6076  // Longitude for South Windsor, CT, USA
//                 }
//             };
//         } else if (selectedLocation === 'India') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 17.4474, // Latitude for Hyderabad, Telangana, India
//                     Longitude: 78.3762  // Longitude for Hyderabad, Telangana, India
//                 }
//             };
//         }
//     }
// }


// import { LightningElement } from 'lwc';

// export default class LocationMapComponent extends LightningElement {
//     selectedAddress = 'USA'; // Default to USA
//     zoomLevel = 4; // Default zoom level for the map
//     mapCenter = {
//         location: {
//             Latitude: 20.5937,  // Default between the two locations (India/USA)
//             Longitude: 78.9629
//         }
//     };
    
//     mapMarkers = [
//         {
//             location: {
//                 Latitude: 41.85378, // Latitude for South Windsor, CT, USA
//                 Longitude: -72.6076  // Longitude for South Windsor, CT, USA
//             },
//             value: 'USA',
//             title: '85 Felt Rd, Suite #604, South Windsor, CT 06074',
//             description: 'USA Location: 85 Felt Rd, Suite #604, South Windsor, CT 06074'
//         },
//         {
//             location: {
//                 Latitude: 17.4474, // Latitude for Hyderabad, Telangana, India
//                 Longitude: 78.3762  // Longitude for Hyderabad, Telangana, India
//             },
//             value: 'India',
//             title: "2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081",
//             description: "India Location: 2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081"
//         }
//     ];

//     // Handle marker selection when a location button is clicked
//     handleMarkerSelect(event) {
//         const selectedLocation = event.target.dataset.id;
//         this.selectedAddress = selectedLocation;
        
//         if (selectedLocation === 'USA') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 41.85378, // Latitude for South Windsor, CT, USA
//                     Longitude: -72.6076  // Longitude for South Windsor, CT, USA
//                 }
//             };
//             this.zoomLevel = 15; // Zoom in specifically for this address
//         } else if (selectedLocation === 'India') {
//             this.mapCenter = {
//                 location: {
//                     Latitude: 17.4474, // Latitude for Hyderabad, Telangana, India
//                     Longitude: 78.3762  // Longitude for Hyderabad, Telangana, India
//                 }
//             };
//             this.zoomLevel = 15; // Zoom in specifically for this address
//         }
//     }
// }



import { LightningElement } from 'lwc';

export default class LocationMapComponent extends LightningElement {
    selectedAddress = 'USA'; // Default to USA
    zoomLevel = 4; // Default zoom level for the map
    mapCenter = {
        location: {
            Latitude: 20.5937,  // Default between the two locations (India/USA)
            Longitude: 78.9629
        }
    };
    
    mapMarkers = [
        {
            location: {
                Latitude: 41.85378, // Latitude for South Windsor, CT, USA
                Longitude: -72.6076  // Longitude for South Windsor, CT, USA
            },
            value: 'USA',
            title: '85 Felt Rd, Suite #604, South Windsor, CT 06074',
            description: 'USA Location: 85 Felt Rd, Suite #604, South Windsor, CT 06074'
        },
        {
            location: {
                Latitude: 17.4474, // Latitude for Hyderabad, Telangana, India
                Longitude: 78.3762  // Longitude for Hyderabad, Telangana, India
            },
            value: 'India',
            title: "2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081",
            description: "India Location: 2nd Floor, Abhi's Ganga, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081"
        }
    ];

    // Handle marker selection when a location button is clicked
    handleMarkerSelect(event) {
        const selectedLocation = event.target.dataset.id;
        this.selectedAddress = selectedLocation;
        
        if (selectedLocation === 'USA') {
            this.mapCenter = {
                location: {
                    Latitude: 41.8497, // Latitude for South Windsor, CT, USA
                    Longitude: -72.5796  // Longitude for South Windsor, CT, USA
                }
            };
            this.zoomLevel = 15; // Zoom in specifically for this address
        } else if (selectedLocation === 'India') {
            this.mapCenter = {
                location: {
                    Latitude: 17.4483, // Latitude for Hyderabad, Telangana, India
                    Longitude: 78.3915  // Longitude for Hyderabad, Telangana, India
                }
            };
            this.zoomLevel = 15; // Zoom in specifically for this address
        }
    }
}
