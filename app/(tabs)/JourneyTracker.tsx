// import * as Location from 'expo-location';
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // Conditional import for maps (only on native platforms)
// let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;
// if (Platform.OS !== 'web') {
//   const Maps = require('react-native-maps');
//   MapView = Maps.default;
//   Marker = Maps.Marker;
//   Polyline = Maps.Polyline;
//   PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
// }

// // Type definitions
// interface Coordinate {
//   latitude: number;
//   longitude: number;
// }

// interface Region extends Coordinate {
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// const JourneyTracker: React.FC = () => {
//   // State variables with TypeScript types
//   const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
//   const [startLocation, setStartLocation] = useState<Coordinate | null>(null);
//   const [endLocation, setEndLocation] = useState<Coordinate | null>(null);
//   const [purpose, setPurpose] = useState<string>('');
//   const [notes, setNotes] = useState<string>('');
//   const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);
//   const [journeyStartTime, setJourneyStartTime] = useState<Date | null>(null);
//   const [totalDistance, setTotalDistance] = useState<number>(0);
//   const [route, setRoute] = useState<Coordinate[]>([]);
//   const [showNewJourney, setShowNewJourney] = useState<boolean>(true);
//   const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
//   const [region, setRegion] = useState<Region>({
//     latitude: 18.5204, // Pune coordinates as default
//     longitude: 73.8567,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   // Get current location permission and location
//   useEffect(() => {
//     if (Platform.OS !== 'web') {
//       getCurrentLocation();
//     } else {
//       // For web, use mock location
//       const mockLocation: Coordinate = {
//         latitude: 18.5204,
//         longitude: 73.8567,
//       };
//       setCurrentLocation(mockLocation);
//     }
//   }, []);

//   const getCurrentLocation = async (): Promise<void> => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Please grant location permission to use this app');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const newLocation: Coordinate = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
      
//       setCurrentLocation(newLocation);
//       setRegion({
//         ...newLocation,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Could not get current location');
//     }
//   };

//   // Handle map press to set start/end locations
//   const handleMapPress = (event: any): void => {
//     const coordinate: Coordinate = event.nativeEvent.coordinate;
    
//     if (!startLocation) {
//       setStartLocation(coordinate);
//       Alert.alert('Start Location Set', 'Now tap to set your end location');
//     } else if (!endLocation) {
//       setEndLocation(coordinate);
//       Alert.alert('End Location Set', 'Both locations are set. Fill in journey details.');
//     }
//   };

//   // For web: simulate location selection
//   const handleWebLocationSelect = (type: 'start' | 'end'): void => {
//     const mockCoordinate: Coordinate = {
//       latitude: 18.5204 + (Math.random() - 0.5) * 0.01,
//       longitude: 73.8567 + (Math.random() - 0.5) * 0.01,
//     };

//     if (type === 'start') {
//       setStartLocation(mockCoordinate);
//       Alert.alert('Start Location Set', 'Mock location set for web testing');
//     } else {
//       setEndLocation(mockCoordinate);
//       Alert.alert('End Location Set', 'Mock location set for web testing');
//     }
//   };

//   // Calculate distance between two points (Haversine formula)
//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c; // Distance in kilometers
//   };

//   // Start journey
//   const startJourney = async (): Promise<void> => {
//     if (!startLocation || !endLocation || !purpose.trim()) {
//       Alert.alert('Missing Information', 'Please set start/end locations and purpose');
//       return;
//     }

//     setIsJourneyActive(true);
//     setJourneyStartTime(new Date());
//     setRoute([startLocation]);
//     setShowNewJourney(false);
    
//     if (Platform.OS !== 'web') {
//       // Start location tracking on native platforms
//       const subscription = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000,
//           distanceInterval: 10,
//         },
//         (location) => {
//           const newCoordinate: Coordinate = {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           };
          
//           setCurrentLocation(newCoordinate);
//           setRoute(prevRoute => [...prevRoute, newCoordinate]);
          
//           setRegion({
//             ...newCoordinate,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           });
//         }
//       );
//       setLocationSubscription(subscription);
//     } else {
//       // Mock journey for web
//       Alert.alert('Web Mode', 'Journey started in web mode (simulation)');
//     }
//   };

//   // End journey
//   const endJourney = (): void => {
//     if (!isJourneyActive || !journeyStartTime) return;

//     const journeyEndTime = new Date();
//     const timeTaken = Math.round((journeyEndTime.getTime() - journeyStartTime.getTime()) / 60000);
    
