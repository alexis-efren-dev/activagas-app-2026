import React from 'react';
import {Dimensions, Text, TextInput, View} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {validateNumber} from '../../utils/validations';
const {width, height} = Dimensions.get('screen');
const borders = (width * 0.7) / (height / 36);
const inputStyle: any = {
  width: width / 5,
  borderRadius: borders,
  borderTopRightRadius: borders,
  borderTopLeftRadius: borders,
  elevation: 5,
  backgroundColor: 'white',
  textAlign: 'center',
};
const buttonStyles = {
  marginBottom: 20,
  marginTop: 5,
  width: width / 3,
  borderRadius: borders,
};
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
    <View
      style={{
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width,
      }}>
      <Text style={{color: '#ffffff', fontSize: 18, fontWeight: '500'}}>
        ACTIVACIONES DE EMERGENCIA (se renuevan automaticamente cada mes)
      </Text>
      {emergencyActivations.map((activations: any) => (
        <View
          style={{flexDirection: 'row', marginTop: 5}}
          key={activations.key}>
          <TextInput
            value={activations.value}
            placeholder="Horas"
            style={inputStyle}
            onChange={({nativeEvent: {text}}) => {
              if (validateNumber(text)) {handlerChange(activations.key, text);}
            }}
            keyboardType={'numeric'}
          />
          <IconButton
            icon="delete"
            iconColor={'white'}
            size={20}
            onPress={() => {
              handlerDelete(activations);
            }}
          />
        </View>
      ))}
      <Button
        style={buttonStyles}
        onPress={handlerAddActivations}
        mode="contained"
        buttonColor="#1C9ADD">
        Agregar
      </Button>
    </View>
  );
};
export default EmergencyActivations;

/*

*/
