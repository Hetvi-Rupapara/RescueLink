import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

const HELP_OPTIONS = ['Food', 'Shelter', 'Medical', 'Rescue', 'Other'];

export default function ReportScreen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedHelps, setSelectedHelps] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhone = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (phoneError) setPhoneError(validatePhone(value));
  };

  const toggleHelp = (option: string) => {
    setSelectedHelps(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option],
    );
  };

  const handleSubmit = async () => {
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError('');
    setIsSubmitting(true);

    const fullDescription =
      description.trim().length > 0
        ? `${description.trim()} | Help needed: ${selectedHelps.join(', ') || 'Not specified'}`
        : `Help needed: ${selectedHelps.join(', ') || 'Not specified'}`;

    const payload = {
      name,
      location,
      description: fullDescription,
      phone,
      peopleCount,
      severity,
      helpNeeded: selectedHelps,
    };
    console.log('Sending payload:', payload); // [web:128][web:181]

    try {
      const res = await fetch('http://localhost:4000/api/sos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      console.log('Response status:', res.status);
      console.log('Response body:', json);

      if (res.ok) {
        setName('');
        setLocation('');
        setDescription('');
        setPhone('');
        setPeopleCount('');
        setSeverity('medium');
        setSelectedHelps([]);
      }
    } catch (e) {
      console.log('Network error in SOS request:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSeverityButton = (label: 'low' | 'medium' | 'high') => {
    const isActive = severity === label;
    return (
      <Pressable
        key={label}
        onPress={() => setSeverity(label)}
        style={[
          styles.severityChip,
          isActive && styles.severityChipActive,
        ]}
      >
        <Text
          style={[
            styles.severityChipText,
            isActive && styles.severityChipTextActive,
          ]}
        >
          {label.toUpperCase()}
        </Text>
      </Pressable>
    );
  };

  const renderHelpButton = (option: string) => {
    const isActive = selectedHelps.includes(option);
    return (
      <Pressable
        key={option}
        onPress={() => toggleHelp(option)}
        style={[
          styles.helpChip,
          isActive && styles.helpChipActive,
        ]}
      >
        <Text
          style={[
            styles.helpChipText,
            isActive && styles.helpChipTextActive,
          ]}
        >
          {option}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>
          Tap options quickly and send an SOS in seconds.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic info</Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Your location"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={[styles.input, phoneError ? styles.inputError : null]}
            placeholder="10-digit mobile number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={handlePhoneChange}
            maxLength={14}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          <Text style={styles.label}>People affected</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1, 3, 10"
            keyboardType="numeric"
            value={peopleCount}
            onChangeText={setPeopleCount}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Severity</Text>
          <View style={styles.severityRow}>
            {renderSeverityButton('low')}
            {renderSeverityButton('medium')}
            {renderSeverityButton('high')}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Help needed</Text>
          <View style={styles.wrapRow}>
            {HELP_OPTIONS.map(renderHelpButton)}
          </View>

          <Text style={styles.label}>Extra details (optional)</Text>
          <TextInput
            style={[styles.input, { height: 90 }]}
            placeholder="Landmarks, injuries, water level, etc."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Back" onPress={() => router.back()} />
        <Button
          title={isSubmitting ? 'Sending...' : 'Send SOS'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#d9534f',
  },
  errorText: {
    fontSize: 12,
    color: '#d9534f',
    marginTop: 2,
  },

  // SEVERITY ROW & CHIPS (side-by-side, left aligned, small gaps)
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  severityChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#f0f6ff',
    minWidth: 80,
    alignItems: 'center',
    marginRight: 8, // small space between LOW / MEDIUM / HIGH
  }, // [web:226][web:229]
  severityChipActive: {
    backgroundColor: '#007bff',
  },
  severityChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  severityChipTextActive: {
    color: 'white',
  },

  // HELP chips
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  helpChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#f0f6ff',
    marginRight: 8,
    marginBottom: 8,
  },
  helpChipActive: {
    backgroundColor: '#007bff',
  },
  helpChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  helpChipTextActive: {
    color: 'white',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  bottomSpace: {
    height: 12,
  },
});