//     let distance = 0;
//     if (Platform.OS === 'web') {
//       // Mock distance for web
//       distance = Math.random() * 10 + 1; // 1-11 km
//     } else {
//       for (let i = 1; i < route.length; i++) {
//         distance += calculateDistance(
//           route[i-1].latitude,
//           route[i-1].longitude,
//           route[i].latitude,
//           route[i].longitude
//         );
//       }
//     }
    
//     setTotalDistance(Number(distance.toFixed(2)));
//     setIsJourneyActive(false);
    
//     if (locationSubscription) {
//       locationSubscription.remove();
//     }
    
//     Alert.alert(
//       'Journey Completed!',
//       `Time taken: ${timeTaken} minutes\nDistance: ${distance.toFixed(2)} km`,
//       [{ text: 'OK', onPress: () => resetJourney() }]
//     );
//   };

//   // Reset journey
//   const resetJourney = (): void => {
//     setStartLocation(null);
//     setEndLocation(null);
//     setPurpose('');
//     setNotes('');
//     setRoute([]);
//     setTotalDistance(0);
//     setJourneyStartTime(null);
//     setShowNewJourney(true);
    
//     if (locationSubscription) {
//       locationSubscription.remove();
//       setLocationSubscription(null);
//     }
//   };

//   // Web fallback component
//   const WebMapPlaceholder: React.FC = () => (
//     <View style={styles.webMapPlaceholder}>
//       <Text style={styles.webMapText}>📍 Map View</Text>
//       <Text style={styles.webMapSubText}>
//         {Platform.OS === 'web' ? 'Maps work on mobile devices' : 'Loading map...'}
//       </Text>
      
//       {Platform.OS === 'web' && (
//         <View style={styles.webLocationButtons}>
//           <TouchableOpacity 
//             style={[styles.webLocationButton, startLocation && styles.webLocationButtonSelected]}
//             onPress={() => handleWebLocationSelect('start')}
//           >
//             <Text style={styles.webLocationButtonText}>
//               {startLocation ? '✓ Start Set' : 'Set Start Location'}
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.webLocationButton, endLocation && styles.webLocationButtonSelected]}
//             onPress={() => handleWebLocationSelect('end')}
//           >
//             <Text style={styles.webLocationButtonText}>
//               {endLocation ? '✓ End Set' : 'Set End Location'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   // New Journey Form Component
//   const NewJourneyForm: React.FC = () => (
//     <Modal visible={showNewJourney} animationType="slide">
//       <SafeAreaView style={styles.modalContainer}>
//         <ScrollView contentContainerStyle={styles.formContainer}>
//           <Text style={styles.header}>Start New Journey</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Start Location</Text>
//             <TouchableOpacity 
//               style={styles.locationButton}
//               onPress={() => {
//                 if (Platform.OS === 'web') {
//                   handleWebLocationSelect('start');
//                 } else {
//                   setShowNewJourney(false);
//                   Alert.alert('Tap on Map', 'Tap on the map to set start location');
//                 }
//               }}
//             >
//               <Text style={styles.locationButtonText}>
//                 {startLocation ? '✓ Start Location Set' : 'Choose Start Location'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>End Location</Text>
//             <TouchableOpacity 
//               style={styles.locationButton}
//               onPress={() => {
//                 if (!startLocation) {
//                   Alert.alert('Set Start First', 'Please set start location first');
//                   return;
//                 }
//                 if (Platform.OS === 'web') {
//                   handleWebLocationSelect('end');
//                 } else {
//                   setShowNewJourney(false);
//                   Alert.alert('Tap on Map', 'Tap on the map to set end location');
//                 }
//               }}
//             >
//               <Text style={styles.locationButtonText}>
//                 {endLocation ? '✓ End Location Set' : 'Choose End Location'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Purpose</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="e.g. Site Visit, Meeting..."
//               value={purpose}
//               onChangeText={setPurpose}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Notes</Text>
//             <TextInput
//               style={[styles.textInput, styles.notesInput]}
//               placeholder="Additional notes..."
//               value={notes}
//               onChangeText={setNotes}
//               multiline
//               numberOfLines={3}
//             />
//           </View>

