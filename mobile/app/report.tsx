import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

const HELP_TYPES = ['Food', 'Medical', 'Evacuation', 'Shelter'] as const;
type HelpType = (typeof HELP_TYPES)[number];

export default function ReportScreen() {
  const [selectedHelpType, setSelectedHelpType] = useState<HelpType | null>(null);
  const [peopleCount, setPeopleCount] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    // Basic validation
    if (!selectedHelpType) {
      Alert.alert('Missing information', 'Please select the type of help you need.');
      return;
    }
    if (!peopleCount || isNaN(Number(peopleCount))) {
      Alert.alert('Missing information', 'Please enter a valid number of people.');
      return;
    }

    const payload = {
      type: selectedHelpType,
      peopleCount: Number(peopleCount),
      details: details.trim(),
      // TODO: location will be added later (from GPS / map)
    };

    // For now, just show what would be sent
    Alert.alert(
      'SOS Submitted',
      `Type: ${payload.type}\nPeople: ${payload.peopleCount}\nDetails: ${payload.details || 'N/A'}`
    );

    // Later we'll actually POST this to the backend.
    // For now we can navigate back to Home after submitting.
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Help</Text>
      <Text style={styles.subtitle}>
        Tell us what kind of help you need so rescue teams can prioritize.
      </Text>

      {/* Help type selector */}
      <Text style={styles.label}>Type of help needed *</Text>
      <View style={styles.helpTypesContainer}>
        {HELP_TYPES.map((type) => {
          const isSelected = selectedHelpType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.helpTypeChip,
                isSelected && styles.helpTypeChipSelected,
              ]}
              onPress={() => setSelectedHelpType(type)}
            >
              <Text
                style={[
                  styles.helpTypeText,
                  isSelected && styles.helpTypeTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Number of people */}
      <Text style={styles.label}>Number of people affected *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3"
        keyboardType="number-pad"
        value={peopleCount}
        onChangeText={setPeopleCount}
      />

      {/* Additional details */}
      <Text style={styles.label}>Additional details (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Floor, medical conditions, children/elderly, water level, etc."
        multiline
        numberOfLines={4}
        value={details}
        onChangeText={setDetails}
      />

      {/* Location placeholder */}
      <Text style={styles.locationInfo}>
        Location will be auto-detected via GPS in the next step.
      </Text>

      {/* Actions */}
      <View style={styles.buttonsRow}>
        <Button title="Cancel" onPress={() => router.back()} />
        <Button title="Send SOS" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  helpTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  helpTypeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#888',
  },
  helpTypeChipSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  helpTypeText: {
    color: '#333',
  },
  helpTypeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  locationInfo: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  buttonsRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

