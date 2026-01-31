import {useField} from 'formik';
import React, {useEffect} from 'react';
import {Dimensions, TextInput, View, StyleSheet, Platform} from 'react-native';
import {HelperText} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {validateNumber, validateSearch} from '../../utils/validations';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface IDynamic {
  label: string;
  name: string;
  onChange: any;
  keyboard: any;
  error: any;
  secureTextEntry?: false | true;
  iconDirection?: any;
  theme?: {};
  customStyle?: {};
  icon?: string;
  onlyLettersAndNumber?: boolean;
  colorIcon?: string;
  helper?: string;
  iconUri?: string;
  typeFind?: boolean;
  extractInfo?: any;
  immutable?: any;
  isFetching?: any;
  setExtractData?: any;
  [x: string]: any;
}

export const DynamicInputBasic: React.FC<IDynamic> = ({
  ...props
}): JSX.Element => {
  const [field] = useField(props);

  const hasErrors = () => {
    return props.error[props.name] && field.value !== '' ? true : false;
  };

  useEffect(() => {
    if (props.setExtractData) {
      props.onChange(props.setExtractData[0], props.setExtractData[1]);
    }
  }, [JSON.stringify(props.setExtractData)]);

  // Search input (typeFind)
  if (props.typeFind) {
    return (
      <>
        <View style={[styles.searchContainer, props.doNotShow && styles.hidden]}>
          <View style={styles.searchIconContainer}>
            <Icon name="magnify" size={22} color="#1C9ADD" />
          </View>
          <TextInput
            onChangeText={(value: string) => {
              const parsedValue = value;
              if (validateSearch(parsedValue)) {
                props.onChange(props.name, parsedValue);
                props.withoutButton ? props.handleSubmit() : null;
              }
            }}
            value={field.value}
            editable={!props.isFetching}
            style={styles.searchInput}
            placeholderTextColor="#8E8E93"
            placeholder={props.label}
          />
          {field.value !== '' && (
            <View style={styles.searchClearButton}>
              <Icon name="close-circle" size={18} color="#C7C7CC" />
            </View>
          )}
        </View>
        {hasErrors() ? (
          <HelperText type="error" visible={hasErrors()}>
            {props.error[props.name]}
          </HelperText>
        ) : null}
      </>
    );
  }

  // Regular input
  return (
    <>
      <View
        style={{
          display: props.doNotShow ? 'none' : 'flex',
          backgroundColor: 'white',
          width: width * 0.8,
          height: height / 9,
          margin: 8,
          borderRadius: (width * 0.7) / (height / 36),
          elevation: 5,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            autoCapitalize={props.isUpper ? 'characters' : 'none'}
            onChangeText={(value: string) => {
              let validValue = true;
              const parsedValue = value;
              if (props.keyboard === 'numeric') {
                if (!validateNumber(parsedValue)) {
                  validValue = false;
                }
              }

              if (props.onlyLettersAndNumber) {
                if (!validateSearch(parsedValue)) {
                  validValue = false;
                }
              }

              if (validValue) {
                if (props.extractInfo) {
                  props.extractInfo((oldState: any) => ({
                    ...oldState,
                    [props.name]: parsedValue,
                  }));
                }
                props.onChange(props.name, parsedValue);
              }
            }}
            editable={props.editable}
            value={field.value}
            keyboardType={props.keyboard}
            secureTextEntry={props.secureTextEntry}
            style={{
              width: '85%',
              marginLeft: 5,
              fontSize: !props.editable ? 25 : 15,
              color: 'black',
            }}
            placeholderTextColor="#000"
            placeholder={props.label}
          />
          {props.editable && props.iconUri ? (
            <View
              style={{
                width: 20,
                height: 20,
                aspectRatio: 1 * 1.4,
              }}>
              <Icon name={props.icon || 'pencil'} size={18} color="#8E8E93" />
            </View>
          ) : null}
        </View>
        <LinearGradient
          style={{
            width: '94%',
            height: 2,
            marginLeft: 7,
            position: 'relative',
            top: -10,
          }}
          colors={['#323F48', '#074169', '#019CDE']}
        />
        <HelperText
          type="info"
          visible={true}
          style={{
            position: 'relative',
            top: -10,
            color: 'black',
          }}>
          {field.value !== '' && props.editable ? props.label : props.helper}
        </HelperText>
      </View>

      {hasErrors() ? (
        <HelperText type="error" visible={hasErrors()}>
          {props.error[props.name]}
        </HelperText>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 6,
    marginVertical: 8,
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
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  searchClearButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