//           <TouchableOpacity style={styles.startButton} onPress={startJourney}>
//             <Text style={styles.startButtonText}>Start Journey</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.cancelButton} 
//             onPress={() => setShowNewJourney(false)}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Conditional rendering based on platform */}
//       {Platform.OS !== 'web' && MapView ? (
//         <MapView
//           style={styles.map}
//           region={region}
//           onPress={handleMapPress}
//           showsUserLocation={true}
//           showsMyLocationButton={true}
//           provider={PROVIDER_GOOGLE}
//           mapType="standard"
//           showsCompass={true}
//           showsScale={true}
//           showsBuildings={true}
//           showsTraffic={false}
//           showsIndoors={true}
//           loadingEnabled={true}
//           loadingIndicatorColor="#007AFF"
//           loadingBackgroundColor="#FFFFFF"
//         >
//           {startLocation && (
//             <Marker 
//               coordinate={startLocation} 
//               title="Start Location" 
//               description="Journey starting point"
//             >
//               <View style={styles.customMarker}>
//                 <Text style={styles.markerText}>🟢</Text>
//               </View>
//             </Marker>
//           )}
//           {endLocation && (
//             <Marker 
//               coordinate={endLocation} 
//               title="End Location" 
//               description="Journey destination"
//             >
//               <View style={styles.customMarker}>
//                 <Text style={styles.markerText}>🔴</Text>
//               </View>
//             </Marker>
//           )}
//           {route.length > 1 && (
//             <Polyline 
//               coordinates={route} 
//               strokeColor="#007AFF" 
//               strokeWidth={4}
//               lineDashPattern={[1]}
//             />
//           )}
//         </MapView>
//       ) : (
//         <WebMapPlaceholder />
//       )}

//       {/* Control Panel */}
//       <View style={styles.controlPanel}>
//         {!isJourneyActive ? (
//           <TouchableOpacity
//             style={styles.newJourneyButton}
//             onPress={() => setShowNewJourney(true)}
//           >
//             <Text style={styles.buttonText}>New Journey</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.activeJourneyPanel}>
//             <Text style={styles.activeJourneyText}>Journey in Progress</Text>
//             <Text style={styles.purposeText}>Purpose: {purpose}</Text>
//             <TouchableOpacity style={styles.endButton} onPress={endJourney}>
//               <Text style={styles.buttonText}>End Journey</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       <NewJourneyForm />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   customMarker: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   markerText: {
//     fontSize: 20,
//   },
//   webMapPlaceholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//   },
//   webMapText: {
//     fontSize: 48,
//     marginBottom: 20,
//   },
//   webMapSubText: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   webLocationButtons: {
//     width: '80%',
//   },
//   webLocationButton: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: '#2196F3',
//   },
//   webLocationButtonSelected: {
//     backgroundColor: '#C8E6C9',
//     borderColor: '#4CAF50',
//   },
//   webLocationButtonText: {
//     textAlign: 'center',
//     fontWeight: '500',
//     color: '#1976D2',
//   },
//   controlPanel: {
//     position: 'absolute',
//     bottom: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   newJourneyButton: {
//     backgroundColor: '#00C853',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   endButton: {
//     backgroundColor: '#FF5722',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   activeJourneyPanel: {
//     alignItems: 'center',
//   },
//   activeJourneyText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#00C853',
//   },
//   purposeText: {
//     fontSize: 14,
//     color: '#666',
//     marginVertical: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   formContainer: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   locationButton: {
//     backgroundColor: '#E3F2FD',
//     padding: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2196F3',
//   },
//   locationButtonText: {
//     color: '#1976D2',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 15,
//     backgroundColor: 'white',
//     fontSize: 16,
//   },
//   notesInput: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   startButton: {
//     backgroundColor: '#00C853',
//     padding: 18,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   startButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   cancelButton: {
//     backgroundColor: 'transparent',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#666',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontWeight: '500',
//   },
// });

// export default JourneyTracker;





// import * as Location from 'expo-location';
// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';

// // Conditional import for maps (only on native platforms)
// let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;
// if (Platform.OS !== 'web') {
//   const Maps = require('react-native-maps');
//   MapView = Maps.default;
//   Marker = Maps.Marker;
//   Polyline = Maps.Polyline;
//   PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
// }

// // Type definitions
// interface Coordinate {
//   latitude: number;
//   longitude: number;
// }

// interface Region extends Coordinate {
//   latitudeDelta: number;
//   longitudeDelta: number;
// }

