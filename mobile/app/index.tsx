import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const goToReport = () => {
    router.push('/report');
  };

  const goToReportsList = () => {
    router.push('/reports');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RescueLink - Home</Text>
      <Text style={styles.subtitle}>
        AI-powered flood early warning & disaster response
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="Send SOS" onPress={goToReport} />

        <View style={{ height: 12 }} />

        <Button title="View SOS Reports" onPress={goToReportsList} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#555', marginBottom: 24 },
  buttonGroup: {
    alignSelf: 'stretch',
    paddingHorizontal: 32,
  },
});
