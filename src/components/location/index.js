import React from 'react';

import haversine from '../../utils/haversine';

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
        const geolocationWatchId = navigator.geolocation.watchPosition(this.addLocationToHistory);

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
                    time: loc.timestamp,
                }),
            };
        });
    }

    render() {
        const { locationHistory } = this.state;

        const data = [];
        for (let i = 1; i < locationHistory.length; i++) {
            const location1 = locationHistory[i - 1];
            const location2 = locationHistory[i];
            const coords1 = location1.coords;
            const coords2 = location2.coords;

            const distance = haversine(coords1, coords2);

            const duration = (location2.time - location1.time) / 1000;
            const speed = distance / duration; // meters per second;

            if (duration > 0.5) {
                data.push({
                    distance,
                    time: location2.time,
                    duration,
                    speed,
                });
            }
        }

        data.reverse();
        const lastDatum = data[0];
        const totalDistance = data.map(d => d.distance).reduce((a, c) => a + c, 0);

        return (
            <div>
                {lastDatum && (
                    <h2>{`${(lastDatum.speed * 3.6).toFixed(1)} km/h, ${totalDistance.toFixed(
                        1
                    )} m`}</h2>
                )}
                <table>
                    <thead>
                        <tr>
                            <th>Distance (m)</th>
                            <th>Duration (s)</th>
                            <th>Speed (m/s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((datum, i) => (
                            <tr key={`${datum.time}${i}`}>
                                <td>{datum.distance.toFixed(3)}</td>
                                <td>{datum.duration.toFixed(3)}</td>
                                <td>{datum.speed.toFixed(3)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