// const JourneyTracker: React.FC = () => {
//   // State variables with TypeScript types
//   const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
//   const [startLocation, setStartLocation] = useState<Coordinate | null>(null);
//   const [endLocation, setEndLocation] = useState<Coordinate | null>(null);
//   const [purpose, setPurpose] = useState<string>('');
//   const [notes, setNotes] = useState<string>('');
//   const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);
//   const [journeyStartTime, setJourneyStartTime] = useState<Date | null>(null);
//   const [totalDistance, setTotalDistance] = useState<number>(0);
//   const [route, setRoute] = useState<Coordinate[]>([]);
//   const [showNewJourney, setShowNewJourney] = useState<boolean>(true);
//   const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
//   const [region, setRegion] = useState<Region>({
//     latitude: 18.5204, // Pune coordinates as default
//     longitude: 73.8567,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });

//   // Get current location permission and location
//   useEffect(() => {
//     if (Platform.OS !== 'web') {
//       getCurrentLocation();
//     } else {
//       // For web, use mock location
//       const mockLocation: Coordinate = {
//         latitude: 18.5204,
//         longitude: 73.8567,
//       };
//       setCurrentLocation(mockLocation);
//     }
//   }, []);

//   const getCurrentLocation = async (): Promise<void> => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission denied', 'Please grant location permission to use this app');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const newLocation: Coordinate = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       };
      
//       setCurrentLocation(newLocation);
//       setRegion({
//         ...newLocation,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Could not get current location');
//     }
//   };

//   // Handle map press to set start/end locations
//   const handleMapPress = (event: any): void => {
//     const coordinate: Coordinate = event.nativeEvent.coordinate;
    
//     if (!startLocation) {
//       setStartLocation(coordinate);
//       Alert.alert('Start Location Set', 'Now tap to set your end location');
//     } else if (!endLocation) {
//       setEndLocation(coordinate);
//       Alert.alert('End Location Set', 'Both locations are set. Fill in journey details.');
//     }
//   };

//   // For web: simulate location selection
//   const handleWebLocationSelect = (type: 'start' | 'end'): void => {
//     const mockCoordinate: Coordinate = {
//       latitude: 18.5204 + (Math.random() - 0.5) * 0.01,
//       longitude: 73.8567 + (Math.random() - 0.5) * 0.01,
//     };

//     if (type === 'start') {
//       setStartLocation(mockCoordinate);
//       Alert.alert('Start Location Set', 'Mock location set for web testing');
//     } else {
//       setEndLocation(mockCoordinate);
//       Alert.alert('End Location Set', 'Mock location set for web testing');
//     }
//   };

//   // Calculate distance between two points (Haversine formula)
//   const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//     const R = 6371; // Earth's radius in kilometers
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c; // Distance in kilometers
//   };

//   // Start journey
//   const startJourney = async (): Promise<void> => {
//     if (!startLocation || !endLocation || !purpose.trim()) {
//       Alert.alert('Missing Information', 'Please set start/end locations and purpose');
//       return;
//     }

//     setIsJourneyActive(true);
//     setJourneyStartTime(new Date());
//     setRoute([startLocation]);
//     setShowNewJourney(false);
    
//     if (Platform.OS !== 'web') {
//       // Start location tracking on native platforms
//       const subscription = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.High,
//           timeInterval: 5000,
//           distanceInterval: 10,
//         },
//         (location) => {
//           const newCoordinate: Coordinate = {
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//           };
          
//           setCurrentLocation(newCoordinate);
//           setRoute(prevRoute => [...prevRoute, newCoordinate]);
          
//           setRegion({
//             ...newCoordinate,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           });
//         }
//       );
//       setLocationSubscription(subscription);
//     } else {
//       // Mock journey for web
//       Alert.alert('Web Mode', 'Journey started in web mode (simulation)');
//     }
//   };

//   // End journey
//   const endJourney = (): void => {
//     if (!isJourneyActive || !journeyStartTime) return;

//     const journeyEndTime = new Date();
//     const timeTaken = Math.round((journeyEndTime.getTime() - journeyStartTime.getTime()) / 60000);
    
//     let distance = 0;
//     if (Platform.OS === 'web') {
//       // Mock distance for web
//       distance = Math.random() * 10 + 1; // 1-11 km
//     } else {
//       for (let i = 1; i < route.length; i++) {
//         distance += calculateDistance(
//           route[i-1].latitude,
//           route[i-1].longitude,
//           route[i].latitude,
//           route[i].longitude
//         );
//       }
//     }
    
//     setTotalDistance(Number(distance.toFixed(2)));
//     setIsJourneyActive(false);
    
//     if (locationSubscription) {
//       locationSubscription.remove();
//     }
    
