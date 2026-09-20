import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PRIVACY_POLICY_EFFECTIVE_DATE, PRIVACY_POLICY_SECTIONS, transitBlueColors } from '@droppd/shared';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '../components/ScreenHeader';
import type { ProfileStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PrivacyPolicy'>;

export function PrivacyPolicyScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Privacy Policy" subtitle={`Effective ${PRIVACY_POLICY_EFFECTIVE_DATE}`} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {PRIVACY_POLICY_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.body.map((paragraph, i) => (
              <Text key={i} style={styles.paragraph}>{paragraph}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  body: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 18 },
  section: { gap: 6 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: transitBlueColors.textPrimary },
  paragraph: { fontSize: 13, lineHeight: 19, color: transitBlueColors.textSecondary },
});
