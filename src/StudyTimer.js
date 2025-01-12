import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Vibration,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Sound from 'react-native-sound';
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const StudyTimer = () => {
  const navigation = useNavigation();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [initialSeconds, setInitialSeconds] = useState(0);

  const [isStopwatch, setIsStopwatch] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  const timerRef = useRef(null);
  const stopwatchRef = useRef(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    Sound.setMode('SpokenAudio');
    Sound.setActive(true);
  }, []);

  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const total = sessions.reduce((sum, session) => {
      const sessionDate = new Date(session.startTime).setHours(0, 0, 0, 0);
      if (sessionDate === today) {
        return sum + session.duration;
      }
      return sum;
    }, 0);
    setDailyTotal(total);
  }, [sessions]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stopwatchRef.current) clearInterval(stopwatchRef.current);
    };
  }, []);

  const playAlarm = () => {
    try {
      Vibration.vibrate([500, 500, 500]);

      const isAndroid = Platform.OS === 'android';
      const alarm = new Sound(
        isAndroid ? 'alarm_sound.mp3' : 'alarm_sound.m4a',
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Failed to load sound', error);
            return;
          }

          alarm.setVolume(1.0);
          alarm.play(success => {
            if (!success) {
              console.log('Sound playback failed');
            }
          });

          Alert.alert(
            "Time's Up!",
            'Timer completed!',
            [
              {
                text: 'Stop',
                onPress: () => {
                  Vibration.cancel();
                  alarm.stop();
                  alarm.release();
                  resetTimer();
                },
                style: 'cancel',
              },
            ],
            {
              cancelable: false,
              onDismiss: () => {
                Vibration.cancel();
                alarm.stop();
                alarm.release();
              },
            },
          );
        },
      );
    } catch (error) {
      console.error('Error playing alarm:', error);
      Alert.alert('Timer Complete', 'Timer completed!');
    }
  };
  const formatTime = totalSeconds => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0',
    )}:${String(secs).padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      const totalSeconds =
        parseInt(hours || '0') * 3600 +
        parseInt(minutes || '0') * 60 +
        parseInt(seconds || '0');

      if (totalSeconds <= 0) {
        Alert.alert('Invalid Time', 'Please enter a valid time');
        return;
      }

      setTimerSeconds(totalSeconds);
      setInitialSeconds(totalSeconds);
    }

    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      setSessionStartTime(new Date());
      setIsStopwatchRunning(true);
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
  };

  const pauseStopwatch = () => {
    clearInterval(stopwatchRef.current);
    setIsStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(stopwatchRef.current);
    setIsStopwatchRunning(false);
    if (stopwatchTime > 0) {
      saveSession(stopwatchTime);
    }
    setStopwatchTime(0);
    setSessionStartTime(null);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(true);
  };

  const saveSession = duration => {
    const sessionEndTime = new Date();
    const newSession = {
      name: `Study Session ${sessions.length + 1}`,
      duration: duration,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      formattedDuration: formatTime(duration),
    };

    setSessions(prev => [newSession, ...prev]);
    setSessionStartTime(null);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimerSeconds(0);
    setInitialSeconds(0);
    setHours('');
    setMinutes('');
    setSeconds('');
    setSessionStartTime(null);
  };

  const formatSessionTime = (startTime, endTime) => {
    return `${new Date(startTime).toLocaleTimeString()} - ${new Date(
      endTime,
    ).toLocaleTimeString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={24} color="#4B9F89"  onPress={() => navigation.goBack()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Timer</Text>
        <TouchableOpacity onPress={() => setIsStopwatch(!isStopwatch)}>
          <Icon
            name={isStopwatch ? 'clock' : 'stopwatch'}
            size={24}
            color="#4B9F89"
          />
        </TouchableOpacity>
      </View>

      {/* Daily Total */}
      <View style={styles.dailyStats}>
        <Text style={styles.dailyStatsText}>
          Today's Total Study Time: {formatTime(dailyTotal)}
        </Text>
      </View>

      {/* Timer/Stopwatch Display */}
      <View style={styles.timerContainer}>
        <View style={styles.progressCircle}>
          {/* <View style={styles.progressBackground} /> */}
          {!isStopwatch && timerSeconds > 0 && (
            <View
              style={[
                styles.progressFill,
                {
                  transform: [
                    {
                      rotate: `${
                        ((initialSeconds - timerSeconds) / initialSeconds) * 360
                      }deg`,
                    },
                  ],
                },
              ]}
            />
          )}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {isStopwatch
                ? formatTime(stopwatchTime)
                : formatTime(timerSeconds)}
            </Text>
            <Text style={styles.modeText}>
              {isStopwatch ? 'Stopwatch' : 'Timer'}
            </Text>
          </View>
        </View>

        {/* Time Input for Timer */}
        {!isStopwatch && !isRunning && !isPaused && (
          <View style={styles.timeInputContainer}>
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                placeholder="00"
                keyboardType="number-pad"
                maxLength={2}
                value={hours}
                onChangeText={setHours}
              />
              <Text style={styles.timeLabel}>hrs</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                placeholder="00"
                keyboardType="number-pad"
                maxLength={2}
                value={minutes}
                onChangeText={setMinutes}
              />
              <Text style={styles.timeLabel}>min</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeInputGroup}>
              <TextInput
                style={styles.timeInput}
                placeholder="00"
                keyboardType="number-pad"
                maxLength={2}
                value={seconds}
                onChangeText={setSeconds}
              />
              <Text style={styles.timeLabel}>sec</Text>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {isStopwatch ? (
            <>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  isStopwatchRunning && styles.pauseButton,
                ]}
                onPress={isStopwatchRunning ? pauseStopwatch : startStopwatch}>
                <Text style={styles.controlButtonText}>
                  {isStopwatchRunning ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.resetButton]}
                onPress={resetStopwatch}>
                <Text style={styles.controlButtonText}>Save & Reset</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.controlButton, isRunning && styles.pauseButton]}
                onPress={isRunning ? pauseTimer : startTimer}>
                <Text style={styles.controlButtonText}>
                  {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start'}
                </Text>
              </TouchableOpacity>
              {(isPaused || !isRunning) && (
                <TouchableOpacity
                  style={[styles.controlButton, styles.resetButton]}
                  onPress={resetTimer}>
                  <Text style={styles.controlButtonText}>Reset</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Sessions List */}
      <View style={styles.sessionsHeader}>
        <Text style={styles.sessionsTitle}>Study Sessions</Text>
      </View>
      <ScrollView style={styles.sessionsContainer}>
        {sessions.map((session, index) => (
          <View key={index} style={styles.sessionItem}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionName}>{session.name}</Text>
              <Text style={styles.sessionTime}>
                {formatSessionTime(session.startTime, session.endTime)}
              </Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.sessionDuration}>
                {session.formattedDuration}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },
  dailyStats: {
    padding: 16,
    backgroundColor: '#E7F5FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dailyStatsText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    fontWeight: '500',
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressCircle: {
    justifyContent: 'center',
    alignItems: 'center',

    padding: 20,
  },

  progressFill: {
    borderWidth: 15,
    borderColor: '#4B9F89',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timeContainer: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#212529',
    letterSpacing: 2,
  },
  modeText: {
    fontSize: 16,
    color: '#6C757D',
    marginTop: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#4B9F89',
    borderRadius: 8,
    padding: 12,
    width: 64,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#FFFFFF',
    color: '#212529',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
    fontWeight: '500',
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 8,
    color: '#4B9F89',
    fontWeight: '300',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  controlButton: {
    backgroundColor: '#4B9F89',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: 120,
  },
  pauseButton: {
    backgroundColor: '#FFA500',
  },
  resetButton: {
    backgroundColor: '#6C757D',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sessionsHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  sessionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 4,
  },
  sessionsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#6C757D',
  },
  durationContainer: {
    backgroundColor: '#E7F5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sessionDuration: {
    fontSize: 16,
    color: '#4B9F89',
    fontWeight: '500',
  },

  fadeIn: {
    opacity: 1,
    transition: 'opacity 0.3s ease-in',
  },
  fadeOut: {
    opacity: 0,
    transition: 'opacity 0.3s ease-out',
  },

  timeInputFocused: {
    borderColor: '#228BE6',
    borderWidth: 2,
    shadowColor: '#4B9F89',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  controlButtonHover: {
    opacity: 0.9,
  },

  '@media (max-width: 375px)': {
    timeText: {
      fontSize: 40,
    },
    timeInput: {
      width: 56,
      padding: 10,
    },
    controlButton: {
      paddingHorizontal: 24,
      minWidth: 100,
    },
  },

  darkMode: {
    container: {
      backgroundColor: '#1A1A1A',
    },
    timeText: {
      color: '#FFFFFF',
    },
    headerTitle: {
      color: '#FFFFFF',
    },
    sessionName: {
      color: '#FFFFFF',
    },
    timeInput: {
      backgroundColor: '#2C2C2C',
      color: '#FFFFFF',
      borderColor: '#4B9F89',
    },
  },

  accessibilityFocus: {
    borderWidth: 2,
    borderColor: '#228BE6',
    borderRadius: 8,
  },
});

export default StudyTimer;