//     Alert.alert(
//       'Journey Completed!',
//       `Time taken: ${timeTaken} minutes\nDistance: ${distance.toFixed(2)} km`,
//       [{ text: 'OK', onPress: () => resetJourney() }]
//     );
//   };

//   // Reset journey
//   const resetJourney = (): void => {
//     setStartLocation(null);
//     setEndLocation(null);
//     setPurpose('');
//     setNotes('');
//     setRoute([]);
//     setTotalDistance(0);
//     setJourneyStartTime(null);
//     setShowNewJourney(true);
    
//     if (locationSubscription) {
//       locationSubscription.remove();
//       setLocationSubscription(null);
//     }
//   };

//   // Web fallback component
//   const WebMapPlaceholder: React.FC = () => (
//     <View style={styles.webMapPlaceholder}>
//       <Text style={styles.webMapText}>📍 Map View</Text>
//       <Text style={styles.webMapSubText}>
//         {Platform.OS === 'web' ? 'Maps work on mobile devices' : 'Loading map...'}
//       </Text>
      
//       {Platform.OS === 'web' && (
//         <View style={styles.webLocationButtons}>
//           <TouchableOpacity 
//             style={[styles.webLocationButton, startLocation && styles.webLocationButtonSelected]}
//             onPress={() => handleWebLocationSelect('start')}
//           >
//             <Text style={styles.webLocationButtonText}>
//               {startLocation ? '✓ Start Set' : 'Set Start Location'}
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.webLocationButton, endLocation && styles.webLocationButtonSelected]}
//             onPress={() => handleWebLocationSelect('end')}
//           >
//             <Text style={styles.webLocationButtonText}>
//               {endLocation ? '✓ End Set' : 'Set End Location'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );

//   // New Journey Form Component
//   const NewJourneyForm: React.FC = () => (
//     <Modal visible={showNewJourney} animationType="slide">
//       <SafeAreaView style={styles.modalContainer}>
//         <ScrollView contentContainerStyle={styles.formContainer}>
//           <Text style={styles.header}>Start New Journey</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Start Location</Text>
//             <TouchableOpacity 
//               style={styles.locationButton}
//               onPress={() => {
//                 if (Platform.OS === 'web') {
//                   handleWebLocationSelect('start');
//                 } else {
//                   setShowNewJourney(false);
//                   Alert.alert('Tap on Map', 'Tap on the map to set start location');
//                 }
//               }}
//             >
//               <Text style={styles.locationButtonText}>
//                 {startLocation ? '✓ Start Location Set' : 'Choose Start Location'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>End Location</Text>
//             <TouchableOpacity 
//               style={styles.locationButton}
//               onPress={() => {
//                 if (!startLocation) {
//                   Alert.alert('Set Start First', 'Please set start location first');
//                   return;
//                 }
//                 if (Platform.OS === 'web') {
//                   handleWebLocationSelect('end');
//                 } else {
//                   setShowNewJourney(false);
//                   Alert.alert('Tap on Map', 'Tap on the map to set end location');
//                 }
//               }}
//             >
//               <Text style={styles.locationButtonText}>
//                 {endLocation ? '✓ End Location Set' : 'Choose End Location'}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Purpose</Text>
//             <TextInput
//               style={styles.textInput}
//               placeholder="e.g. Site Visit, Meeting..."
//               value={purpose}
//               onChangeText={setPurpose}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Notes</Text>
//             <TextInput
//               style={[styles.textInput, styles.notesInput]}
//               placeholder="Additional notes..."
//               value={notes}
//               onChangeText={setNotes}
//               multiline
//               numberOfLines={3}
//             />
//           </View>

//           <TouchableOpacity style={styles.startButton} onPress={startJourney}>
//             <Text style={styles.startButtonText}>Start Journey</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.cancelButton} 
//             onPress={() => setShowNewJourney(false)}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Conditional rendering based on platform */}
//       {Platform.OS !== 'web' && MapView ? (
//         <MapView
//           style={styles.map}
//           region={region}
//           onPress={handleMapPress}
//           showsUserLocation={true}
//           showsMyLocationButton={true}
//           provider={PROVIDER_GOOGLE}
//           mapType="standard"
//           showsCompass={true}
//           showsScale={true}
//           showsBuildings={true}
//           showsTraffic={false}
//           showsIndoors={true}
//           loadingEnabled={true}
//           loadingIndicatorColor="#007AFF"
//           loadingBackgroundColor="#FFFFFF"
//         >
//           {startLocation && (
//             <Marker 
//               coordinate={startLocation} 
//               title="Start Location" 
//               description="Journey starting point"
//             >
//               <View style={styles.customMarker}>
//                 <Text style={styles.markerText}>🟢</Text>
//               </View>
//             </Marker>
//           )}
//           {endLocation && (
//             <Marker 
//               coordinate={endLocation} 
//               title="End Location" 
//               description="Journey destination"
//             >
//               <View style={styles.customMarker}>
//                 <Text style={styles.markerText}>🔴</Text>
//               </View>
//             </Marker>
//           )}
//           {route.length > 1 && (
//             <Polyline 
//               coordinates={route} 
//               strokeColor="#007AFF" 
//               strokeWidth={4}
//               lineDashPattern={[1]}
//             />
//           )}
//         </MapView>
//       ) : (
//         <WebMapPlaceholder />
//       )}

