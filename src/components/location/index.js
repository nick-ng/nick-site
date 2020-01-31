import React from 'react';

export default class Location extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            geolocationWatchId: null,
            locationHistory: [],
        };

        this.addLocationToHistory = this.addLocationToHistory.bind(this);
    }

    componentDidMount() {
        const geolocationWatchId = navigator.geolocation.watchPosition(
            this.addLocationToHistory
        );

        this.setState({
            geolocationWatchId,
        });
    }

    componentWillUnmount() {
        const { geolocationWatchId } = this.state;
        if (geolocationWatchId !== null) {
            navigator.geolocation.clearWatch(geolocationWatchId);
        }
    }

    addLocationToHistory(loc) {
        this.setState(state => {
            const { locationHistory } = state;
            return {
                locationHistory: locationHistory.concat({
                    coords: {
                        lon: loc.coords.longitude,
                        lat: loc.coords.latitude,
                    },
                    time: new Date(),
                }),
            };
        });
    }

    render() {
        const { locationHistory } = this.state;

        const lastLocation = locationHistory[locationHistory.length - 1];

        return (
            <div>
                {lastLocation && (
                    <h2>
                        {`lon: ${lastLocation.coords.lon}, lat: ${lastLocation.coords.lat}`}
                    </h2>
                )}
                {locationHistory.map((location, i) => (
                    <div key={`${location.time}${i}`}>
                        {`lon: ${location.coords.lon}, lat: ${location.coords.lat}`}
                    </div>
                ))}
            </div>
        );
    }
}
