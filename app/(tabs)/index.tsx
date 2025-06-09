import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const steps = ['Inhale', 'Hold', 'Exhale', 'Hold'];
const STEP_DURATION = 4000;

export default function App() {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      runStep();
      intervalRef.current = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % steps.length);
        runStep();
      }, STEP_DURATION);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const runStep = () => {
    const step = steps[stepIndex];
    if (step === 'Hold' || step === 'Exhale') {
      if (Platform.OS === 'android') {
        Vibration.vibrate(200);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) setStepIndex(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>{running ? steps[stepIndex] : 'Ready'}</Text>
      <TouchableOpacity onPress={toggleRunning} activeOpacity={0.7}>
        <View style={styles.neuWrapper}>
          <LinearGradient
            colors={['#ffffff', '#dfe9f3']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {running ? 'Stop' : 'Start'}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 42,
    fontWeight: '600',
    color: '#333',
    marginBottom: 60,
  },
  neuWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
    backgroundColor: '#ecf0f3',
    borderRadius: 100,
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f3',
    shadowColor: '#ffffff',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
});