//       {/* Control Panel */}
//       <View style={styles.controlPanel}>
//         {!isJourneyActive ? (
//           <TouchableOpacity
//             style={styles.newJourneyButton}
//             onPress={() => setShowNewJourney(true)}
//           >
//             <Text style={styles.buttonText}>New Journey</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={styles.activeJourneyPanel}>
//             <Text style={styles.activeJourneyText}>Journey in Progress</Text>
//             <Text style={styles.purposeText}>Purpose: {purpose}</Text>
//             <TouchableOpacity style={styles.endButton} onPress={endJourney}>
//               <Text style={styles.buttonText}>End Journey</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       <NewJourneyForm />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   customMarker: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   markerText: {
//     fontSize: 20,
//   },
//   webMapPlaceholder: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//   },
//   webMapText: {
//     fontSize: 48,
//     marginBottom: 20,
//   },
//   webMapSubText: {
//     fontSize: 18,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   webLocationButtons: {
//     width: '80%',
//   },
//   webLocationButton: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderWidth: 2,
//     borderColor: '#2196F3',
//   },
//   webLocationButtonSelected: {
//     backgroundColor: '#C8E6C9',
//     borderColor: '#4CAF50',
//   },
//   webLocationButtonText: {
//     textAlign: 'center',
//     fontWeight: '500',
//     color: '#1976D2',
//   },
//   controlPanel: {
//     position: 'absolute',
//     bottom: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   newJourneyButton: {
//     backgroundColor: '#00C853',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   endButton: {
//     backgroundColor: '#FF5722',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   activeJourneyPanel: {
//     alignItems: 'center',
//   },
//   activeJourneyText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#00C853',
//   },
//   purposeText: {
//     fontSize: 14,
//     color: '#666',
//     marginVertical: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   formContainer: {
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   locationButton: {
//     backgroundColor: '#E3F2FD',
//     padding: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#2196F3',
//   },
//   locationButtonText: {
//     color: '#1976D2',
//     textAlign: 'center',
//     fontWeight: '500',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 15,
//     backgroundColor: 'white',
//     fontSize: 16,
//   },
//   notesInput: {
//     height: 80,
//     textAlignVertical: 'top',
//   },
//   startButton: {
//     backgroundColor: '#00C853',
//     padding: 18,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   startButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   cancelButton: {
//     backgroundColor: 'transparent',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#666',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontWeight: '500',
//   },
// });

// export default JourneyTracker;






import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Conditional import for maps (only on native platforms)
let MapView: any, Marker: any, Polyline: any, PROVIDER_GOOGLE: any;
let mapsAvailable = false;

try {
  if (Platform.OS !== 'web') {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
    mapsAvailable = true;
  }
} catch (error) {
  console.warn('react-native-maps not available:', error);
  mapsAvailable = false;
}

// Type definitions
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Region extends Coordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}

