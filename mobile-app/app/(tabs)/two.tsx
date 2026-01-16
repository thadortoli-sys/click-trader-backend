import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { ThemedCard } from '../../components/ThemedCard';
import { ThemedButton } from '../../components/ThemedButton';

export default function StylesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Design System</Text>

      <Text style={styles.sectionHeader}>Colors & Gradients</Text>

      <View style={styles.demoSection}>
        <Text style={styles.label}>Rainbow Border (Login)</Text>
        <ThemedCard variant="rainbow">
          <Text style={styles.cardText}>Rainbow Variant</Text>
        </ThemedCard>
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.label}>Midnight Border (Premium)</Text>
        <ThemedCard variant="midnight">
          <Text style={styles.cardText}>Midnight Variant</Text>
        </ThemedCard>
      </View>

      <Text style={styles.sectionHeader}>Typography</Text>
      <View style={styles.demoSection}>
        <Text style={[styles.text, { fontSize: 34, fontWeight: '700' }]}>H1 Title</Text>
        <Text style={[styles.text, { fontSize: 22, fontWeight: '600' }]}>H2 Subtitle</Text>
        <Text style={[styles.text, { fontSize: 16 }]}>Body Text</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  sectionHeader: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  demoSection: {
    marginBottom: 20,
  },
  label: {
    color: '#888',
    marginBottom: 5,
  },
  cardText: {
    color: 'white',
    textAlign: 'center',
    padding: 20
  },
  text: {
    color: 'white',
    marginBottom: 5,
  }
});
