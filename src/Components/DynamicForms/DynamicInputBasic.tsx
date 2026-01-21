
import {useField} from 'formik';
import React, {useEffect} from 'react';
import {Dimensions, Image, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {HelperText} from 'react-native-paper';
import {useDispatch} from 'react-redux';
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.setExtractData) {
      props.onChange(props.setExtractData[0], props.setExtractData[1]);
    }
  }, [JSON.stringify(props.setExtractData)]);

  return (
    <>
      <View
        style={{
          display: props.doNotShow ? 'none' : 'flex',
          backgroundColor: 'white',
          width: width * 0.8,
          height: props.typeFind ? height / 13 : height / 9,
          margin: 8,
          borderRadius: (width * 0.7) / (height / 36),
          elevation: 5,
        }}>
        {props.typeFind ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                aspectRatio: 1 * 1.4,
              }}>
              <Image
                source={{
                  uri: props.iconUri,
                }}
                style={{
                  resizeMode: 'contain',
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
            <View style={{}}>
              <LinearGradient
                style={{
                  width: 2,
                  height: '60%',
                  marginLeft: 7,
                }}
                colors={['#323F48', '#074169', '#019CDE']}
              />
            </View>

            <View style={{flex: 1}}>
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
                style={{
                  width: '85%',
                  marginLeft: 20,
                  fontSize: 25,
                  color: '#000',
                }}
                placeholderTextColor="#000"
                placeholder={props.label}
              />
            </View>
          </View>
        ) : (
          <>
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
                    if (!validateNumber(parsedValue)) {validValue = false;}
                  }

                  if (props.onlyLettersAndNumber) {
                    if (!validateSearch(parsedValue)) {validValue = false;}
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
              {!props.editable ? null : (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    aspectRatio: 1 * 1.4,
                  }}>
                  {props.iconUri ? (
                    <Image
                      source={{
                        uri: props.iconUri,
                      }}
                      style={{
                        resizeMode: 'contain',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  ) : null}
                </View>
              )}
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
              {field.value !== '' && props.editable
                ? props.label
                : props.helper}
            </HelperText>
          </>
        )}
      </View>

      {hasErrors() ? (
        <HelperText type="error" visible={hasErrors()}>
          {props.error[props.name]}
        </HelperText>
      ) : null}
    </>
  );
};
