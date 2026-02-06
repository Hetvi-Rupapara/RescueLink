import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RescueLink - Home</Text>
      <Text style={styles.subtitle}>
        AI-powered flood early warning & disaster response
      </Text>

      <Link href="/report" asChild>
        <Button title="Go to Report Screen" onPress={() => {}} />
      </Link>
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
  subtitle: { fontSize: 14, textAlign: 'center', color: '#555' },
});
