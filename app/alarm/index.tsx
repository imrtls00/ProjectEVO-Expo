import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';

import AlarmModule, { removeAlarm, scheduleAlarm, stopAlarm } from "expo-alarm-module";

// The following code is an example of how to use the alarm module.
const MyAlarmScreen = () => {
    const alarmIn60 = () => {
        var newDate = new Date();
        newDate.setSeconds(newDate.getSeconds() + 30);

        scheduleAlarm(
        {
            uid: "alarm1",
            day: newDate,
            title: "Title of alarm",
            description: "Alarm Description",        
            snoozeInterval: 5,
            repeating: true,
            active: true
        } as any
        );

    };

    /* Create a new alarm 60 seconds after the current date.*/
    const onStopAlarmButton = () => {
        // Stops any alarm that is playing
        stopAlarm();
        
        // Removes the alarm. Also stops any alarm that is playing, so the above function stopAlarm is redundant.
        removeAlarm("alarm1");

    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>React Native Alarm Test</Text>
            <Button title="Alarm in 30 seconds" onPress={alarmIn60} />
            <Button title="Stop Alarm" onPress={onStopAlarmButton} />
        </View>
    );
};

export default MyAlarmScreen;