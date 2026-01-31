import React from 'react';
import {
  Dimensions,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {validateNumber} from '../../utils/validations';

const {width} = Dimensions.get('screen');

interface EmergencyProps {
  emergencyActivations: any[];
  setEmergencyActivations: Function;
}

const EmergencyActivations: React.FC<EmergencyProps> = ({
  emergencyActivations,
  setEmergencyActivations,
}) => {
  const handlerAddActivations = () => {
    setEmergencyActivations((prevEmergency: any) => {
      const newKey =
        prevEmergency.length > 0
          ? prevEmergency[prevEmergency.length - 1].key + 1
          : 1;
      return [...prevEmergency, {key: newKey, value: ''}];
    });
  };

  const handlerDelete = (dataToDelete: any) => {
    setEmergencyActivations((prevEmergency: any) => {
      return prevEmergency.filter(
        (ToDelete: any) => ToDelete.key !== dataToDelete.key,
      );
    });
  };

  const handlerChange = (key: any, value: any) => {
    setEmergencyActivations((prevEmergency: any) => {
      const copyActivations = [...prevEmergency];
      copyActivations.map((activationsMap: any) => {
        if (activationsMap.key === key) {
          activationsMap.value = value;
        }
      });
      return copyActivations;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="alarm-light" size={20} color="#E91E63" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Activaciones de Emergencia</Text>
          <Text style={styles.headerSubtitle}>
            Se renuevan automáticamente cada mes
          </Text>
        </View>
      </View>

      {/* Activations List */}
      {emergencyActivations.length > 0 && (
        <View style={styles.activationsList}>
          {emergencyActivations.map((activations: any, index: number) => (
            <View key={activations.key} style={styles.activationItem}>
              <View style={styles.activationNumber}>
                <Text style={styles.activationNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Icon name="clock-outline" size={18} color="#E91E63" />
                <TextInput
                  value={activations.value}
                  placeholder="Horas"
                  placeholderTextColor="#999"
                  style={styles.input}
                  onChangeText={(text) => {
                    if (validateNumber(text)) {
                      handlerChange(activations.key, text);
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handlerDelete(activations)}
                activeOpacity={0.7}>
                <Icon name="close-circle" size={24} color="#E53935" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {emergencyActivations.length === 0 && (
        <View style={styles.emptyState}>
          <Icon name="clock-alert-outline" size={32} color="#CCC" />
          <Text style={styles.emptyStateText}>
            No hay activaciones de emergencia
          </Text>
        </View>
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handlerAddActivations}
        activeOpacity={0.8}>
        <LinearGradient
          style={styles.addButtonGradient}
          colors={['#E91E63', '#C2185B']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Icon name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: width - 32,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  activationsList: {
    marginBottom: 16,
  },
  activationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  activationNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activationNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E91E63',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
    minWidth: 120,
  },
  input: {
    width: 60,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default EmergencyActivations;
