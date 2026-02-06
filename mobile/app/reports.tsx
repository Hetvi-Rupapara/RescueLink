import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';

type SosReport = {
  id: number;
  name: string;
  location: string;
  description: string;
  phone: string | null;
  peopleCount: string | null;
  severity: string;
  createdAt: string;
  helpNeeded?: string[];
};

export default function ReportsScreen() {
  const [reports, setReports] = useState<SosReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      setError('');
      const res = await fetch('http://localhost:4000/api/sos');
      const json = await res.json();
      setReports(json.reports || []);
    } catch (e) {
      console.log('Error fetching reports:', e);
      setError('Could not load reports. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const renderItem = ({ item }: { item: SosReport }) => {
    const created = new Date(item.createdAt);
    const timeLabel = created.toLocaleString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name || 'Unknown person'}</Text>
          <Text
            style={[
              styles.severityBadge,
              item.severity === 'high'
                ? styles.severityHigh
                : item.severity === 'low'
                ? styles.severityLow
                : styles.severityMedium,
            ]}
          >
            {item.severity.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.location}>{item.location}</Text>

        <Text style={styles.meta}>
          Phone: {item.phone || 'N/A'} • People: {item.peopleCount || 'N/A'}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <Text style={styles.time}>{timeLabel}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 8 }}>Loading SOS reports…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>SOS Reports</Text>
        <Text style={styles.subtitle}>Latest requests from affected users</Text>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Back
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {reports.length === 0 ? (
        <View style={styles.center}>
          <Text>No SOS reports yet.</Text>
          <Text style={{ color: '#555', marginTop: 4 }}>
            Send one from the Report screen.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  back: {
    marginTop: 4,
    color: '#007bff',
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  severityHigh: {
    backgroundColor: '#d9534f',
  },
  severityMedium: {
    backgroundColor: '#f0ad4e',
  },
  severityLow: {
    backgroundColor: '#5cb85c',
  },
  location: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    color: '#777',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#d9534f',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
});