const JourneyTracker: React.FC = () => {
  // State variables
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  const [startLocation, setStartLocation] = useState<Coordinate | null>(null);
  const [endLocation, setEndLocation] = useState<Coordinate | null>(null);
  const [purpose, setPurpose] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);
  const [journeyStartTime, setJourneyStartTime] = useState<Date | null>(null);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [showNewJourney, setShowNewJourney] = useState<boolean>(true);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 18.5204, // Pune coordinates as default
    longitude: 73.8567,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Get current location permission and location
  useEffect(() => {
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    } else {
      // For web, use mock location
      const mockLocation: Coordinate = {
        latitude: 18.5204,
        longitude: 73.8567,
      };
      setCurrentLocation(mockLocation);
    }
  }, []);

  const getCurrentLocation = async (): Promise<void> => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Please grant location permission to use this app');
        // Use default location if permission denied
        const defaultLocation: Coordinate = {
          latitude: 18.5204,
          longitude: 73.8567,
        };
        setCurrentLocation(defaultLocation);
        return;
      }

      // Simplified location request
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const newLocation: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(newLocation);
      setRegion({
        ...newLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Could not get current location. Using default location.');
      // Use default Pune location
      const defaultLocation: Coordinate = {
        latitude: 18.5204,
        longitude: 73.8567,
      };
      setCurrentLocation(defaultLocation);
    }
  };

  // Handle map press to set start/end locations
  const handleMapPress = (event: any): void => {
    const coordinate: Coordinate = event.nativeEvent.coordinate;
    
    if (!startLocation) {
      setStartLocation(coordinate);
      Alert.alert('Start Location Set', 'Now tap to set your end location');
    } else if (!endLocation) {
      setEndLocation(coordinate);
      Alert.alert('End Location Set', 'Both locations are set. Fill in journey details.');
    }
  };

  // Handle map ready
  const handleMapReady = (): void => {
    console.log('Map is ready');
    setMapError(null);
  };

  // Handle map errors
  const handleMapError = (error: any): void => {
    console.error('Map error:', error);
    setMapError('Map failed to load. Check your Google Maps API key configuration.');
  };

  // For web: simulate location selection
  const handleWebLocationSelect = (type: 'start' | 'end'): void => {
    const mockCoordinate: Coordinate = {
      latitude: 18.5204 + (Math.random() - 0.5) * 0.01,
      longitude: 73.8567 + (Math.random() - 0.5) * 0.01,
    };

    if (type === 'start') {
      setStartLocation(mockCoordinate);
      Alert.alert('Start Location Set', 'Mock location set for web testing');
    } else {
      setEndLocation(mockCoordinate);
      Alert.alert('End Location Set', 'Mock location set for web testing');
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Start journey
  const startJourney = async (): Promise<void> => {
    if (!startLocation || !endLocation || !purpose.trim()) {
      Alert.alert('Missing Information', 'Please set start/end locations and purpose');
      return;
    }

    setIsJourneyActive(true);
    setJourneyStartTime(new Date());
    setRoute([startLocation]);
    setShowNewJourney(false);
    
    if (Platform.OS !== 'web') {
      // Start location tracking on native platforms
      try {
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (location) => {
            const newCoordinate: Coordinate = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            
            setCurrentLocation(newCoordinate);
            setRoute(prevRoute => [...prevRoute, newCoordinate]);
            
            setRegion({
              ...newCoordinate,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        );
        setLocationSubscription(subscription);
      } catch (error) {
        console.error('Location tracking error:', error);
        Alert.alert('Warning', 'Location tracking may not work properly');
      }
    } else {
      // Mock journey for web
      Alert.alert('Web Mode', 'Journey started in web mode (simulation)');
    }
  };

  // End journey
  const endJourney = (): void => {
    if (!isJourneyActive || !journeyStartTime) return;

    const journeyEndTime = new Date();
    const timeTaken = Math.round((journeyEndTime.getTime() - journeyStartTime.getTime()) / 60000);
    
    let distance = 0;
    if (Platform.OS === 'web') {
      // Mock distance for web
      distance = Math.random() * 10 + 1; // 1-11 km
    } else {
      for (let i = 1; i < route.length; i++) {
        distance += calculateDistance(
          route[i-1].latitude,
          route[i-1].longitude,
          route[i].latitude,
          route[i].longitude
        );
      }
    }
    
    setTotalDistance(Number(distance.toFixed(2)));
    setIsJourneyActive(false);
    
    if (locationSubscription) {
      locationSubscription.remove();
    }
    
    Alert.alert(
      'Journey Completed!',
      `Time taken: ${timeTaken} minutes\nDistance: ${distance.toFixed(2)} km`,
      [{ text: 'OK', onPress: () => resetJourney() }]
    );
  };

  // Reset journey
  const resetJourney = (): void => {
    setStartLocation(null);
    setEndLocation(null);
    setPurpose('');
    setNotes('');
    setRoute([]);
    setTotalDistance(0);
    setJourneyStartTime(null);
    setShowNewJourney(true);
    setMapError(null);
    
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // Map Error Component
  const MapErrorComponent: React.FC = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Map Error</Text>
      <Text style={styles.errorMessage}>{mapError}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => {
          setMapError(null);
        }}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Web fallback component
  const WebMapPlaceholder: React.FC = () => (
    <View style={styles.webMapPlaceholder}>
      <Text style={styles.webMapText}>📍 Map View</Text>
      <Text style={styles.webMapSubText}>Maps work on mobile devices</Text>
      
      <View style={styles.webLocationButtons}>
        <TouchableOpacity 
          style={[styles.webLocationButton, startLocation && styles.webLocationButtonSelected]}
          onPress={() => handleWebLocationSelect('start')}
        >
          <Text style={styles.webLocationButtonText}>
            {startLocation ? '✓ Start Set' : 'Set Start Location'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.webLocationButton, endLocation && styles.webLocationButtonSelected]}
          onPress={() => handleWebLocationSelect('end')}
        >
          <Text style={styles.webLocationButtonText}>
            {endLocation ? '✓ End Set' : 'Set End Location'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Main Map Component
  const renderMap = () => {
    // Web platform - show placeholder
    if (Platform.OS === 'web') {
      return <WebMapPlaceholder />;
    }

    // Native platform but maps not available
    if (!mapsAvailable) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Maps Not Available</Text>
          <Text style={styles.errorMessage}>
            react-native-maps is not installed or configured properly
          </Text>
        </View>
      );
    }

    // Map error occurred
    if (mapError) {
      return <MapErrorComponent />;
    }

    // Render the actual map with minimal props to avoid errors
    return (
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        onMapReady={handleMapReady}
        onError={handleMapError}
        showsUserLocation={true}
        showsMyLocationButton={true}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        loadingEnabled={true}
        loadingIndicatorColor="#007AFF"
        loadingBackgroundColor="#FFFFFF"
      >
        {startLocation && (
          <Marker 
            coordinate={startLocation} 
            title="Start Location" 
            description="Journey starting point"
          >
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>🟢</Text>
            </View>
          </Marker>
        )}
        {endLocation && (
          <Marker 
            coordinate={endLocation} 
            title="End Location" 
            description="Journey destination"
          >
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>🔴</Text>
            </View>
          </Marker>
        )}
        {route.length > 1 && (
          <Polyline 
            coordinates={route} 
            strokeColor="#007AFF" 
            strokeWidth={4}
          />
        )}
      </MapView>
    );
  };

  // New Journey Form Component
  const NewJourneyForm: React.FC = () => (
    <Modal visible={showNewJourney} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.header}>Start New Journey</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Location</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  handleWebLocationSelect('start');
                } else {
                  setShowNewJourney(false);
                  Alert.alert('Tap on Map', 'Tap on the map to set start location');
                }
              }}
            >
              <Text style={styles.locationButtonText}>
                {startLocation ? '✓ Start Location Set' : 'Choose Start Location'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>End Location</Text>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={() => {
                if (!startLocation) {
                  Alert.alert('Set Start First', 'Please set start location first');
                  return;
                }
                if (Platform.OS === 'web') {
                  handleWebLocationSelect('end');
                } else {
                  setShowNewJourney(false);
                  Alert.alert('Tap on Map', 'Tap on the map to set end location');
                }
              }}
            >
              <Text style={styles.locationButtonText}>
                {endLocation ? '✓ End Location Set' : 'Choose End Location'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Site Visit, Meeting..."
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Additional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startJourney}>
            <Text style={styles.startButtonText}>Start Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowNewJourney(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {renderMap()}

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {!isJourneyActive ? (
          <TouchableOpacity
            style={styles.newJourneyButton}
            onPress={() => setShowNewJourney(true)}
          >
            <Text style={styles.buttonText}>New Journey</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.activeJourneyPanel}>
            <Text style={styles.activeJourneyText}>Journey in Progress</Text>
            <Text style={styles.purposeText}>Purpose: {purpose}</Text>
            <TouchableOpacity style={styles.endButton} onPress={endJourney}>
              <Text style={styles.buttonText}>End Journey</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <NewJourneyForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    fontSize: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  webMapText: {
    fontSize: 48,
    marginBottom: 20,
  },
  webMapSubText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  webLocationButtons: {
    width: '80%',
  },
  webLocationButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  webLocationButtonSelected: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },
  webLocationButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#1976D2',
  },
  controlPanel: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  newJourneyButton: {
    backgroundColor: '#00C853',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  endButton: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeJourneyPanel: {
    alignItems: 'center',
  },
  activeJourneyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C853',
  },
  purposeText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  locationButton: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  locationButtonText: {
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  startButton: {
    backgroundColor: '#00C853',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});

export default JourneyTracker;