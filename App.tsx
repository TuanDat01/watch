import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableHighlight, View, ScrollView } from "react-native";

export default function App(): React.JSX.Element {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [laps, setLaps] = useState<number[]>([]);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const toggleTimer = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
    };

    const resetTimer = () => {
        setTime(0);
        setIsRunning(false);
        setLaps([]);
    };

    const lapTimer = () => {
        setLaps((prevLaps) => [...prevLaps, time]);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        const milliseconds = Math.floor((time % 1000) / 10);
        return `${minutes < 10 ? "0" : ""}${minutes}:${
            seconds < 10 ? "0" : ""
        }${seconds},${milliseconds < 10 ? "0" : ""}${milliseconds}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.timeWrapper}>
                    <Text style={styles.timer}>{formatTime(time)}</Text>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableHighlight
                        style={styles.buttonReset}
                        underlayColor="#C0C0C0" // Màu xám nhạt
                        onPress={isRunning ? lapTimer : resetTimer}
                        disabled={!isRunning && time === 0}
                    >
                        <Text style={styles.buttonText}>
                            {isRunning ? "Lap" : "Reset"}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={isRunning ? styles.buttonRunning : styles.buttonStart}
                        underlayColor="#004d00"
                        onPress={toggleTimer}
                    >
                        <Text style={styles.buttonText}>
                            {isRunning ? "Stop" : "Start"}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={styles.footer}>
                <ScrollView>
                    <View style={styles.lapContainer}>
                        {laps.slice(0).reverse().map((lap, index) => (
                            <View key={index} style={styles.lap}>
                                <Text style={styles.laptext}>{`Lap #${laps.length - index}`}</Text>
                                <Text style={styles.laptext}>{formatTime(lap)}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    timeWrapper: {
        flex: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonWrapper: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    lapContainer: {
        paddingBottom: 80,
    },
    lap: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    laptext: {
        fontSize: 30,
        color: "white",
    },
    timer: {
        fontSize: 90,
        backgroundColor: "black",
        color: "white",
    },
    header: {
        flex: 1,
    },
    footer: {
        flex: 1,
    },
    buttonStart: {
        borderRadius: 50,
        height: 100,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00CC3C", // Màu xanh lá cây sáng
    },
    buttonRunning: {
        borderRadius: 50,
        height: 100,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DC143C", // Màu đỏ đậm
    },
    buttonReset: {
        borderRadius: 50,
        height: 100,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray", // Màu xám nhạt
    },
    buttonText: {
        color: "white", // Màu trắng
        fontWeight: "700",
        fontSize: 20,
    },
});